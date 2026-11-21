"use client";

import React, { useState } from "react";

export interface DraftSection {
  id: string;
  heading: string;
  content: string;
  wordCount: number;
}

const DEFAULT_SECTIONS: DraftSection[] = [
  {
    id: "sec_1",
    heading: "1. Executive Summary & Physics of Cavitation",
    content: "Cavitation in sanitary rotary lobe pumps occurs when suction-side absolute pressure drops below the fluid vapor pressure at operating washdown temperatures. Vapor cavities collapse abruptly against rotor lobes, generating micro-jets exceeding 1,000 MPa localized impact pressure and causing pitting erosion on 316L stainless steel surfaces.",
    wordCount: 52,
  },
  {
    id: "sec_2",
    heading: "2. Clean-in-Place (CIP) Washdown Thermal Shock & Elastomer Swelling",
    content: "Clean-in-place cycles frequently alternate between 85°C caustic sodium hydroxide (NaOH) wash solutions and 15°C cold water rinse phases. This severe thermal shock causes rapid volumetric thermal expansion of EPDM and FKM mechanical seal elastomers. When caustic concentrations exceed 2.5%, elastomer swelling reduces radial clearance to zero, resulting in premature seal binding and unplanned packaging line downtime.",
    wordCount: 64,
  },
  {
    id: "sec_3",
    heading: "3. 3-A Sanitary Standard 02-12 Compliance & Material Selection",
    content: "Under 3-A Sanitary Standard 02-12, all product contact surfaces must maintain a maximum surface roughness of Ra ≤ 0.8 µm (32 µin), free of pits, crevices, and unground welds. Upgrading from standard carbon/silicon carbide faces to monolithic silicon carbide with encapsulated FFKM O-rings guarantees 100% chemical resistance across full CIP pH ranges (1 to 14).",
    wordCount: 61,
  },
  {
    id: "sec_4",
    heading: "4. Preventive Maintenance Protocol & Vibration Thresholds",
    content: "Per ISO 10816-3 Class II guidelines, velocity RMS vibration levels should be monitored continuously at the front pump bearing housing. Baseline baseline readings between 0.71 and 1.80 mm/s indicate normal operation. Any excursion above 2.80 mm/s demands immediate inspection for rotor timing gear backlash or shaft deflection.",
    wordCount: 54,
  },
];

export function SectionRegeneratorStudio() {
  const [sections, setSections] = useState<DraftSection[]>(DEFAULT_SECTIONS);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("sec_2");
  const [promptDirective, setPromptDirective] = useState(
    "Make the tone more technical for Plant Maintenance Engineers. Add IS 2825 / ASME Section VIII pressure vessel citations and include exact torque tolerances in Newton-meters."
  );
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [proposedContent, setProposedContent] = useState<string | null>(null);

  const activeSection = sections.find((s) => s.id === selectedSectionId);

  const handleRegenerate = () => {
    if (!activeSection) return;
    setIsRegenerating(true);
    setProposedContent(null);

    setTimeout(() => {
      setProposedContent(
        `Under IS 2825 and ASME Section VIII design criteria, Clean-in-Place (CIP) regimes subject sanitary rotary lobe pump seals to extreme thermo-mechanical cycling. Alternating between 85°C caustic wash (2.5% to 3.0% NaOH) and 15°C chilled post-rinse introduces a ΔT of 70°C in under 90 seconds. To prevent elastomer thermal binding, gland follower bolts must be torqued to exactly 42.5 N·m (±1.5 N·m) using a calibrated digital torque wrench. Furthermore, upgrading to peroxide-cured EPDM (ASTM D1418) or fully encapsulated FFKM O-rings eliminates seal face blistering and guarantees zero blow-by during 4.2 bar backpressure cleaning pulses.`
      );
      setIsRegenerating(false);
    }, 800);
  };

  const handleCommit = () => {
    if (!proposedContent || !selectedSectionId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId
          ? {
              ...s,
              content: proposedContent,
              wordCount: proposedContent.split(/\s+/).length,
            }
          : s
      )
    );
    setProposedContent(null);
    alert("Section updated successfully without altering the rest of your 2,500-word draft!");
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0 font-bold text-xs">
              ⚡
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Surgical Single-Section AI Regenerator
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Never re-write an entire 2,500-word technical page just to fix one formula, citation, or tone. Regenerate individual sections in seconds with complete contextual preservation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Section Selector List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Section to Edit ({sections.length})
          </h3>
          <div className="space-y-2">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSectionId(sec.id);
                  setProposedContent(null);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedSectionId === sec.id
                    ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate max-w-[200px]">
                    {sec.heading}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {sec.wordCount}w
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {sec.content}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Section Editor & AI Delta Preview */}
        <div className="lg:col-span-2 space-y-5">
          {activeSection && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div>
                <span className="text-xs font-mono text-indigo-600 font-bold uppercase">
                  Active Section Target
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {activeSection.heading}
                </h3>
              </div>

              {/* Current Live Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Current Draft Content
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
                  {activeSection.content}
                </div>
              </div>

              {/* Regeneration Directive Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                  AI Directive for this Section Only
                </label>
                <textarea
                  rows={3}
                  value={promptDirective}
                  onChange={(e) => setPromptDirective(e.target.value)}
                  placeholder="e.g. Include ASME Section VIII criteria, specify torque tolerance in N·m..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  {isRegenerating ? "Regenerating Section..." : "Regenerate Section with AI"}
                </button>
              </div>

              {/* Proposed Delta Comparison */}
              {proposedContent && (
                <div className="space-y-4 pt-4 border-t border-slate-100 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      Proposed Revision (AI Output)
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                      +{proposedContent.split(/\s+/).length - activeSection.wordCount} words
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-mono">
                    {proposedContent}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setProposedContent(null)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleCommit}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      Commit &amp; Merge into Full Draft
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
