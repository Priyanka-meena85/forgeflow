"use client";

import { useState, useCallback } from "react";
import {
  auditDraftAgainstBrandVoice,
  type BrandVoiceProfile,
  type BrandVoiceViolation,
} from "@/lib/brandVoiceEngine";

const DEFAULT_PROFILE: BrandVoiceProfile = {
  id: "bvp_default",
  orgId: "org_demo",
  name: "AccuDrive Industrial — Default Voice",
  toneAdjectives: ["authoritative", "precise", "data-driven", "concise"],
  forbiddenWords: ["cheap", "simple", "easy", "just", "obviously", "simply"],
  preferredTerms: {
    pump: "rotary lobe pump",
    machine: "CNC machining centre",
    iso: "ISO 9001:2015",
  },
  personaInstructions:
    "Write as a senior mechanical engineer. Never use marketing superlatives. Always cite the relevant IS / ISO / ASME standard.",
  uploadedDocNames: ["AccuDrive_ProductSpec_2024.pdf"],
  vectorChunks: [
    "AccuDrive rotary lobe pumps comply with 3-A Sanitary Standard 02-12 and are CIP-validated.",
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function BrandVoiceKnowledgeBase() {
  const [profile, setProfile] = useState<BrandVoiceProfile>(DEFAULT_PROFILE);
  const [auditText, setAuditText] = useState(
    "This simple and cheap pump solution is easy to install. Just follow the iso guidelines."
  );
  const [violations, setViolations] = useState<BrandVoiceViolation[]>([]);
  const [audited, setAudited] = useState(false);
  const [newForbidden, setNewForbidden] = useState("");
  const [newFromTerm, setNewFromTerm] = useState("");
  const [newToTerm, setNewToTerm] = useState("");
  const [newTone, setNewTone] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "AccuDrive_ProductSpec_2024.pdf",
    "ISO9001_CertificateScan.pdf",
  ]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [activeSection, setActiveSection] = useState<"rules" | "audit" | "kb">("rules");

  const runAudit = useCallback(() => {
    const v = auditDraftAgainstBrandVoice(auditText, profile);
    setViolations(v);
    setAudited(true);
  }, [auditText, profile]);

  const addForbiddenWord = () => {
    if (!newForbidden.trim()) return;
    setProfile((p) => ({
      ...p,
      forbiddenWords: [...p.forbiddenWords, newForbidden.trim()],
    }));
    setNewForbidden("");
  };

  const removeForbiddenWord = (word: string) => {
    setProfile((p) => ({
      ...p,
      forbiddenWords: p.forbiddenWords.filter((w) => w !== word),
    }));
  };

  const addPreferredTerm = () => {
    if (!newFromTerm.trim() || !newToTerm.trim()) return;
    setProfile((p) => ({
      ...p,
      preferredTerms: { ...p.preferredTerms, [newFromTerm.trim()]: newToTerm.trim() },
    }));
    setNewFromTerm("");
    setNewToTerm("");
  };

  const addToneAdjective = () => {
    if (!newTone.trim()) return;
    setProfile((p) => ({
      ...p,
      toneAdjectives: [...p.toneAdjectives, newTone.trim()],
    }));
    setNewTone("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const names = files.map((f) => f.name);
    setUploadedFiles((prev) => [...new Set([...prev, ...names])]);
    setUploadStatus(`Indexed ${names.join(", ")} into knowledge base.`);
    setTimeout(() => setUploadStatus(""), 4000);
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Brand Voice & Knowledge Base</h2>
            <p className="text-sm text-slate-500 mt-1">
              Set tone rules, forbidden words, preferred terminology, and upload spec sheets so
              every AI-generated page sounds exactly like your brand.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
            Active profile: {profile.name}
          </span>
        </div>

        {/* Tab nav */}
        <div className="flex gap-2 mt-5 border-b border-slate-100">
          {(["rules", "audit", "kb"] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === sec
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {sec === "rules" && "Voice Rules"}
              {sec === "audit" && "Draft Auditor"}
              {sec === "kb" && "Knowledge Base"}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION: Voice Rules */}
      {activeSection === "rules" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tone Adjectives */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Tone Adjectives</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.toneAdjectives.map((adj) => (
                <span
                  key={adj}
                  className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100"
                >
                  {adj}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                placeholder="Add adjective..."
                value={newTone}
                onChange={(e) => setNewTone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addToneAdjective()}
              />
              <button
                onClick={addToneAdjective}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Forbidden Words */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Forbidden Words</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.forbiddenWords.map((w) => (
                <span
                  key={w}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-0.5 text-xs font-medium text-red-700 border border-red-100"
                >
                  {w}
                  <button
                    onClick={() => removeForbiddenWord(w)}
                    className="ml-1 text-red-400 hover:text-red-600 leading-none"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                placeholder="Add forbidden word..."
                value={newForbidden}
                onChange={(e) => setNewForbidden(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addForbiddenWord()}
              />
              <button
                onClick={addForbiddenWord}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Block
              </button>
            </div>
          </div>

          {/* Preferred Terms */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Preferred Terminology Map
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left p-2 font-semibold text-slate-600 border border-slate-200">
                      Generic Term
                    </th>
                    <th className="text-left p-2 font-semibold text-slate-600 border border-slate-200">
                      Preferred Brand Term
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(profile.preferredTerms).map(([from, to]) => (
                    <tr key={from} className="hover:bg-slate-50">
                      <td className="p-2 border border-slate-200 text-red-700 font-mono">{from}</td>
                      <td className="p-2 border border-slate-200 text-green-700 font-mono">{to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                className="flex-1 min-w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                placeholder="Generic term (e.g. pump)"
                value={newFromTerm}
                onChange={(e) => setNewFromTerm(e.target.value)}
              />
              <input
                className="flex-1 min-w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                placeholder="Preferred term (e.g. rotary lobe pump)"
                value={newToTerm}
                onChange={(e) => setNewToTerm(e.target.value)}
              />
              <button
                onClick={addPreferredTerm}
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Map Term
              </button>
            </div>
          </div>

          {/* Persona Instructions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">AI Persona Instructions</h3>
            <textarea
              className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono resize-y"
              rows={4}
              value={profile.personaInstructions}
              onChange={(e) =>
                setProfile((p) => ({ ...p, personaInstructions: e.target.value }))
              }
            />
            <p className="text-xs text-slate-400 mt-1">
              These instructions are injected into the AI system prompt for every content generation call.
            </p>
          </div>
        </div>
      )}

      {/* SECTION: Draft Auditor */}
      {activeSection === "audit" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Draft Auditor</h3>
          <p className="text-xs text-slate-500">
            Paste any draft text below. The engine will flag forbidden words, wrong terminology,
            and tone mismatches against your brand voice rules.
          </p>
          <textarea
            className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono resize-y"
            rows={6}
            value={auditText}
            onChange={(e) => {
              setAuditText(e.target.value);
              setAudited(false);
            }}
          />
          <button
            onClick={runAudit}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Run Brand Voice Audit
          </button>

          {audited && (
            <div>
              {violations.length === 0 ? (
                <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800 font-semibold">
                  No violations found. Draft is brand-compliant.
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-red-700">
                    {violations.length} violation{violations.length > 1 ? "s" : ""} found
                  </p>
                  {violations.map((v, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs"
                    >
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold mr-2 ${
                          v.type === "forbidden_word"
                            ? "bg-red-100 text-red-700"
                            : v.type === "wrong_term"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {v.type.replace(/_/g, " ")}
                      </span>
                      <strong className="text-slate-800">&quot;{v.found}&quot;</strong>
                      <span className="text-slate-600 ml-2">— {v.suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION: Knowledge Base */}
      {activeSection === "kb" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-semibold text-slate-700">Knowledge Base — Uploaded Documents</h3>
          <p className="text-xs text-slate-500">
            Upload product spec sheets, case studies, ISO certificates, and engineering reports.
            The AI references these when generating content to ensure factual accuracy.
          </p>

          {/* Upload zone */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-2xl p-8 cursor-pointer hover:bg-indigo-50 transition-colors">
            <div className="text-3xl mb-2 text-indigo-300">+</div>
            <span className="text-sm font-medium text-indigo-600">Click to upload PDF / DOCX</span>
            <span className="text-xs text-slate-400 mt-1">Max 25 MB per file</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {uploadStatus && (
            <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-xs text-green-800 font-semibold">
              {uploadStatus}
            </div>
          )}

          {/* File list */}
          <ul className="divide-y divide-slate-100">
            {uploadedFiles.map((name) => (
              <li key={name} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-600">
                      {name.split(".").pop()?.toUpperCase() ?? "DOC"}
                    </span>
                  </div>
                  <span className="text-sm text-slate-700">{name}</span>
                </div>
                <span className="text-xs text-green-600 font-semibold">Indexed</span>
              </li>
            ))}
          </ul>

          {/* Knowledge chunks preview */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 mb-2">
              Extracted Knowledge Chunks (preview)
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {profile.vectorChunks.map((chunk, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700 font-mono"
                >
                  [{i + 1}] {chunk}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
