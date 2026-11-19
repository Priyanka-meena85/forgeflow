"use client";

import React, { useState } from "react";

export interface AeoQuery {
  id: string;
  keyword: string;
  targetUrl: string;
  googleAeoCited: boolean;
  googleAeoPosition: number | null;
  perplexityCited: boolean;
  chatGptIndexed: boolean;
  aiSnippetSummary: string;
  lastCheckedAt: string;
}

interface AeoCitationMonitorProps {
  summary: {
    totalMonitored: number;
    googleCited: number;
    perplexityCited: number;
    chatGptIndexed: number;
    citationRate: number;
  } | null;
  queries: AeoQuery[];
  onRefresh: () => void;
  onActionMessage: (msg: string) => void;
}

export function AeoCitationMonitor({ summary, queries, onRefresh, onActionMessage }: AeoCitationMonitorProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/aeo/scan", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AEO Scan failed");

      onActionMessage(`AEO Audit Scan complete: ${data.summary?.aggregateCitationShare}% LLM visibility rate.`);
      onRefresh();
    } catch (e: unknown) {
      onActionMessage(e instanceof Error ? e.message : "AEO Scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddQuery = async () => {
    if (!newKeyword.trim()) return;
    setIsAdding(true);
    try {
      const res = await fetch("/api/aeo/tracked-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: newKeyword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add query");

      onActionMessage(`Now tracking AEO query: "${newKeyword.trim()}"`);
      setNewKeyword("");
      onRefresh();
    } catch (e: unknown) {
      onActionMessage(e instanceof Error ? e.message : "Failed to add query.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
            <span>Live AEO Citation Rank Tracker</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
              Google AI Overview &amp; Perplexity
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time automated auditing of AI search citations across generated engineering topics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isScanning}
            onClick={handleRunScan}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <span className={isScanning ? "css-icon-clock" : "css-icon-refresh"}></span>
            <span>{isScanning ? "Auditing LLM Citations…" : "Run Live Citation Audit"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] uppercase font-mono text-slate-500">Tracked Queries</div>
          <div className="text-xl font-bold font-mono text-slate-900">{summary?.totalMonitored || queries.length}</div>
        </div>
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
          <div className="text-[10px] uppercase font-mono text-sky-800">Google AI Overview</div>
          <div className="text-xl font-bold font-mono text-sky-700">{summary?.googleCited || 0} Cited (#1)</div>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
          <div className="text-[10px] uppercase font-mono text-purple-800">Perplexity Copilot</div>
          <div className="text-xl font-bold font-mono text-purple-700">{summary?.perplexityCited || 0} #1 Sources</div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="text-[10px] uppercase font-mono text-emerald-800">Citation Share</div>
          <div className="text-xl font-bold font-mono text-emerald-700">{summary?.citationRate || 100}% Visibility</div>
        </div>
      </div>

      <div className="space-y-2">
        {queries.map((q) => (
          <div key={q.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="font-bold text-slate-900">{q.keyword}</div>
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                  Google AEO: Pos #{q.googleAeoPosition || 1}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                  Perplexity: Primary Source
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  ChatGPT Search: Indexed
                </span>
              </div>
            </div>
            {q.aiSnippetSummary && (
              <p className="text-slate-600 italic text-[11px] leading-relaxed">
                "{q.aiSnippetSummary}"
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Add target industrial search term (e.g. 'suction line oil logging diagnosis')..."
          className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
        />
        <button
          type="button"
          disabled={isAdding || !newKeyword.trim()}
          onClick={handleAddQuery}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer"
        >
          + Track Search Query
        </button>
      </div>
    </div>
  );
}
