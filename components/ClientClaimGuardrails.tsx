"use client";

import { useState } from "react";
import { validateDraftAgainstGuardrails, DEFAULT_GUARDRAIL_RULES, type GuardrailViolation } from "@/lib/claimGuardrailsEngine";

export function ClientClaimGuardrails() {
  const [sampleText, setSampleText] = useState(
    "Our new servo hydraulic cylinder is 100% leak-proof and outperforms Parker Hannifin while being manufactured in an AS9100 certified aerospace cleanroom."
  );
  const [result, setResult] = useState(() => validateDraftAgainstGuardrails(sampleText));

  function handleCheck() {
    setResult(validateDraftAgainstGuardrails(sampleText));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono bg-red-950 text-red-400 border border-red-800 rounded">
              COMPLIANCE &amp; LEGAL GUARDRAILS
            </span>
            <span className="text-xs text-zinc-400 font-mono">Negative Claims • Competitor Blocklist • Liability Shield</span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white">
            Client Claim Guardrails &amp; Pre-Publish Interceptor
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Prevents dangerous absolute statements, unverified certifications, or competitor trademark infringements.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase text-zinc-400">
          Draft Text To Inspect Against Brand Rules:
        </label>
        <textarea
          rows={3}
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 font-mono focus:outline-none focus:border-red-500"
        />
        <div className="flex justify-end">
          <button
            onClick={handleCheck}
            className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded transition"
          >
            Validate Against Guardrails
          </button>
        </div>
      </div>

      {/* Result Status Banner */}
      <div
        className={`p-4 rounded-lg border text-xs flex items-center justify-between ${
          result.isPublishable
            ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
            : "bg-red-950/40 border-red-800 text-red-300"
        }`}
      >
        <div>
          <strong className="block text-sm font-bold">
            {result.isPublishable ? "✓ APPROVED FOR PUBLISHING" : "⛔ PUBLISHING BLOCKED BY LEGAL GUARDRAIL"}
          </strong>
          {result.isPublishable
            ? "No critical engineering or trademark violations detected."
            : `${result.violations.length} liability rule violation(s) must be remediated before deployment.`}
        </div>
        <span className="font-mono text-xs uppercase px-2 py-1 rounded bg-black/40">
          {DEFAULT_GUARDRAIL_RULES.length} Active Guardrails
        </span>
      </div>

      {/* Violations List */}
      <div className="space-y-3">
        {result.violations.map((v, i) => (
          <div key={i} className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-800 rounded">
                {v.category}
              </span>
              <span className="text-xs font-mono text-red-400 font-bold">
                TRIGGERED: &quot;{v.matchedText}&quot;
              </span>
            </div>
            <p className="text-xs text-zinc-300">{v.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
