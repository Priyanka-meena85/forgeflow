import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function ClearscopeComparisonPage() {
  const COMPARISON_ROWS = [
    {
      feature: "Industrial Domain Focus",
      forgeflow: "100% Industrial & Manufacturing (7 Pre-built Verticals)",
      clearscope: "Generic B2C & SaaS (E-commerce, consumer lifestyle)",
      note: "Clearscope has no concept of engineering tolerances, alloys, or failure modes.",
    },
    {
      feature: "Answer Engine Optimization (AEO / GEO)",
      forgeflow: "Native multi-engine tracking (Perplexity, ChatGPT, SGE)",
      clearscope: "Traditional Google 10-blue-links keyword density",
      note: "Clearscope cannot audit whether your brand is cited in LLM syntheses.",
    },
    {
      feature: "3D CAD / STEP Geometry Schema Extractor",
      forgeflow: "Automated STEP/IGES to JSON-LD TechArticle graph",
      clearscope: "Unsupported (Text input only)",
      note: "ForgeFlow turns CAD files into verified engineering schemas without human entry.",
    },
    {
      feature: "DIN / JIS / ASTM Standards Crosswalk",
      forgeflow: "1-Click international alloy & unit equivalence engine",
      clearscope: "Unsupported",
      note: "Essential for European & Japanese industrial supply chain discoverability.",
    },
    {
      feature: "Deterministic Engineering QA Gating",
      forgeflow: "Closed-loop tolerance & fluff validation before publish",
      clearscope: "Generic readability & word count scoring",
      note: "Prevents publishing hallucinated specs that violate engineering tolerances.",
    },
    {
      feature: "Enterprise Multi-Tenant Row-Level Security",
      forgeflow: "PostgreSQL RLS with Okta SAML 2.0 & SCIM",
      clearscope: "Basic shared team logins",
      note: "ForgeFlow meets aerospace & defense tier-1 data isolation standards.",
    },
    {
      feature: "Competitive Citation Displacement Matrix",
      forgeflow: "Direct tracking of competitor PDF answer displacements",
      clearscope: "Competitor keyword gap analysis only",
      note: "Tracks real-time share of voice in conversational answers.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Platform Benchmark
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              ForgeFlow vs. Clearscope
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Why manufacturing OEMs and industrial technical teams outgrow generic keyword graders and choose ForgeFlow for deterministic Answer Engine Optimization.
            </p>
          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-xs font-mono uppercase">
                    <th className="p-4 sm:p-5 text-slate-400 font-bold">Capability</th>
                    <th className="p-4 sm:p-5 text-cyan-400 font-bold bg-cyan-950/20">
                      ForgeFlow Industrial AEO
                    </th>
                    <th className="p-4 sm:p-5 text-slate-400 font-bold">Clearscope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 sm:p-5 font-bold text-white align-top">
                        <div>{row.feature}</div>
                        <div className="text-[11px] text-slate-500 font-normal mt-1 leading-normal">
                          {row.note}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-cyan-300 font-medium bg-cyan-950/10 align-top">
                        <div className="flex items-start gap-2">
                          <span className="css-icon-check text-cyan-400 shrink-0 mt-0.5"></span>
                          <span>{row.forgeflow}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-400 align-top">
                        <div className="flex items-start gap-2">
                          <span className="text-slate-600 shrink-0 font-bold">&times;</span>
                          <span>{row.clearscope}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deep-Dive Why Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">The Cost of Generic SEO Graders</h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Tools like Clearscope were designed when search was ten blue links and keyword repetition boosted ranking. When applied to industrial manufacturing, they reward superficial marketing jargon and punish precise technical formulas.
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Answer engines like Perplexity ignore fluffy prose and cite structured, verified data schemas. ForgeFlow was built specifically to extract and syndicate this engineering precision.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Engineered for Technical Credibility</h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                With ForgeFlow, your chief metallurgist or chief reliability engineer signs off on content within the platform before publication. Our Deterministic QA studio enforces zero-tolerance deviation on CAD geometry and ASTM alloy ratings.
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Result: Your brand becomes the authoritative reference that Perplexity and ChatGPT cite when engineers troubleshoot critical systems.
              </p>
            </div>
          </div>

          {/* CTA Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-800/40 rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Upgrade to True Industrial AEO?
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Migrate your industrial catalog to ForgeFlow in minutes. We provide automated PDF and STEP file ingestion during pilot onboarding.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20"
              >
                Schedule Technical Migration Review &rarr;
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider transition"
              >
                Explore Pricing Tiers
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
