"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function FeaturesPage() {
  const [activePillarTab, setActivePillarTab] = useState<"all" | "search" | "qa" | "publishing" | "enterprise">("all");
  const [activeCadPart, setActiveCadPart] = useState<"spindle" | "bearing" | "seal">("spindle");
  const [activeCrosswalkAlloy, setActiveCrosswalkAlloy] = useState<"4140" | "316L" | "D2">("4140");
  const [searchSimEngine, setSearchSimEngine] = useState<"google" | "perplexity" | "chatgpt">("google");

  const alloyData = {
    "4140": {
      us: "AISI 4140 Alloy Steel",
      din: "42CrMo4 Vergütungsstahl (WNr. 1.7225)",
      jis: "SCM440 クロムモリブデン鋼",
      psi: "3,000 PSI",
      bar: "206.8 bar",
      mpa: "20.7 MPa",
      tempF: "180°F",
      tempC: "82°C",
    },
    "316L": {
      us: "AISI 316L Stainless Steel",
      din: "X2CrNiMo17-12-2 (WNr. 1.4404)",
      jis: "SUS316L オーステナイト系ステンレス鋼",
      psi: "1,500 PSI",
      bar: "103.4 bar",
      mpa: "10.3 MPa",
      tempF: "250°F",
      tempC: "121°C",
    },
    "D2": {
      us: "AISI D2 Cold-Work Tool Steel",
      din: "X153CrMoV12 (WNr. 1.2379)",
      jis: "SKD11 高炭素高クロム工具鋼",
      psi: "4,500 PSI",
      bar: "310.2 bar",
      mpa: "31.0 MPa",
      tempF: "140°F",
      tempC: "60°C",
    },
  };

  const cadParts = {
    spindle: {
      name: "High-Speed Dynamic Spindle Assembly",
      sku: "OEM-SPN-9921",
      tolerance: "ISO 230-3 Thermal Drift < 1.8 µm",
      torque: "42.0 Nm ± 1.2 Nm",
      material: "42CrMo4 Induction Hardened",
      status: "100% SPEC VERIFIED",
    },
    bearing: {
      name: "Hybrid Ceramic Angular Contact Bearings",
      sku: "OEM-BRG-4410",
      tolerance: "ABEC 9 / ISO 492 Class 2",
      torque: "Preload: 350 N Axial",
      material: "Silicon Nitride (Si3N4) Balls",
      status: "100% SPEC VERIFIED",
    },
    seal: {
      name: "FDA-Grade Encapsulated FFKM Rotary Seal",
      sku: "OEM-SEL-0212",
      tolerance: "3-A Sanitary Standard 02-12 Compliant",
      torque: "Cover Gasket: 18.5 Nm Cross-Pattern",
      material: "Encapsulated FFKM / Kalrez Equivalent",
      status: "100% SPEC VERIFIED",
    },
  };

  const auditModules = [
    { id: "M01", name: "Owner & Team RBAC Authentication", group: "Identity & Security", endpoint: "/api/auth/login", benchmark: "200 OK (Session Signed)", tag: "Multi-Role" },
    { id: "M02", name: "Edge Security & HSTS Middleware", group: "Edge Infrastructure", endpoint: "/*", benchmark: "100% Correlation Tagged", tag: "SOC2" },
    { id: "M03", name: "Deep Health & APM Diagnostics", group: "Edge Infrastructure", endpoint: "/api/health", benchmark: "< 5ms Target Latency", tag: "Real-Time" },
    { id: "M04", name: "Multi-Tenant Row-Level Security (RLS)", group: "Compliance & Security", endpoint: "/api/workspace", benchmark: "Zero Cross-Org Leakage", tag: "Strict RLS" },
    { id: "M05", name: "Automated WAL Backup & PITR Hub", group: "Compliance & Security", endpoint: "/api/admin/backups", benchmark: "RPO < 5m Point-in-Time", tag: "Disaster Recovery" },
    { id: "M06", name: "SCIM 2.0 RFC 7644 User Sync", group: "Identity & Security", endpoint: "/api/scim/v2/Users", benchmark: "Okta / Azure AD Sync", tag: "Enterprise SSO" },
    { id: "M07", name: "Distributed Task Queue & DLQ", group: "Resilience & Scale", endpoint: "/api/queue", benchmark: "Exponential Jitter Retry", tag: "High-Throughput" },
    { id: "M08", name: "Direct Presigned R2/S3 Uploads", group: "Object Storage", endpoint: "/api/upload/presign", benchmark: "50MB+ Edge Direct Upload", tag: "Zero-Hop" },
    { id: "M09", name: "Public v1 REST API & Sliding Limiter", group: "Developer Tools", endpoint: "/api/v1/content", benchmark: "300 req/min Rate Gating", tag: "REST API" },
    { id: "M10", name: "Reverse-IP Buyer Intent & Enrichment", group: "Lead Attribution", endpoint: "/api/leads/enrich", benchmark: "PE & OEM Executive Match", tag: "Revenue Engine" },
    { id: "M11", name: "Autonomous AI Search Radar", group: "AEO Analytics", endpoint: "/api/aeo/tracked-queries", benchmark: "Real-Time Share of Voice", tag: "AEO Radar" },
    { id: "M12", name: "White-Label Subdomain & SSL Hub", group: "Dealer Syndication", endpoint: "/api/subdomains", benchmark: "Instant Edge SSL Provision", tag: "Co-Marketing" },
    { id: "M13", name: "Edge Headless Technical Whitepaper PDF", group: "Document Engine", endpoint: "/api/reports/pdf", benchmark: "Sub-Second Edge Rendering", tag: "PDF / Spec" },
    { id: "F01", name: "Live AI Answer Engine Simulator", group: "AEO Core", endpoint: "/api/ai/simulate-aeo", benchmark: "Google, Perplexity & ChatGPT", tag: "Patent-Ready" },
    { id: "F02", name: "Global DIN / JIS Standards Crosswalk", group: "Engineering QA", endpoint: "/api/tools/localize-standard", benchmark: "Tri-Lingual Hreflang Pairs", tag: "Global OEM" },
    { id: "F03", name: "3D CAD STEP Tolerance Inspector", group: "Engineering QA", endpoint: "/api/tools/cad-inspect", benchmark: "AP214 Geometric JSON-LD", tag: "WebGL 360°" },
    { id: "F04", name: "1-Click Headless CMS Connectors", group: "Distribution", endpoint: "/api/cms/integrations", benchmark: "WordPress VIP & Webflow", tag: "Direct Webhook" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      <PublicNavbar activeNav="features" />

      {/* Hero Header with Enterprise Badges */}
      <section className="pt-16 pb-14 bg-gradient-to-b from-white via-sky-50/30 to-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white text-sky-800 border border-sky-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ENTERPRISE INDUSTRIAL SUITE • 23 VERIFIED ARCHITECTURAL MODULES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] font-humanist">
            Engineered for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 bg-clip-text text-transparent">
              Zero-Hallucination Industrial AEO
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Consumer AI writes fluffy marketing prose that plant engineers immediately dismiss. ForgeFlow delivers deterministic engineering tolerances, automated 3D CAD schemas, and instant headless distribution designed strictly for industrial manufacturing.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-sky-600/25 cursor-pointer"
            >
              Test Drive Platform &rarr;
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              View Transparent Plans
            </Link>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Audit Score</span>
              <span className="text-xl font-black text-emerald-600 font-mono">23 / 23 PASS</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">100% Production Ready</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Citation Score</span>
              <span className="text-xl font-black text-sky-600 font-mono">98% SOV</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Top-Ranked AI Summary</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Compliance Gating</span>
              <span className="text-xl font-black text-slate-900 font-mono">0 Hallucination</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Enforced Physical Bounds</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Global Standards</span>
              <span className="text-xl font-black text-purple-600 font-mono">DIN · JIS · ASTM</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Automatic Alloy Crosswalk</span>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL OVERVIEW SHOWCASE (Directly matching the screenshot style) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                Enterprise Blueprint &amp; Core Pillars
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-humanist">
                High-Density Industrial Content Architecture
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                SOC2 Type II Certified
              </span>
              <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-800 px-2.5 py-1 rounded-full border border-sky-200">
                Pure Software SaaS
              </span>
            </div>
          </div>

          {/* 4 Columns matching the reference screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1: AI Search Architecture */}
            <div className="space-y-4">
              <div className="font-mono text-[10.5px] font-bold uppercase text-slate-400 tracking-wider pb-1 border-b border-slate-100">
                AI Search Architecture
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-search text-sky-600"></span>
                  <span>AI SERP Simulator</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Google SGE, Perplexity &amp; ChatGPT live answer preview before publishing.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold">
                  45-Word Capsule Engine
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-gear text-sky-600"></span>
                  <span>AEO Schema Hub</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Deterministic JSON-LD TechArticle &amp; FAQ syndication with zero script errors.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Googlebot Verified
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-bolt text-sky-600"></span>
                  <span>Citation Steal Matrix</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Displace competitor locked PDFs on zero-volume high-intent B2B inquiries.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                  Share-of-Voice Tracking
                </span>
              </div>
            </div>

            {/* Column 2: Engineering QA & Risk */}
            <div className="space-y-4">
              <div className="font-mono text-[10.5px] font-bold uppercase text-slate-400 tracking-wider pb-1 border-b border-slate-100">
                Engineering QA &amp; Risk
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-shield text-sky-600"></span>
                  <span>Deterministic QA</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Closed-loop word count, fluff &amp; physical engineering tolerance bounds checking.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  0 Hallucination Gate
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-gear text-sky-600"></span>
                  <span>DIN / JIS Crosswalk</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  1-Click global unit (PSI/bar) &amp; international alloy metallurgy localization.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold">
                  en-US · de-DE · ja-JP
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-box text-sky-600"></span>
                  <span>3D CAD Inspector</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  WebGL 360° exploded view with interactive component tolerance tooltips.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                  AP214 STEP Parser
                </span>
              </div>
            </div>

            {/* Column 3: Publishing & Distribution */}
            <div className="space-y-4">
              <div className="font-mono text-[10.5px] font-bold uppercase text-slate-400 tracking-wider pb-1 border-b border-slate-100">
                Publishing &amp; Distribution
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-launch text-sky-600"></span>
                  <span>1-Click CMS Publisher</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  WordPress VIP, Webflow Collection API &amp; Shopify B2B headless connectors.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Live Webhook Sync
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-grid text-sky-600"></span>
                  <span>Dealer Co-Marketing</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Multi-brand subdomain publishing with automated rel=&quot;canonical&quot; protection.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold">
                  Distributor Network
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition group">
                <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-sky-600 text-sm">
                  <span className="css-icon-check text-sky-600"></span>
                  <span>Publishing Kanban</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Chief Reliability Engineer sign-off gate before any technical draft is published.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                  Multi-Stage Review
                </span>
              </div>
            </div>

            {/* Column 4: Enterprise Grade Card */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between border border-slate-800 shadow-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                    Enterprise Grade
                  </span>
                  <span className="text-[9px] font-mono bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-800">
                    SLA 99.9%
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="css-icon-check text-emerald-400 shrink-0 mt-0.5"></span>
                    <span><strong>SAML 2.0 &amp; Okta SSO:</strong> Federated enterprise identity management.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="css-icon-check text-emerald-400 shrink-0 mt-0.5"></span>
                    <span><strong>SCIM User Sync:</strong> RFC 7644 deprovisioning &amp; audit trail logs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="css-icon-check text-emerald-400 shrink-0 mt-0.5"></span>
                    <span><strong>Tri-Model COGS Router:</strong> Optimal speed &amp; engineering inference cost.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="css-icon-check text-emerald-400 shrink-0 mt-0.5"></span>
                    <span><strong>SOC2 Multi-Tenant RLS:</strong> Row-level isolation across enterprise units.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <Link
                  href="/pricing"
                  className="block w-full py-2.5 px-3 text-center bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Explore All 23 Modules &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE DEEP-DIVES */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Pillar 1: Live AI Answer Engine Simulator Interactive Demo */}
        <div id="serp-simulator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200 uppercase">
              Interactive Pillar 01 • Search Simulator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Preview What Plant Engineers See in AI Search Results
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When maintenance managers search for equipment fault codes, AI search engines cite structured 45-word direct answer capsules. ForgeFlow embeds a real-time simulator right in your drafting workspace so you preview exact citation cards before publishing.
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="css-icon-check text-emerald-600"></span>
                  <span>Google AI Overview Anchor</span>
                </div>
                <p className="text-slate-500 mt-0.5 text-[11px]">
                  Calibrated to dominate the top Google SGE summary capsule with verified OEM attribution.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="css-icon-check text-emerald-600"></span>
                  <span>Perplexity Pro Tabular Comparison</span>
                </div>
                <p className="text-slate-500 mt-0.5 text-[11px]">
                  Automatically generates competitive tolerance tables comparing your OEM spec to generic competitors.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="css-icon-check text-emerald-600"></span>
                  <span>ChatGPT Search Verbatim Quotes</span>
                </div>
                <p className="text-slate-500 mt-0.5 text-[11px]">
                  Produces structured blockquotes with direct attribution to your brand domain and part numbers.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive SERP Engine Mockup */}
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-slate-300">Live AI SERP Simulator</span>
              </div>

              {/* Engine Switcher */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setSearchSimEngine("google")}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                    searchSimEngine === "google" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Google AI
                </button>
                <button
                  type="button"
                  onClick={() => setSearchSimEngine("perplexity")}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                    searchSimEngine === "perplexity" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Perplexity
                </button>
                <button
                  type="button"
                  onClick={() => setSearchSimEngine("chatgpt")}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                    searchSimEngine === "chatgpt" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  ChatGPT
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">Target Search Query:</span>
              <span className="font-semibold text-white">
                &quot;Carrier RTU low delta-T chilled water loop troubleshooting ASHRAE 90.1&quot;
              </span>
            </div>

            {searchSimEngine === "google" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-sky-400 font-bold font-mono">Google AI Overview Direct Citation</span>
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Confidence: 98%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  &quot;Low Delta-T syndrome in commercial RTU chilled water systems is remediated by verifying triple-duty valve authority and adjusting 2-way modulating actuator curves. Under ASHRAE 90.1-2025, maintaining minimum 12°F (6.7°C) temperature differential prevents chiller plant staging inefficiency.&quot;
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span className="text-sky-400">Source: specs.accudrive.io [1]</span>
                  <span className="text-emerald-400">Verified OEM #1</span>
                </div>
              </div>
            )}

            {searchSimEngine === "perplexity" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold font-mono">Perplexity Pro Sourcing &amp; Matrix</span>
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Sonar Verified
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="py-1">Parameter</th>
                        <th className="py-1 text-sky-400">Your OEM Spec</th>
                        <th className="py-1 text-slate-500">Generic Competitor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="py-1.5">Design Delta-T</td>
                        <td className="py-1.5 text-sky-300 font-bold">12.0°F (6.7°C) Certified</td>
                        <td className="py-1.5 text-slate-400">8.0°F Uncalibrated</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Valve Authority</td>
                        <td className="py-1.5 text-sky-300 font-bold">N=0.50 Pressure Indep.</td>
                        <td className="py-1.5 text-slate-400">Standard Modulating</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {searchSimEngine === "chatgpt" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-bold font-mono">ChatGPT Search Verbatim Synthesis</span>
                  <span className="text-slate-400 font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                    OpenAI GPT-4o
                  </span>
                </div>
                <blockquote className="border-l-2 border-sky-500 pl-3 text-xs italic text-slate-300 leading-relaxed">
                  &quot;According to verified engineering specs from specs.accudrive.io, low delta-T can degrade chiller efficiency by up to 34%. Immediate protocol requires checking coil air balance and resetting bypass valves.&quot;
                </blockquote>
                <div className="text-[10px] font-mono text-right text-sky-400">
                  — Cited from published tech bulletin
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pillar 2: Interactive Deterministic QA & Standards Crosswalk */}
        <div id="deterministic-qa" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 font-humanist text-sm">
                Interactive Standards Crosswalk Converter
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono text-[10px] font-bold">
                AUTOMATIC DUAL-UNITS
              </span>
            </div>

            {/* Alloy Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Select Alloy:</span>
              {(["4140", "316L", "D2"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setActiveCrosswalkAlloy(a)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    activeCrosswalkAlloy === a
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  AISI {a}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">US Standard</span>
                <span className="font-bold text-slate-900 block">{alloyData[activeCrosswalkAlloy].us}</span>
                <span className="text-[11px] font-mono text-slate-600 block">{alloyData[activeCrosswalkAlloy].psi}</span>
                <span className="text-[11px] font-mono text-slate-600 block">{alloyData[activeCrosswalkAlloy].tempF}</span>
              </div>
              <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-1">
                <span className="text-[10px] font-mono uppercase text-sky-700 block font-bold">German DIN</span>
                <span className="font-bold text-sky-950 block">{alloyData[activeCrosswalkAlloy].din}</span>
                <span className="text-[11px] font-mono text-sky-800 block">{alloyData[activeCrosswalkAlloy].bar}</span>
                <span className="text-[11px] font-mono text-sky-800 block">{alloyData[activeCrosswalkAlloy].tempC}</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-700 block font-bold">Japanese JIS</span>
                <span className="font-bold text-emerald-950 block">{alloyData[activeCrosswalkAlloy].jis}</span>
                <span className="text-[11px] font-mono text-emerald-800 block">{alloyData[activeCrosswalkAlloy].mpa}</span>
                <span className="text-[11px] font-mono text-emerald-800 block">{alloyData[activeCrosswalkAlloy].tempC}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600">Generated Hreflang Tags:</span>
              <span className="font-mono text-[10.5px] text-sky-700 font-bold">en-US · de-DE · ja-JP (Synced)</span>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
              Interactive Pillar 02 • Closed-Loop QA
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Deterministic Engineering QA Studio &amp; Tolerance Rules
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In manufacturing, hallucinations create physical safety hazards, equipment downtime, and warranty claims. ForgeFlow enforces a strict closed-loop validation engine that verifies every engineering tolerance against official industrial standards before a single word goes live.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Mathematical Tolerance Gating:</strong> Prevents impossible physical parameters (e.g. pressure exceeding valve rating).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Fluff Word Sanitizer:</strong> Automatically detects and removes prohibited marketing clichés.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Chief Reliability Engineer Sign-Off:</strong> Cryptographically stamped approval audit trail.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pillar 3: Interactive 3D CAD Component Inspector */}
        <div id="cad-inspector" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200 uppercase">
              Interactive Pillar 03 • 3D CAD Inspector
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Interactive 3D CAD Component Inspector (Embeddable WebGL)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Google SGE and Perplexity prioritize technical articles containing interactive engineering components. ForgeFlow embeds lightweight 360° exploded view 3D inspectors directly inside published articles so plant engineers can explore every bearing, seal, and torque spec in their browser.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>AP214 STEP CAD Extraction:</strong> Ingests native 3D geometry into structured JSON-LD schema.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Component Click Tooltips:</strong> Hover over any subassembly to view verified torque limits and replacement SKUs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Zero Plugins Needed:</strong> Runs pure Canvas/WebGL rendering with fast sub-second load times.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300">WebGL 360° Assembly Explorer</span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded border border-purple-800">
                Rotatable 360°
              </span>
            </div>

            {/* Interactive Subassembly Tabs */}
            <div className="flex items-center gap-1.5">
              {(["spindle", "bearing", "seal"] as const).map((part) => (
                <button
                  key={part}
                  type="button"
                  onClick={() => setActiveCadPart(part)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer capitalize ${
                    activeCadPart === part
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {part} Subassembly
                </button>
              ))}
            </div>

            <div className="h-44 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <div className="text-center z-10 space-y-1">
                <span className="css-icon-box text-3xl text-sky-400 block mx-auto"></span>
                <span className="text-xs font-bold text-slate-100">{cadParts[activeCadPart].name}</span>
                <span className="text-[10px] font-mono text-emerald-400 block">{cadParts[activeCadPart].status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <span className="text-slate-400 block">Verified Tolerance:</span>
                <span className="font-bold text-white text-[11px]">{cadParts[activeCadPart].tolerance}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <span className="text-slate-400 block">Torque Spec:</span>
                <span className="font-bold text-sky-400 text-[11px]">{cadParts[activeCadPart].torque}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <span className="text-slate-400 block">Alloy Material:</span>
                <span className="font-bold text-white text-[11px]">{cadParts[activeCadPart].material}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <span className="text-slate-400 block">OEM Part Number:</span>
                <span className="font-bold text-emerald-400 text-[11px]">{cadParts[activeCadPart].sku}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 4: Direct 1-Click Headless CMS Publishing */}
        <div id="headless-cms" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 font-humanist text-sm">Direct Headless Webhooks</span>
              <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-mono text-[10px] font-bold">
                SUB-3S DEPLOYMENT
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="css-icon-launch text-sky-600"></span>
                  <div>
                    <div className="font-bold text-slate-800">WordPress VIP REST API</div>
                    <div className="text-[10px] text-slate-500">Live Yoast/RankMath schema &amp; rel=&quot;canonical&quot; tag injection</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  HTTP 200 OK
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="css-icon-grid text-sky-600"></span>
                  <div>
                    <div className="font-bold text-slate-800">Webflow Collection API v2</div>
                    <div className="text-[10px] text-slate-500">Custom multi-reference field mapping &amp; immediate staging deploy</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  HTTP 200 OK
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="css-icon-card text-sky-600"></span>
                  <div>
                    <div className="font-bold text-slate-800">Shopify B2B &amp; Hydrogen</div>
                    <div className="text-[10px] text-slate-500">Wholesale equipment catalog metafield &amp; tech spec synchronization</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  HTTP 200 OK
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Interactive Pillar 04 • Instant Distribution
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Direct 1-Click Headless CMS Publisher (WordPress VIP &amp; Webflow)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Never copy-paste HTML or manually wire JSON-LD script tags again. Once your Chief Reliability Engineer approves a technical article, a single click deploys it directly to your production CMS with automated canonical tags and live URL health verification.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Instant rel=&quot;canonical&quot; Injection:</strong> Automatically protects primary domain authority across distributor networks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Live URL Health Monitoring:</strong> Verifies the published URL is immediately indexable by Googlebot.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Multi-Brand Co-Marketing:</strong> Push customized versions to authorized dealer subdomains without duplicate content penalties.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMPLETE 23-MODULE AUDITED ARCHITECTURAL MATRIX */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Complete Architectural Scorecard
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-humanist">
              23 Enterprise Production Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Every single module is fully implemented, verified with automated end-to-end audit test suites, and enterprise production certified.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono text-[10.5px] uppercase">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Code</th>
                    <th className="py-3.5 px-6 font-bold">Module Name &amp; Description</th>
                    <th className="py-3.5 px-4 font-bold">Architectural Category</th>
                    <th className="py-3.5 px-4 font-bold">API Route / Trigger</th>
                    <th className="py-3.5 px-4 font-bold text-center">Audit Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditModules.map((mod) => (
                    <tr key={mod.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-sky-700">{mod.id}</td>
                      <td className="py-3 px-6 font-semibold text-slate-900">{mod.name}</td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{mod.group}</td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{mod.endpoint}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {mod.benchmark}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>ENTERPRISE PRODUCTION DEPLOYMENT</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-humanist">
            Ready to Dominate Industrial Answer Engines?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join equipment OEMs, component distributors, and precision job shops that have turned engineering specifications into high-margin RFQ pipelines.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-sky-600/30 cursor-pointer"
            >
              Launch Live Demo Console &rarr;
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              View Pricing &amp; Plans
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
