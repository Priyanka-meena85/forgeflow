import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

const CASE_STUDIES = [
  {
    title: "Precision Tooling OEM Replaces 1,200 Static PDFs With Live AEO Schemas",
    company: "Apex Precision Tooling Inc.",
    vertical: "Precision CNC & Tooling",
    heroMetric: "+340%",
    heroMetricLabel: "Increase in Perplexity & SGE Citations",
    duration: "90 Days Post-Deployment",
    summary:
      "Apex was completely invisible on zero-volume technical queries like '4-flute solid carbide end mill chattering on Inconel 718'. By syndicating their ISO 13399 tool geometry into ForgeFlow TechArticle graphs, they captured 82% share of voice.",
    kpis: [
      { label: "Engineering RFQs / Mo", value: "+46 RFQs", change: "+280%" },
      { label: "Content Cycle Time", value: "3.5 Days", change: "-68%" },
      { label: "AEO Answer Coverage", value: "82.4%", change: "+54.1%" },
    ],
    quote:
      "Before ForgeFlow, our 80-page tooling catalogs were black holes to AI engines. Now, when machine shops ask ChatGPT or Perplexity for feed-and-speed tables on aerospace alloys, our part numbers are the cited reference.",
    author: "Markus Vance",
    authorRole: "VP of Product Engineering & Technical Sales",
  },
  {
    title: "HVAC Chiller Manufacturer Achieves 94% Answer Engine Coverage for Low-GWP Queries",
    company: "Nordic Thermal Systems",
    vertical: "HVAC & Commercial Refrigeration",
    heroMetric: "$1.4M",
    heroMetricLabel: "Attributed Commercial Pipeline in 6 Months",
    duration: "6 Months",
    summary:
      "With EPA A2L refrigerant transitions forcing rapid engineering updates, Nordic needed engineers to find their R-454B scroll chiller specs. ForgeFlow's DIN/JIS crosswalk localized their thermal heat exchanger data across 14 European and North American markets.",
    kpis: [
      { label: "Closed OEM Contracts", value: "4 Wins", change: "$1.4M ARR" },
      { label: "Global Spec Downloads", value: "8,920", change: "+195%" },
      { label: "Zero-Volume Indexation", value: "94.2%", change: "+61%" },
    ],
    quote:
      "Mechanical contractors don't browse websites anymore—they ask AI bots which economizer coil meets ASHRAE 90.1. ForgeFlow put our exact engineering tolerances into those AI responses.",
    author: "Elena Rostova",
    authorRole: "Director of Global Applications & Marketing",
  },
  {
    title: "Automotive Tier-1 Displaces Competitor Spec Sheets on 42 Electric Vehicle Components",
    company: "Vanguard Mobility Components",
    vertical: "Automotive Tier-1 Stamping",
    heroMetric: "42",
    heroMetricLabel: "Competitor Displacement Victories on Perplexity",
    duration: "4 Months",
    summary:
      "Vanguard used ForgeFlow's Citation Steal Matrix to identify competitor CAD whitepapers cited on battery enclosure stamping tolerances. Within 120 days, Vanguard displaced legacy PDF citations with interactive WebGL subassemblies.",
    kpis: [
      { label: "Direct Tier-1 Inquiries", value: "31 RFQs", change: "+160%" },
      { label: "Competitors Displaced", value: "42 Keywords", change: "100% Win" },
      { label: "Content COGS Reduction", value: "$42,000", change: "-74%" },
    ],
    quote:
      "The deterministic compliance studio gave our chief metallurgist 100% confidence to publish without fears of AI hallucinating yield strengths. That trust unlocked our entire content velocity.",
    author: "David Chen",
    authorRole: "Chief Technology & Strategy Officer",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Verifiable Industrial Case Studies
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Real Industrial Teams Displacing Legacy PDFs With AI Citations
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore how industrial manufacturers, tooling specialists, and automotive Tier-1s generate high-margin RFQ pipeline by ranking inside LLM answer systems.
            </p>
          </div>

          {/* Cards */}
          <div className="space-y-12">
            {CASE_STUDIES.map((study, idx) => (
              <div
                key={study.company}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 hover:border-slate-700 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded">
                        {study.vertical}
                      </span>
                      <span className="text-xs font-mono text-slate-400">• {study.duration}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{study.title}</h2>
                    <div className="text-xs text-slate-400 font-medium mt-1">{study.company}</div>
                  </div>

                  <div className="bg-slate-950 border border-cyan-900/60 rounded-xl p-4 text-center md:text-right shrink-0">
                    <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-humanist">
                      {study.heroMetric}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                      {study.heroMetricLabel}
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
                  {study.summary}
                </p>

                {/* KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {study.kpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-1"
                    >
                      <div className="text-xs text-slate-400">{kpi.label}</div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-white font-humanist">{kpi.value}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">{kpi.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="bg-slate-950/40 border-l-2 border-cyan-500 pl-4 py-2 italic text-slate-300 text-xs sm:text-sm">
                  &ldquo;{study.quote}&rdquo;
                  <div className="not-italic text-xs font-semibold text-white mt-2">
                    {study.author} — <span className="text-slate-400 font-normal">{study.authorRole}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-900/40 rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Benchmark Your Industrial Catalog Against AI Engines
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Our engineering team will run a complimentary Share-of-Voice diagnostic on your top 20 part numbers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20"
              >
                Request Free AEO Diagnostic &rarr;
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider transition"
              >
                View Transparent Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
