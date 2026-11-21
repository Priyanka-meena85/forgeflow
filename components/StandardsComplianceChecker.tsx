"use client";

import { useState } from "react";
import { auditTechnicalClaims, type StandardVerificationClaim } from "@/lib/standardsComplianceChecker";

export function StandardsComplianceChecker() {
  const [contentInput, setContentInput] = useState(
    "Our hydraulic subplate valve assemblies feature circular runout tolerances within 0.005mm (MMC), fully compliant with ISO 4401 dimensions and IS 2062 steel base plates with IP67 sealed sensors."
  );
  const [claims, setClaims] = useState<StandardVerificationClaim[]>(() => auditTechnicalClaims(contentInput));

  function handleAudit() {
    setClaims(auditTechnicalClaims(contentInput));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono bg-purple-950 text-purple-400 border border-purple-800 rounded">
              STANDARDS &amp; COMPLIANCE FACT-CHECKER
            </span>
            <span className="text-xs text-zinc-400 font-mono">ASME • ISO • OSHA • IEC • BIS IS</span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white">
            Engineering Claim Verification &amp; Standards Citation Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Validates engineering assertions against official governing codes. Generates citable source clauses for LLM zero-hallucination trust.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase text-zinc-400">
          Technical Draft / Specification Text to Verify:
        </label>
        <textarea
          rows={3}
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAudit}
            className="px-4 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded transition"
          >
            Run Standards Audit
          </button>
        </div>
      </div>

      {/* Verified Claims Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Verified Standards Citations ({claims.length})
        </h3>
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-2 hover:border-purple-800/60 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 rounded">
                  {claim.detectedStandard}
                </span>
                <span className="text-xs font-mono text-zinc-300 font-bold">{claim.governingCode}</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                ✓ VERIFIED ACCURATE
              </span>
            </div>

            <p className="text-xs text-zinc-200 font-medium">
              &quot;{claim.claimText}&quot;
            </p>

            <div className="p-2.5 bg-zinc-950/60 rounded border border-zinc-800/60 text-xs text-zinc-400 font-mono">
              <strong className="text-zinc-300">Official Citation: </strong>
              {claim.citationText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
