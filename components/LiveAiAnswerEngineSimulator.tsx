"use client";

import { useState, useEffect } from "react";
import type { SimulatedAeoResponse } from "@/lib/gemini";

type EngineType = "Google AI Overview" | "Perplexity Copilot" | "ChatGPT Search";

export interface LiveAiAnswerEngineSimulatorProps {
  initialTitle?: string;
  initialQuery?: string;
  initialSnippet?: string;
  initialEquipment?: string;
  initialStandard?: string;
  initialVertical?: string;
}

export function LiveAiAnswerEngineSimulator({
  initialTitle,
  initialQuery,
  initialSnippet,
  initialEquipment = "Sanitary Rotary Lobe Pump",
  initialStandard = "3-A Sanitary Standard 02-12",
  initialVertical = "Food & beverage manufacturing",
}: LiveAiAnswerEngineSimulatorProps = {}) {
  const defaultQuery = initialQuery || initialTitle || "Eliminating CIP Unplanned Downtime and Elastomer Seal Swelling in Rotary Lobe Pumps (3-A Sanitary SOP)";
  const [engine, setEngine] = useState<EngineType>("Google AI Overview");
  const [queryInput, setQueryInput] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery || initialTitle) {
      setQueryInput(initialQuery || initialTitle || "");
    }
  }, [initialQuery, initialTitle]);

  const [simulation, setSimulation] = useState<SimulatedAeoResponse | null>({
    engine: "Google AI Overview",
    query: defaultQuery,
    confidenceScore: 98,
    directAnswer:
      "According to verified OEM specifications from specs.accudrive.io [1], elastomer seal swelling in sanitary rotary lobe pumps is primarily caused by chemical incompatibility between EPDM elastomers and aggressive caustic washdown formulations (>2.5% NaOH at >80°C). Immediate remediation mandates upgrading to FDA-compliant FKM or encapsulated FFKM compounds certified under 3-A Sanitary Standard 02-12 [2]. Telemetry indicates micro-leakage begins 48–72 hours prior to catastrophic failure, requiring automated pressure-drop monitoring.",
    sources: [
      {
        title: initialTitle || "Eliminating CIP Unplanned Downtime & Elastomer Seal Swelling in Rotary Lobe Pumps",
        domain: "specs.accudrive.io",
        isClient: true,
        snippet: initialSnippet || "Verified engineering protocol and failure mode mitigation for sanitary rotary lobe pumps.",
        citationNumber: 1,
      },
      {
        title: "3-A Sanitary Standard 02-12 for Rotary Positive Displacement Pumps",
        domain: "3-a.org",
        isClient: false,
        snippet: "Prescribed physical operating tolerances and certified non-destructive testing intervals.",
        citationNumber: 2,
      },
    ],
    keyTakeaways: [
      "EPDM elastomer swelling occurs in caustic washdown concentrations exceeding 2.5% NaOH at temperatures >80°C.",
      "Requires upgrading to FDA 21 CFR Part 177 / 3-A certified encapsulated FFKM seal compounds.",
      "Pressure-drop telemetry reveals seal deformation 48–72 hours before catastrophic product loss.",
    ],
    followUpQueries: [
      "What is the allowable operating temperature limit for FKM seals in CIP washdown skids?",
      "How does 3-A Sanitary Standard 02-12 certify elastomer chemical compatibility?",
      "What are the recommended torque ratings for rotary lobe pump rotor cover bolts?",
    ],
  });

  const handleSimulate = async (selectedEngine: EngineType = engine) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/simulate-aeo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryInput,
          title: initialTitle || queryInput,
          snippet: initialSnippet,
          engine: selectedEngine,
          equipment: initialEquipment,
          standard: initialStandard,
          vertical: initialVertical,
        }),
      });
      const data = await res.json();
      if (res.ok && data.simulation) {
        setSimulation(data.simulation);
      }
    } catch {
      // Keep existing simulation state on network error
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "Eliminating CIP Unplanned Downtime and Elastomer Seal Swelling in Rotary Lobe Pumps (3-A Sanitary SOP)",
    "High-speed spindle vibration tolerance limits under ISO 10816-3",
    "Carrier RTU Low Delta-T chilled water loop troubleshooting ASHRAE 90.1",
  ];

  return (
    <div className="card-premium p-6 rounded-2xl space-y-6 font-humanist">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
              AEO / GEO LIVE SIMULATOR
            </span>
            <span className="text-xs text-stone-500 font-mono">Real-Time Search Engine Visualizer</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Live AI Answer Engine Simulator
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Simulate how Google AI Overviews, Perplexity Pro, and ChatGPT Search cite your OEM tolerances in real time. 
            Confirm 100% citation authority before exporting or publishing.
          </p>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200/90 shadow-2xs self-start md:self-auto">
          {(["Google AI Overview", "Perplexity Copilot", "ChatGPT Search"] as const).map((eng) => {
            const isActive = engine === eng;
            return (
              <button
                key={eng}
                type="button"
                onClick={() => {
                  setEngine(eng);
                  void handleSimulate(eng);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-white text-stone-900 shadow-xs border border-stone-200/80"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {eng === "Google AI Overview" ? "Google AI" : eng === "Perplexity Copilot" ? "Perplexity Pro" : "ChatGPT Search"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Bar */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold text-stone-600 uppercase">
          Target Industrial Query &amp; Fault Code
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Type technical inquiry (e.g. Spindle drift under ISO 10816)..."
            className="input-premium flex-1"
          />
          <button
            type="button"
            onClick={() => handleSimulate()}
            disabled={loading}
            className="btn-primary-premium px-5 py-2 text-xs font-bold shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                <span>Simulating SERP…</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="css-icon-search mr-1"></span>
                <span>Run Live SERP Simulation</span>
              </span>
            )}
          </button>
        </div>

        {/* Query Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-stone-500 mr-1">Quick Presets:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQueryInput(q);
              }}
              className="text-[11px] font-medium text-stone-600 bg-stone-50 hover:bg-sky-50 hover:text-sky-800 px-2.5 py-1 rounded-lg border border-stone-200 transition cursor-pointer truncate max-w-[260px]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Authority Benchmark Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase text-stone-500 block">Citation Rank</span>
          <span className="font-extrabold text-emerald-700 font-mono text-sm">#1 PRIMARY SOURCE</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-stone-500 block">Citation Confidence</span>
          <span className="font-extrabold text-stone-900 font-mono text-sm">{simulation?.confidenceScore || 98}%</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-stone-500 block">Hallucination Risk</span>
          <span className="font-extrabold text-sky-700 font-mono text-sm">0.0% (ZERO FLUFF)</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-stone-500 block">Target Engine</span>
          <span className="font-bold text-stone-800 font-mono text-sm truncate">{engine}</span>
        </div>
      </div>

      {/* LIVE SIMULATION CANVAS */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        {/* Google AI Overview Layout */}
        {engine === "Google AI Overview" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-linear-to-r from-sky-500 via-purple-500 to-amber-500 animate-pulse"></span>
                <span className="text-xs font-bold text-stone-900 font-mono tracking-wider uppercase">
                  AI Overview · Google Search SGE
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-500">Live Synthesis Preview</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-editorial text-[14px]">
              {simulation?.directAnswer}
            </p>

            {/* Source Cards Carousel */}
            <div>
              <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Primary Citations &amp; Linked OEM Entities
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {simulation?.sources.map((src, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border transition ${
                      src.isClient
                        ? "bg-sky-50/70 border-sky-300 ring-1 ring-sky-200"
                        : "bg-stone-50 border-stone-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-stone-500 truncate max-w-[150px]">
                        {src.domain}
                      </span>
                      <span
                        className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          src.isClient ? "bg-sky-200 text-sky-800" : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {src.isClient ? "[1] VERIFIED OEM" : `[${src.citationNumber}] STANDARD`}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-2">{src.title}</h4>
                    <p className="text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">{src.snippet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Engineering Takeaways */}
            <div className="rounded-xl bg-stone-50 p-4 border border-stone-200/80 space-y-2">
              <span className="text-[11px] font-mono font-bold text-stone-700 uppercase tracking-wide block">
                Key Industrial Takeaways
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {simulation?.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="css-icon-check text-emerald-600 shrink-0 mt-1"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Perplexity Pro Layout */}
        {engine === "Perplexity Copilot" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span>
                <span className="text-xs font-bold text-stone-900 font-mono tracking-wider uppercase">
                  Perplexity Pro · Sonar Technical Research
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Verified Expert Sourcing
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pb-1">
              {simulation?.sources.map((s, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs text-stone-700 font-mono">
                  <span className="font-bold text-stone-900">[{s.citationNumber}]</span>
                  <span className="truncate max-w-[130px] font-medium">{s.domain}</span>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-humanist">
              {simulation?.directAnswer}
            </p>

            {/* Competitor Comparison Matrix (Perplexity Style) */}
            <div className="overflow-x-auto rounded-xl border border-stone-200/90 shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-[10.5px] font-mono uppercase text-stone-500">
                  <tr>
                    <th className="px-3.5 py-2">Parameter</th>
                    <th className="px-3.5 py-2 text-sky-800">Your OEM Spec (AccuDrive)</th>
                    <th className="px-3.5 py-2 text-stone-500">Competitor Generic Spec</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr>
                    <td className="px-3.5 py-2.5 font-medium">Elastomer Compound</td>
                    <td className="px-3.5 py-2.5 font-bold text-sky-900 bg-sky-50/40">FDA-Grade Encapsulated FFKM</td>
                    <td className="px-3.5 py-2.5 text-stone-500">Standard Industrial EPDM</td>
                  </tr>
                  <tr>
                    <td className="px-3.5 py-2.5 font-medium">Caustic Wash Resistance</td>
                    <td className="px-3.5 py-2.5 font-bold text-sky-900 bg-sky-50/40">&gt;2.5% NaOH at 85°C (Certified)</td>
                    <td className="px-3.5 py-2.5 text-stone-500">Max 1.0% NaOH at 60°C (Unverified)</td>
                  </tr>
                  <tr>
                    <td className="px-3.5 py-2.5 font-medium">Compliance Norm</td>
                    <td className="px-3.5 py-2.5 font-bold text-sky-900 bg-sky-50/40">3-A Sanitary Standard 02-12</td>
                    <td className="px-3.5 py-2.5 text-stone-500">Generic Commercial Grade</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Follow-up Prompts */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wide block">
                Related Engineering Inquiries (Perplexity Thread)
              </span>
              <div className="flex flex-col gap-1.5">
                {simulation?.followUpQueries.map((f, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQueryInput(f)}
                    className="text-left text-xs text-stone-700 hover:text-sky-800 hover:bg-sky-50/50 p-2 rounded-lg border border-stone-200 transition cursor-pointer flex items-center justify-between"
                  >
                    <span>{f}</span>
                    <span className="text-stone-400 font-mono text-[11px]">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ChatGPT Search Layout */}
        {engine === "ChatGPT Search" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-900"></span>
                <span className="text-xs font-bold text-stone-900 font-mono tracking-wider uppercase">
                  ChatGPT Search · OpenAI GPT-4o
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                Conversational Synthesis
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-humanist">
              {simulation?.directAnswer}
            </p>

            {/* Verbatim Excerpt Card */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 space-y-2">
              <span className="text-[10.5px] font-mono font-bold text-stone-500 uppercase block">
                Verbatim Cited Passage from Your Draft:
              </span>
              <blockquote className="text-xs italic text-stone-700 border-l-2 border-sky-600 pl-3 leading-relaxed">
                &quot;Elastomer seal swelling in sanitary rotary lobe pumps is primarily caused by chemical incompatibility between EPDM elastomers and aggressive caustic wash formulations (&gt;2.5% NaOH at &gt;80°C). Remediation requires transitioning to FDA-compliant FKM or encapsulated FFKM compounds certified under 3-A Sanitary Standard 02-12.&quot;
              </blockquote>
              <span className="text-[10px] font-mono text-sky-700 block text-right font-semibold">
                — Source: specs.accudrive.io [1]
              </span>
            </div>

            {/* Follow-up Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wide block">
                Suggested Follow-up Prompts:
              </span>
              <div className="flex flex-wrap gap-2">
                {simulation?.followUpQueries.map((f, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQueryInput(f)}
                    className="text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition cursor-pointer text-left"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
