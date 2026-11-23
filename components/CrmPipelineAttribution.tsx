"use client";

import { useEffect, useState } from "react";
import type { AttributedDeal } from "@/app/api/crm/attribution/route";

export function CrmPipelineAttribution() {
  const [deals, setDeals] = useState<AttributedDeal[]>([]);
  const [pipelineTotal, setPipelineTotal] = useState(820000);
  const [closedWon, setClosedWon] = useState(625000);
  const [roi, setRoi] = useState("41.6x");
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [syncing, setSyncing] = useState(false);

  const fetchAttribution = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/attribution");
      const data = await res.json();
      if (res.ok) {
        if (data.deals) setDeals(data.deals);
        if (data.totalPipelineInfluencedUsd) setPipelineTotal(data.totalPipelineInfluencedUsd);
        if (data.closedWonRevenueUsd) setClosedWon(data.closedWonRevenueUsd);
        if (data.roiMultiplier) setRoi(data.roiMultiplier);
      }
    } catch {
      setActionMsg("Failed to stream CRM attribution data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttribution();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/crm/attribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_all" }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(data.message);
        fetchAttribution();
      }
    } catch {
      setActionMsg("Failed to synchronize CRM pipeline.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                CLOSED-LOOP CRM REVENUE ATTRIBUTION
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Salesforce &bull; HubSpot</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              AEO &amp; SEO Revenue Pipeline Attribution
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Industrial CFOs do not care about raw impressions. ForgeFlow bridges zero-volume technical answer pages directly to multi-touch enterprise deals in Salesforce and HubSpot.
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer disabled:opacity-50 transition"
          >
            {syncing ? "Synchronizing CRM..." : "Sync CRM Deals"}
          </button>
        </div>

        {actionMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg("")} className="text-emerald-700 hover:text-emerald-950 text-xs font-bold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Total Influenced Pipeline</span>
            <p className="text-2xl font-black text-slate-900 font-humanist">${pipelineTotal.toLocaleString("en-US")} USD</p>
            <p className="text-[10px] text-slate-500 font-mono">3 Active Tier-1 Accounts</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">Closed-Won Contract Revenue</span>
            <p className="text-2xl font-black text-emerald-700 font-humanist">${closedWon.toLocaleString("en-US")} USD</p>
            <p className="text-[10px] text-emerald-800 font-mono">100% Attributed to AEO Specs</p>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-sky-800">Software ARR ROI Multiplier</span>
            <p className="text-2xl font-black text-sky-700 font-humanist">{roi}</p>
            <p className="text-[10px] text-sky-800 font-mono">Against Annual SaaS Subscription</p>
          </div>
        </div>
      </div>

      {/* Attributed Deals Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
          Attributed Enterprise Deals &amp; Originating Zero-Volume Specs
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <span className="inline-block w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {deals.map((deal) => (
              <div key={deal.id} className="p-4 bg-white hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-white">
                      {deal.crmSystem}
                    </span>
                    <strong className="text-slate-900 text-sm">{deal.dealName}</strong>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      deal.stage === "CLOSED_WON" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}>
                      {deal.stage.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">Account: <strong className="text-slate-900">{deal.accountName}</strong> &bull; Closed: {deal.closedDate}</p>
                  <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Originating Zero-Volume AEO Article:</span>
                    <span>&quot;{deal.originatingDraftTitle}&quot;</span>
                    <span className="text-sky-800 block mt-0.5">Query: &quot;{deal.originatingKeyword}&quot;</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-slate-900 block font-mono">
                    ${deal.dealAmount.toLocaleString("en-US")}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{deal.touchpointsCount} Organic Touches</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
