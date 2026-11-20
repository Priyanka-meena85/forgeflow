"use client";

import { useState, useEffect } from "react";

export interface CompetitorTarget {
  id: string;
  competitorName: string;
  query: string;
  searchEngine: "Google AI Overview" | "Perplexity Copilot";
  citedUrl: string;
  estimatedAcv: string;
  gapScore: number;
  detectedWeaknesses: string[];
  recommendedCounterStrategy: string;
  counterArticleSlug: string;
}

export function CompetitorAeoDisplacer({ onGenerateCounterDraft }: { onGenerateCounterDraft?: (slug: string) => void }) {
  const [competitors, setCompetitors] = useState<CompetitorTarget[]>([]);
  const [summary, setSummary] = useState<{
    totalDisplaceableQueries: number;
    totalPipelineAtRisk: string;
    averageCompetitorGapScore: number;
    opportunityLevel: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyTargetId, setBusyTargetId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const res = await fetch("/api/aeo/displace");
        if (res.ok) {
          const data = await res.json();
          if (active && data.competitors) {
            setCompetitors(data.competitors);
            setSummary(data.marketIntelligenceSummary);
          }
        }
      } catch (err) {
        console.error("Failed to load competitor AEO intelligence:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadData();
    return () => { active = false; };
  }, []);

  const handleDisplace = async (target: CompetitorTarget) => {
    setBusyTargetId(target.id);
    setActionNotice(null);
    try {
      const res = await fetch("/api/aeo/displace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitorId: target.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Displacement trigger failed.");
      setActionNotice(`Counter-Spec SOP Initiated: ${target.recommendedCounterStrategy}`);
      if (onGenerateCounterDraft) {
        onGenerateCounterDraft(target.counterArticleSlug);
      }
    } catch (e: unknown) {
      setActionNotice(e instanceof Error ? e.message : "Displacement trigger error.");
    } finally {
      setBusyTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Competitive Answer Engine Intelligence
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              AEO Competitor Displacer &amp; Citation Steal Matrix
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Identify where Google AI Overviews and Perplexity cite competing OEMs (Parker Hannifin, Alfa Laval, Carrier). Scan their technical specification gaps and generate certified counter-spec articles to displace their citations.
            </p>
          </div>

          {summary && (
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Displaceable Pipeline</span>
                <span className="text-lg font-black text-emerald-400">{summary.totalPipelineAtRisk}</span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Average Spec Gap</span>
                <span className="text-lg font-black text-amber-400">{summary.averageCompetitorGapScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="css-icon-check text-emerald-600"></span>
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            <span className="css-icon-cross"></span>
          </button>
        </div>
      )}

      {/* Competitor Steal Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-mono">
          Scanning Answer Engine Citation Graphs for Competitor Gaps...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {competitors.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 transition shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                    CITED: {c.competitorName}
                  </span>
                  <span className="text-xs font-mono text-slate-500">via {c.searchEngine}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500 font-mono">Target ACV: <strong className="text-slate-900">{c.estimatedAcv}</strong></span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Spec Gap: {c.gapScore}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">High-Intent Diagnostic Query</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">&ldquo;{c.query}&rdquo;</h4>
                <a
                  href={c.citedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-sky-600 hover:underline break-all block mt-1"
                >
                  {c.citedUrl}
                </a>
              </div>

              {/* Detected Weaknesses & Counter Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-700 block">
                    Detected Technical Vulnerabilities in Competitor Spec
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {c.detectedWeaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold shrink-0">&times;</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200/80 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-sky-800 block">
                      ForgeFlow Certified Counter-Strategy
                    </span>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {c.recommendedCounterStrategy}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busyTargetId === c.id}
                    onClick={() => void handleDisplace(c)}
                    className="self-start px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span className="css-icon-bolt"></span>
                    <span>{busyTargetId === c.id ? "Analyzing Slices..." : "Generate Counter-Spec Article"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
