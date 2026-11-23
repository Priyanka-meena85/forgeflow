"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

interface AuditResult {
  domain: string;
  industry: string;
  keyword: string;
  metrics: {
    overallScore: number;
    dinIsoScore: number;
    aeoScore: number;
    cadIndexScore: number;
    estimatedMissingPages: number;
    missedPipelineUsd: string;
  };
  gaps: Array<{
    title: string;
    severity: string;
    description: string;
    fix: string;
  }>;
}

export default function FreeAuditPage() {
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("Industrial Valves & Flow Control");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError("Please enter your company website domain.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/audit/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, industry, keyword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to scan domain.");
      }
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Scanning failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Free Industrial SEO & AEO Scanner
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Is Your Industrial Catalog Visible in AI Search?
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Scan your domain against 50+ industrial ranking factors: DIN/ISO structured schema, Perplexity/ChatGPT engineering citations, and PDF spec crawlability.
            </p>
          </div>

          {/* Scanner Input Box */}
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleScan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Company Website Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. apexvalve.com"
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Industrial Valves & Flow Control">Valves & Flow Control</option>
                    <option value="CNC Machining & Precision Tooling">CNC & Precision Tooling</option>
                    <option value="Hydraulics & Pneumatic Systems">Hydraulics & Pneumatics</option>
                    <option value="Heavy Equipment & Machinery">Heavy Machinery</option>
                    <option value="HVAC & Industrial Cooling">Industrial HVAC</option>
                    <option value="Fasteners & Custom Metal Stampings">Fasteners & Stampings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Primary OEM Part / Product Keyword (Optional)
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. High Pressure Ball Valves ISO 5208"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {error && <p className="text-rose-400 text-xs font-mono">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Running 50-Point Industrial SEO Audit...
                  </>
                ) : (
                  "Run Instant Diagnostic Audit &rarr;"
                )}
              </button>
            </form>
          </div>

          {/* Results Display */}
          {result && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
              {/* Score Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-rose-900/60 bg-rose-950/20 text-center">
                  <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">
                    {result.metrics.overallScore}/100
                  </div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
                    Overall AI/SEO Health
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 text-center">
                  <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                    {result.metrics.aeoScore}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
                    AEO Citation Share
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 text-center">
                  <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
                    {result.metrics.estimatedMissingPages}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
                    Unranked Part Pages
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    {result.metrics.missedPipelineUsd}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
                    Estimated Lost Pipeline
                  </div>
                </div>
              </div>

              {/* Critical Gaps Breakdown */}
              <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Identified Engineering Visibility Gaps on {result.domain}
                </h3>

                <div className="space-y-4">
                  {result.gaps.map((gap, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-200">{gap.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          {gap.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{gap.description}</p>
                      <div className="text-xs text-cyan-300/90 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-900/50 flex items-start gap-2">
                        <span className="font-bold font-mono text-[11px] text-cyan-400">FIX:</span>
                        <span>{gap.fix}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conversion CTA Box */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border border-cyan-800/80 text-center space-y-4">
                  <h4 className="text-xl font-black text-white">
                    Ready To Recover Your Lost Engineering Pipeline?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                    Start your 14-day industrial pilot. Upload your catalog spec sheet and generate your first 50 engineer-verified pages automatically.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                      href="/auth/register"
                      className="w-full sm:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20"
                    >
                      Claim 50 Free Pages Trial &rarr;
                    </Link>
                    <Link
                      href="/demo"
                      className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs uppercase tracking-wider transition"
                    >
                      Book Technical Walkthrough
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
