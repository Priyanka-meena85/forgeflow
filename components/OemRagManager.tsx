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

      onActionMessage(`✔ Successfully ingested '${title}' with ${data.document?.extractedNodesCount || 0} extracted engineering tolerances.`);
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
          <span>+ Ingest Spec Document</span>
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
                <span className="text-xl">📄</span>
                <h3 className="text-base font-bold text-slate-900">Ingest OEM Spec Sheet into RAG</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
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
                <label className="block text-xs font-bold text-slate-700 mb-1">OEM Tolerances &amp; Technical Text</label>
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
                  {isIngesting ? "Extracting Specs…" : "⚡ Ingest into RAG Engine"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
