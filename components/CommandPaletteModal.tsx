"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { TabKey, Draft } from "@/types/dashboard";
import { navSections, executiveNavSections } from "@/config/dashboardNavigation";

export interface CommandPaletteAction {
  id: string;
  title: string;
  category: "Navigation" | "Draft" | "Quick Action";
  subtitle?: string;
  iconClass: string;
  badge?: string;
  perform: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabKey) => void;
  drafts: Draft[];
  onSelectDraft?: (draftId: string | number) => void;
  onTriggerAction?: (actionId: string) => void;
  isAdmin?: boolean;
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigateTab,
  drafts,
  onSelectDraft,
  onTriggerAction,
  isAdmin = true,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allActions = useMemo<CommandPaletteAction[]>(() => {
    const list: CommandPaletteAction[] = [];

    // 1. Navigation items from all sections
    const seenTabs = new Set<string>();
    navSections.forEach((sec) => {
      sec.items.forEach((item) => {
        if (seenTabs.has(item.label)) return;
        if (item.adminOnly && !isAdmin) return;
        seenTabs.add(item.label);
        list.push({
          id: `nav-${item.label}`,
          title: item.label,
          category: "Navigation",
          subtitle: `Workspace: ${sec.title}`,
          iconClass: item.iconClass,
          badge: item.badge,
          perform: () => {
            onNavigateTab(item.label);
            onClose();
          },
        });
      });
    });

    // 2. Quick Actions
    list.push(
      {
        id: "action-compliance",
        title: "Run Live Compliance & Fluff Audit",
        category: "Quick Action",
        subtitle: "Audit physical tolerances, DIN/ISO standards, and sanitize claims",
        iconClass: "css-icon-shield",
        badge: "Auto-Audit",
        perform: () => {
          onNavigateTab("Risk & Compliance");
          onTriggerAction?.("compliance");
          onClose();
        },
      },
      {
        id: "action-ingest",
        title: "Ingest Equipment Technical Datasheet",
        category: "Quick Action",
        subtitle: "Parse PDF or specification document to extract parameters",
        iconClass: "css-icon-doc",
        badge: "PDF / Spec",
        perform: () => {
          onTriggerAction?.("ingest-modal");
          onClose();
        },
      },
      {
        id: "action-aeo-sim",
        title: "Simulate AEO Citation (Perplexity & Google AI)",
        category: "Quick Action",
        subtitle: "Test citation probability on Perplexity and Google SGE/AEO",
        iconClass: "css-icon-search",
        badge: "AEO Live",
        perform: () => {
          onNavigateTab("QA Review Studio");
          onTriggerAction?.("aeo-sim");
          onClose();
        },
      },
      {
        id: "action-erp-sync",
        title: "Route Live Inventory to Published Specs",
        category: "Quick Action",
        subtitle: "Query ERP stock levels and update schema availability",
        iconClass: "css-icon-box",
        badge: "SAP / NetSuite",
        perform: () => {
          onNavigateTab("ERP Stock Router");
          onClose();
        },
      },
      {
        id: "action-client-pdf",
        title: "Generate Executive ROI Report PDF",
        category: "Quick Action",
        subtitle: "Compile client attribution, pipeline value, and audit stamps",
        iconClass: "css-icon-doc",
        badge: "C-Suite PDF",
        perform: () => {
          onNavigateTab("Client ROI Report");
          onClose();
        },
      }
    );

    // 3. Drafts
    drafts.forEach((draft) => {
      list.push({
        id: `draft-${draft.id}`,
        title: draft.title,
        category: "Draft",
        subtitle: `Keyword: ${draft.keyword} • Vertical: ${draft.vertical || "Industrial"} [${draft.stage}]`,
        iconClass: "css-icon-doc",
        badge: draft.stage,
        perform: () => {
          onNavigateTab("QA Review Studio");
          onSelectDraft?.(draft.id);
          onClose();
        },
      });
    });

    return list;
  }, [isAdmin, drafts, onNavigateTab, onSelectDraft, onTriggerAction, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allActions;
    const q = query.toLowerCase();
    return allActions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q) ||
        (a.badge && a.badge.toLowerCase().includes(q))
    );
  }, [allActions, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].perform();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keep selected item scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Universal Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 font-humanist text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <span className="css-icon-search text-slate-400 shrink-0"></span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search 44 modules, drafts, industrial standards, or quick actions… (Cmd+K)"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-slate-100/50 scrollbar-thin"
        >
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="css-icon-alert text-slate-400 text-lg block"></span>
              <p className="text-xs font-bold text-slate-700">No matching modules or actions found</p>
              <p className="text-[11px] text-slate-500">Try searching &quot;CAD&quot;, &quot;QA&quot;, &quot;ERP&quot;, &quot;WordPress&quot;, or &quot;Compliance&quot;.</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={item.perform}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition ${
                    isSelected
                      ? "bg-sky-50 text-sky-950 font-medium border border-sky-200/80 shadow-2xs"
                      : "text-slate-700 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`${item.iconClass} shrink-0 text-slate-500 ${
                        isSelected ? "text-sky-600" : ""
                      }`}
                    ></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold truncate text-slate-900">{item.title}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                            item.category === "Quick Action"
                              ? "bg-purple-100 text-purple-800"
                              : item.category === "Draft"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600 border border-slate-200/60">
                        {item.badge}
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                        ↵ Return
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>ForgeFlow Omnipresent Search</span>
        </div>
      </div>
    </div>
  );
}
