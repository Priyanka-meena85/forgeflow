import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export const BLOG_POSTS = [
  {
    slug: "what-is-aeo-for-manufacturing",
    title: "What is Answer Engine Optimization (AEO) for Manufacturing?",
    excerpt:
      "How engineers and procurement officers are bypassing Google ten-blue-links in favor of generative LLM engines like Perplexity, ChatGPT, and Google SGE.",
    date: "Nov 18, 2026",
    readTime: "7 min read",
    category: "Architecture & AEO",
    author: "Industrial Search Lab",
  },
  {
    slug: "how-industrial-companies-rank-perplexity-chatgpt",
    title: "How Industrial Companies Can Rank in Perplexity and ChatGPT",
    excerpt:
      "A technical walkthrough of deterministic JSON-LD schema graphs, TechArticle structuring, and entity grounding required to become a cited citation source.",
    date: "Nov 12, 2026",
    readTime: "9 min read",
    category: "AI Search Engineering",
    author: "Alexei Petrov, Lead Architect",
  },
  {
    slug: "din-jis-standards-crosswalk-technical-seo",
    title: "DIN vs JIS Standards: Why Multilingual Content Matters for Industrial SEO",
    excerpt:
      "Why European and Asian manufacturing buyers fail to find US spec sheets, and how 1-click alloy equivalence tables unlock global technical discoverability.",
    date: "Nov 04, 2026",
    readTime: "6 min read",
    category: "Global Standards",
    author: "Engineering Standards Group",
  },
  {
    slug: "death-of-industrial-pdf-spec-sheets",
    title: "The Death of the Industrial PDF: Why AEO is Replacing Document SEO",
    excerpt:
      "82% of technical spec sheets are locked inside unindexed 40-page PDF catalogs. Here is how modern OEMs convert raw CAD metadata into high-ranking schema graphs.",
    date: "Oct 27, 2026",
    readTime: "8 min read",
    category: "Content Strategy",
    author: "Sarah Lindqvist",
  },
  {
    slug: "hvac-commercial-refrigeration-aeo-playbook",
    title: "HVAC & Commercial Refrigeration: The 2026 Answer Engine Playbook",
    excerpt:
      "Capturing mechanical engineering intent during the EPA A2L refrigerant transition. Strategies for SEER2 ratings, compressor failure modes, and ASHRAE compliance.",
    date: "Oct 19, 2026",
    readTime: "11 min read",
    category: "HVAC Vertical",
    author: "HVAC Domain Specialist",
  },
  {
    slug: "cad-step-schema-extraction-manufacturing",
    title: "Automated STEP CAD Schema Extraction: From 3D Model to Google Knowledge Graph",
    excerpt:
      "How WebGL exploded subassemblies and STEP boundary representation files are parsed into JSON-LD TechArticle nodes without human hallucination risk.",
    date: "Oct 08, 2026",
    readTime: "10 min read",
    category: "CAD & Engineering",
    author: "Core Systems Team",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-14">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Industrial Search Engineering
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              AEO Insights, Architectural Guides &amp; Case Analysis
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Deep-dives on generative answer engine optimization, deterministic JSON-LD schema design, and industrial search capture for B2B manufacturers.
            </p>
          </div>

          {/* Featured Post */}
          <div className="bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500 text-slate-950">
                FEATURED GUIDE
              </span>
              <span className="text-xs text-slate-400 font-mono">7 min read • Nov 18, 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white hover:text-cyan-400 transition">
              <Link href="/blog/what-is-aeo-for-manufacturing">
                What is Answer Engine Optimization (AEO) for Manufacturing?
              </Link>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              Procurement engineers and MRO teams no longer scan 10 Google search results when sourcing a replacement mechanical seal or hydraulic actuator. They prompt Perplexity, Claude, or SGE directly with failure symptoms. Learn how to architect your catalog for this shift.
            </p>
            <div>
              <Link
                href="/blog/what-is-aeo-for-manufacturing"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-xs uppercase tracking-wider transition"
              >
                <span>Read Full Technical Guide</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-cyan-400 font-bold">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white hover:text-cyan-400 transition leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{post.excerpt}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">{post.date}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
