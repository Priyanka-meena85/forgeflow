"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const handleSimulateWebhook = () => {
    setSimulatingWebhook(true);
    setWebhookStatus(null);
    setTimeout(() => {
      setSimulatingWebhook(false);
      setWebhookStatus("HTTP 200 OK • Payload dispatched to WordPress VIP REST API • Canonical & JSON-LD Injected in 142ms");
    }, 700);
  };

  const cmsIntegrations = [
    {
      id: "wordpress",
      title: "WordPress VIP & Enterprise REST API",
      category: "Headless CMS",
      badge: "1-Click Direct",
      description: "Direct bi-directional integration with WordPress REST API. Publishes full technical articles with automatic rel=\"canonical\" tag injection and Yoast/RankMath schema synchronization in under 3 seconds.",
      features: [
        "1-Click direct draft and live publish webhooks",
        "Automated rel=\"canonical\" primary authority tag injection",
        "Deterministic JSON-LD TechArticle & FAQPage script embed",
        "Preserves existing Gutenberg / Elementor custom layouts",
        "Live HTTP 200 URL health check verification",
      ],
      authType: "OAuth 2.0 Bearer Token / App Passwords",
      status: "Verified Connector",
    },
    {
      id: "webflow",
      title: "Webflow Collection API v2",
      category: "Headless CMS",
      badge: "Collection Sync",
      description: "Automated programmatic synchronization with Webflow CMS Collections. Maps equipment taxonomies, engineering failure modes, and tolerance crosswalk tables directly into Webflow custom fields.",
      features: [
        "Real-time item creation and immediate live staging deployment",
        "Multi-reference field mapping for industrial verticals",
        "Custom code embed injection for WebGL 3D CAD inspector",
        "Multi-site synchronization across brand subdomains",
        "Dynamic OpenGraph & Twitter card image generation",
      ],
      authType: "Webflow v2 Bearer Token",
      status: "Verified Connector",
    },
    {
      id: "shopify",
      title: "Shopify B2B & Hydrogen Headless Hub",
      category: "B2B E-Commerce & ERP",
      badge: "Wholesale Catalog",
      description: "Synchronize certified diagnostic guides directly with Shopify B2B wholesale product catalogs and Hydrogen storefronts, turning high-intent technical searches into immediate RFQ orders.",
      features: [
        "Metafield synchronization for certified tolerance limits",
        "Replacement part SKU deep-linking from 3D CAD models",
        "Wholesale customer tier pricing and request-for-quote button",
        "Hydrogen React server component hydration",
        "Automatic sitemap index pinging to Google Search Console",
      ],
      authType: "Shopify GraphQL Access Token",
      status: "Verified Connector",
    },
    {
      id: "contentful",
      title: "Contentful & Strapi Enterprise Mesh",
      category: "Headless CMS",
      badge: "API Mesh",
      description: "Seamless integration into enterprise headless content meshes. Pushes structured technical capsules into Contentful Content Types or Strapi collections with full audit trail logging.",
      features: [
        "Environment-specific staging (Draft, QA, Production)",
        "Rich text to Markdown and HTML AST parsing",
        "Automated asset ingestion into digital asset management (DAM)",
        "SCIM-aligned author attribution and sign-off stamping",
        "Webhook trigger on Chief Reliability Engineer approval",
      ],
      authType: "Content Management API (CMA) Token",
      status: "Verified Connector",
    },
    {
      id: "developer-api",
      title: "Developer REST API v1 & Webhooks",
      category: "Developer & Workflow",
      badge: "300 req/min",
      description: "Full programmatic access to ForgeFlow's deterministic generation engine, QA validation rules, and schema serializers. Ingest proprietary engineering manuals directly via CLI or CI/CD pipelines.",
      features: [
        "Sliding window rate limiter with real-time quota telemetry",
        "Cryptographically signed HMAC-SHA256 webhook payloads",
        "OpenAPI 3.1 & Postman collection specification",
        "Batch drafting endpoints with parallel async workers",
        "Sub-100ms response times on cached schema graph endpoints",
      ],
      authType: "API Key (ff_live_...) with IP Whitelist",
      status: "REST v1 Active",
    },
    {
      id: "sap-erp",
      title: "SAP S/4HANA & ERP Master Data Connector",
      category: "B2B E-Commerce & ERP",
      badge: "BOM Sync",
      description: "Connect your enterprise ERP (SAP S/4HANA, NetSuite, Epicor) to pull live bill-of-materials (BOM), active machinery SKUs, and replacement part inventory directly into content generation.",
      features: [
        "Automated SKU verification preventing discontinued part citations",
        "Real-time distributor inventory status indicators",
        "OEM dealer pricing synchronization across territories",
        "ISO 9001 quality audit documentation trails",
        "Zero-latency read-only read replicas",
      ],
      authType: "SAP OData / RFC Gateway",
      status: "ERP Bridge Ready",
    },
    {
      id: "step-cad",
      title: "STEP CAD 3D Geometry Extractor",
      category: "Developer & Workflow",
      badge: "AP203 / AP214",
      description: "Upload raw STEP/STP 3D CAD assemblies (up to 50MB+) to extract volumetric geometries, subassembly hierarchies, and geometric dimensioning and tolerancing (GD&T) directly into schema.",
      features: [
        "Client-side edge presigned R2/S3 direct upload bypass",
        "Automated WebGL 360° exploded view canvas generation",
        "Subassembly part number and bolt torque extraction",
        "Direct export to Schema.org 3DModel specification",
        "Compatible with SolidWorks, Inventor, CATIA & Creo",
      ],
      authType: "Presigned S3/R2 Endpoint",
      status: "CAD Parser Ready",
    },
    {
      id: "slack-bot",
      title: "Slack & Microsoft Teams Review Bot",
      category: "Developer & Workflow",
      badge: "HITL Gate",
      description: "Human-in-the-loop review automation. Sends automated interactive Slack and Teams cards to Chief Reliability Engineers when articles require engineering tolerance sign-off.",
      features: [
        "1-Click approve or request revision buttons in Slack",
        "Instant notification on fluff sanitizer or tolerance violation",
        "Audit log recording of reviewer identity and timestamp",
        "Custom channel routing per industrial vertical",
        "Automated reminder pings for pending draft queues",
      ],
      authType: "Slack Bot Token & Interactive Webhook",
      status: "Bot Online",
    },
  ];

  const categories = ["All", "Headless CMS", "B2B E-Commerce & ERP", "Developer & Workflow"];

  const filteredIntegrations = selectedCategory === "All"
    ? cmsIntegrations
    : cmsIntegrations.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      <PublicNavbar activeNav="integrations" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>ENTERPRISE CONNECTORS &amp; HEADLESS CMS HUB</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight font-humanist">
            Publish Directly to Your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 bg-clip-text text-transparent">
              Production Website &amp; CMS
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Never copy-paste HTML again. ForgeFlow connects directly with your existing WordPress VIP, Webflow, Shopify B2B, or headless stack with automated canonical tags and live URL health verification.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Connect Your CMS in 60 Seconds &rarr;
            </Link>
            <Link
              href="/features"
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Explore 1-Click Publishing Feature
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Webhook Simulator Strip */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                Interactive Webhook Dispatch Simulator
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Test how ForgeFlow pushes approved engineering articles with JSON-LD schema to your CMS endpoint in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSimulateWebhook}
              disabled={simulatingWebhook}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-mono font-bold transition cursor-pointer flex items-center gap-2"
            >
              {simulatingWebhook ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>Dispatching Webhook...</span>
                </>
              ) : (
                <>
                  <span className="css-icon-launch"></span>
                  <span>Simulate 1-Click Dispatch &rarr;</span>
                </>
              )}
            </button>
          </div>
        </div>

        {webhookStatus && (
          <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center justify-between animate-fade-in">
            <span className="font-semibold">{webhookStatus}</span>
            <button
              type="button"
              onClick={() => setWebhookStatus(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </section>

      {/* Integrations Grid */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-humanist">
              Connected Infrastructure ({filteredIntegrations.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Production connectors with verified automated sync pipelines
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Bi-directional Webhooks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIntegrations.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-200 space-y-4 scroll-mt-24 group hover:border-sky-300"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  {item.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {item.status}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition font-humanist">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[10.5px] font-mono font-bold uppercase text-slate-400">
                  Automated Pipeline Capabilities:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {item.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Auth: {item.authType}</span>
                <span className="text-sky-700 font-bold group-hover:underline">
                  Configure Hook &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REST API Quickstart Terminal */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-purple-700 tracking-wider">
              Developer Quickstart
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Programmatic Content Ingestion API
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Automate drafting from your CI/CD pipelines, ERP systems, or custom internal engineering portals.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-5 font-mono text-xs text-slate-200 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="ml-2 font-bold text-slate-300">curl -X POST https://api.forgeflow.io/api/v1/content</span>
              </span>
              <span className="text-sky-400">Rate Limit: 300 req/min</span>
            </div>
            <pre className="text-sky-300 text-[11px] overflow-x-auto leading-relaxed">
{`curl -X POST https://api.forgeflow.io/api/v1/content \\
  -H "Authorization: Bearer ff_live_99a8b1c2..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "vertical": "hvac-commercial-refrigeration",
    "equipment": "Commercial RTU Scroll Compressor",
    "standard": "ASHRAE 90.1-2025",
    "targetQuery": "RTU Low Delta-T Chilled Water Loop Troubleshooting",
    "publishWebhook": "https://oem-brand.com/wp-json/wp/v2/posts"
  }'`}
            </pre>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Response: HTTP 200 OK • 1,480 Words Generated • 0 Fluff Words Detected</span>
              <span className="text-emerald-400">Execution Time: 342ms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>ENTERPRISE CMS INTEGRATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-humanist">
            Ready to Automate Your Technical Publishing Pipeline?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Connect your website in minutes. Zero code refactoring, zero database migrations.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-sky-600/30 cursor-pointer"
            >
              Start Free Integration &rarr;
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
