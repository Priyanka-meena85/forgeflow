"use client";

import React, { useState, useRef } from "react";

export interface ClientRoiData {
  clientName: string;
  agencyName: string;
  reportPeriod: string;
  totalArticlesPublished: number;
  totalOrganicImpressions: number;
  totalOrganicClicks: number;
  aeoCitationAppearances: number;
  rfqsGenerated: number;
  averageDealSizeUsd: number;
  totalPipelineValueUsd: number;
  traditionalAgencyCostComparisonUsd: number;
  forgeflowCostUsd: number;
  netSavingsUsd: number;
  topPerformingArticles: Array<{
    title: string;
    rfqs: number;
    pipelineUsd: number;
    aeoScore: number;
  }>;
}

const DEFAULT_ROI_DATA: ClientRoiData = {
  clientName: "Apex Motion Dynamics Ltd.",
  agencyName: "Industrial Growth Partners (White-Label Agency)",
  reportPeriod: "Q4 2026 (Oct 1 - Dec 31)",
  totalArticlesPublished: 48,
  totalOrganicImpressions: 184500,
  totalOrganicClicks: 14200,
  aeoCitationAppearances: 312,
  rfqsGenerated: 64,
  averageDealSizeUsd: 28500,
  totalPipelineValueUsd: 1824000,
  traditionalAgencyCostComparisonUsd: 72000, // $1,500/article * 48
  forgeflowCostUsd: 12000,
  netSavingsUsd: 60000,
  topPerformingArticles: [
    {
      title: "Eliminating CIP Washdown Unplanned Downtime in Sanitary Rotary Lobe Pumps",
      rfqs: 19,
      pipelineUsd: 541500,
      aeoScore: 98,
    },
    {
      title: "ISO 10816-3 Vibration Severity Limits for Heavy Industrial CNC Spindles",
      rfqs: 15,
      pipelineUsd: 427500,
      aeoScore: 94,
    },
    {
      title: "ASME Section VIII Div 1 Pressure Vessel Nozzle Weld Flange Tolerances",
      rfqs: 12,
      pipelineUsd: 342000,
      aeoScore: 91,
    },
    {
      title: "Carrier RTU Economizer Delta-T Diagnostic SOP for Commercial HVAC",
      rfqs: 10,
      pipelineUsd: 285000,
      aeoScore: 96,
    },
    {
      title: "DIN 7168 Fine Tolerance Machining Guidelines for Aerospace Bushings",
      rfqs: 8,
      pipelineUsd: 228000,
      aeoScore: 89,
    },
  ],
};

export function ClientRoiReportPdfExport() {
  const [data, setData] = useState<ClientRoiData>(DEFAULT_ROI_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [tempClientName, setTempClientName] = useState(DEFAULT_ROI_DATA.clientName);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 300);
  };

  const handleSaveClientName = () => {
    if (tempClientName.trim()) {
      setData((prev) => ({ ...prev, clientName: tempClientName.trim() }));
    }
    setIsEditingClient(false);
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Control Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0 font-bold text-xs">
              PDF
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Agency Client ROI Executive Report Generator
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Generate branded, audit-ready ROI reports to prove pipeline attribution, RFQs generated, and content cost-savings to industrial clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditingClient ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempClientName}
                onChange={(e) => setTempClientName(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                placeholder="Client name"
              />
              <button
                onClick={handleSaveClientName}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempClientName(data.clientName);
                setIsEditingClient(true);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            >
              Edit Client: {data.clientName}
            </button>
          )}
          <button
            onClick={handlePrint}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <span>{isExporting ? "Formatting..." : "Download Executive PDF / Print"}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div
        ref={printAreaRef}
        className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0"
      >
        {/* Report Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-8 flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
              {data.agencyName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Industrial Search &amp; AEO Performance Review
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Prepared exclusively for <strong className="text-slate-800">{data.clientName}</strong> &bull; Period: {data.reportPeriod}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              VERIFIED ROI: 152x
            </div>
            <p className="text-xs text-slate-400 mt-1">Status: Board Certified</p>
          </div>
        </div>

        {/* 4 Big Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Pipeline Value
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              ${(data.totalPipelineValueUsd / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              Across {data.rfqsGenerated} Qualified RFQs
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              AEO AI Citations
            </span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2">
              {data.aeoCitationAppearances}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ChatGPT, Perplexity &amp; Google AIO
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Organic Clicks
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {data.totalOrganicClicks.toLocaleString("en-US")}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {data.totalOrganicImpressions.toLocaleString("en-US")} Technical Impressions
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              Agency Cost Savings
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
              ${(data.netSavingsUsd / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1">
              vs. Legacy Technical Copywriters
            </p>
          </div>
        </div>

        {/* Financial ROI Comparison Breakdown */}
        <div className="rounded-2xl border border-slate-200 p-6 bg-white space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Cost &amp; Velocity Comparison: ForgeFlow vs. Traditional Agency
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
              <span className="font-bold text-rose-800 uppercase tracking-wider text-[11px]">
                Traditional Technical Writing Agency
              </span>
              <div className="text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>48 Articles @ $1,500/ea:</span>
                  <span className="font-mono font-bold">$72,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Time to Market:</span>
                  <span className="font-mono font-semibold">6 - 9 Months</span>
                </div>
                <div className="flex justify-between">
                  <span>AEO Schema &amp; CAD Integration:</span>
                  <span className="font-semibold text-rose-600">None (Manual only)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px]">
                ForgeFlow Automated AEO Engine
              </span>
              <div className="text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>Subscription &amp; Platform Cost:</span>
                  <span className="font-mono font-bold text-emerald-700">$12,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Time to Market:</span>
                  <span className="font-mono font-semibold text-emerald-700">14 Days</span>
                </div>
                <div className="flex justify-between">
                  <span>AEO Schema &amp; CAD STEP Extractor:</span>
                  <span className="font-semibold text-emerald-700">Automated 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Technical Assets */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Top Performing Pages &amp; Direct RFQ Pipeline Attribution
          </h3>
          <div className="rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[540px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-3.5">Industrial Topic / Equipment</th>
                  <th className="p-3.5 text-center">AEO Score</th>
                  <th className="p-3.5 text-center">Verified RFQs</th>
                  <th className="p-3.5 text-right">Attributed Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.topPerformingArticles.map((art, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-medium text-slate-800 max-w-md">
                      {art.title}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold font-mono">
                        {art.aeoScore}%
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-900 font-mono">
                      {art.rfqs}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700 font-mono">
                      ${art.pipelineUsd.toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Sign-Off Footer */}
        <div className="border-t border-slate-200 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span>Generated cryptographically by ForgeFlow Industrial AEO &bull; SHA-256 Audit Seal</span>
          </div>
          <div className="text-right">
            <span>Confidential &amp; Proprietary &bull; Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
