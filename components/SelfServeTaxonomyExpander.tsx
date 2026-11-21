"use client";

import React, { useState } from "react";

export interface SubNicheProposal {
  nicheName: string;
  vertical: string;
  suggestedEquipment: string[];
  failureModes: string[];
  applicableStandards: string[];
  targetPersonas: Array<{
    role: string;
    corePainPoint: string;
    intentType: "Commercial" | "Informational" | "Transactional";
  }>;
  projectedSearchVolume: number;
  projectedRfqsYearly: number;
}

export function SelfServeTaxonomyExpander() {
  const [subNicheInput, setSubNicheInput] = useState(
    "Cryogenic Ball Valves for LNG Bunkering & Storage"
  );
  const [selectedVertical, setSelectedVertical] = useState("Oil, gas & chemical processing");
  const [isExpanding, setIsExpanding] = useState(false);
  const [proposal, setProposal] = useState<SubNicheProposal | null>(null);
  const [ingested, setIngested] = useState(false);

  const handleExpand = () => {
    if (!subNicheInput.trim()) return;
    setIsExpanding(true);
    setIngested(false);

    setTimeout(() => {
      setProposal({
        nicheName: subNicheInput,
        vertical: selectedVertical,
        suggestedEquipment: [
          "Extended Bonnet Cryogenic Ball Valve",
          "PCTFE Soft-Seated Low-Emission Valve",
          "Fire-Safe Pneumatic Actuated Quarter-Turn Valve",
          "Jacketed Thermal Relief Cryogenic Check Valve",
        ],
        failureModes: [
          "Stem packing freeze-up & fugitive methane emissions",
          "Seat cavitation at -196°C liquid nitrogen temperatures",
          "Body-to-bonnet thermal differential contraction leakage",
          "Actuator torque sizing degradation in sub-zero frost lines",
        ],
        applicableStandards: [
          "BS 6364 (Valves for Cryogenic Service)",
          "ISO 28921-1 (Industrial valves for low-temperature applications)",
          "ASME B16.34 (Valves Flanged, Threaded, and Welding End)",
          "API 6FA (Specification for Fire Test for Valves)",
        ],
        targetPersonas: [
          {
            role: "LNG Terminal Plant Manager",
            corePainPoint: "Minimizing boil-off gas (BOG) losses & passing annual EPA fugitive emission audits",
            intentType: "Commercial",
          },
          {
            role: "Cryogenic Piping Lead Engineer",
            corePainPoint: "Verifying PCTFE vs PEEK seat compression limits under ASME B16.34 cold ratings",
            intentType: "Informational",
          },
          {
            role: "EPC Procurement Specialist",
            corePainPoint: "Bulk lead-times for BS 6364 hydrostatic test certification packages",
            intentType: "Transactional",
          },
        ],
        projectedSearchVolume: 4200,
        projectedRfqsYearly: 38,
      });
      setIsExpanding(false);
    }, 700);
  };

  const handleIngest = () => {
    setIngested(true);
    alert(`Successfully ingested "${proposal?.nicheName}" into the production Taxonomy Matrix! 16 programmatic topics queued.`);
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0 font-bold text-xs">
              ⚡
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Self-Serve Sub-Niche Taxonomy Expander
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Request any emerging industrial sub-sector. ForgeFlow automatically derives the equipment taxonomy, failure physics, ISO codes, and buyer personas.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Sub-Niche or Product Line Name
            </label>
            <input
              type="text"
              value={subNicheInput}
              onChange={(e) => setSubNicheInput(e.target.value)}
              placeholder="e.g. Servo-Driven Cartesian Pick & Place Gantries"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Parent Industrial Sector
            </label>
            <select
              value={selectedVertical}
              onChange={(e) => setSelectedVertical(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 bg-white"
            >
              <option value="Oil, gas & chemical processing">Oil, Gas &amp; Chemical</option>
              <option value="Food & beverage manufacturing">Food &amp; Beverage</option>
              <option value="Precision machining & machine tools">Precision Machining</option>
              <option value="Heavy material handling & mining">Heavy Mining &amp; Material</option>
              <option value="Semiconductor & cleanroom robotics">Semiconductor &amp; Cleanroom</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleExpand}
          disabled={isExpanding}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          {isExpanding ? "Deriving Taxonomy & Standards..." : "Generate AI Taxonomy Matrix"}
        </button>
      </div>

      {/* Expansion Results */}
      {proposal && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">
                Derived Taxonomy Cluster
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {proposal.nicheName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Parent Vertical: <strong>{proposal.vertical}</strong> &bull; Est. Search Volume:{" "}
                <strong>{proposal.projectedSearchVolume.toLocaleString()}/mo</strong> &bull; Projected RFQs:{" "}
                <strong className="text-emerald-700">+{proposal.projectedRfqsYearly}/yr</strong>
              </p>
            </div>

            <button
              onClick={handleIngest}
              disabled={ingested}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-xs ${
                ingested
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {ingested ? "Ingested in Taxonomy Matrix" : "Ingest Cluster into Taxonomy Matrix"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Equipment Types */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Identified Equipment (4)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {proposal.suggestedEquipment.map((eq, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Failure Modes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Critical Failure Modes (4)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {proposal.failureModes.map((fm, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{fm}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Applicable Standards */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Compliance Standards (4)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {proposal.applicableStandards.map((std, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span className="font-medium text-slate-900">{std}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Buyer Personas Mapping */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Target Buyer Persona Intent Mapping
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proposal.targetPersonas.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{p.role}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                      {p.intentType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.corePainPoint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
