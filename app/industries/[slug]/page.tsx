import { notFound } from "next/navigation";
import Link from "next/link";
import { INDUSTRIAL_SECTORS, getIndustryBySlug } from "@/lib/industriesDirectory";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import { IndustrySectorInteractiveView } from "@/components/IndustrySectorInteractiveView";

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

      {/* Sector Hero Header */}
      <section className="pt-14 pb-12 bg-gradient-to-b from-white via-sky-50/20 to-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs">
              <li>
                <Link href="/industries" className="text-slate-500 hover:text-sky-600 font-medium">
                  Industries Directory
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">&gt;</li>
              <li>
                <span className="text-sky-700 font-mono font-bold">{sector.category}</span>
              </li>
              <li aria-hidden="true" className="text-slate-300">&gt;</li>
              <li aria-current="page">
                <span className="text-slate-900 font-semibold">{sector.title}</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
              Standard: {sector.standard}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Target Deal ACV: {sector.avgDealValue}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Search Volume: {sector.searchVol}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Risk: {sector.specRisk}
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

      {/* Main Interactive Workbench */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6">
        <IndustrySectorInteractiveView sector={sector} />
      </section>

      {/* Sector Conversion CTA */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>PRE-BUILT {sector.shortTitle.toUpperCase()} TAXONOMY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-humanist">
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
