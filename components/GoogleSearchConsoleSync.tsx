"use client";

import { useState, useEffect } from "react";
import type { GscQueryMetric, SchemaDriftAlert } from "@/app/api/integrations/gsc/route";

export function GoogleSearchConsoleSync() {
  const [property, setProperty] = useState("sc-domain:accudrive-reliability.com");
  const [lastSync, setLastSync] = useState<string>("");
  const [summary, setSummary] = useState<{
    totalIndexedPages: number;
    monthlyImpressions: number;
    monthlyClicks: number;
    averageCtr: string;
    averagePosition: number;
    richResultEligibility: string;
  } | null>(null);
  const [queries, setQueries] = useState<GscQueryMetric[]>([]);
  const [alerts, setAlerts] = useState<SchemaDriftAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchGsc() {
      try {
        const res = await fetch("/api/integrations/gsc");
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setProperty(data.connectedProperty);
            setLastSync(data.lastSyncTime);
            setSummary(data.summary);
            setQueries(data.topQueries);
            setAlerts(data.driftAlerts);
          }
        }
      } catch (err) {
        console.error("GSC sync error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    void fetchGsc();
    return () => { active = false; };
  }, []);

  const handleResolveDrift = async (alertId: string) => {
    setPatchingId(alertId);
    setActionMessage(null);
    try {
      const res = await fetch("/api/integrations/gsc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESOLVE_DRIFT", alertId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Patch failed.");
      setAlerts(data.driftAlerts);
      setActionMessage(data.message);
    } catch (e: unknown) {
      setActionMessage(e instanceof Error ? e.message : "Patch failed.");
    } finally {
      setPatchingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Google Search Console &amp; Schema Drift Hub
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Connected Property: <strong className="text-slate-800">{property}</strong> &bull; Bi-directional sync active
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            GSC API Live Verified
          </span>
        </div>

        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Indexed Pages</span>
              <span className="text-base font-extrabold text-slate-900">{summary.totalIndexedPages}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Monthly Impr</span>
              <span className="text-base font-extrabold text-sky-700">{summary.monthlyImpressions.toLocaleString("en-US")}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Monthly Clicks</span>
              <span className="text-base font-extrabold text-emerald-700">{summary.monthlyClicks.toLocaleString("en-US")}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Avg CTR</span>
              <span className="text-base font-extrabold text-slate-900">{summary.averageCtr}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Avg Position</span>
              <span className="text-base font-extrabold text-slate-900">{summary.averagePosition}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Rich Result Pass</span>
              <span className="text-base font-extrabold text-emerald-700">{summary.richResultEligibility}</span>
            </div>
          </div>
        )}
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <span className="css-icon-check text-emerald-600"></span>
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Schema Drift & Googlebot Rich Result Alerts */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
              Schema Drift &amp; Google Rich Snippet Health
            </h3>
            <p className="text-xs text-slate-500">
              Automated monitoring for structured data deprecations, Googlebot syntax warnings, and missing entity links.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {alerts.filter((a) => !a.isResolved).length} Pending Drift Checks
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition ${
                alert.isResolved ? "bg-slate-50/60 border-slate-200 opacity-60" : "bg-white border-amber-200 shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    alert.severity === "WARNING" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900">{alert.schemaType}</span>
                  <span className="text-xs text-slate-400 font-mono break-all">{alert.url}</span>
                </div>
                {alert.isResolved ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 self-start sm:self-auto">
                    <span className="css-icon-check"></span>
                    <span>Patched</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={patchingId === alert.id}
                    onClick={() => void handleResolveDrift(alert.id)}
                    className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                  >
                    <span className="css-icon-bolt"></span>
                    <span>{patchingId === alert.id ? "Patching..." : "Auto-Patch Schema"}</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-700">{alert.description}</p>
              <p className="text-[11px] font-mono text-slate-500 mt-1">Proposed Resolution: {alert.suggestedPatch}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Query Impressions Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase font-mono border-b border-slate-100 pb-2">
          High-Intent Search Queries Synced from GSC
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <th className="py-2.5 px-3">Search Query</th>
                <th className="py-2.5 px-3">Monthly Impr</th>
                <th className="py-2.5 px-3">Clicks</th>
                <th className="py-2.5 px-3">CTR</th>
                <th className="py-2.5 px-3">Avg Pos</th>
                <th className="py-2.5 px-3">AI Overview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queries.map((q, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 font-mono">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 font-sans">{q.query}</td>
                  <td className="py-2.5 px-3 text-slate-600">{q.impressions}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">{q.clicks}</td>
                  <td className="py-2.5 px-3 text-slate-600">{(q.ctr * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{q.position}</td>
                  <td className="py-2.5 px-3">
                    {q.hasAeoOverview ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        ACTIVE AEO
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Standard SERP</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
