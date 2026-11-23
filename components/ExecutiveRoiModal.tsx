"use client";

import React, { useState } from "react";

export function ExecutiveRoiModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOpenPrintable = () => {
    window.open("/api/reports/executive-roi?format=html", "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 sm:p-8 space-y-6 max-h-[90dvh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
              <span className="css-icon-chart text-emerald-700"></span>
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Executive AEO &amp; Search ROI Digest
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                C-Suite Attribution Report · Google AI &amp; Perplexity Impact
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
          >
            <span className="css-icon-cross"></span>
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 leading-relaxed">
            <strong className="block text-emerald-950 text-sm mb-1">
              Executive Proof of Value (The CFO Report)
            </strong>
            This automated monthly digest proves exact business attribution to your VP of Marketing and CFO: how many times your equipment was cited as the #1 diagnostic source, how many plant reliability engineers visited, and estimated machinery replacement pipeline value.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">AEO Citations</span>
              <span className="text-xl font-black text-emerald-700">84</span>
              <span className="text-[10px] text-slate-500 block">#1 Sources</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Citation Share</span>
              <span className="text-xl font-black text-sky-700">96.2%</span>
              <span className="text-[10px] text-slate-500 block">Brand Dominance</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Engineer Visits</span>
              <span className="text-xl font-black text-slate-900">1,240</span>
              <span className="text-[10px] text-slate-500 block">Qualified Buyers</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Attributed Pipeline</span>
              <span className="text-xl font-black text-emerald-700">$480k+</span>
              <span className="text-[10px] text-slate-500 block">Est. Equipment Deals</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <strong className="text-slate-900 text-xs block">Key Included Sections:</strong>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Verified Google AI Overview &amp; Perplexity Copilot source breakdown</li>
              <li>Top 5 performing failure-mode slices and corresponding regulatory standards (ASHRAE, ASME, ISO)</li>
              <li>Inbound RFQ &amp; diagnostic engineering checklist download attribution</li>
              <li>Branded PDF letterhead ready for executive board presentation</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleOpenPrintable}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <span className="css-icon-doc"></span>
            <span>Open &amp; Print Executive PDF</span>
            <span className="css-icon-launch"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
