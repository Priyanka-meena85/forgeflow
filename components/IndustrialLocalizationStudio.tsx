"use client";

import { useEffect, useState } from "react";
import type { LocalizedEngineeringSlice } from "@/lib/standardsCrosswalk";

interface Props {
  initialTitle?: string;
  initialMaterial?: string;
  initialPressure?: number;
  initialTemp?: number;
}

export function IndustrialLocalizationStudio({
  initialTitle = "Root Cause Protocol: Stamping Die Galling & Dynamic Hydraulic Stress",
  initialMaterial = "AISI 4140",
  initialPressure = 3000,
  initialTemp = 180,
}: Props) {
  const [slices, setSlices] = useState<LocalizedEngineeringSlice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<"en-US" | "de-DE" | "ja-JP">("de-DE");
  const [activeView, setActiveView] = useState<"tolerances" | "schema" | "hreflang">("tolerances");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState("");

  // Input States
  const [title, setTitle] = useState(initialTitle);
  const [material, setMaterial] = useState(initialMaterial);
  const [pressurePsi, setPressurePsi] = useState(initialPressure);
  const [temperatureF, setTemperatureF] = useState(initialTemp);
  const [clearanceIn, setClearanceIn] = useState(0.0005);
  const [torqueFtLb, setTorqueFtLb] = useState(65);

  const fetchCrosswalk = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/localize-standard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          material,
          pressurePsi: Number(pressurePsi),
          temperatureF: Number(temperatureF),
          clearanceIn: Number(clearanceIn),
          torqueFtLb: Number(torqueFtLb),
        }),
      });
      const data = await res.json();
      if (res.ok && data.slices) {
        setSlices(data.slices);
        setActionMsg("1-Click Standards Crosswalk & Multi-Lingual Schema Generated!");
      }
    } catch {
      setActionMsg("Failed to run standards crosswalk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCrosswalk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const applyPreset = (preset: {
    title: string;
    mat: string;
    p: number;
    t: number;
    c: number;
    tq: number;
  }) => {
    setTitle(preset.title);
    setMaterial(preset.mat);
    setPressurePsi(preset.p);
    setTemperatureF(preset.t);
    setClearanceIn(preset.c);
    setTorqueFtLb(preset.tq);
  };

  const activeSlice = slices.find((s) => s.locale === selectedLocale) || slices[0];

  return (
    <div className="space-y-6 font-humanist">
      {/* Header Banner */}
      <div className="card-premium p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                NIST SP 811 / ISO 80000-1 CROSSWALK
              </span>
              <span className="text-xs text-slate-500 font-mono">DIN EN &bull; JIS G &bull; ANSI/ASTM</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Global Engineering Standards &amp; Unit Crosswalk Engine
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-3xl leading-relaxed">
              Industrial machinery exports globally. Auto-localize US engineering specifications (AISI 4140, 3,000 PSI, 180°F) into German DIN EN 10083-3 (42CrMo4, 206 bar, 82°C) and Japanese JIS G4053 (SCM440) with automated multi-lingual Schema.org (<code className="px-1 bg-slate-100 rounded text-slate-800">inLanguage: &quot;de&quot; / &quot;ja&quot;</code>) and bidirectional hreflang tags.
            </p>
          </div>
          <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0 self-start sm:self-auto">
            Zero Rounding Drift
          </span>
        </div>

        {/* 1-Click Interactive Parameter Bar */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase">
              1-Click US Imperial Input Parameters
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Presets:</span>
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    title: "High-Pressure Hydraulic Spindle Assembly & Valve Manifold",
                    mat: "AISI 4140",
                    p: 3000,
                    t: 180,
                    c: 0.0005,
                    tq: 65,
                  })
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 transition cursor-pointer"
              >
                Hydraulic 4140 (3,000 PSI)
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    title: "Sanitary Rotary Lobe CIP Washdown Pump Head",
                    mat: "AISI 316L",
                    p: 350,
                    t: 195,
                    c: 0.0012,
                    tq: 85,
                  })
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 transition cursor-pointer"
              >
                Sanitary 316L CIP (350 PSI)
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    title: "RTU Scroll Compressor Flank & Sump Thermal Limits",
                    mat: "ASTM A536",
                    p: 450,
                    t: 140,
                    c: 0.0015,
                    tq: 45,
                  })
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 transition cursor-pointer"
              >
                Ductile Iron RTU (ASTM A536)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                Material Grade
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="input-premium w-full text-xs py-1.5"
              >
                <option value="AISI 4140">AISI 4140 (Chrome-Moly)</option>
                <option value="AISI 316L">AISI 316L (Sanitary SS)</option>
                <option value="ASTM A536">ASTM A536 (Ductile Iron)</option>
                <option value="AISI 1045">AISI 1045 (Medium Carbon)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                Pressure (PSI)
              </label>
              <input
                type="number"
                value={pressurePsi}
                onChange={(e) => setPressurePsi(Number(e.target.value))}
                className="input-premium w-full text-xs py-1.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                Temperature (°F)
              </label>
              <input
                type="number"
                value={temperatureF}
                onChange={(e) => setTemperatureF(Number(e.target.value))}
                className="input-premium w-full text-xs py-1.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                Clearance (in.)
              </label>
              <input
                type="number"
                step="0.0001"
                value={clearanceIn}
                onChange={(e) => setClearanceIn(Number(e.target.value))}
                className="input-premium w-full text-xs py-1.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                Torque (ft-lb)
              </label>
              <input
                type="number"
                value={torqueFtLb}
                onChange={(e) => setTorqueFtLb(Number(e.target.value))}
                className="input-premium w-full text-xs py-1.5 font-mono"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => void fetchCrosswalk()}
                disabled={loading}
                className="btn-primary-premium w-full py-2 text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="css-icon-bolt"></span>
                    <span>1-Click Crosswalk</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <span className="css-icon-check text-emerald-600"></span>
              <span>{actionMsg}</span>
            </span>
            <button
              type="button"
              onClick={() => setActionMsg("")}
              className="text-emerald-700 hover:text-emerald-950 text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Target Market Navigator */}
      <div className="card-premium p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          {/* Market Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/90 shadow-2xs">
            {[
              { id: "de-DE", label: "Germany & DACH", code: "DIN EN (42CrMo4)" },
              { id: "ja-JP", label: "Japan & APAC", code: "JIS G (SCM440)" },
              { id: "en-US", label: "United States", code: "ANSI/ASTM (AISI 4140)" },
            ].map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelectedLocale(loc.id as "en-US" | "de-DE" | "ja-JP")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedLocale === loc.id
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{loc.label}</span>
                <span className="text-[10px] font-mono text-slate-400">({loc.code.split(" ")[0]})</span>
              </button>
            ))}
          </div>

          {/* Sub-view switcher: Tolerances vs Schema vs Hreflang */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveView("tolerances")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeView === "tolerances"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Physical Tolerances
            </button>
            <button
              type="button"
              onClick={() => setActiveView("schema")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeView === "schema"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Multi-Lingual Schema.org
            </button>
            <button
              type="button"
              onClick={() => setActiveView("hreflang")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeView === "hreflang"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Hreflang Tags
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-slate-500">Crosswalking units via NIST SP 811 &amp; ISO 80000-1...</p>
          </div>
        ) : activeSlice ? (
          <div className="space-y-6">
            {/* Market Headline Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-slate-500 uppercase">{activeSlice.marketName}</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeSlice.regulatoryBody}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{activeSlice.translatedHeadline}</h3>
              <p className="text-xs text-slate-600 font-mono">
                Governing Standard: <strong className="text-sky-800">{activeSlice.targetStandard}</strong>
              </p>
              <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-200/60">
                {activeSlice.complianceStatement}
              </p>
            </div>

            {/* TAB VIEW 1: PHYSICAL TOLERANCES & METALLURGY */}
            {activeView === "tolerances" && (
              <div className="space-y-4 animate-fade-in">
                {/* 4-Box Unit Crosswalk Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      Operating Pressure
                    </span>
                    <p className="text-base font-extrabold text-slate-900 font-mono">{activeSlice.units.pressure}</p>
                    <p className="text-[11px] text-slate-500">
                      Converted from {pressurePsi} PSI ({activeSlice.locale === "en-US" ? "Imperial" : "Metric SI"})
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      Operating Temperature
                    </span>
                    <p className="text-base font-extrabold text-slate-900 font-mono">{activeSlice.units.temperature}</p>
                    <p className="text-[11px] text-slate-500">
                      Thermal limits ({activeSlice.locale === "en-US" ? `${temperatureF}°F` : `${Math.round(((temperatureF - 32) * 5) / 9)}°C`})
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      Radial Tolerance / Spiel
                    </span>
                    <p className="text-base font-extrabold text-slate-900 font-mono">{activeSlice.units.clearance}</p>
                    <p className="text-[11px] text-slate-500">GD&amp;T nominal assembly clearance</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      Bolt Tightening Torque
                    </span>
                    <p className="text-base font-extrabold text-slate-900 font-mono">{activeSlice.units.torque}</p>
                    <p className="text-[11px] text-slate-500">Calibrated assembly torque ±1.5%</p>
                  </div>
                </div>

                {/* Metallurgy Equivalents Table */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Certified Metallurgy Equivalent: {activeSlice.metallurgy.grade}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        Governed by: {activeSlice.metallurgy.equivalentStandard} &bull; Tensile: {activeSlice.metallurgy.tensileStrength}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${activeSlice.metallurgy.grade} (${activeSlice.metallurgy.equivalentStandard})`, "metal")}
                      className="text-xs font-mono font-bold text-sky-700 hover:text-sky-900 cursor-pointer flex items-center gap-1"
                    >
                      <span className="css-icon-check"></span>
                      <span>{copiedKey === "metal" ? "Copied!" : "Copy Spec"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    {activeSlice.metallurgy.compositionSummary}
                  </p>
                </div>
              </div>
            )}

            {/* TAB VIEW 2: MULTI-LINGUAL SCHEMA.ORG JSON-LD */}
            {activeView === "schema" && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-bold">
                    Schema.org TechArticle &bull; inLanguage: &quot;{activeSlice.locale}&quot;
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(activeSlice.schemaJsonLd, null, 2), "schema")}
                    className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1"
                  >
                    <span className="css-icon-check"></span>
                    <span>{copiedKey === "schema" ? "Copied Schema!" : "Copy JSON-LD"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
                  {JSON.stringify(activeSlice.schemaJsonLd, null, 2)}
                </pre>
              </div>
            )}

            {/* TAB VIEW 3: HREFLANG ALTERNATE TAGS */}
            {activeView === "hreflang" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-bold">Bidirectional Hreflang Canonical Injection Block</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        slices.map((s) => s.hreflangTag).join("\n") +
                          '\n<link rel="alternate" hreflang="x-default" href="https://industrial-oem.com/en-us/spec" />',
                        "hreflang"
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1"
                  >
                    <span className="css-icon-check"></span>
                    <span>{copiedKey === "hreflang" ? "Copied Hreflang!" : "Copy Hreflang Cluster"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs space-y-2 leading-relaxed">
                  {slices.map((s, idx) => (
                    <div key={idx} className="truncate">
                      {s.hreflangTag}
                    </div>
                  ))}
                  <div className="text-slate-400">
                    &lt;link rel=&quot;alternate&quot; hreflang=&quot;x-default&quot; href=&quot;https://industrial-oem.com/en-us/{title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}&quot; /&gt;
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Inject this cluster in your CMS <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">&lt;head&gt;</code> tag to guarantee Google and Baidu/Yahoo Japan direct traffic to localized regional engineering versions without duplicate content penalties.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
