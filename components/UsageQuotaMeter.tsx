"use client";

import React, { useState } from "react";

export interface QuotaMetric {
  id: string;
  name: string;
  used: number;
  limit: number;
  unit: string;
  tier: string;
  isOverLimit: boolean;
  warningThreshold: number; // percentage (e.g. 80)
}

const DEFAULT_METRICS: QuotaMetric[] = [
  {
    id: "pages",
    name: "AEO Pages Generated",
    used: 84,
    limit: 100,
    unit: "pages",
    tier: "Scale Tier",
    isOverLimit: false,
    warningThreshold: 80,
  },
  {
    id: "words",
    name: "AI Tokens / Words Processed",
    used: 182400,
    limit: 250000,
    unit: "words",
    tier: "Scale Tier",
    isOverLimit: false,
    warningThreshold: 80,
  },
  {
    id: "aeo_simulations",
    name: "AEO Live Citation Simulations",
    used: 92,
    limit: 100,
    unit: "runs",
    tier: "Scale Tier",
    isOverLimit: false,
    warningThreshold: 90,
  },
  {
    id: "cad_extractions",
    name: "STEP CAD Schema Extractions",
    used: 18,
    limit: 25,
    unit: "files",
    tier: "Scale Tier",
    isOverLimit: false,
    warningThreshold: 70,
  },
  {
    id: "webhook_syncs",
    name: "CMS & Distributor Webhooks",
    used: 1240,
    limit: 5000,
    unit: "events",
    tier: "Scale Tier",
    isOverLimit: false,
    warningThreshold: 80,
  },
];

export function UsageQuotaMeter() {
  const [metrics] = useState<QuotaMetric[]>(DEFAULT_METRICS);
  const [daysRemaining] = useState(9);
  const [quotaBanner, setQuotaBanner] = useState<string | null>(null);

  const handleUpgradeClick = () => {
    setQuotaBanner("Redirecting to Stripe Billing Portal to scale plan limits...");
    setTimeout(() => setQuotaBanner(null), 4000);
  };

  const handleManageOverage = () => {
    setQuotaBanner("Soft-limit auto-expansion guardrails verified. High-priority publishing protected.");
    setTimeout(() => setQuotaBanner(null), 4000);
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Overview Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0 font-bold text-xs">
              📊
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Workspace Usage &amp; Plan Quota Meters
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time telemetry of your monthly consumption across AEO content engines, CAD extraction, and CMS integrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Billing Cycle</span>
            <p className="text-sm font-bold text-slate-800">{daysRemaining} Days Remaining</p>
          </div>
          <button
            onClick={handleUpgradeClick}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
          >
            Upgrade Plan &amp; Add Capacity
          </button>
        </div>
      </div>

      {quotaBanner && (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-800 animate-fade-in flex items-center gap-2">
          <span>ℹ️</span>
          <span>{quotaBanner}</span>
        </div>
      )}

      {/* Quota Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((m) => {
          const percent = Math.min(100, Math.round((m.used / m.limit) * 100));
          const isWarning = percent >= m.warningThreshold;

          return (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 bg-white shadow-xs space-y-4 transition-all ${
                isWarning ? "border-amber-300 ring-1 ring-amber-100" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                  <span className="text-[11px] font-semibold text-slate-400">{m.tier}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    isWarning
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {percent}%
                </span>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {m.used.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    / {m.limit.toLocaleString()} {m.unit}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent >= 90
                        ? "bg-rose-500"
                        : percent >= 75
                        ? "bg-amber-500"
                        : "bg-indigo-600"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-500">
                <span>
                  Remaining:{" "}
                  <strong className="text-slate-800">
                    {(m.limit - m.used).toLocaleString()} {m.unit}
                  </strong>
                </span>
                {isWarning && (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    Approaching limit
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overage Guardrail Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-indigo-950">
            Soft-Limit Auto-Expansion Protection Active
          </h4>
          <p className="text-xs text-indigo-700">
            Never lose an RFQ. When limits are reached, high-priority publishing continues automatically at $12 per 10 additional AEO pages without service disruption.
          </p>
        </div>
        <button
          onClick={handleManageOverage}
          className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-semibold"
        >
          Manage Overage Rules
        </button>
      </div>
    </div>
  );
}
