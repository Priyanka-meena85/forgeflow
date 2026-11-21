"use client";

import React, { useState, useEffect } from "react";
import { TabKey, Draft } from "@/types/dashboard";

interface OnboardingChecklistWidgetProps {
  onNavigateTab: (tab: TabKey) => void;
  drafts: Draft[];
  selectedVertical: string;
}

export function OnboardingChecklistWidget({
  onNavigateTab,
  drafts,
  selectedVertical,
}: OnboardingChecklistWidgetProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const savedCollapsed = window.localStorage.getItem("forgeflow_checklist_collapsed");
      if (savedCollapsed === "true") setCollapsed(true);
      const savedDismissed = window.localStorage.getItem("forgeflow_checklist_dismissed");
      if (savedDismissed === "true") setDismissed(true);
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem("forgeflow_checklist_collapsed", String(next));
    } catch {}
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem("forgeflow_checklist_dismissed", "true");
    } catch {}
  };

  // Automated Progress Evaluation
  const hasVertical = Boolean(selectedVertical);
  const hasApprovedDraft = drafts.some((d) => d.stage === "Approved" || d.stage === "Published");
  const hasPublishedDraft = drafts.some((d) => d.stage === "Published");
  const hasDrafts = drafts.length > 0;

  const checklist = [
    {
      id: "step-1",
      title: "Set Target Manufacturing Vertical",
      desc: "Specify your equipment category & compliance tolerances (3-A, ASTM, ISO)",
      completed: hasVertical,
      tab: "Taxonomy Matrix" as TabKey,
    },
    {
      id: "step-2",
      title: "Synthesize or Ingest First Technical Spec",
      desc: "Generate engineering draft with deterministic Answer Capsule",
      completed: hasDrafts,
      tab: "Mission Control" as TabKey,
    },
    {
      id: "step-3",
      title: "Complete Expert QA & Sign-Off (PE/PhD Reviewer)",
      desc: "Verify volumetric calculations, failure modes & approve for release",
      completed: hasApprovedDraft,
      tab: "QA Review Studio" as TabKey,
    },
    {
      id: "step-4",
      title: "Route Live Inventory to Published Specs",
      desc: "Connect ERP inventory (SAP / NetSuite) to prevent 404 stock outages",
      completed: false, // User can click to explore
      tab: "ERP Stock Router" as TabKey,
    },
    {
      id: "step-5",
      title: "Distribute to CMS & Generate Executive ROI Report",
      desc: "Publish live via REST Webhooks and compile board-ready PDF attribution",
      completed: hasPublishedDraft,
      tab: "Client ROI Report" as TabKey,
    },
  ];

  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  if (dismissed) return null;

  return (
    <div className="bg-white rounded-2xl border border-sky-200/80 shadow-xs p-4 sm:p-5 font-humanist space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
            <span className="css-icon-bolt"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Production Readiness Checklist
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-sky-50 text-sky-700 border border-sky-200">
                {completedCount} of {checklist.length} Complete ({progressPercent}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Essential onboarding path to achieve automated industrial AEO citations & revenue attribution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={collapsed ? "Expand checklist" : "Collapse checklist"}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer text-xs"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss checklist"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer text-xs"
          >
            <span className="css-icon-cross"></span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-sky-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Expanded Checklist Items */}
      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
          {checklist.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab(item.tab)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                item.completed
                  ? "bg-emerald-50/60 border-emerald-200 text-slate-800"
                  : "bg-slate-50/70 hover:bg-sky-50/50 border-slate-200/80 text-slate-700 hover:border-sky-300"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">Step 0{idx + 1}</span>
                  {item.completed ? (
                    <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                      Done ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold font-mono text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                      Pending
                    </span>
                  )}
                </div>
                <p className="font-bold text-slate-900 text-xs leading-snug">{item.title}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-mono font-bold text-sky-700">
                <span>{item.tab}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
