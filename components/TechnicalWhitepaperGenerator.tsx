"use client";

import { useState } from "react";

export function TechnicalWhitepaperGenerator({ selectedDraftId }: { selectedDraftId?: string | number }) {
  const [downloading, setDownloading] = useState(false);

  const handleOpenWhitepaper = () => {
    setDownloading(true);
    const url = `/api/reports/whitepaper${selectedDraftId ? `?draftId=${selectedDraftId}` : ""}`;
    window.open(url, "_blank");
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="css-icon-doc text-sky-600"></span>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              1-Click PE-Certified PDF Technical Whitepaper Generator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Generate publication-ready 2-page engineering whitepapers with corporate header, operating limits table, and verified PE sign-off for procurement RFQ attachment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenWhitepaper}
          disabled={downloading}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <span className="css-icon-launch"></span>
          <span>{downloading ? "Formatting Whitepaper..." : "Preview / Print Whitepaper (PDF)"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Output Format</span>
          <strong className="text-slate-900 font-semibold">2-Page A4 Vector Print Document</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Attribution</span>
          <strong className="text-emerald-700 font-semibold">Includes PE License &amp; Credentials</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Procurement Use</span>
          <strong className="text-sky-800 font-semibold">RFQ &amp; Capital Purchase Attachment</strong>
        </div>
      </div>
    </div>
  );
}
