"use client";

import { useState, useEffect } from "react";
import type { StandardConversionPair } from "@/app/api/tools/convert-standards/route";

export function UnitStandardConverter() {
  const [selectedVertical, setSelectedVertical] = useState<"hvac" | "sanitary_pumps" | "hydraulics">("hvac");
  const [pairs, setPairs] = useState<StandardConversionPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchConversions = async (cat: "hvac" | "sanitary_pumps" | "hydraulics") => {
    setSelectedVertical(cat);
    setLoading(true);
    try {
      const res = await fetch("/api/tools/convert-standards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cat }),
      });
      const data = await res.json();
      if (res.ok && data.conversionPairs) {
        setPairs(data.conversionPairs);
      }
    } catch (e) {
      console.error("Standard conversion error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    void fetchConversions("hvac");
  }, []);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Global Standardizer &amp; Metric/Imperial Auto-Converter
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Convert US Imperial engineering parameters (ASHRAE / ASME / ASTM) into certified European &amp; Asian ISO/DIN Metric standards with zero rounding error. Allows single-click cross-border publishing.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-sky-50 text-sky-700 border border-sky-200 self-start sm:self-auto">
            ISO 80000-1 / NIST 811
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => void fetchConversions("hvac")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedVertical === "hvac"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            HVAC &amp; Refrigeration (ASHRAE &harr; EN 378)
          </button>
          <button
            type="button"
            onClick={() => void fetchConversions("sanitary_pumps")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedVertical === "sanitary_pumps"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Sanitary Food &amp; Pharma (3-A &harr; DIN 11866)
          </button>
          <button
            type="button"
            onClick={() => void fetchConversions("hydraulics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedVertical === "hydraulics"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Fluid Power &amp; Hydraulics (SAE &harr; ISO 4406)
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-10 text-center text-slate-400 font-mono text-xs">
            Calculating NIST/ISO Regulatory Equivalence...
          </div>
        ) : (
          pairs.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <span className="text-xs font-mono font-bold text-slate-900">
                  {p.imperialParam} &harr; {p.metricParam}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {p.verifiedTolerance}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* US Imperial Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                      US Market (Imperial Units)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Domestic SOP</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900 font-mono py-1">{p.imperialValue}</div>
                  <div className="text-[11px] text-slate-600 font-mono pt-1 border-t border-slate-200/60">
                    Governing Code: <strong>{p.governingUsStandard}</strong>
                  </div>
                </div>

                {/* ISO/DIN Metric Card */}
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-sky-800">
                      Global Export (ISO / DIN Metric)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${p.metricValue} (${p.equivalentIsoDinStandard})`, idx)}
                      className="text-[10px] font-mono text-sky-700 hover:underline cursor-pointer font-bold flex items-center gap-1"
                    >
                      <span className="css-icon-check"></span>
                      <span>{copiedIndex === idx ? "Copied" : "Copy Metric SOP"}</span>
                    </button>
                  </div>
                  <div className="text-base font-extrabold text-sky-900 font-mono py-1">{p.metricValue}</div>
                  <div className="text-[11px] text-sky-800 font-mono pt-1 border-t border-sky-200/60">
                    Certified Equivalence: <strong>{p.equivalentIsoDinStandard}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
