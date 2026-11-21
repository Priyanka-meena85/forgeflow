"use client";

import { useState } from "react";
import { detectContentDecay, type DecayedPage } from "@/lib/contentDecayEngine";

export function ContentDecayAlerts() {
  const [pages, setPages] = useState(() => detectContentDecay());
  const [refreshedIds, setRefreshedIds] = useState<string[]>([]);

  function handleTriggerRefresh(id: string) {
    setRefreshedIds((prev) => [...prev, id]);
    setTimeout(() => {
      setPages((prev) => prev.filter((p) => p.id !== id));
    }, 1200);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono bg-amber-950 text-amber-400 border border-amber-800 rounded">
              CONTENT REFRESH &amp; DECAY ALERTS
            </span>
            <span className="text-xs text-zinc-400 font-mono">MarketMuse / Frase Equivalent</span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white">
            Algorithmic Content Decay &amp; Spec Refresh Triggers
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Detects pages losing citation position or organic clicks due to competitor schema updates or standards revisions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {pages.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/30 border border-zinc-800 rounded-lg text-emerald-400 text-xs">
            ✓ All catalog pages are currently operating at peak freshness and citation dominance.
          </div>
        ) : (
          pages.map((page) => {
            const isRefreshing = refreshedIds.includes(page.id);
            return (
              <div
                key={page.id}
                className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4 hover:border-zinc-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                          page.urgency === "CRITICAL"
                            ? "bg-red-950 text-red-400 border border-red-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {page.urgency} DECAY
                      </span>
                      <span className="text-xs text-red-400 font-mono font-bold">
                        {page.trafficLossPercentage}% Impressions / Citations
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{page.title}</h3>
                    <p className="text-xs text-zinc-400 font-mono">{page.url}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-zinc-400">Rank Drift:</span>
                    <div className="text-sm font-mono font-bold">
                      <span className="text-emerald-400">#{page.previousCitationRank}</span>
                      <span className="text-zinc-500 mx-1">→</span>
                      <span className="text-red-400">#{page.currentCitationRank}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Updated {page.lastUpdatedDaysAgo} days ago</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-zinc-950/60 rounded border border-zinc-800/80 text-xs">
                  <div>
                    <span className="font-mono text-zinc-400 uppercase">Root Cause Diagnosis:</span>
                    <p className="text-zinc-300 mt-0.5">{page.decayReason}</p>
                  </div>
                  <div>
                    <span className="font-mono text-indigo-400 uppercase">Recommended Remediation:</span>
                    <p className="text-zinc-200 mt-0.5 font-medium">{page.recommendedFix}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleTriggerRefresh(page.id)}
                    disabled={isRefreshing}
                    className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-black rounded transition disabled:opacity-50"
                  >
                    {isRefreshing ? "Auto-Synthesizing 2026 Refresh..." : "Execute Automated 1-Click Refresh"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
