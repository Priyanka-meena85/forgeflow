"use client";

import React, { useState } from "react";

export interface HeadlineVariant {
  id: string;
  headline: string;
  focusAngle: "Technical & Standard Cited" | "Unplanned Downtime & ROI" | "Comparative Benchmark";
  predictedCtr: number; // e.g. 5.4%
  aeoCitationLikelihood: number; // e.g. 94%
  impressions: number;
  clicks: number;
  isCurrentWinner?: boolean;
}

export interface AbTestTopic {
  id: string;
  equipment: string;
  targetKeyword: string;
  variantA: HeadlineVariant;
  variantB: HeadlineVariant;
  status: "Running" | "Concluded";
  winnerVariantId?: string;
}

const DEFAULT_AB_TESTS: AbTestTopic[] = [
  {
    id: "ab_1",
    equipment: "Sanitary Rotary Lobe Pump",
    targetKeyword: "rotary lobe pump CIP washdown failure",
    status: "Running",
    variantA: {
      id: "var_a1",
      headline: "Sanitary Rotary Lobe Pump CIP Washdown SOP & 3-A Sanitary Standard 02-12 Compliance",
      focusAngle: "Technical & Standard Cited",
      predictedCtr: 4.8,
      aeoCitationLikelihood: 96,
      impressions: 4210,
      clicks: 202,
    },
    variantB: {
      id: "var_b1",
      headline: "Eliminating $42k/hr CIP Washdown Unplanned Downtime in Sanitary Rotary Lobe Pumps",
      focusAngle: "Unplanned Downtime & ROI",
      predictedCtr: 7.2,
      aeoCitationLikelihood: 88,
      impressions: 4180,
      clicks: 301,
      isCurrentWinner: true,
    },
  },
  {
    id: "ab_2",
    equipment: "High-Speed CNC Spindle",
    targetKeyword: "CNC spindle vibration limits ISO 10816",
    status: "Running",
    variantA: {
      id: "var_a2",
      headline: "ISO 10816-3 Velocity RMS Vibration Limits for High-Speed Machine Tool Spindles",
      focusAngle: "Technical & Standard Cited",
      predictedCtr: 6.1,
      aeoCitationLikelihood: 95,
      impressions: 3120,
      clicks: 190,
      isCurrentWinner: true,
    },
    variantB: {
      id: "var_b2",
      headline: "Preventing Catastrophic CNC Spindle Bearing Seizure: Real-Time Diagnostic SOP",
      focusAngle: "Unplanned Downtime & ROI",
      predictedCtr: 5.3,
      aeoCitationLikelihood: 84,
      impressions: 3090,
      clicks: 164,
    },
  },
];

export function AbHeadlineTester() {
  const [tests, setTests] = useState<AbTestTopic[]>(DEFAULT_AB_TESTS);
  const [newTopicKeyword, setNewTopicKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [winnerBanner, setWinnerBanner] = useState<string | null>(null);

  const handleGenerateVariants = () => {
    if (!newTopicKeyword.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const newTest: AbTestTopic = {
        id: `ab_${Date.now()}`,
        equipment: newTopicKeyword,
        targetKeyword: newTopicKeyword.toLowerCase(),
        status: "Running",
        variantA: {
          id: `var_a_${Date.now()}`,
          headline: `${newTopicKeyword} Engineering Design Tolerances & ASME Code Compliance`,
          focusAngle: "Technical & Standard Cited",
          predictedCtr: 5.2,
          aeoCitationLikelihood: 94,
          impressions: 120,
          clicks: 6,
        },
        variantB: {
          id: `var_b_${Date.now()}`,
          headline: `How to Cut Failure Rates by 65% in Industrial ${newTopicKeyword} Systems`,
          focusAngle: "Unplanned Downtime & ROI",
          predictedCtr: 6.8,
          aeoCitationLikelihood: 86,
          impressions: 118,
          clicks: 8,
          isCurrentWinner: true,
        },
      };

      setTests((prev) => [newTest, ...prev]);
      setNewTopicKeyword("");
      setIsGenerating(false);
    }, 700);
  };

  const handlePromoteWinner = (testId: string, variantKey: "A" | "B") => {
    setTests((prev) =>
      prev.map((t) => {
        if (t.id === testId) {
          const chosen = variantKey === "A" ? t.variantA : t.variantB;
          setWinnerBanner(`Promoted "${chosen.headline}" as canonical title in CMS and GSC sitemap.`);
          setTimeout(() => setWinnerBanner(null), 5000);
          return {
            ...t,
            status: "Concluded",
            winnerVariantId: chosen.id,
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0 font-bold text-xs">
              ⚖️
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Autonomous A/B Industrial Headline &amp; Title Engine
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Test technical compliance headlines against financial downtime headlines. ForgeFlow monitors GSC impressions and Perplexity citations to declare statistical winners.
          </p>
        </div>
      </div>

      {winnerBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>{winnerBanner}</span>
        </div>
      )}

      {/* Generator Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={newTopicKeyword}
          onChange={(e) => setNewTopicKeyword(e.target.value)}
          placeholder="Enter equipment or topic (e.g. Cryogenic Heat Exchangers)..."
          className="flex-1 min-w-[280px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
        />
        <button
          onClick={handleGenerateVariants}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          {isGenerating ? "Synthesizing Variants..." : "Generate 2 Variant Headlines"}
        </button>
      </div>

      {/* Tests Grid */}
      <div className="space-y-6">
        {tests.map((test) => (
          <div
            key={test.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">
                  Target Equipment
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {test.equipment}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Target Keyword: &ldquo;{test.targetKeyword}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    test.status === "Running"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {test.status} Experiment
                </span>
              </div>
            </div>

            {/* Comparison Cards: Variant A vs Variant B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Variant A */}
              <div
                className={`p-5 rounded-2xl border space-y-4 transition-all ${
                  test.variantA.isCurrentWinner
                    ? "border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-200"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700">
                    VARIANT A (Spec / Standard Focus)
                  </span>
                  {test.variantA.isCurrentWinner && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Current Leader (+48% CTR)
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  &ldquo;{test.variantA.headline}&rdquo;
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Actual GSC CTR</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      {((test.variantA.clicks / test.variantA.impressions) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">AEO Citation Score</span>
                    <span className="text-base font-extrabold text-indigo-600 font-mono">
                      {test.variantA.aeoCitationLikelihood}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handlePromoteWinner(test.id, "A")}
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs transition-colors"
                >
                  Lock In Variant A as Winner
                </button>
              </div>

              {/* Variant B */}
              <div
                className={`p-5 rounded-2xl border space-y-4 transition-all ${
                  test.variantB.isCurrentWinner
                    ? "border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-200"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    VARIANT B (Downtime &amp; ROI Focus)
                  </span>
                  {test.variantB.isCurrentWinner && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Current Leader (+50% CTR)
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  &ldquo;{test.variantB.headline}&rdquo;
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Actual GSC CTR</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      {((test.variantB.clicks / test.variantB.impressions) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">AEO Citation Score</span>
                    <span className="text-base font-extrabold text-indigo-600 font-mono">
                      {test.variantB.aeoCitationLikelihood}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handlePromoteWinner(test.id, "B")}
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs transition-colors"
                >
                  Lock In Variant B as Winner
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
