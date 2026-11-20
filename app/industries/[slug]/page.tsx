import { notFound } from "next/navigation";
import Link from "next/link";
import { INDUSTRIAL_SECTORS, getIndustryBySlug } from "@/lib/industriesDirectory";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export function generateStaticParams() {
  return INDUSTRIAL_SECTORS.map((sector) => ({
    slug: sector.slug,
  }));
}

export default async function IndustrySectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = getIndustryBySlug(slug);

  if (!sector) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      <PublicNavbar activeNav="industries" />

      {/* Sector Hero */}
      <section className="pt-14 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link href="/industries" className="text-slate-500 hover:text-sky-600 font-medium">
              Industries Directory
            </Link>
            <span className="text-slate-300">&gt;</span>
            <span className="text-sky-700 font-mono font-bold">{sector.category}</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-900 font-semibold">{sector.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
              {sector.standard}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Target Deal ACV: {sector.avgDealValue}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Search Volume: {sector.searchVol}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-humanist">
            {sector.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {sector.heroSnippet}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Generate {sector.shortTitle} Content &rarr;
            </Link>
            <Link
              href="/features"
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Explore QA Validation Studio
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* 1. The Verified 45-Word Answer Engine Capsule Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                Certified AEO Answer Capsule (Google SGE &amp; Perplexity Ready)
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              Deterministic Accuracy: {sector.specRisk}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400">
              Query: &quot;{sector.sampleHeadline}&quot;
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 text-sm sm:text-base leading-relaxed text-slate-100 font-serif">
              &quot;{sector.capsuleText}&quot;
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <span>Schema: {sector.schemaTypes.join(" + ")}</span>
              <span>&bull;</span>
              <span>Length: ~45 words</span>
            </div>
            <span className="text-sky-400">Targeting Google AI Overview Box #1</span>
          </div>
        </div>

        {/* 2. Failure Mode & Root Cause Protocol */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Root Cause Protocol
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-humanist">
              Failure Mode: {sector.failureMode}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {sector.rootCauseAnalysis}
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800">Affected Component:</div>
              <p className="text-slate-600 font-mono text-[11.5px]">
                {sector.equipment}
              </p>
              <div className="font-bold text-slate-800 pt-1">Governing Standard:</div>
              <p className="text-slate-600 font-mono text-[11.5px]">
                {sector.standard}
              </p>
            </div>
          </div>

          {/* Plant Engineer Reviewer Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-md space-y-4">
            <span className="text-[10px] font-mono uppercase font-bold text-sky-400 tracking-wider">
              Plant Reliability Validation
            </span>
            <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              &quot;{sector.plantEngineerQuote.text}&quot;
            </blockquote>
            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs font-bold text-white">
                {sector.plantEngineerQuote.author}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {sector.plantEngineerQuote.role}
              </div>
              <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                {sector.plantEngineerQuote.company}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Global Standards Crosswalk Table (DIN / JIS / ASTM) */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 sm:p-7 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-humanist">
                1-Click Global Standards Localization Crosswalk
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant translation between US Imperial, German DIN EN, and Japanese JIS industrial specs.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
              Multi-Lingual Schema Ready
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-700 font-mono text-[11px]">
                  <th className="py-3 px-6">Physical Property</th>
                  <th className="py-3 px-4">US Specification</th>
                  <th className="py-3 px-4">German DIN Standard</th>
                  <th className="py-3 px-4">Japanese JIS Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {sector.toleranceCrosswalk.map((item) => (
                  <tr key={item.property} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-6 font-semibold text-slate-900 font-sans">{item.property}</td>
                    <td className="py-3 px-4 text-slate-700">{item.usSpec}</td>
                    <td className="py-3 px-4 font-bold text-sky-800">{item.germanDin}</td>
                    <td className="py-3 px-4 font-bold text-emerald-800">{item.japaneseJis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Critical Specifications & Tolerances Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 sm:p-7 border-b border-slate-200 bg-slate-50/70">
            <h2 className="text-lg font-bold text-slate-900 font-humanist">
              Deterministic Tolerance &amp; Criticality Boundaries
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict mathematical upper and lower boundaries validated before content generation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-700 font-mono text-[11px]">
                  <th className="py-3 px-6">Engineering Parameter</th>
                  <th className="py-3 px-4">Rated Limit</th>
                  <th className="py-3 px-4">Permissible Tolerance</th>
                  <th className="py-3 px-4">Criticality Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sector.specSheet.map((spec) => (
                  <tr key={spec.parameter} className="hover:bg-slate-50 transition font-mono">
                    <td className="py-3 px-6 font-semibold text-slate-900 font-sans">{spec.parameter}</td>
                    <td className="py-3 px-4 text-slate-700">{spec.ratedLimit}</td>
                    <td className="py-3 px-4 text-slate-700">{spec.tolerance}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        spec.criticality === "CRITICAL"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : spec.criticality === "HIGH"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}>
                        {spec.criticality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Sector FAQ */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-humanist">
            {sector.shortTitle} Engineering FAQ
          </h2>
          <div className="space-y-3">
            {sector.sampleFaq.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">{faq.question}</div>
                <div className="text-slate-600 leading-relaxed">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sector CTA */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black font-humanist">
            Start Generating Certified {sector.shortTitle} Content
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Publish technical diagnostic articles that capture high-intent search queries from maintenance directors and plant engineers.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-sky-600/30 cursor-pointer"
            >
              Launch Live Workspace &rarr;
            </Link>
            <Link
              href="/industries"
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Back to All Industries
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
