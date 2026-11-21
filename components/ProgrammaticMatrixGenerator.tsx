"use client";

import { useState } from "react";
import { generateProgrammaticMatrix, DEFAULT_MATRIX_DIMENSIONS, type GeneratedMatrixPage } from "@/lib/programmaticMatrixEngine";

export function ProgrammaticMatrixGenerator() {
  const [matrixPages, setMatrixPages] = useState<GeneratedMatrixPage[]>(() => generateProgrammaticMatrix());
  const [selectedPersona, setSelectedPersona] = useState<string>("ALL");
  const [batchGeneratedCount, setBatchGeneratedCount] = useState(0);

  const filteredPages = selectedPersona === "ALL"
    ? matrixPages
    : matrixPages.filter((p) => p.targetPersona.includes(selectedPersona));

  function handleBatchDeploy() {
    setBatchGeneratedCount(filteredPages.length);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
              PROGRAMMATIC MATRIX GENERATOR
            </span>
            <span className="text-xs text-zinc-400 font-mono">Equipment × Industry × Problem</span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white">
            Long-Tail Industrial Programmatic Grid Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Generates high-intent long-tail landing pages with dedicated buyer persona mappings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {batchGeneratedCount > 0 && (
            <span className="text-xs text-emerald-400 font-mono">
              ✓ {batchGeneratedCount} programmatic pages synthesized!
            </span>
          )}
          <button
            onClick={handleBatchDeploy}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition shadow-xs"
          >
            Deploy Full Batch ({filteredPages.length} Pages)
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
          <span className="text-xs text-zinc-400 uppercase font-mono">Equipment Types</span>
          <div className="text-2xl font-bold text-white mt-1">{DEFAULT_MATRIX_DIMENSIONS.equipments.length}</div>
        </div>
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
          <span className="text-xs text-zinc-400 uppercase font-mono">Industry Sectors</span>
          <div className="text-2xl font-bold text-white mt-1">{DEFAULT_MATRIX_DIMENSIONS.industries.length}</div>
        </div>
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
          <span className="text-xs text-zinc-400 uppercase font-mono">Failure Modes / Problems</span>
          <div className="text-2xl font-bold text-white mt-1">{DEFAULT_MATRIX_DIMENSIONS.problems.length}</div>
        </div>
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
          <span className="text-xs text-zinc-400 uppercase font-mono">Total Matrix Output</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{matrixPages.length} Pages</div>
        </div>
      </div>

      {/* Persona Filter Bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400 font-mono">Buyer Persona Filter:</span>
        {["ALL", "Plant Manager", "Maintenance Engineer", "Procurement Officer"].map((persona) => (
          <button
            key={persona}
            onClick={() => setSelectedPersona(persona)}
            className={`px-3 py-1 rounded text-xs font-mono transition ${
              selectedPersona === persona
                ? "bg-indigo-600 text-white font-bold"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            {persona}
          </button>
        ))}
      </div>

      {/* Pages Table */}
      <div className="overflow-x-auto border border-zinc-800 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900 text-zinc-400 font-mono uppercase border-b border-zinc-800">
            <tr>
              <th className="py-2.5 px-4">Programmatic Page Title</th>
              <th className="py-2.5 px-4">Industry Application</th>
              <th className="py-2.5 px-4">Target Buyer Persona</th>
              <th className="py-2.5 px-4">Est. Search Volume</th>
              <th className="py-2.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/40">
            {filteredPages.slice(0, 8).map((page) => (
              <tr key={page.slug} className="hover:bg-zinc-900/40 transition">
                <td className="py-3 px-4">
                  <div className="font-semibold text-white">{page.h1Title}</div>
                  <div className="font-mono text-zinc-400 text-[11px]">{page.slug}</div>
                </td>
                <td className="py-3 px-4 text-zinc-300">{page.industry}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {page.targetPersona}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-zinc-400">{page.estimatedMonthlySearchVolume}/mo</td>
                <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">SYNTHESIZED</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
