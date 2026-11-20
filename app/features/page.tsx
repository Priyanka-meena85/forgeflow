"use client";

import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      <PublicNavbar activeNav="features" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>ENTERPRISE ARCHITECTURE &amp; 23 MODULAR SUITES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-humanist">
            Engineered for <br className="hidden sm:inline" />
            <span className="text-sky-600">Zero-Hallucination AEO</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Horizontal AI tools write consumer fluff that plant engineers reject. ForgeFlow delivers deterministic engineering tolerances, automated 3D CAD schema, and instant headless publishing.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Test Drive Platform &rarr;
            </Link>
            <Link
              href="/pricing"
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              View Transparent Plans
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Architectural Pillars */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Pillar 1: AI Search Architecture */}
        <div id="serp-simulator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 uppercase">
              Pillar 01 • Search Simulation
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Live AI Answer Engine Simulator (Google SGE, Perplexity &amp; ChatGPT)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When industrial maintenance directors search for fault code resolutions, AI search engines cite concise 45-word direct answer capsules. ForgeFlow embeds a real-time simulator right in your drafting workspace so you preview exact citation cards before publishing.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Google AI Overviews:</strong> Previews how your 45-word capsule anchors the top AI summary box.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Perplexity Pro Citations:</strong> Simulates tabular competitive tolerance comparisons.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>ChatGPT Search Quotes:</strong> Verifies direct quote eligibility with verified brand domain attribution.</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400 font-bold">Simulated Prompt:</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                98% Citation Probability
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 text-slate-300">
              &quot;How to prevent commercial RTU compressor flooded starts during low ambient drops?&quot;
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>Google SGE Direct Citation Card:</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-slate-300 font-sans">
                &quot;Compressor flooded starts in commercial RTUs are eliminated by maintaining crankcase heater sump temperature at minimum 20°F (11.1°C) above saturated suction temperature, paired with automatic pump-down solenoid cycles calibrated to ASHRAE 90.1-2025 requirements.&quot;
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Source: accudrive.io/specs/rtu-compressor</span>
                <span className="text-emerald-400">Verified Citation #1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Deterministic QA & Standards Crosswalk */}
        <div id="deterministic-qa" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 font-humanist text-sm">Deterministic Validation Studio</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono text-[10px] font-bold">
                100% SPEC VERIFIED
              </span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Fluff Word Sanitizer</div>
                  <div className="text-[10px] text-slate-500">Bans marketing clichés (&quot;delve&quot;, &quot;tapestry&quot;, &quot;game-changer&quot;)</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  0 Fluff Found
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Word Count Gatekeeper</div>
                  <div className="text-[10px] text-slate-500">Requires minimum 1,200 words with dense spec tables</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  1,480 Words (Pass)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Global Standards Crosswalk</div>
                  <div className="text-[10px] text-slate-500">German DIN EN 10083-3 &amp; Japanese JIS G4053 auto-conversion</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800">
                  Localized (3 Langs)
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
              Pillar 02 • Closed-Loop QA
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Deterministic Engineering QA Studio &amp; Tolerance Rules
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In manufacturing, hallucinations create physical safety hazards and liability claims. ForgeFlow enforces a strict closed-loop validation engine that verifies every engineering tolerance against official industrial standards before a single word goes live.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Zero-Hallucination Gating:</strong> Mathematical bounds checking prevents impossible operating parameters.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>1-Click Multi-Lingual Crosswalk:</strong> Automatically crosswalks US specifications (e.g. AISI 4140, 3,000 PSI) to German DIN (42CrMo4, 206.8 bar) and Japanese JIS (SCM440, 20.7 MPa).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Role-Based Sign-Off Gate:</strong> Requires Chief Reliability Engineer digital stamp to approve articles for release.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pillar 3: 3D CAD Component Inspector */}
        <div id="cad-inspector" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
              Pillar 03 • Interactive 3D WebGL
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Interactive 3D CAD Component Inspector (Embeddable WebGL)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Google SGE and Perplexity give the highest authority score to articles containing interactive engineering components. ForgeFlow embeds lightweight 360° exploded view 3D inspectors directly inside published articles so plant engineers can explore every bearing, seal, and torque spec in their browser.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>STEP CAD File Ingestion:</strong> Automatically extracts AP203/AP214 geometric parameters into JSON-LD schema.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Component Click Tooltips:</strong> Hover over any subassembly to view verified torque limits, material grades, and OEM replacement SKUs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Zero Plugins Needed:</strong> Runs pure Canvas/WebGL rendering with fast sub-second load times on mobile and desktop.</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300">Interactive 3D Model Viewer</span>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                Rotatable 360°
              </span>
            </div>
            <div className="h-48 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 border-2 border-dashed border-sky-500/40 rounded-full animate-spin"></div>
              </div>
              <div className="text-center z-10 space-y-1">
                <span className="css-icon-box text-3xl text-sky-400 block mx-auto"></span>
                <span className="text-xs font-bold text-slate-200">AccuDrive SV-5000 Die Assembly</span>
                <span className="text-[10px] font-mono text-slate-400 block">Click component to inspect tolerances</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-500 block">Spindle Torque:</span>
                <span className="font-bold text-white">42.0 Nm ± 1.5</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-500 block">Alloy Grade:</span>
                <span className="font-bold text-white">AISI 4140 / 42CrMo4</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-500 block">OEM Part SKU:</span>
                <span className="font-bold text-emerald-400">OEM-YOYCLV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 4: Direct 1-Click Headless CMS Publishing */}
        <div id="headless-cms" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 font-humanist text-sm">Connected CMS Channels</span>
              <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-mono text-[10px] font-bold">
                LIVE WEBHOOK SYNC
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="css-icon-launch text-sky-600"></span>
                  <div>
                    <div className="font-bold text-slate-800">WordPress VIP REST API</div>
                    <div className="text-[10px] text-slate-500">Automated post drafting, Yoast/RankMath schema injection</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="css-icon-grid text-sky-600"></span>
                  <div>
                    <div className="font-bold text-slate-800">Webflow Collection API v2</div>
                    <div className="text-[10px] text-slate-500">Custom multi-reference field mapping &amp; live slug publish</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="css-icon-card text-sky-600"></span>
                  <div>
                    <div className="font-bold text-slate-800">Shopify B2B / Hydrogen</div>
                    <div className="text-[10px] text-slate-500">Wholesale equipment catalog metafield &amp; tech spec sync</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Pillar 04 • Instant Distribution
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
                <span><strong>Instant rel=&quot;canonical&quot; Injection:</strong> Automatically configures primary domain authority across distributor networks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Live URL Health Monitoring:</strong> Pings production HTTP status to verify the page is indexable by Googlebot.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                <span><strong>Multi-Brand Co-Marketing:</strong> Push customized versions to authorized dealer subdomains without duplicate content penalties.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>EXPERIENCE THE FULL ENTERPRISE SUITE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-humanist">
            Ready to Turn Engineering Specifications Into Revenue?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join leading industrial OEMs who have displaced competitor legacy catalogs in Google AI Overviews and Perplexity.
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
