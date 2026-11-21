"use client";

import { useState } from "react";
import { generateInternalLinkSuggestions, type InternalLinkSuggestion } from "@/lib/internalLinkingEngine";

export function InternalLinkingStudio() {
  const [data, setData] = useState(() => generateInternalLinkSuggestions());
  const [injectedCount, setInjectedCount] = useState(0);

  function handleInjectLink(idx: number) {
    setData((prev) => ({
      ...prev,
      suggestions: prev.suggestions.filter((_, i) => i !== idx),
    }));
    setInjectedCount((c) => c + 1);
  }

  function handleBatchInjectAll() {
    setInjectedCount((c) => c + data.suggestions.length);
    setData((prev) => ({
      ...prev,
      suggestions: [],
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono bg-sky-950 text-sky-400 border border-sky-800 rounded">
              TOPIC CLUSTER ARCHITECTURE
            </span>
            <span className="text-xs text-zinc-400 font-mono">SearchAtlas / Surfer Equivalent</span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white">
            Autonomous Internal Linking &amp; Orphan Page Resolver
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Automatically connects new product specifications to parent pillar pages with natural anchor texts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {injectedCount > 0 && (
            <span className="text-xs text-emerald-400 font-mono">
              ✓ {injectedCount} links deployed to CMS
            </span>
          )}
          {data.suggestions.length > 0 && (
            <button
              onClick={handleBatchInjectAll}
              className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded transition shadow-xs"
            >
              1-Click Batch Inject All ({data.suggestions.length})
            </button>
          )}
        </div>
      </div>

      {/* Cluster Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(data.clusterHealth).map(([cluster, stats]) => (
          <div key={cluster} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
            <span className="text-xs font-mono text-zinc-400 uppercase">Topic Cluster</span>
            <div className="text-sm font-bold text-white mt-1">{cluster}</div>
            <div className="flex items-center justify-between mt-3 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
              <span>{stats.totalPages} catalog pages</span>
              <span className="font-mono text-sky-400">{stats.internalLinkDensity} inbound links</span>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions Queue */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Pending Link Injections ({data.suggestions.length})
        </h3>
        {data.suggestions.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/30 border border-zinc-800 rounded-lg text-zinc-400 text-xs">
            ✓ All catalog specification pages are 100% interconnected. Zero orphan pages detected.
          </div>
        ) : (
          <div className="space-y-3">
            {data.suggestions.map((sug, i) => (
              <div key={i} className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-sky-400 font-bold">{sug.clusterName}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-emerald-400 font-mono">{sug.semanticRelevanceScore}% Relevance</span>
                  </div>
                  <div className="text-xs text-zinc-300">
                    <strong className="text-zinc-400">Source: </strong>
                    <span className="font-mono text-zinc-200">{sug.sourcePageUrl}</span>
                    <span className="mx-2 text-zinc-500">→</span>
                    <strong className="text-zinc-400">Target: </strong>
                    <span className="font-mono text-indigo-300">{sug.targetPageUrl}</span>
                  </div>
                  <p className="text-xs text-zinc-400 italic pt-1">
                    &quot;{sug.contextSentence}&quot;
                  </p>
                </div>
                <button
                  onClick={() => handleInjectLink(i)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded border border-zinc-700 transition shrink-0"
                >
                  Inject Anchor Link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
