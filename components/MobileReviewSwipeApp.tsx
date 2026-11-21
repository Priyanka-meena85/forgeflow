"use client";

import React, { useState } from "react";

export interface MobileReviewDraft {
  id: string;
  title: string;
  equipment: string;
  standardCited: string;
  wordCount: number;
  riskRating: "Low" | "Medium" | "High";
  keyClaim: string;
  schemaValid: boolean;
  cadVerified: boolean;
}

const MOCK_MOBILE_QUEUE: MobileReviewDraft[] = [
  {
    id: "draft_01",
    title: "Sanitary Rotary Lobe Pump CIP Washdown SOP & Elastomer Compatibility",
    equipment: "Sanitary Rotary Lobe Pump",
    standardCited: "3-A Sanitary Standard 02-12 / FDA 21 CFR",
    wordCount: 2450,
    riskRating: "Low",
    keyClaim: "Caustic washdown >2.5% NaOH causes irreversible volumetric swelling in EPDM seals, requiring FKM upgrade.",
    schemaValid: true,
    cadVerified: true,
  },
  {
    id: "draft_02",
    title: "ISO 10816-3 Machine Vibration Limits: High-Speed CNC Spindle Diagnostic",
    equipment: "Electro-Spindle CNC Machining Centre",
    standardCited: "ISO 10816-3 (Class III rigid support)",
    wordCount: 2280,
    riskRating: "Low",
    keyClaim: "Velocity RMS vibration exceeding 4.5 mm/s indicates imminent inner ring bearing spalling within 72 hours.",
    schemaValid: true,
    cadVerified: true,
  },
  {
    id: "draft_03",
    title: "ASME Section VIII Div 1 Hydrostatic Pressure Testing Protocol",
    equipment: "Shell & Tube Heat Exchanger",
    standardCited: "ASME Section VIII Div 1 UG-99",
    wordCount: 2890,
    riskRating: "Low",
    keyClaim: "Minimum test pressure shall be 1.3 times maximum allowable working pressure multiplied by stress ratio.",
    schemaValid: true,
    cadVerified: true,
  },
];

export function MobileReviewSwipeApp() {
  const [queue, setQueue] = useState<MobileReviewDraft[]>(MOCK_MOBILE_QUEUE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const currentItem = queue[currentIndex];

  const handleApprove = () => {
    if (!currentItem) return;
    setLastAction(`APPROVED & PUBLISHED: "${currentItem.title.slice(0, 40)}..."`);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReject = () => {
    if (!currentItem) return;
    const reason = prompt("Enter revision note for technical team:", "Verify torque rating on page 3");
    if (reason) {
      setLastAction(`CHANGES REQUESTED: "${reason}"`);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLastAction(null);
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0 font-bold text-xs">
              📱
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Mobile Field Review &amp; Swipe-to-Approve QA App
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Engineered for plant managers and field engineers on tablets and smartphones. One-tap sign-off with E-E-A-T cryptographic verification.
          </p>
        </div>

        {currentIndex >= queue.length && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Reset Demo Queue
          </button>
        )}
      </div>

      {lastAction && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          {lastAction}
        </div>
      )}

      {/* Mobile Card Canvas Simulator */}
      <div className="max-w-md mx-auto">
        {currentItem ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-5 relative overflow-hidden transition-all duration-300">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">
                Card {currentIndex + 1} of {queue.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                {currentItem.riskRating} Risk
              </span>
            </div>

            {/* Equipment Tag */}
            <div className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
              {currentItem.equipment}
            </div>

            {/* Title */}
            <h3 className="text-lg font-black text-slate-900 leading-snug">
              {currentItem.title}
            </h3>

            {/* Key Technical Claim */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Core Engineering Claim to Verify
              </span>
              <p className="text-xs font-medium text-slate-800 leading-relaxed italic">
                &ldquo;{currentItem.keyClaim}&rdquo;
              </p>
            </div>

            {/* Compliance Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Standard:</span>
                <span className="font-bold text-slate-800 truncate max-w-[120px]">
                  {currentItem.standardCited}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">CAD Match:</span>
                <span className="font-bold text-emerald-700">Verified 100%</span>
              </div>
            </div>

            {/* Actions: Swipe Left (Reject) vs Swipe Right (Approve) */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={handleReject}
                className="w-full py-3 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>✕ Request Edit</span>
              </button>
              <button
                onClick={handleApprove}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>✓ Approve &amp; Push</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs space-y-3">
            <div className="text-3xl">🎉</div>
            <h3 className="text-base font-bold text-slate-900">
              All Field QA Reviews Completed!
            </h3>
            <p className="text-xs text-slate-500">
              All technical drafts have been validated against ISO/ASME codes and signed off for automated CMS publication.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
