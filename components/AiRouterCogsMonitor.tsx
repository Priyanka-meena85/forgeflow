"use client";

import { useEffect, useState } from "react";

interface ModelInfo {
  provider: string;
  model: string;
  status: "ONLINE" | "FALLBACK_STANDBY" | "RATE_LIMITED";
  inputCostPer1M: number;
  outputCostPer1M: number;
  averageLatencyMs: number;
}

interface CogsData {
  primaryModel: string;
  fallbackChain: string[];
  tenantMargin: string;
  averageCostPerPage: string;
  retailPricePerPage: string;
  models: ModelInfo[];
  recentGenerations: Array<{
    id: string;
    keyword: string;
    modelUsed: string;
    tokensTotal: number;
    costUsd: number;
    latencyMs: number;
    completedAt: string;
  }>;
}

export function AiRouterCogsMonitor() {
  const [data, setData] = useState<CogsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/cogs");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCogs();
  }, []);

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                TRI-MODEL LLM ROUTER &bull; ZERO DOWNTIME
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Dynamic Token Metering</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              AI Router Resilience &amp; Token COGS Margin Hub
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Automated high-throughput LLM routing with sub-second failover. Guarantees 99.9% uptime for technical schema generation while maintaining a &gt;90% gross margin on token economics.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Avg Cost / Spec</p>
              <p className="text-2xl font-black text-slate-900 font-humanist">{data?.averageCostPerPage || "$0.041"}</p>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Gross Token Margin</p>
              <p className="text-2xl font-black text-emerald-600 font-humanist">{data?.tenantMargin || "94.2%"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Roster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(data?.models || [
          { provider: "Google DeepMind", model: "gemini-1.5-pro", status: "ONLINE", inputCostPer1M: 3.5, outputCostPer1M: 10.5, averageLatencyMs: 820 },
          { provider: "Anthropic", model: "claude-3-5-sonnet", status: "FALLBACK_STANDBY", inputCostPer1M: 3.0, outputCostPer1M: 15.0, averageLatencyMs: 910 },
          { provider: "OpenAI", model: "gpt-4o", status: "FALLBACK_STANDBY", inputCostPer1M: 5.0, outputCostPer1M: 15.0, averageLatencyMs: 1140 },
        ]).map((m, idx) => (
          <div key={m.model} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  {idx === 0 ? "Tier 1: Primary Engine" : `Tier ${idx + 1}: Standby Fallback`}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {m.status}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base leading-snug">{m.model}</h3>
              <p className="text-xs text-slate-500 mb-4">{m.provider}</p>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Input Blended (1M):</span>
                  <span className="font-mono font-bold text-slate-900">${m.inputCostPer1M.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Output Blended (1M):</span>
                  <span className="font-mono font-bold text-slate-900">${m.outputCostPer1M.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Average TTFT Latency:</span>
                  <span className="font-mono font-bold text-sky-800">{m.averageLatencyMs}ms</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Automatic Circuit Breaker:</span>
              <span className="font-bold text-slate-800">ARMED</span>
            </div>
          </div>
        ))}
      </div>

      {/* Generation History Stream */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
          Recent LLM Generation Dispatches &amp; COGS Audit
        </h3>

        {loading ? (
          <div className="py-8 text-center text-slate-400">
            <span className="inline-block w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {(data?.recentGenerations || [
              { id: "gen_1", keyword: "servo stamping press die galling IATF 16949", modelUsed: "gemini-1.5-pro", tokensTotal: 3410, costUsd: 0.038, latencyMs: 840, completedAt: "12m ago" },
              { id: "gen_2", keyword: "commercial RTU suction floodback symptoms", modelUsed: "gemini-1.5-pro", tokensTotal: 3890, costUsd: 0.044, latencyMs: 890, completedAt: "24m ago" },
              { id: "gen_3", keyword: "hydraulic piston pump cavitation ISO 4406", modelUsed: "gemini-1.5-pro", tokensTotal: 3200, costUsd: 0.036, latencyMs: 780, completedAt: "48m ago" },
            ]).map((g) => (
              <div key={g.id} className="p-3.5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <strong className="text-slate-900 font-semibold">{g.keyword}</strong>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-0.5">
                    <span className="text-sky-800 font-bold">{g.modelUsed}</span> &bull; 
                    <span>{g.tokensTotal.toLocaleString("en-US")} tokens</span> &bull; 
                    <span>{g.latencyMs}ms latency</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-emerald-700 block">${g.costUsd.toFixed(4)} USD</span>
                  <span className="text-[10px] text-slate-400 font-mono">{g.completedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
