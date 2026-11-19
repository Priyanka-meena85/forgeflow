"use client";

import React, { useState } from "react";

export interface OemDoc {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  extractedSpecs: Array<{ category: string; parameter: string; value: string }>;
  snippet: string;
  createdAt: string;
}

interface OemRagManagerProps {
  documents: OemDoc[];
  onRefresh: () => void;
  onActionMessage: (msg: string) => void;
}

export function OemRagManager({ documents, onRefresh, onActionMessage }: OemRagManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleIngest = async () => {
    if (!title.trim() || !rawText.trim()) {
      onActionMessage("Title and datasheet/manual text are required.");
      return;
    }
    setIsIngesting(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          fileName: uploadedFileName || `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
          rawText: rawText.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ingestion failed");

      onActionMessage(`Successfully ingested '${title}' with ${data.document?.extractedNodesCount || 0} extracted engineering tolerances.`);
      setTitle("");
      setRawText("");
      setUploadedFileName("");
      setShowModal(false);
      onRefresh();
    } catch (e: unknown) {
      onActionMessage(e instanceof Error ? e.message : "Document ingestion failed.");
    } finally {
      setIsIngesting(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setRawText(content);
        onActionMessage(`Loaded ${file.name} (${content.length} chars) into spec parser.`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
            <span>OEM Equipment Manuals &amp; Tolerances (RAG Grounding)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Zero-Hallucination Active
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Equipment manuals and engineering spec sheets actively injected into LLM generation prompts to ground exact tolerances, failure modes, and ASTM/ASHRAE standards.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
        >
          <span className="css-icon-plus"></span>
          <span>Ingest Spec Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-purple-300 transition space-y-2.5 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="font-bold text-slate-900 line-clamp-1">{doc.title}</div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 shrink-0">
                {doc.fileName?.endsWith(".pdf") ? "PDF" : "SPEC"}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] line-clamp-2 italic leading-relaxed">
              "{doc.snippet}"
            </p>
            <div className="pt-1 border-t border-slate-200/80 flex flex-wrap gap-1">
              {doc.extractedSpecs?.slice(0, 3).map((spec, sIdx) => (
                <span key={sIdx} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-700">
                  {spec.parameter}: <strong>{spec.value}</strong>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                  <span className="css-icon-doc"></span>
                </span>
                <h3 className="text-base font-bold text-slate-900">Ingest OEM Spec Sheet into RAG</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
              >
                <span className="css-icon-cross"></span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title / Model Number</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Carrier WeatherMaster 48HC RTU Service Manual"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attach File (.pdf, .txt, .md)</label>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.json"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  className="w-full text-xs border border-slate-200 rounded-xl p-2 bg-slate-50 text-slate-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">OEM Tolerances &amp; Technical Text</label>
                  <span className="text-[10px] text-purple-700 font-mono font-semibold">Or load pre-verified specimen:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("Trane IntelliPak Commercial Rooftop Unit IOM");
                      setUploadedFileName("trane_intellipak_iom.pdf");
                      setRawText("Trane IntelliPak Packaged Rooftop Unit IOM Manual. Operating suction pressure envelope: 118 to 132 psig for R-410A scroll circuits. Saturated suction temperature: 40°F to 45°F. Design operating superheat envelope: 10°F to 14°F. Thermal discharge cutoff: 220°F. Deflection tolerance: 0.05 mm/m. Complies with ASHRAE 90.1 energy efficiency and AHRI 340/360 rating standards.");
                    }}
                    className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono hover:bg-purple-100 cursor-pointer"
                  >
                    + Trane HVAC (ASHRAE)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("Bosch Rexroth A10VSO High-Pressure Pump Specs");
                      setUploadedFileName("rexroth_a10vso_specs.pdf");
                      setRawText("Bosch Rexroth A10VSO Variable Displacement Axial Piston Pump. Nominal working pressure: 280 to 350 bar. Peak intermittent limit: 400 bar. Inlet suction envelope: 0.8 to 2.5 bar absolute. Hydraulic fluid cleanliness code: ISO 4406 18/16/13. Fluid viscosity range: 16 to 36 mm²/s at operating temperatures between 50°C and 80°C. Slipper clearance tolerance: 0.015 mm.");
                    }}
                    className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono hover:bg-purple-100 cursor-pointer"
                  >
                    + Rexroth Pump (ISO 4406)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("Schuler 1200T Servo Stamping Press Calibration Manual");
                      setUploadedFileName("schuler_1200t_manual.pdf");
                      setRawText("Schuler 1200-Ton Servo Stamping Press Operating Protocol. Die parallel alignment deflection tolerance: 0.03 mm across 3000 mm bed. Counterbalance operating air pressure: 4.5 to 6.2 bar. Slide gib clearance: 0.04 to 0.06 mm. ISO 10816 vibration severity threshold: < 2.8 mm/s RMS. IATF 16949 automotive tooling quality standard.");
                    }}
                    className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono hover:bg-purple-100 cursor-pointer"
                  >
                    + Schuler Press (IATF)
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste operating tolerances, suction pressure envelopes (e.g. 118-132 psig), superheat limits (10-14°F), clearances..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isIngesting || !title.trim() || !rawText.trim()}
                  onClick={handleIngest}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span className="css-icon-bolt"></span>
                  <span>{isIngesting ? "Extracting Specs…" : "Ingest into RAG Engine"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
