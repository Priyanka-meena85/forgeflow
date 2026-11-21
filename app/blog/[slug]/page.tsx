import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export async function generateStaticParams() {
  return [
    { slug: "what-is-aeo-for-manufacturing" },
    { slug: "how-industrial-companies-rank-perplexity-chatgpt" },
    { slug: "din-jis-standards-crosswalk-technical-seo" },
    { slug: "death-of-industrial-pdf-spec-sheets" },
    { slug: "hvac-commercial-refrigeration-aeo-playbook" },
    { slug: "cad-step-schema-extraction-manufacturing" },
  ];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6">
        <article className="max-w-4xl mx-auto space-y-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs font-mono text-slate-400">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-slate-200">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-slate-200">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-cyan-400 font-bold truncate max-w-[200px] sm:max-w-none">
                {slug}
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="space-y-4 border-b border-slate-800 pb-8">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Technical AEO Strategy
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              What is Answer Engine Optimization (AEO) for Manufacturing?
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span>Published: November 18, 2026</span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>Author: Industrial Search Systems Lab</span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
            <p className="text-lg text-slate-200 font-medium leading-relaxed">
              For over two decades, industrial digital marketing relied on a simple equation: publish product catalogs, optimize for high-volume keywords like &ldquo;centrifugal pump manufacturer&rdquo;, and generate PDF downloads. In 2026, this paradigm has broken down entirely.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-white pt-4">
              1. The Rise of Zero-Volume Industrial Search
            </h2>
            <p>
              When a reliability engineer on an automotive assembly line faces unexpected bearing failure, they do not type generic keywords into Google. Instead, they prompt an AI engine like Perplexity, ChatGPT, or Google SGE with complex, multi-variable queries:
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300">
              &ldquo;Why is our 75kW chilled water screw compressor vibrating at 120Hz after synthetic POE oil retrofit, and which replacement mechanical seal resists 18 bar at -25°C?&rdquo;
            </div>
            <p>
              Traditional search engines return 10 PDFs with generic brochures. Answer engines synthesize a direct answer—and cite the specific technical documentation that provides deterministic, verified failure mode tolerances.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-white pt-4">
              2. Why Traditional SEO Fails Industrial B2B
            </h2>
            <p>
              Generic SEO SaaS tools evaluate content based on keyword density, reading level, and generic backlink profiles. This actively damages industrial content:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-white">Fluff Penalization:</strong> LLMs filter out marketing superlatives (&ldquo;industry-leading innovation&rdquo;) to extract raw technical data tables.
              </li>
              <li>
                <strong className="text-white">Unstructured CAD Data:</strong> 3D geometry and dimensional tolerances trapped inside static CAD drawings are completely invisible to search crawlers.
              </li>
              <li>
                <strong className="text-white">Lack of Entity Grounding:</strong> Without Schema.org <code className="text-cyan-400 font-mono">TechArticle</code> and <code className="text-cyan-400 font-mono">DefinedTermSet</code> graphs, search models cannot verify alloy equivalents (e.g. AISI 316L vs EN 1.4404).
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-white pt-4">
              3. The Three Pillars of ForgeFlow AEO Architecture
            </h2>
            <p>
              To rank consistently as the primary citation in AI answer interfaces, industrial companies must implement three core capabilities:
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-slate-300">
              <li>
                <strong className="text-white">Deterministic JSON-LD Graph Hub:</strong> Emitting deeply nested semantic graphs that connect part numbers directly to operating envelope limits, test standards (ISO 10816, ASME B16.34), and manufacturer identifiers.
              </li>
              <li>
                <strong className="text-white">DIN / JIS Crosswalk Localization:</strong> Automatically cross-referencing German DIN, Japanese JIS, and US ASTM standards so European and Asian procurement bots cite your catalog.
              </li>
              <li>
                <strong className="text-white">Closed-Loop Compliance Gating:</strong> Requiring chief engineering sign-off before syndication to guarantee zero AI hallucination on mission-critical tolerances.
              </li>
            </ol>

            <div className="bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-800/40 rounded-xl p-6 my-8 space-y-4">
              <h3 className="text-lg font-bold text-white">Ready to Audit Your Catalog&apos;s AI Share of Voice?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ForgeFlow connects directly with your CAD storage and CMS to generate verified AEO capsules that displace competitor PDFs.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/demo"
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
                >
                  Book Live Architecture Demo &rarr;
                </Link>
                <Link
                  href="/features"
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider transition"
                >
                  Explore 23 Architecture Modules
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
