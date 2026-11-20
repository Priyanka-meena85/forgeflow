"use client";

import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function IntegrationsPage() {
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
      authType: "Application Passwords / OAuth 2.0 Bearer Token",
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
      authType: "Webflow v2 OAuth Bearer Token / API Key",
    },
    {
      id: "shopify",
      title: "Shopify B2B & Hydrogen Headless Hub",
      category: "B2B E-Commerce",
      badge: "Wholesale Catalog",
      description: "Synchronize certified diagnostic guides directly with Shopify B2B wholesale product catalogs and Hydrogen storefronts, turning high-intent technical searches into immediate RFQ orders.",
      features: [
        "Metafield synchronization for certified tolerance limits",
        "Replacement part SKU deep-linking from 3D CAD models",
        "Wholesale customer tier pricing and request-for-quote button",
        "Hydrogen React server component hydration",
        "Automatic sitemap index pinging to Google Search Console",
      ],
      authType: "Shopify Admin GraphQL & REST Access Token",
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
    },
  ];

  const developerIntegrations = [
    {
      id: "developer-api",
      title: "Developer REST API v1 & Webhooks",
      category: "Developer Infrastructure",
      badge: "300 req/min",
      description: "Full programmatic access to ForgeFlow's deterministic generation engine, QA validation rules, and schema serializers. Ingest proprietary engineering manuals directly via CLI or CI/CD pipelines.",
      features: [
        "Sliding window rate limiter with real-time quota telemetry",
        "Cryptographically signed HMAC-SHA256 webhook payloads",
        "OpenAPI 3.1 & Postman collection specification",
        "Batch drafting endpoints with parallel async workers",
        "Sub-100ms response times on cached schema graph endpoints",
      ],
      authType: "API Key (ff_live_...) with IP Whitelisting",
    },
    {
      id: "sap-erp",
      title: "SAP & ERP Master Data Connector",
      category: "Enterprise ERP",
      badge: "BOM Sync",
      description: "Connect your enterprise ERP (SAP S/4HANA, NetSuite, Epicor) to pull live bill-of-materials (BOM), active machinery SKUs, and replacement part inventory directly into content generation.",
      features: [
        "Automated SKU verification preventing discontinued part citations",
        "Real-time distributor inventory status indicators",
        "OEM dealer pricing synchronization across territories",
        "ISO 9001 quality audit documentation trails",
        "Zero-latency read-only read replicas",
      ],
      authType: "SAP OData / RFC Secure Gateway",
    },
    {
      id: "step-cad",
      title: "STEP CAD 3D Geometry Extractor",
      category: "Engineering CAD",
      badge: "AP203 / AP214",
      description: "Upload raw STEP/STP 3D CAD assemblies (up to 50MB+) to extract volumetric geometries, subassembly hierarchies, and geometric dimensioning and tolerancing (GD&T) directly into schema.",
      features: [
        "Client-side edge presigned R2/S3 direct upload bypass",
        "Automated WebGL 360° exploded view canvas generation",
        "Subassembly part number and bolt torque extraction",
        "Direct export to Schema.org 3DModel specification",
        "Compatible with SolidWorks, Inventor, CATIA & Creo",
      ],
      authType: "Direct Presigned Upload Credentials",
    },
    {
      id: "slack-bot",
      title: "Slack & Microsoft Teams Review Bot",
      category: "Workflow & Governance",
      badge: "HITL Gate",
      description: "Human-in-the-loop review automation. Sends automated interactive Slack and Teams cards to Chief Reliability Engineers when articles require engineering tolerance sign-off.",
      features: [
        "1-Click approve or request revision buttons in Slack",
        "Instant notification on fluff sanitizer or tolerance violation",
        "Audit log recording of reviewer identity and timestamp",
        "Custom channel routing per industrial vertical",
        "Automated reminder pings for pending draft queues",
      ],
      authType: "Slack App Bot Token & Interactive Webhook",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      <PublicNavbar activeNav="integrations" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>ENTERPRISE CONNECTORS &amp; HEADLESS CMS HUB</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-humanist">
            Publish Directly to Your <br className="hidden sm:inline" />
            <span className="text-sky-600">Production Website &amp; CMS</span>
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
        </div>
      </section>

      {/* CMS Integrations Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold uppercase text-sky-700 tracking-wider">
            Direct 1-Click Publishing Connectors
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
            Headless &amp; Enterprise CMS Integrations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cmsIntegrations.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 space-y-4 scroll-mt-24"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  {item.badge}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-humanist">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[10.5px] font-mono font-bold uppercase text-slate-400">
                  Capabilities &amp; Automated Pipeline:
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
                <span>Auth: {item.authType.split("/")[0]}</span>
                <span className="text-emerald-700 font-bold">Status: Ready</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer & Enterprise Systems Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase text-purple-700 tracking-wider">
              Developer &amp; Infrastructure
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              APIs, CAD Geometry &amp; Enterprise Governance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {developerIntegrations.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 space-y-4 scroll-mt-24"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-humanist">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/80">
                  <div className="text-[10.5px] font-mono font-bold uppercase text-slate-400">
                    Technical Specifications:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {item.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <span className="css-icon-check text-purple-600 shrink-0 mt-0.5"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Protocol: {item.authType.split("/")[0]}</span>
                  <span className="text-purple-700 font-bold">Standard Spec</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black font-humanist">
            Need a Custom CMS Webhook or Enterprise SAP Connector?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Our engineering team builds custom integrations for enterprise customers within 5 business days, fully backed by our 99.9% uptime SLA.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-sky-600/30 cursor-pointer"
            >
              Start Free Trial &rarr;
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Review Enterprise Pricing
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
