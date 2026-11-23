"use client";

import { useEffect, useState } from "react";

interface ExecutiveReportData {
  meta: {
    reportId: string;
    generatedAt: string;
    organizationName: string;
    auditPeriod: string;
    complianceStandard: string;
  };
  executiveSummary: {
    overallAeoScore: number;
    aeoScoreDelta: string;
    verifiedTechnicalSpecsCount: number;
    estimatedPipelineInfluenced: string;
    rfqConversionLift: string;
    verdict: string;
  };
  aiEngineVisibility: Array<{
    engine: string;
    marketSharePct: number;
    primaryCitationRate: string;
    status: string;
    topTrigger: string;
  }>;
  competitorDisplacement: Array<{
    competitor: string;
    displacedQueriesCount: number;
    citationWinRate: string;
    topDisplacedPartCategory: string;
  }>;
  influencedEnterpriseAccounts: Array<{
    account: string;
    ipConfidence: string;
    visits: number;
    partsInspected: string[];
    estimatedRfqValue: string;
  }>;
  strategicActionPlan: string[];
}

export function ExecutiveAuditReportModal({
  isOpen,
  onClose,
  orgName,
}: {
  isOpen: boolean;
  onClose: () => void;
  orgName?: string;
}) {
  const [data, setData] = useState<ExecutiveReportData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`/api/reports/executive-audit?org=${encodeURIComponent(orgName || "Apex Motion Systems")}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.report) {
          setData(json.report);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [isOpen, orgName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-5 sm:p-8 text-zinc-100 my-auto max-h-[90dvh] overflow-y-auto">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 text-xs font-mono bg-indigo-950 text-indigo-400 border border-indigo-800 rounded">
                C-SUITE BOARD AUDIT
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {data?.meta.reportId || "EXECUTIVE-AEO-REPORT"}
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-1 text-white">
              {data?.meta.organizationName || orgName || "Apex Motion Systems"} — Executive AEO Audit & ROI
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Period: {data?.meta.auditPeriod || "Q4 2026"} | {data?.meta.complianceStandard}
            </p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-800 transition"
            >
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-zinc-400">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Synthesizing executive board intelligence...</p>
          </div>
        ) : data ? (
          <div className="space-y-6 mt-6">
            {/* KPI Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg">
                <span className="text-xs text-zinc-400 uppercase font-mono">AEO Domain Score</span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{data.executiveSummary.overallAeoScore}/100</div>
                <span className="text-xs text-emerald-500/80">{data.executiveSummary.aeoScoreDelta}</span>
              </div>
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg">
                <span className="text-xs text-zinc-400 uppercase font-mono">Verified Tech Specs</span>
                <div className="text-3xl font-extrabold text-white mt-1">{data.executiveSummary.verifiedTechnicalSpecsCount}</div>
                <span className="text-xs text-zinc-400">ASME / ISO Schemas</span>
              </div>
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg">
                <span className="text-xs text-zinc-400 uppercase font-mono">Influenced Pipeline</span>
                <div className="text-3xl font-extrabold text-indigo-400 mt-1">{data.executiveSummary.estimatedPipelineInfluenced}</div>
                <span className="text-xs text-zinc-400">Fortune 500 Manufacturing</span>
              </div>
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg">
                <span className="text-xs text-zinc-400 uppercase font-mono">RFQ Conversion Lift</span>
                <div className="text-3xl font-extrabold text-purple-400 mt-1">{data.executiveSummary.rfqConversionLift}</div>
                <span className="text-xs text-zinc-400">vs Organic Search</span>
              </div>
            </div>

            {/* Verdict */}
            <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-lg text-sm text-indigo-200">
              <strong className="text-indigo-400">Executive Assessment: </strong>
              {data.executiveSummary.verdict}
            </div>

            {/* AI Engine Breakdown */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-mono mb-3">
                Answer Engine Visibility Matrix
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.aiEngineVisibility.map((eng) => (
                  <div key={eng.engine} className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">{eng.engine}</span>
                      <span className="px-2 py-0.5 text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-mono">
                        {eng.primaryCitationRate} Primary Citation
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                      <span className="text-zinc-400">Top Query Trigger: </span>
                      <span className="text-zinc-300 font-mono">{eng.topTrigger}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Influenced Accounts Table */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-mono mb-3">
                Reverse-IP Deanonymized High-Intent Enterprise Accounts
              </h3>
              <div className="overflow-x-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-zinc-400 font-mono uppercase border-b border-zinc-800">
                    <tr>
                      <th className="py-2.5 px-4">Enterprise Account</th>
                      <th className="py-2.5 px-4">Confidence</th>
                      <th className="py-2.5 px-4">Catalog Interactions</th>
                      <th className="py-2.5 px-4">Key Parts Inspected</th>
                      <th className="py-2.5 px-4">Estimated RFQ Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/40">
                    {data.influencedEnterpriseAccounts.map((acc) => (
                      <tr key={acc.account} className="hover:bg-zinc-900/40 transition">
                        <td className="py-3 px-4 font-semibold text-white">{acc.account}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400">{acc.ipConfidence}</td>
                        <td className="py-3 px-4 text-zinc-300">{acc.visits} sessions</td>
                        <td className="py-3 px-4 font-mono text-zinc-400">{acc.partsInspected.join(", ")}</td>
                        <td className="py-3 px-4 font-mono text-indigo-300 font-bold">{acc.estimatedRfqValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Action Items */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono mb-2">
                Action Items for Next Quarterly Business Review (QBR)
              </h3>
              <ul className="space-y-1.5 text-xs text-zinc-300 list-disc list-inside">
                {data.strategicActionPlan.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
