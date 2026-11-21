"use client";

import { useState } from "react";
import {
  fetchKeywordRankings,
  rankDelta,
  type SeoIntegrationConfig,
  type KeywordRankData,
} from "@/lib/seoIntegrations";

const PROVIDERS: Array<{ id: "ahrefs" | "semrush"; name: string; color: string }> = [
  { id: "ahrefs", name: "Ahrefs", color: "bg-orange-500" },
  { id: "semrush", name: "SEMrush", color: "bg-blue-600" },
];

export function SeoToolsConnector() {
  const [config, setConfig] = useState<SeoIntegrationConfig>({
    provider: "ahrefs",
    apiKey: "",
    connected: false,
    domain: "accudrive.io",
    lastSyncAt: undefined,
  });
  const [rankings, setRankings] = useState<KeywordRankData[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [sortKey, setSortKey] = useState<keyof KeywordRankData>("volume");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleConnect = async () => {
    if (!config.apiKey.trim()) {
      setMsg("Enter an API key to connect.");
      return;
    }
    setLoading(true);
    const data = await fetchKeywordRankings(config);
    setConfig((prev) => ({
      ...prev,
      connected: true,
      lastSyncAt: new Date().toISOString(),
    }));
    setRankings(data);
    setMsg(`Connected to ${config.provider === "ahrefs" ? "Ahrefs" : "SEMrush"}. ${data.length} keywords loaded.`);
    setLoading(false);
    setTimeout(() => setMsg(""), 4000);
  };

  const handleResync = async () => {
    setLoading(true);
    const data = await fetchKeywordRankings(config);
    setRankings(data);
    setConfig((prev) => ({ ...prev, lastSyncAt: new Date().toISOString() }));
    setLoading(false);
  };

  const toggleSort = (key: keyof KeywordRankData) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...rankings].sort((a, b) => {
    const av = a[sortKey] as number;
    const bv = b[sortKey] as number;
    return sortDir === "desc" ? bv - av : av - bv;
  });

  const avgPos = rankings.length
    ? Math.round(rankings.reduce((s, r) => s + r.position, 0) / rankings.length)
    : 0;
  const top3 = rankings.filter((r) => r.position <= 3).length;
  const improved = rankings.filter((r) => r.position < r.prevPosition).length;

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Ahrefs / SEMrush Connector</h2>
        <p className="text-sm text-slate-500 mt-1">
          Pull keyword ranking data directly into your content workflow.
          See which pages are climbing, stalling, or falling.
        </p>

        {/* Provider tabs */}
        <div className="flex gap-2 mt-4">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setConfig((prev) => ({ ...prev, provider: p.id, connected: false }))}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${config.provider === p.id ? `${p.color} text-white` : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-xs font-medium text-slate-600">API Key</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-mono"
              placeholder={`${config.provider === "ahrefs" ? "Ahrefs" : "SEMrush"} API key`}
              value={config.apiKey}
              onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Domain</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              value={config.domain}
              onChange={(e) => setConfig((prev) => ({ ...prev, domain: e.target.value }))}
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleConnect}
              disabled={loading}
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Connecting..." : config.connected ? "Re-sync" : "Connect"}
            </button>
            {config.connected && (
              <button
                onClick={handleResync}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Refresh
              </button>
            )}
          </div>
        </div>

        {msg && (
          <div className="mt-3 rounded-xl bg-green-50 border border-green-200 p-2.5 text-xs text-green-800 font-semibold">
            {msg}
          </div>
        )}

        {config.connected && config.lastSyncAt && (
          <div className="mt-2 text-xs text-slate-400">
            Last sync: {new Date(config.lastSyncAt).toLocaleString("en-IN")} from {config.provider === "ahrefs" ? "Ahrefs" : "SEMrush"}
          </div>
        )}
      </div>

      {/* KPIs */}
      {rankings.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Avg. Position", value: `#${avgPos}`, color: "text-indigo-700" },
              { label: "Top 3 Rankings", value: top3, color: "text-green-700" },
              { label: "Improved", value: improved, color: "text-emerald-600" },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs text-center">
                <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Rankings table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      { key: "keyword", label: "Keyword" },
                      { key: "position", label: "Position" },
                      { key: "volume", label: "Volume" },
                      { key: "difficulty", label: "KD" },
                      { key: "cpc", label: "CPC" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="text-left p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-100"
                        onClick={() => toggleSort(col.key as keyof KeywordRankData)}
                      >
                        {col.label} {sortKey === col.key ? (sortDir === "desc" ? "v" : "^") : ""}
                      </th>
                    ))}
                    <th className="p-3 font-semibold text-slate-600">Change</th>
                    <th className="p-3 font-semibold text-slate-600">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((r, i) => {
                    const delta = rankDelta(r.position, r.prevPosition);
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{r.keyword}</div>
                          <div className="text-slate-400 font-mono text-xs">{r.url}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-indigo-700">#{r.position}</td>
                        <td className="p-3 font-mono">{r.volume.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`font-semibold ${r.difficulty <= 30 ? "text-green-600" : r.difficulty <= 50 ? "text-amber-600" : "text-red-600"}`}>
                            {r.difficulty}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-700">${r.cpc.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`font-bold text-sm ${delta.positive ? "text-green-600" : "text-red-500"}`}>
                            {delta.label}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${r.source === "ahrefs" ? "bg-orange-500" : "bg-blue-600"}`}>
                            {r.source}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
