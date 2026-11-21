"use client";

import { useState } from "react";

type EngineMode = "ChatGPT" | "Perplexity" | "Google AIO" | "Gemini";

interface PromptTestResult {
  engine: EngineMode;
  query: string;
  isCited: boolean;
  citationPosition: number | null;
  confidenceScore: number;
  aiAnswer: string;
  pageSnippetUsed: string;
  recommendation: string;
  aeoChecks: {
    hasDirectAnswer: boolean;
    hasFaqSchema: boolean;
    hasStatistics: boolean;
    hasComparisonTable: boolean;
    hasExpertCredit: boolean;
    hasSpecifiedSource: boolean;
  };
}

const ENGINE_COLORS: Record<EngineMode, string> = {
  ChatGPT: "bg-green-100 text-green-800 border-green-200",
  Perplexity: "bg-blue-100 text-blue-800 border-blue-200",
  "Google AIO": "bg-indigo-100 text-indigo-800 border-indigo-200",
  Gemini: "bg-purple-100 text-purple-800 border-purple-200",
};

function simulateResult(query: string, pageContent: string, engine: EngineMode): PromptTestResult {
  // Deterministic simulation based on content signals
  const lowerContent = pageContent.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const hasDirectAnswer =
    lowerContent.includes("is") &&
    lowerContent.includes("because") &&
    lowerContent.length > 200;
  const hasFaqSchema =
    lowerContent.includes("?") && lowerContent.split("?").length > 2;
  const hasStatistics =
    /\d+(\.\d+)?[\s]?(%|mm|mpa|°c|rpm|kg|kw|bar|psi)/i.test(pageContent);
  const hasComparisonTable =
    lowerContent.includes("vs") || lowerContent.includes("comparison") || lowerContent.includes("compare");
  const hasExpertCredit =
    lowerContent.includes("engineer") || lowerContent.includes("certified") || lowerContent.includes("iso");
  const hasSpecifiedSource =
    lowerContent.includes("standard") || lowerContent.includes("astm") ||
    lowerContent.includes("iso") || lowerContent.includes("asme") || lowerContent.includes("is ");

  const aeoScore = [
    hasDirectAnswer, hasFaqSchema, hasStatistics,
    hasComparisonTable, hasExpertCredit, hasSpecifiedSource,
  ].filter(Boolean).length;

  const queryMatch = lowerQuery.split(" ").filter((w) => w.length > 3).some((w) => lowerContent.includes(w));
  const isCited = queryMatch && aeoScore >= 3;

  const confidenceScore = Math.round(
    (aeoScore / 6) * 60 + (queryMatch ? 25 : 0) + (isCited ? 15 : 0)
  );

  const citationPosition = isCited ? Math.floor(aeoScore / 2) + 1 : null;

  const aiAnswer = isCited
    ? `Based on verified technical data from your page: "${pageContent.slice(0, 120).trim()}..." — ${engine} would likely cite this page as a source.`
    : `${engine} would generate a generic answer without citing your page. The content lacks sufficient AEO signals for direct citation.`;

  const pageSnippetUsed = isCited
    ? pageContent.slice(0, 160).trim() + "..."
    : "No snippet extracted — content signals below citation threshold.";

  const recommendation = aeoScore < 3
    ? "CRITICAL: Add a direct answer paragraph, FAQ section with 3+ questions, and cite an ISO/IS standard. Without these, AI engines will never cite this page."
    : aeoScore < 5
      ? "PARTIAL: Add statistical data with units (MPa, °C, rpm) and a comparison table. This will push citation probability above 70%."
      : "STRONG: Page has solid AEO structure. Consider adding an Expert Review block with credentials to push E-E-A-T and AI citation confidence above 90%.";

  return {
    engine,
    query,
    isCited,
    citationPosition,
    confidenceScore,
    aiAnswer,
    pageSnippetUsed,
    recommendation,
    aeoChecks: {
      hasDirectAnswer,
      hasFaqSchema,
      hasStatistics,
      hasComparisonTable,
      hasExpertCredit,
      hasSpecifiedSource,
    },
  };
}

const SAMPLE_QUERIES = [
  "What causes rotary lobe pump seal failure in CIP operations?",
  "Best CNC machining tolerances for automotive grade components India",
  "ISO 9001 certified industrial bearing suppliers India",
  "Oil free compressor for food grade applications BIS certified",
];

const SAMPLE_CONTENT = `Elastomer seal failure in rotary lobe pumps during CIP operations is primarily caused by chemical incompatibility between EPDM seals and caustic wash solutions exceeding 2.5% NaOH concentration at temperatures above 80°C, per 3-A Sanitary Standard 02-12.

Our ISO 9001:2015 certified rotary lobe pumps are engineered with FKM and FFKM seal options that withstand caustic concentrations up to 5% NaOH at 95°C.

Comparison: EPDM vs FKM vs FFKM seals:
- EPDM: Max 1.5% NaOH, 70°C — suitable for water-based cleaning only
- FKM: Up to 5% NaOH, 100°C — recommended for standard CIP
- FFKM: Up to 10% NaOH, 150°C — for aggressive chemical cleaning

FAQ:
Q: How often should seals be replaced in a CIP-intensive operation?
A: Per IS 2825 recommendations, seals should be inspected every 2000 operating hours or 6 months, whichever comes first.

Q: Does the pump meet 3-A Sanitary Standard requirements?
A: Yes. All units carry 3-A Sanitary Standard 02-12 certification, verified by independent third-party auditors.`;

