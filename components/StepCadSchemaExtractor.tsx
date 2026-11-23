"use client";

import { useState } from "react";
import type { CadParsedEntity } from "@/lib/cadStepParser";

const sampleStepCode = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ForgeFlow Industrial CAD Model'),'2;1');
FILE_NAME('AccuDrive-SV5000-Stamping-Die.step','2026-03-01T12:00:00',('Alex Vance'),('AccuDrive Corp'),'Open CASCADE STEP processor 7.6','AutoCAD','');
FILE_SCHEMA(('AP214_AUTOMOTIVE_DESIGN'));
ENDSEC;
DATA;
#10=PRODUCT('AccuDrive SV-5000 Progressive Stamping Die Assembly','PART_SV5000_REV2','',(#11));
#11=PRODUCT_CONTEXT('',#12,'mechanical');
#12=APPLICATION_CONTEXT('automotive mechanical design');
#20=MATERIAL_DESIGNATION('AISI 4140 High-Tensile Chrome-Moly Alloy Steel',(#21));
#30=SURFACE_TOLERANCE('PVD TiAlN Hard Coating 60 HRC',0.002);
ENDSEC;
END-ISO-10303-21;`;

export function StepCadSchemaExtractor() {
  const [stepInput, setStepInput] = useState(sampleStepCode);
  const [partNameInput, setPartNameInput] = useState("AccuDrive SV-5000 Progressive Die Assembly");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CadParsedEntity | null>(null);
  const [actionMsg, setActionMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"Tolerances" | "SchemaJSON">("Tolerances");

  const handleParse = async () => {
    setLoading(true);
    setActionMsg("");
    try {
      const res = await fetch("/api/tools/parse-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepContent: stepInput, partName: partNameInput }),
      });
      const data = await res.json();
      if (res.ok && data.parsed) {
        setResult(data.parsed);
        setActionMsg("3D CAD definitions parsed into deterministic Schema.org graph.");
      } else {
        setActionMsg(data.error || "Failed to parse STEP file.");
      }
    } catch {
      setActionMsg("Network error parsing CAD structure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                ISO 10303-21 &bull; AP214 / AP242
              </span>
              <span className="text-[11px] text-slate-500 font-mono">3D CAD to Schema Pipeline</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              STEP / CAD Metadata to AEO Schema Extractor
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Bypass generic text prompts. Ingest native 3D CAD STEP files directly to extract GD&amp;T concentricity, metallurgy ratings, and punch-to-die tolerances into Schema.org ProductSpecification graphs.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
            3D CAD File Ingestion (STEP / STP)
          </h3>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Component / Asset Name
            </label>
            <input
              value={partNameInput}
              onChange={(e) => setPartNameInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Raw STEP ASCII Content (ISO 10303-21 Exchange Structure)
            </label>
            <textarea
              rows={12}
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-950 text-slate-200 p-3.5 text-xs font-mono outline-none focus:border-sky-600 leading-relaxed"
            />
          </div>

          <button
            onClick={handleParse}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                <span>Parsing 3D CAD Geometries…</span>
              </>
            ) : (
              <>
                <span className="css-icon-bolt"></span>
                <span>Extract Tolerances &amp; Generate Schema</span>
              </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
                Extracted Engineering Specification
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("Tolerances")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "Tolerances" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Tolerances
                </button>
                <button
                  onClick={() => setActiveTab("SchemaJSON")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "SchemaJSON" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Schema JSON-LD
                </button>
              </div>
            </div>

            {result ? (
              activeTab === "Tolerances" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">CAD Standard</span>
                      <strong className="text-slate-900 font-mono">{result.cadStandard}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Assigned Part Number</span>
                      <strong className="text-sky-800 font-mono">{result.partNumber}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase font-bold text-sky-800 block">Metallurgy &amp; Heat Treatment</span>
                    <strong className="text-slate-900 block">{result.materialGrade}</strong>
                    <p className="text-[11px] text-slate-600">{result.hardnessRating}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      GD&amp;T Operational Tolerance Envelopes
                    </span>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                      {result.operatingTolerances.map((tol) => (
                        <div key={tol.parameter} className="p-2.5 bg-white flex items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">{tol.parameter}</p>
                            <span className="text-[10px] font-mono text-slate-500">{tol.isoStandard}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-slate-900 block">{tol.nominal}</span>
                            <span className="text-[10px] font-mono text-slate-400">{tol.toleranceRange}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-[380px] leading-relaxed">
                  {JSON.stringify(result.schemaGraph, null, 2)}
                </pre>
              )
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                Click &quot;Extract Tolerances &amp; Generate Schema&quot; to parse CAD definitions.
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(result.schemaGraph, null, 2));
                setActionMsg("Schema.org ProductSpecification graph copied to clipboard.");
              }}
              className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Copy Schema.org JSON-LD to Clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
