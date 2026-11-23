"use client";

import { useEffect, useState } from "react";
import type { MdfClaim } from "@/app/api/billing/mdf/route";

export function MdfCoOpBilling() {
  const [claims, setClaims] = useState<MdfClaim[]>([]);
  const [availableBudget, setAvailableBudget] = useState(45000);
  const [remainingBudget, setRemainingBudget] = useState(23750);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const [distributorName, setDistributorName] = useState("Ferguson Industrial Distribution");
  const [oemSponsor, setOemSponsor] = useState("Carrier Commercial HVAC");
  const [claimAmount, setClaimAmount] = useState("6500");
  const [poNumber, setPoNumber] = useState("PO-MDF-2026-9921");
  const [submitting, setSubmitting] = useState(false);

  const fetchMdf = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/mdf");
      const data = await res.json();
      if (res.ok) {
        if (data.claims) setClaims(data.claims);
        if (data.availableMdfBudgetUsd) setAvailableBudget(data.availableMdfBudgetUsd);
        if (data.remainingMdfUsd) setRemainingBudget(data.remainingMdfUsd);
      }
    } catch {
      setActionMsg("Failed to stream OEM MDF billing ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMdf();
  }, []);

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/billing/mdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distributorName,
          oemSponsor,
          claimAmountUsd: Number(claimAmount),
          poNumber,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(data.message);
        fetchMdf();
      } else {
        setActionMsg(data.error || "Failed to submit MDF claim.");
      }
    } catch {
      setActionMsg("Network error submitting MDF claim.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                OEM CO-OP ADVERTISING &amp; MDF FINANCING
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Net-30 PO Reconciliation</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Market Development Funds (MDF) Co-Op Ledger
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Eliminate software budget objections. Allow regional distributors and dealers to finance their local programmatic content engine directly through pre-approved OEM co-op advertising allowances.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Total OEM Co-Op Cap</p>
              <p className="text-2xl font-black text-slate-900 font-humanist">${availableBudget.toLocaleString("en-US")}</p>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Available Dealer Balance</p>
              <p className="text-2xl font-black text-emerald-600 font-humanist">${remainingBudget.toLocaleString("en-US")}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Claims Column */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
            Active Distributor Co-Op Claims
          </h3>

          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <span className="inline-block w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {claims.map((claim) => (
                <div key={claim.id} className="p-4 bg-white hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-slate-900 text-sm">{claim.distributorName}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        claim.status === "APPROVED" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {claim.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-slate-600">OEM Sponsor: <strong className="text-slate-900">{claim.oemSponsor}</strong></p>
                    <p className="text-[10px] font-mono text-slate-500 mt-1">PO: {claim.poNumber} &bull; Submitted: {claim.submittedDate}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-emerald-700 block font-mono">
                      ${claim.claimAmountUsd.toLocaleString("en-US")} USD
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">100% OEM Reimbursed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claim Submission Column */}
        <form onSubmit={handleSubmitClaim} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
            Submit Dealer Co-Op Claim
          </h3>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Distributor / Dealer Name
            </label>
            <input
              required
              value={distributorName}
              onChange={(e) => setDistributorName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              OEM Sponsor Program
            </label>
            <input
              required
              value={oemSponsor}
              onChange={(e) => setOemSponsor(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Amount (USD)
              </label>
              <input
                required
                type="number"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-mono outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Purchase Order #
              </label>
              <input
                required
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-mono outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            {submitting ? "Verifying OEM Budget…" : "Submit Claim for Reimbursement"}
          </button>
        </form>
      </div>
    </div>
  );
}
