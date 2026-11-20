"use client";

import { useState } from "react";

interface CadComponentPart {
  id: string;
  name: string;
  partNumber: string;
  material: string;
  wearLimit: string;
  failureMode: string;
  inspectionStandard: string;
  status: "NORMAL" | "WARNING" | "CRITICAL";
}

const equipmentAssemblyParts: CadComponentPart[] = [
  {
    id: "part_1",
    name: "Scroll Compressor Fixed & Orbiting Flanks",
    partNumber: "RTU-SCR-4029-HC",
    material: "High-Silicon Ductile Iron (ASTM A536)",
    wearLimit: "Tip seal gap < 0.0015 in. (0.038 mm)",
    failureMode: "Liquid refrigerant floodback washing POE lubricant film",
    inspectionStandard: "ASHRAE Standard 90.1 / ISO 9001:2015",
    status: "WARNING",
  },
  {
    id: "part_2",
    name: "Dual Cartridge Mechanical Face Seal",
    partNumber: "SEAL-SIC-9102-CIP",
    material: "Silicon Carbide (SiC) vs Tungsten Carbide",
    wearLimit: "Face flatness < 2 helium light bands (0.000023 in.)",
    failureMode: "Caustic 2% CIP washdown swelling of secondary EPDM O-ring",
    inspectionStandard: "3-A Sanitary Standard 02-12 / FDA 21 CFR 177.2600",
    status: "CRITICAL",
  },
  {
    id: "part_3",
    name: "High-Pressure Hydraulic Slipper Retainer Plate",
    partNumber: "HYD-SLP-7200-PRO",
    material: "Forged Bronze CDA 932 / Case-Hardened Alloy Steel",
    wearLimit: "Slipper-to-swashplate play < 0.0008 in. (0.020 mm)",
    failureMode: "Cavitation erosion delaminating bronze face at 3,000 PSI",
    inspectionStandard: "ISO 4406 Cleanliness Class 17/15/12",
    status: "NORMAL",
  },
  {
    id: "part_4",
    name: "Extruder Bi-Metallic Barrel Liner",
    partNumber: "EXT-BRL-5500-BM",
    material: "Centrifugally Cast Tungsten-Cobalt Matrix",
    wearLimit: "Internal diameter ovality < 0.003 in. (0.076 mm)",
    failureMode: "High-shear polymer compounding barrel wall scuffing",
    inspectionStandard: "ASTM D1238 Melt Flow Protocol",
    status: "NORMAL",
  },
];

export function CadExplodedViewStudio() {
  const [selectedPart, setSelectedPart] = useState<CadComponentPart>(equipmentAssemblyParts[0]);
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false);

  const embedSnippet = `<div data-forgeflow-cad-widget="true" data-assembly-id="${selectedPart.id}" data-spec="${selectedPart.inspectionStandard}">
  <div class="ff-cad-diagnostic-container">
    <h3>${selectedPart.name} - Reliability Inspection Limits</h3>
    <p>Wear Limit: ${selectedPart.wearLimit} | Material: ${selectedPart.material}</p>
    <p>Failure Protocol: ${selectedPart.failureMode} (${selectedPart.inspectionStandard})</p>
  </div>
</div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setEmbedCodeCopied(true);
    setTimeout(() => setEmbedCodeCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="css-icon-box text-sky-600"></span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Interactive 3D CAD Component Inspector Studio
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Embed interactive 3D component exploded inspection checkpoints inside your technical landing pages. Answer engines prioritize pages with interactive structural diagnostic widgets above static text.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            WebGL / Schema.org Ready
          </span>
        </div>
      </div>

      {/* Interactive Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Component Schematic Canvas */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-slate-300">
                Assembly Diagnostic Canvas &bull; 4 Critical Inspection Nodes
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Click node to inspect</span>
          </div>

          {/* Interactive Inspection Nodes Grid */}
          <div className="grid grid-cols-2 gap-3 py-4">
            {equipmentAssemblyParts.map((p) => {
              const isSelected = selectedPart.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPart(p)}
                  className={`p-4 rounded-xl text-left border transition cursor-pointer ${
                    isSelected
                      ? "bg-sky-950/80 border-sky-400 ring-2 ring-sky-400/20 shadow-md"
                      : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold">
                      {p.partNumber}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        p.status === "CRITICAL"
                          ? "bg-rose-900/60 text-rose-300 border border-rose-700"
                          : p.status === "WARNING"
                          ? "bg-amber-900/60 text-amber-300 border border-amber-700"
                          : "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">{p.name}</h4>
                  <span className="text-[10px] font-mono text-sky-400 block mt-2">
                    Wear Limit: {p.wearLimit}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 font-mono text-[11px] flex items-center justify-between">
            <span>Viewport: High-Fidelity Parametric Vector Canvas</span>
            <span className="text-sky-300">ISO 9001 / 3-A Inspected</span>
          </div>
        </div>

        {/* Right Column: Selected Component Diagnostic Inspector */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono uppercase font-bold text-sky-700 block">
                Selected Component Inspection Spec
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedPart.name}</h3>
              <p className="text-xs font-mono text-slate-500 mt-0.5">Part No: {selectedPart.partNumber}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Alloy / Material Spec:</span>
                <strong className="text-slate-900 font-semibold">{selectedPart.material}</strong>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Allowable Clearance &amp; Wear Limit:</span>
                <strong className="text-rose-700 font-mono font-bold">{selectedPart.wearLimit}</strong>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Critical Failure Mode:</span>
                <span className="text-slate-700">{selectedPart.failureMode}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Inspection &amp; QA Standard:</span>
                <strong className="text-sky-800 font-mono font-bold">{selectedPart.inspectionStandard}</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={copyEmbed}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="css-icon-check"></span>
              <span>{embedCodeCopied ? "Embed Code Copied to Clipboard!" : "Copy Interactive Article Embed Widget"}</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400 block text-center">
              Embeds interactive diagnostic schema for Google SGE &amp; Perplexity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
