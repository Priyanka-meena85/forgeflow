"use client";

import { useEffect, useState } from "react";
import type { DistributorHub } from "@/app/api/distributor/syndicate/route";

export function DistributorSyndication() {
  const [hubs, setHubs] = useState<DistributorHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(88);
  const [actionMsg, setActionMsg] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchHubs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/distributor/syndicate");
      const data = await res.json();
      if (res.ok && data.hubs) {
        setHubs(data.hubs);
        if (typeof data.totalLeadsGenerated === "number") setTotalLeads(data.totalLeadsGenerated);
      }
    } catch {
      setActionMsg("Failed to load distributor hubs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  const handleToggle = async (hub: DistributorHub) => {
    setBusyId(hub.id);
    try {
      const res = await fetch("/api/distributor/syndicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distributorId: hub.id, action: "toggle_status" }),
      });
      const data = await res.json();
      if (res.ok && data.hub) {
        setHubs((prev) => prev.map((h) => (h.id === hub.id ? data.hub : h)));
        setActionMsg(`Updated status for ${hub.distributorName}.`);
      }
    } catch {
      setActionMsg("Failed to update status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleResyndicate = async (hub: DistributorHub) => {
    setBusyId(hub.id);
    try {
      const res = await fetch("/api/distributor/syndicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distributorId: hub.id, action: "re_syndicate" }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(data.message);
        fetchHubs();
      }
    } catch {
      setActionMsg("Failed to re-syndicate spec.");
    } finally {
      setBusyId(null);
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
                MULTI-TIER CHANNEL CO-MARKETING
              </span>
              <span className="text-[11px] text-slate-500 font-mono">rel=&quot;canonical&quot; Preserved</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Distributor &amp; Dealer Syndication Network
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Co-market OEM-certified operating tolerances and troubleshooting guides across regional distributor branches.
              Enables local inventory lookup while preserving authoritative search ownership back to your root domain.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Channel Leads Delivered</p>
              <p className="text-2xl font-black text-slate-900 font-humanist">{totalLeads} RFQs</p>
            </div>
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

      {/* Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">
            <span className="inline-block w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          hubs.map((hub) => (
            <div
              key={hub.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{hub.distributorName}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      hub.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {hub.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-4">{hub.cityState} &bull; {hub.region}</p>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Inventory Status:</span>
                    <span className="font-mono font-bold text-sky-800">{hub.inventoryStatus.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Partner Subdomain:</span>
                    <span className="font-mono text-[11px] text-slate-700">{hub.syndicatedDomain}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Routed Phone:</span>
                    <span className="font-mono text-slate-800 font-semibold">{hub.assignedPhone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Leads Generated:</span>
                    <span className="font-mono font-bold text-emerald-700">{hub.leadCount} RFQs</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Last Synchronized:</span>
                    <span className="font-mono text-slate-500">{hub.lastSyndicatedAt}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 mb-4 text-[11px] font-mono text-slate-600">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Canonical Tag Target:</span>
                  <span className="break-all text-sky-800">{hub.canonicalUrl}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleToggle(hub)}
                  disabled={busyId === hub.id}
                  className="py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  {hub.status === "ACTIVE" ? "Pause Hub" : "Activate Hub"}
                </button>
                <button
                  onClick={() => handleResyndicate(hub)}
                  disabled={busyId === hub.id}
                  className="py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {busyId === hub.id ? "Syncing…" : "Re-Sync Spec"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
