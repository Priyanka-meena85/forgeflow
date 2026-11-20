"use client";

import { useEffect, useState } from "react";
import type { DeanonymizedAccount } from "@/app/api/intent/deanonymize/route";

export function BuyerIntentDiscovery() {
  const [loading, setLoading] = useState(true);
  const [pipelineTotal, setPipelineTotal] = useState("$620,000");
  const [accounts, setAccounts] = useState<DeanonymizedAccount[]>([]);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchIntent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intent/deanonymize");
      const data = await res.json();
      if (res.ok && data.accounts) {
        setAccounts(data.accounts);
        if (data.pipelineIdentified) setPipelineTotal(data.pipelineIdentified);
      }
    } catch {
      setStatusMsg("Failed to stream reverse-IP intent data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntent();
  }, []);

  const handleTriggerABM = async (acc: DeanonymizedAccount) => {
    setTriggeringId(acc.id);
    setStatusMsg("");
    try {
      const res = await fetch("/api/intent/deanonymize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: acc.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`Targeted ABM content draft initiated for ${acc.companyName}.`);
      } else {
        setStatusMsg(data.error || "Failed to trigger ABM spec.");
      }
    } catch {
      setStatusMsg("Network error dispatching ABM draft.");
    } finally {
      setTriggeringId(null);
    }
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-sky-100 bg-linear-to-r from-sky-900 via-slate-900 to-slate-950 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                REVERSE-IP DEANONYMIZATION
              </span>
              <span className="text-[11px] text-slate-400">B2B Graph Verified</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              B2B Account Intent &amp; Buying Signals
            </h2>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Deanonymize tier-1 manufacturing enterprises reading your technical spec pages before they submit an RFQ. 
              Instantly counter-position with automated ABM engineering whitepapers.
            </p>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-700/80 pt-4 md:pt-0 md:pl-6 shrink-0">
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Identified Pipeline</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-humanist">{pipelineTotal}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">3 High-Velocity Accounts</p>
            </div>
            <button
              onClick={fetchIntent}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
              title="Refresh Radar"
            >
              <span className="css-icon-bolt"></span>
            </button>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg("")} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Visitor Account Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <span className="inline-block w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mb-2"></span>
            <p className="text-xs font-mono uppercase tracking-wider">Streaming IP Graph Signals…</p>
          </div>
        ) : (
          accounts.map((acc) => (
            <div
              key={acc.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">{acc.companyName}</h3>
                    <p className="text-[11px] font-mono text-sky-700 font-semibold">{acc.domain}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    {acc.intentVelocityScore}% VELOCITY
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Industry:</span>
                    <span className="font-semibold text-slate-800 text-right">{acc.industry}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Facility:</span>
                    <span className="font-semibold text-slate-800 text-right">{acc.plantLocation}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Est. Deal Value:</span>
                    <span className="font-bold text-emerald-700 font-mono text-right">{acc.potentialDealSize}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Last Seen:</span>
                    <span className="font-mono text-slate-500">{acc.lastActiveMinutesAgo}m ago</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4 space-y-1">
                  <p className="text-[10px] font-mono uppercase font-bold text-slate-500">Researched Zero-Volume Topic</p>
                  <p className="text-xs font-semibold text-slate-900 leading-snug">{acc.researchedTopic}</p>
                  <p className="text-[10px] font-mono text-sky-800 pt-0.5">Query: &quot;{acc.searchIntentKeyword}&quot;</p>
                </div>
              </div>

              <button
                onClick={() => handleTriggerABM(acc)}
                disabled={triggeringId === acc.id}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-60"
              >
                {triggeringId === acc.id ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>Dispatching ABM Spec…</span>
                  </>
                ) : (
                  <>
                    <span className="css-icon-bolt"></span>
                    <span>1-Click Launch Counter-Spec Draft</span>
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
