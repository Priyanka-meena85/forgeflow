import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

const CHANGELOG_ENTRIES = [
  {
    version: "1.5.0",
    date: "November 20, 2026",
    tag: "Latest",
    changes: [
      { type: "New", description: "Blog content hub with 6 pillar articles on industrial AEO strategy" },
      { type: "New", description: "Partner & agency reseller program page with 3-tier commission model" },
      { type: "New", description: "ForgeFlow vs Clearscope comparison landing page for competitive displacement" },
      { type: "New", description: "Case studies page with 3 detailed industrial ROI benchmarks" },
      { type: "New", description: "Demo booking page with qualification form and industry selector" },
      { type: "New", description: "GDPR cookie consent banner with 3-category preference management" },
      { type: "New", description: "Privacy Policy and Terms of Service legal pages" },
      { type: "New", description: "Stripe checkout integration with subscription billing API routes" },
      { type: "Improved", description: "Security headers (X-Frame-Options, CSP-ready, Referrer-Policy) in next.config" },
      { type: "Improved", description: "Dynamic sitemap.xml generation covering all 7 industry verticals + new pages" },
      { type: "Improved", description: "OpenGraph image generation for social sharing preview cards" },
      { type: "Improved", description: "PublicNavbar 'Book A Demo' CTA now routes to /demo page instead of dead modal" },
      { type: "Fixed", description: "Pricing page CTAs now trigger Stripe checkout flow instead of /?mode=register" },
      { type: "Fixed", description: "Route-level loading skeleton placeholders for all major public pages" },
    ],
  },
  {
    version: "1.4.0",
    date: "November 15, 2026",
    tag: null,
    changes: [
      { type: "New", description: "Industry Sector Interactive Workbench with 6-tab deep-dive for all 7 industrial verticals" },
      { type: "New", description: "Integrations page with webhook dispatch simulator and category filter pills" },
      { type: "New", description: "Features page redesign with 4-column architecture showcase and 23-module audit matrix" },
      { type: "Improved", description: "Industries page with live search filter and AI failure modes section" },
      { type: "Improved", description: "PublicNavbar accessibility: aria-labels, semantic nav, keyboard navigation" },
      { type: "Improved", description: "PublicFooter dynamic copyright year and newsletter validation" },
      { type: "Fixed", description: "Pricing page nested <tr> invalid HTML resolved with Fragment wrapper" },
    ],
  },
  {
    version: "1.3.0",
    date: "October 28, 2026",
    tag: null,
    changes: [
      { type: "New", description: "Live AI Answer Engine Simulator with multi-engine support (SGE, Perplexity, ChatGPT)" },
      { type: "New", description: "DIN / JIS Standards Crosswalk module for global alloy equivalence tables" },
      { type: "New", description: "3D CAD exploded view schema inspector with STEP/IGES boundary parsing" },
      { type: "Improved", description: "AEO Citation Monitor now tracks share of voice across 3 LLM engines" },
    ],
  },
  {
    version: "1.2.0",
    date: "September 15, 2026",
    tag: null,
    changes: [
      { type: "New", description: "Transparent pricing page with annual/monthly toggle and ROI calculator" },
      { type: "New", description: "SCIM 2.0 enterprise user provisioning and deprovisioning dashboard" },
      { type: "New", description: "Publishing Kanban board with chief reliability engineer sign-off gate" },
      { type: "Improved", description: "Multi-tenant PostgreSQL Row-Level Security hardening" },
    ],
  },
  {
    version: "1.1.0",
    date: "August 20, 2026",
    tag: null,
    changes: [
      { type: "New", description: "Multi-brand domain manager with subdomain routing and rel=canonical" },
      { type: "New", description: "RFQ lead scoring dashboard with reverse-IP buyer intent discovery" },
      { type: "New", description: "Geographic Share of Voice tracker beta for regional market analysis" },
    ],
  },
  {
    version: "1.0.0",
    date: "July 1, 2026",
    tag: "Genesis",
    changes: [
      { type: "New", description: "Public launch with 7 pre-built industrial vertical taxonomies" },
      { type: "New", description: "AEO content engine with deterministic JSON-LD TechArticle syndication" },
      { type: "New", description: "Multi-tenant workspace architecture with SAML 2.0 SSO and Okta" },
      { type: "New", description: "23-module deep audit system for production-grade content verification" },
    ],
  },
];

function changeTypeBadge(type: string) {
  const styles: Record<string, string> = {
    New: "bg-emerald-950 text-emerald-400 border-emerald-800",
    Improved: "bg-sky-950 text-sky-400 border-sky-800",
    Fixed: "bg-amber-950 text-amber-400 border-amber-800",
    Security: "bg-red-950 text-red-400 border-red-800",
  };
  return styles[type] || "bg-slate-800 text-slate-400 border-slate-700";
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-14">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Engineering Release Log
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              ForgeFlow Changelog
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              New features, infrastructure improvements, and production fixes shipped by the ForgeFlow core engineering team.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-800" aria-hidden="true" />

            <div className="space-y-12">
              {CHANGELOG_ENTRIES.map((entry) => (
                <div key={entry.version} className="relative pl-12 sm:pl-16">
                  {/* Dot on timeline */}
                  <div className="absolute left-2.5 sm:left-4.5 top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-950" />

                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-black text-white font-mono">v{entry.version}</span>
                      <span className="text-xs text-slate-400 font-mono">{entry.date}</span>
                      {entry.tag && (
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                          {entry.tag}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-2.5">
                      {entry.changes.map((change, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                          <span
                            className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${changeTypeBadge(change.type)}`}
                          >
                            {change.type}
                          </span>
                          <span>{change.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4 pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              Want to test these features on your industrial catalog?
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20"
            >
              <span>Schedule Architecture Demo</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
