"use client";

import { useState, useEffect } from "react";
import { analyzeCompetitorGaps, type GapReport, type GapTopic } from "@/lib/competitorGapEngine";

const PRIORITY_COLORS: Record<GapTopic["priority"], string> = {
  Critical: "bg-red-100 text-red-800 border-red-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
};

const DIFF_COLORS: Record<GapTopic["difficulty"], string> = {
  Low: "text-green-700",
  Medium: "text-amber-600",
  High: "text-red-600",
};

const YOUR_TOPICS = [
  "CNC machining", "rotary lobe pump", "compressor food", "gate valve"
];

const SAMPLE_URLS = [
  "https://surfer-seo.com",
  "https://searchatlas.com",
  "https://marketmuse.com",
];

export function CompetitorUrlGapAnalysis() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<GapReport | null>(null);
  const [filterPriority, setFilterPriority] = useState<GapTopic["priority"] | "All">("All");
  const [filterGap, setFilterGap] = useState<"gaps" | "all">("gaps");
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Set<string>>(new Set());

  const handleScan = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setReport(null);
    await new Promise((r) => setTimeout(r, 1200));
    const r = analyzeCompetitorGaps(url, YOUR_TOPICS);
    setReport(r);
    setScanning(false);
  };

  const handleGenerate = async (topic: GapTopic) => {
    setGenerating(topic.topic);
    await new Promise((r) => setTimeout(r, 800));
    setGenerated((prev) => new Set([...prev, topic.topic]));
    setGenerating(null);
  };

  const filtered = report?.gapTopics.filter((t) => {
    const pOk = filterPriority === "All" || t.priority === filterPriority;
    const gOk = filterGap === "all" || !t.youHave;
    return pOk && gOk;
  }) ?? [];

  const gapCount = report?.gapTopics.filter((t) => !t.youHave).length ?? 0;

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Competitor URL Gap Analysis</h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste a competitor domain. ForgeFlow scans their content clusters, compares with yours,
          and surfaces missing topic pages with volume and difficulty scores.
        </p>

        <div className="flex gap-3 mt-5 flex-wrap">
          <div className="flex-1 min-w-64">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              placeholder="https://competitor.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
          </div>
          <button
            onClick={handleScan}
            disabled={scanning || !url.trim()}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {scanning ? "Scanning..." : "Scan Competitor"}
          </button>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {SAMPLE_URLS.map((u) => (
            <button
              key={u}
              onClick={() => setUrl(u)}
              className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-indigo-300 transition-colors"
            >
              {u.replace("https://", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {report && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Pages Scanned", value: report.scannedPages },
              { label: "Your Coverage", value: `${report.coverageScore}%`, sub: "vs competitor" },
              { label: "Content Gaps", value: gapCount, color: "text-red-600" },
              { label: "Generated At", value: new Date(report.generatedAt).toLocaleTimeString("en-IN") },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs text-center">
                <div className={`text-2xl font-bold ${(k as { color?: string }).color ?? "text-indigo-700"}`}>
                  {k.value}
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">{k.label}</div>
                {"sub" in k && k.sub && <div className="text-xs text-slate-400">{k.sub}</div>}
              </div>
            ))}
          </div>

          {/* Coverage bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>Your coverage vs {report.competitorDomain}</span>
              <span>{report.coverageScore}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${report.coverageScore >= 70 ? "bg-green-500" : report.coverageScore >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${report.coverageScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {report.coverageScore < 50
                ? "Critical gap — competitor dominates most of these topic clusters."
                : report.coverageScore < 75
                  ? "Partial coverage — several high-volume gaps remain."
                  : "Strong coverage — only minor gaps left."}
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex gap-1">
              {(["gaps", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterGap(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${filterGap === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200"}`}
                >
                  {f === "gaps" ? "Gaps Only" : "All Topics"}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {(["All", "Critical", "High", "Medium", "Low"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${filterPriority === p ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Gap table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Topic", "Volume", "Difficulty", "Priority", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left p-3 font-semibold text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => (
                    <tr key={t.topic} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-slate-800 max-w-64">{t.topic}</div>
                        <div className="text-slate-400 font-mono">{t.suggestedSlug}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700">{t.estimatedVolume.toLocaleString("en-US")}</td>
                      <td className={`p-3 font-semibold ${DIFF_COLORS[t.difficulty]}`}>{t.difficulty}</td>
                      <td className="p-3">
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${PRIORITY_COLORS[t.priority]}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        {t.youHave ? (
                          <span className="text-green-600 font-semibold">Covered</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Missing</span>
                        )}
                      </td>
                      <td className="p-3">
                        {!t.youHave && (
                          <button
                            onClick={() => handleGenerate(t)}
                            disabled={generating === t.topic || generated.has(t.topic)}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${generated.has(t.topic) ? "bg-green-50 text-green-700 border border-green-200" : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"}`}
                          >
                            {generating === t.topic ? "..." : generated.has(t.topic) ? "Queued" : "Generate Page"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
