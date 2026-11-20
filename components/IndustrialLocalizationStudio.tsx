"use client";

import { useEffect, useState } from "react";

interface LocalizedSlice {
  locale: "de-DE" | "ja-JP" | "en-US";
  marketName: string;
  targetStandard: string;
  translatedHeadline: string;
  localizedUnits: {
    pressure: string;
    temperature: string;
    clearance: string;
    metallurgy: string;
  };
  regulatoryBody: string;
  hreflangTag: string;
}

export function IndustrialLocalizationStudio() {
  const [slices, setSlices] = useState<LocalizedSlice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocale, setSelectedLocale] = useState<"en-US" | "de-DE" | "ja-JP">("de-DE");
  const [actionMsg, setActionMsg] = useState("");

  const fetchSlices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/localize-standard");
      const data = await res.json();
      if (res.ok && data.slices) {
        setSlices(data.slices);
      }
    } catch {
      setActionMsg("Failed to load localization crosswalk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlices();
  }, []);

  const activeSlice = slices.find((s) => s.locale === selectedLocale) || slices[0];

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                MULTI-REGION STANDARDS CROSSWALK
              </span>
              <span className="text-[11px] text-slate-500 font-mono">DIN &bull; JIS &bull; ANSI &bull; ISO</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Industrial Engineering Multi-Language Localization
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Standard Google Translate fails on engineering terms. ForgeFlow crosswalks metallurgy grades (AISI 4140 &rarr; 42CrMo4 &rarr; SCM440), pressure scales (PSI &rarr; Bar &rarr; MPa), and regulatory compliance bodies with bidirectional hreflang tags.
            </p>
          </div>
        </div>

        {actionMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg("")} className="text-emerald-700 hover:text-emerald-950 text-xs font-bold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Locale Switcher & Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex gap-2">
            {[
              { id: "de-DE", label: "Germany (DIN EN ISO / 42CrMo4)", region: "DACH" },
              { id: "ja-JP", label: "Japan (JIS B / SCM440)", region: "APAC" },
              { id: "en-US", label: "United States (ANSI / AISI 4140)", region: "North America" },
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocale(loc.id as "en-US" | "de-DE" | "ja-JP")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  selectedLocale === loc.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{loc.label}</span>
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            Crosswalk Verified by NIST SP 811
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <span className="inline-block w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : activeSlice ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                Target Market Headline ({activeSlice.marketName})
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">{activeSlice.translatedHeadline}</h3>
              <p className="text-xs font-mono text-sky-800 pt-1">
                Mandatory Standard: {activeSlice.targetStandard} &bull; Regulated by: {activeSlice.regulatoryBody}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Pressure Tolerance</span>
                <p className="text-sm font-black text-slate-900 font-mono">{activeSlice.localizedUnits.pressure}</p>
                <p className="text-[10px] text-slate-500 font-mono">Calibrated to local sensor SOP</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Operating Temperature</span>
                <p className="text-sm font-black text-slate-900 font-mono">{activeSlice.localizedUnits.temperature}</p>
                <p className="text-[10px] text-slate-500 font-mono">Thermal drift threshold</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Punch Clearance</span>
                <p className="text-sm font-black text-slate-900 font-mono">{activeSlice.localizedUnits.clearance}</p>
                <p className="text-[10px] text-slate-500 font-mono">GD&amp;T tolerance envelope</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Metallurgy Specification</span>
                <p className="text-sm font-black text-sky-900 font-mono">{activeSlice.localizedUnits.metallurgy}</p>
                <p className="text-[10px] text-slate-500 font-mono">Equivalent DIN/JIS alloy grade</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                <span>Deterministic Hreflang Canonical Injection</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeSlice.hreflangTag);
                    setActionMsg("Hreflang tag copied to clipboard.");
                  }}
                  className="text-sky-400 hover:underline cursor-pointer"
                >
                  Copy Tag
                </button>
              </div>
              <pre className="overflow-x-auto text-emerald-400">{activeSlice.hreflangTag}</pre>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