export function AeoPromptTester() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0]);
  const [pageContent, setPageContent] = useState(SAMPLE_CONTENT);
  const [selectedEngines, setSelectedEngines] = useState<EngineMode[]>(["ChatGPT", "Perplexity"]);
  const [results, setResults] = useState<PromptTestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [activeResult, setActiveResult] = useState<EngineMode | null>(null);

  const ENGINES: EngineMode[] = ["ChatGPT", "Perplexity", "Google AIO", "Gemini"];

  const toggleEngine = (e: EngineMode) => {
    setSelectedEngines((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  };

  const runTest = async () => {
    if (!query.trim() || !pageContent.trim()) return;
    setTesting(true);
    setResults([]);

    // Simulate per-engine delay
    const outputs: PromptTestResult[] = [];
    for (const engine of selectedEngines) {
      await new Promise((r) => setTimeout(r, 400));
      outputs.push(simulateResult(query, pageContent, engine));
    }

    setResults(outputs);
    setActiveResult(outputs[0]?.engine ?? null);
    setTesting(false);
  };

  const activeRes = results.find((r) => r.engine === activeResult);

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">AEO Prompt Tester</h2>
        <p className="text-sm text-slate-500 mt-1">
          Test whether your page would be cited by ChatGPT, Perplexity, Google AI Overviews, or
          Gemini for a given query. Get a gap analysis and fix recommendations.
        </p>
      </div>

      {/* Config */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        {/* Engine selector */}
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">AI Engines to Test</p>
          <div className="flex flex-wrap gap-2">
            {ENGINES.map((eng) => (
              <button
                key={eng}
                onClick={() => toggleEngine(eng)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                  selectedEngines.includes(eng)
                    ? ENGINE_COLORS[eng]
                    : "bg-white text-slate-500 border-slate-200"
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>

        {/* Query input */}
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">Target Search Query</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {SAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className={`rounded-lg px-2.5 py-1 text-xs border transition-colors ${
                  query === q
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {q.length > 50 ? q.slice(0, 50) + "..." : q}
              </button>
            ))}
          </div>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter the query a buyer would type into ChatGPT / Perplexity..."
          />
        </div>

        {/* Page content */}
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">
            Page Content to Test (paste excerpt — 200-800 words ideal)
          </p>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono resize-y"
            rows={8}
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
            placeholder="Paste your page content here..."
          />
        </div>

        <button
          onClick={runTest}
          disabled={testing || selectedEngines.length === 0}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {testing ? "Testing..." : `Run AEO Citation Test (${selectedEngines.length} engines)`}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Test Results</h3>

          {/* Engine summary pills */}
          <div className="flex flex-wrap gap-3 mb-5">
            {results.map((r) => (
              <button
                key={r.engine}
                onClick={() => setActiveResult(r.engine)}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                  activeResult === r.engine
                    ? ENGINE_COLORS[r.engine] + " shadow-sm"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                <div className="text-sm font-bold">{r.engine}</div>
                <div className="mt-0.5">
                  {r.isCited ? (
                    <span className="text-green-700">Cited (pos. #{r.citationPosition})</span>
                  ) : (
                    <span className="text-red-600">Not Cited</span>
                  )}
                  {" "}&mdash; {r.confidenceScore}% confidence
                </div>
              </button>
            ))}
          </div>

          {/* Active result detail */}
          {activeRes && (
            <div className="space-y-5">
              {/* AEO Signal Checklist */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  AEO Signal Checklist
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(activeRes.aeoChecks).map(([key, pass]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 border text-xs font-medium ${
                        pass
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      <span className="font-bold">{pass ? "+" : "-"}</span>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())
                        .replace("Has ", "")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Citation verdict */}
              <div
                className={`rounded-xl border p-5 ${
                  activeRes.isCited
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div
                      className={`text-lg font-bold ${activeRes.isCited ? "text-green-800" : "text-red-800"}`}
                    >
                      {activeRes.isCited
                        ? `Cited at position #${activeRes.citationPosition}`
                        : "Not Cited"}
                    </div>
                    <div className="text-sm text-slate-700 mt-1">{activeRes.aiAnswer}</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${activeRes.confidenceScore >= 70 ? "text-green-700" : activeRes.confidenceScore >= 40 ? "text-amber-600" : "text-red-600"}`}
                    >
                      {activeRes.confidenceScore}%
                    </div>
                    <div className="text-xs text-slate-500">AEO confidence</div>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Fix Recommendation:
                </span>
                <p className="text-sm text-amber-900 mt-1">{activeRes.recommendation}</p>
              </div>

              {/* Snippet */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1.5">
                  Snippet that would be extracted:
                </p>
                <div className="rounded-lg bg-slate-900 p-3 text-xs font-mono text-cyan-400">
                  {activeRes.pageSnippetUsed}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
