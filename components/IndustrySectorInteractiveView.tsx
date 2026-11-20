"use client";

import { useState } from "react";
import Link from "next/link";
import { IndustrySector, INDUSTRIAL_SECTORS } from "@/lib/industriesDirectory";

interface IndustrySectorInteractiveViewProps {
  sector: IndustrySector;
}

export function IndustrySectorInteractiveView({ sector }: IndustrySectorInteractiveViewProps) {
  const [activeTab, setActiveTab] = useState<"capsule" | "failure" | "crosswalk" | "specs" | "competitive" | "roi">("capsule");
  const [activeEngine, setActiveEngine] = useState<"google" | "perplexity" | "chatgpt">("google");

  // Interactive ROI Calculator for this sector
  const defaultAcv = parseInt(sector.avgDealValue.replace(/[^0-9]/g, "")) || 85000;
  const [pagesCount, setPagesCount] = useState(30);
  const [dealAcv, setDealAcv] = useState(defaultAcv);
  const [winRate, setWinRate] = useState(15);

  const estimatedInquiries = Math.round(pagesCount * 14);
  const estimatedDeals = Math.max(1, Math.round(estimatedInquiries * (winRate / 100)));
  const calculatedPipeline = estimatedDeals * dealAcv;

  return (
    <div className="space-y-12 font-humanist">
      {/* Interactive Sector Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200/90 shadow-2xs flex flex-wrap gap-1">
        {[
          { id: "capsule", label: "AEO Answer Capsule", badge: "Live SGE" },
          { id: "failure", label: "Failure Mode Protocol", badge: "SOP" },
          { id: "crosswalk", label: "DIN / JIS Crosswalk", badge: "Dual-Units" },
          { id: "specs", label: "Tolerance Boundaries", badge: "Criticality" },
          { id: "competitive", label: "PDF Displacement", badge: "Citation Steal" },
          { id: "roi", label: "Pipeline Modeler", badge: "ROI" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.id
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: AEO ANSWER CAPSULE & LIVE SERP PREVIEW */}
      {activeTab === "capsule" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Certified 45-Word Answer Engine Capsule
                </span>
              </div>

              {/* Engine Switcher */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setActiveEngine("google")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeEngine === "google" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Google AI Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEngine("perplexity")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeEngine === "perplexity" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Perplexity Pro
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEngine("chatgpt")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeEngine === "chatgpt" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  ChatGPT Search
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400">
                Targeted Query: &quot;{sector.sampleHeadline}&quot;
              </div>

              {activeEngine === "google" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-100 font-serif space-y-3">
                  <div className="text-[11px] font-mono text-sky-400 font-bold">
                    Google AI Summary Box Anchor #1:
                  </div>
                  <p>&quot;{sector.capsuleText}&quot;</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <span className="text-sky-400">Source: specs.accudrive.io [1]</span>
                    <span className="text-emerald-400">Verified OEM Entity</span>
                  </div>
                </div>
              )}

              {activeEngine === "perplexity" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-100 font-sans space-y-3">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold">
                    Perplexity Pro Sonar Deep Research:
                  </div>
                  <p>&quot;{sector.capsuleText}&quot;</p>
                  <div className="text-[11px] font-mono text-slate-400 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b border-slate-800 text-[10px] text-slate-500">
                        <tr>
                          <th className="py-1">Specification</th>
                          <th className="py-1 text-sky-400">Your OEM Spec</th>
                          <th className="py-1 text-slate-500">Industry Baseline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-[11px]">
                        <tr>
                          <td className="py-1.5">{sector.equipment}</td>
                          <td className="py-1.5 text-sky-300 font-bold">{sector.standardsBadge}</td>
                          <td className="py-1.5 text-slate-400">Standard Commercial</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeEngine === "chatgpt" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-100 font-serif space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 font-bold">
                    ChatGPT Search OpenAI GPT-4o:
                  </div>
                  <blockquote className="border-l-2 border-sky-400 pl-3 italic text-slate-300 text-xs leading-relaxed">
                    &quot;{sector.capsuleText}&quot;
                  </blockquote>
                  <div className="text-[10px] font-mono text-right text-sky-400">
                    — Attributed to verified technical bulletin
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <span>Schema: {sector.schemaTypes.join(" + ")}</span>
                <span>&bull;</span>
                <span>Capsule Word Count: 45 words</span>
              </div>
              <span className="text-emerald-400 font-bold">Citation Probability: 98%</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAILURE MODE PROTOCOL & ROOT CAUSE */}
      {activeTab === "failure" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Root Cause Engineering Protocol
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-humanist">
              Failure Mode: {sector.failureMode}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {sector.rootCauseAnalysis}
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800">Critical Machinery Focus:</div>
              <p className="text-slate-600 font-mono text-[11.5px]">
                {sector.equipment}
              </p>
              <div className="font-bold text-slate-800 pt-1">Governing Standard:</div>
              <p className="text-slate-600 font-mono text-[11.5px]">
                {sector.standard}
              </p>
            </div>
          </div>

          {/* Plant Reliability Reviewer Quote */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-md space-y-4">
            <span className="text-[10px] font-mono uppercase font-bold text-sky-400 tracking-wider">
              Chief Reliability Engineer Sign-Off
            </span>
            <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              &quot;{sector.plantEngineerQuote.text}&quot;
            </blockquote>
            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs font-bold text-white">
                {sector.plantEngineerQuote.author}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {sector.plantEngineerQuote.role}
              </div>
              <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                {sector.plantEngineerQuote.company}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL STANDARDS LOCALIZATION CROSSWALK */}
      {activeTab === "crosswalk" && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-fade-in space-y-4">
          <div className="p-6 sm:p-7 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-humanist">
                1-Click Global Standards Localization Crosswalk
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant translation between US Imperial, German DIN EN, and Japanese JIS industrial specs.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
              Multi-Lingual Hreflang Ready
            </span>
          </div>

          <div className="overflow-x-auto p-4 sm:p-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-700 font-mono text-[11px]">
                  <th className="py-3 px-4">Physical Property</th>
                  <th className="py-3 px-4">US Specification</th>
                  <th className="py-3 px-4">German DIN Standard</th>
                  <th className="py-3 px-4">Japanese JIS Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {sector.toleranceCrosswalk.map((item) => (
                  <tr key={item.property} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900 font-sans">{item.property}</td>
                    <td className="py-3 px-4 text-slate-700">{item.usSpec}</td>
                    <td className="py-3 px-4 font-bold text-sky-800">{item.germanDin}</td>
                    <td className="py-3 px-4 font-bold text-emerald-800">{item.japaneseJis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DETERMINISTIC TOLERANCE BOUNDARIES */}
      {activeTab === "specs" && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-fade-in">
          <div className="p-6 sm:p-7 border-b border-slate-200 bg-slate-50/70">
            <h2 className="text-lg font-bold text-slate-900 font-humanist">
              Deterministic Criticality &amp; Mathematical Tolerance Limits
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict mathematical boundaries verified by the QA Studio before any content publishes.
            </p>
          </div>

          <div className="overflow-x-auto p-4 sm:p-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-700 font-mono text-[11px]">
                  <th className="py-3 px-4">Engineering Parameter</th>
                  <th className="py-3 px-4">Rated Limit</th>
                  <th className="py-3 px-4">Permissible Tolerance</th>
                  <th className="py-3 px-4">Criticality Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {sector.specSheet.map((spec) => (
                  <tr key={spec.parameter} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900 font-sans">{spec.parameter}</td>
                    <td className="py-3 px-4 text-slate-700">{spec.ratedLimit}</td>
                    <td className="py-3 px-4 text-slate-700">{spec.tolerance}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          spec.criticality === "CRITICAL"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : spec.criticality === "HIGH"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {spec.criticality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: COMPETITIVE DISPLACEMENT MATRIX */}
      {activeTab === "competitive" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Legacy Competitor</span>
                <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-200">
                  Unindexed PDF
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-humanist">
                Buried 140-Page Scanned Catalog PDF
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Competitors keep their highest-value troubleshooting advice trapped inside scanned manuals. AI answer engines cannot reliably extract or cite this text, giving you a prime opportunity to displace them.
              </p>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500">
                LLM Citations: 0 • Share of Voice: ~12% • Conversion: Low
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-sky-50/50 border-2 border-sky-300 space-y-3 shadow-sm ring-4 ring-sky-100/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-sky-700">ForgeFlow Optimized</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  Verified #1 Anchor
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-humanist">
                AEO Structured Technical Capsule
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your OEM equipment is syndicated with concise 45-word capsules, JSON-LD TechArticle schema, dual-unit DIN/JIS tables, and live part numbers.
              </p>
              <div className="p-3 rounded-2xl bg-white border border-sky-200 text-[11px] font-mono text-sky-800 font-bold">
                LLM Citations: Primary [1] • Share of Voice: 84% • Deal ACV: {sector.avgDealValue}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PIPELINE & ROI ESTIMATOR */}
      {activeTab === "roi" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fade-in">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-sky-700 tracking-wider">
              Sector Revenue Modeler
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-humanist">
              Estimated Pipeline Return for {sector.shortTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Industrial search has zero consumer fluff. One high-intent equipment contract pays for multiple years of ForgeFlow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                  <span>Published Diagnostic Guides</span>
                  <span className="font-mono text-sky-700">{pagesCount} articles</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={pagesCount}
                  onChange={(e) => setPagesCount(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                  <span>Average Equipment Deal Value (ACV)</span>
                  <span className="font-mono text-sky-700">${dealAcv.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={25000}
                  max={250000}
                  step={5000}
                  value={dealAcv}
                  onChange={(e) => setDealAcv(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                  <span>Opportunity Close Rate</span>
                  <span className="font-mono text-sky-700">{winRate}%</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={winRate}
                  onChange={(e) => setWinRate(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Estimated 12-Month Net New Pipeline
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                ${calculatedPipeline.toLocaleString()}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Estimated RFQs</span>
                  <span className="font-bold text-white font-mono">{estimatedInquiries} Inquiries</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Closed Contracts</span>
                  <span className="font-bold text-white font-mono">{estimatedDeals} Signed Deals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engineering FAQ Accordion */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-slate-900 font-humanist">
          {sector.shortTitle} Engineering FAQ
        </h2>
        <div className="space-y-3">
          {sector.sampleFaq.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 text-xs shadow-2xs">
              <div className="font-bold text-slate-900 text-sm">{faq.question}</div>
              <div className="text-slate-600 leading-relaxed">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Directory Quick Switcher */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold uppercase text-slate-400">
            Explore Other Pre-Built Sectors
          </span>
          <Link href="/industries" className="text-xs font-bold text-sky-600 hover:underline">
            View All 7 &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {INDUSTRIAL_SECTORS.filter((s) => s.slug !== sector.slug).slice(0, 6).map((other) => (
            <Link
              key={other.slug}
              href={`/industries/${other.slug}`}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition text-center group"
            >
              <div className="text-[11px] font-bold text-slate-800 group-hover:text-sky-600 truncate">
                {other.shortTitle}
              </div>
              <div className="text-[9.5px] font-mono text-emerald-700 mt-0.5">
                {other.avgDealValue}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
