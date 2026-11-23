"use client";

import React, { useState } from "react";

interface InteractiveDiagnosticStudioProps {
  onActionMessage: (msg: string) => void;
}

export function InteractiveDiagnosticStudio({ onActionMessage }: InteractiveDiagnosticStudioProps) {
  const [activeWidgetType, setActiveWidgetType] = useState<"hvac" | "hydraulic" | "stamping">("hvac");
  const [hvacPressure, setHvacPressure] = useState(120);
  const [hvacTemp, setHvacTemp] = useState(52);
  const [hydraulicFlow, setHydraulicFlow] = useState(25);
  const [hydraulicHoseId, setHydraulicHoseId] = useState(0.75);
  const [stampingThickness, setStampingThickness] = useState(2.0);
  const [stampingPerimeter, setStampingPerimeter] = useState(180);
  const [stampingTensile, setStampingTensile] = useState(600);

  const satTemp = 0.42 * hvacPressure - 9.5;
  const superheat = Math.max(0, hvacTemp - satTemp);
  const isFloodback = superheat < 6;
  const isStarved = superheat > 18;

  const area = Math.PI * Math.pow(hydraulicHoseId / 2, 2);
  const velocity = (hydraulicFlow * 0.3208) / area;
  const isCavitation = velocity > 4.5;

  const clearanceMm = stampingThickness * 0.09;
  const tonnageMetric = (stampingPerimeter * stampingThickness * stampingTensile * 0.8) / (9810 * 1.0);

  return (
    <div className="p-5 rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h3 className="font-bold text-sm text-slate-100 uppercase font-mono">
            Interactive Engineering Diagnostic Calculator
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg">
          {(["hvac", "hydraulic", "stamping"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveWidgetType(t)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                activeWidgetType === t ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {activeWidgetType === "hvac" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Suction Pressure (psig)</label>
              <input
                type="range"
                min="60"
                max="160"
                value={hvacPressure}
                onChange={(e) => setHvacPressure(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[11px] text-slate-300 mt-1">
                <span>60 psig</span>
                <span className="font-bold text-indigo-400">{hvacPressure} psig</span>
                <span>160 psig</span>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Suction Line Temp (°F)</label>
              <input
                type="range"
                min="30"
                max="80"
                value={hvacTemp}
                onChange={(e) => setHvacTemp(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[11px] text-slate-300 mt-1">
                <span>30°F</span>
                <span className="font-bold text-indigo-400">{hvacTemp}°F</span>
                <span>80°F</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Calculated Suction Superheat</div>
              <div className={`text-2xl font-bold font-mono ${isFloodback ? "text-amber-400" : isStarved ? "text-red-400" : "text-emerald-400"}`}>
                {superheat.toFixed(1)} °F
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Operating Risk Protocol</div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold inline-block mt-0.5 ${
                isFloodback
                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                  : isStarved
                  ? "bg-red-950 text-red-300 border border-red-800"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-800"
              }`}>
                {isFloodback ? "Liquid Slugging Risk (<6°F)" : isStarved ? "Evaporator Starved (>18°F)" : "Optimal Envelope (10-14°F)"}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeWidgetType === "hydraulic" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Flow Rate (GPM)</label>
              <input
                type="range"
                min="5"
                max="60"
                value={hydraulicFlow}
                onChange={(e) => setHydraulicFlow(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[11px] text-slate-300 mt-1">
                <span>5 GPM</span>
                <span className="font-bold text-cyan-400">{hydraulicFlow} GPM</span>
                <span>60 GPM</span>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Hose Inside Diameter (Inches)</label>
              <select
                value={hydraulicHoseId}
                onChange={(e) => setHydraulicHoseId(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white"
              >
                <option value={0.5}>0.50 in (1/2")</option>
                <option value={0.75}>0.75 in (3/4")</option>
                <option value={1.0}>1.00 in (1")</option>
                <option value={1.25}>1.25 in (1-1/4")</option>
                <option value={1.5}>1.50 in (1-1/2")</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Fluid Velocity (fps)</div>
              <div className={`text-2xl font-bold font-mono ${velocity > 20 ? "text-red-400" : isCavitation ? "text-amber-400" : "text-cyan-400"}`}>
                {velocity.toFixed(2)} ft/sec
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">ISO 4406 Cleanliness Gate</div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold inline-block mt-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800">
                {velocity > 20 ? "Pressure Line High" : isCavitation ? "Suction Cavitation Risk (>4 fps)" : "Normal Pressure Velocity"}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeWidgetType === "stamping" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Thickness (mm)</label>
              <input
                type="number"
                step="0.1"
                value={stampingThickness}
                onChange={(e) => setStampingThickness(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Perimeter (mm)</label>
              <input
                type="number"
                value={stampingPerimeter}
                onChange={(e) => setStampingPerimeter(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Tensile (MPa)</label>
              <input
                type="number"
                value={stampingTensile}
                onChange={(e) => setStampingTensile(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Recommended Die Clearance (9%)</div>
              <div className="text-xl font-bold font-mono text-amber-400">
                {clearanceMm.toFixed(3)} mm / side
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Required Press Tonnage</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {tonnageMetric.toFixed(1)} Metric Tons
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
        <span>Referenced: ASHRAE 90.1 • ISO 4406 • IATF 16949 Section 8.5</span>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              navigator.clipboard.writeText(`<iframe src="${window.location.origin}/api/widgets" width="100%" height="320" frameborder="0"></iframe>`);
              onActionMessage("Diagnostic Calculator embed code copied to clipboard!");
            }
          }}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-mono font-bold cursor-pointer transition"
        >
          &lt;/&gt; Copy Embed Code
        </button>
      </div>
    </div>
  );
}
