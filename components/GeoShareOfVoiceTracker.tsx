"use client";

import { useEffect, useState } from "react";
import type { EngineBenchmark } from "@/app/api/aeo/share-of-voice/route";

export function GeoShareOfVoiceTracker() {
  const [benchmarks, setBenchmarks] = useState<EngineBenchmark[]>([]);
  const [averageSoV, setAverageSoV] = useState(64);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const fetchSoV = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/aeo/share-of-voice");
      const data = await res.json();
      if (res.ok) {
        if (data.benchmarks) setBenchmarks(data.benchmarks);
        if (typeof data.averageSoVPct === "number") setAverageSoV(data.averageSoVPct);
      }
    } catch {
      setActionMsg("Failed to stream AEO share of voice radar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoV();
  }, []);

  const handleAudit = async (keyword?: string) => {
    setAuditing(true);
    try {
      const res = await fetch("/api/aeo/share-of-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(data.message);
        fetchSoV();
      }
    } catch {
      setActionMsg("Failed to audit citation capsules.");
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                GENERATIVE ENGINE OPTIMIZATION (GEO)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Perplexity &bull; Google AI &bull; ChatGPT Search</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              AI Share-of-Voice (SoV) Citation Radar
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Track the exact percentage of industrial generative answer capsules that cite your engineering formulas versus legacy OEM competitors. Detect citation drift before it impacts RFQ volume.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Average Citation Share</p>
              <p className="text-2xl font-black text-emerald-600 font-humanist">{averageSoV}%</p>
              <p className="text-[10px] text-slate-400 font-mono">#1 Position in All 3 Engines</p>
            </div>
            <button
              onClick={() => handleAudit()}
              disabled={auditing}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer disabled:opacity-50 transition"
            >
              {auditing ? "Auditing AI Engines…" : "Audit All Queries"}
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg("")} className="text-emerald-700 hover:text-emerald-950 text-xs font-bold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Benchmark Queries */}
      <div className="grid grid-cols-1 gap-5">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <span className="inline-block w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          benchmarks.map((bm) => (
            <div key={bm.keyword} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                      {bm.vertical}
                    </span>
                    <strong className="text-slate-900 text-sm font-mono">&quot;{bm.keyword}&quot;</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Audited across {bm.totalAiQueriesSampled} live prompt iterations &bull; Last run: {bm.lastAuditedDate}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Brand Citation Share</span>
                    <span className="text-xl font-black text-emerald-700 font-mono">{bm.userBrandSharePct}%</span>
                  </div>
                  <button
                    onClick={() => handleAudit(bm.keyword)}
                    disabled={auditing}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    title="Audit This Keyword"
                  >
                    <span className="css-icon-bolt"></span>
                  </button>
                </div>
              </div>

              {/* Competitor Displacement Matrix */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {bm.competitors.map((c) => (
                  <div
                    key={c.brandName}
                    className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      c.isUserBrand ? "bg-emerald-50/40 font-semibold text-slate-900" : "bg-white text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                        #{c.citationRank}
                      </span>
                      <strong className="text-slate-900">{c.brandName}</strong>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded ${c.googleAiOverviewCited ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-slate-100 text-slate-400"}`}>
                          Google AI
                        </span>
                        <span className={`px-2 py-0.5 rounded ${c.perplexityCited ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-slate-100 text-slate-400"}`}>
                          Perplexity
                        </span>
                        <span className={`px-2 py-0.5 rounded ${c.chatGptSearchCited ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-slate-100 text-slate-400"}`}>
                          ChatGPT
                        </span>
                      </div>
                      <span className="w-16 text-right font-mono font-bold text-slate-900">{c.overallShareOfVoicePct}% SoV</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
