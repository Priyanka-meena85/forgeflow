"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { INDUSTRIAL_SECTORS } from "@/lib/industriesDirectory";

export function PublicFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(newsletterEmail.trim())) {
      setSubscribed(true);
    }
  }

  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-12 text-slate-600 font-humanist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-100">
          {/* Column 1: Brand & Enterprise Value */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo-icon.png"
                alt="ForgeFlow Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain shrink-0"
              />
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Forge<span className="text-sky-600">Flow</span>
                </span>
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  Enterprise AEO
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              The premier industrial answer engine optimization (AEO) and programmatic technical content engine. Certified zero-hallucination tolerances for manufacturing OEMs, distributors, and engineering service providers.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                SOC2 Type II Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ISO 27001 Ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                99.9% SLA Guarantee
              </span>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-900 mb-1.5">
                Industrial AEO Weekly Dispatch
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Get monthly zero-volume engineering search queries and algorithmic LLM citation breakdowns.
              </p>
              {subscribed ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <span className="css-icon-check text-emerald-600"></span>
                  <span>Subscribed! Check your inbox for the Q1 2026 Industrial Benchmark.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} aria-label="Industrial AEO newsletter subscription" className="flex gap-2 max-w-sm">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="engineer@manufacturing.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Platform Features */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Platform Features
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features#serp-simulator" className="hover:text-sky-600 transition">
                  AI SERP Simulator (Google &amp; Perplexity)
                </Link>
              </li>
              <li>
                <Link href="/features#deterministic-qa" className="hover:text-sky-600 transition">
                  Deterministic QA Studio
                </Link>
              </li>
              <li>
                <Link href="/features#schema-hub" className="hover:text-sky-600 transition">
                  AEO Schema Graph Hub
                </Link>
              </li>
              <li>
                <Link href="/features#cad-inspector" className="hover:text-sky-600 transition">
                  3D CAD Tolerance Inspector
                </Link>
              </li>
              <li>
                <Link href="/features#standards-crosswalk" className="hover:text-sky-600 transition">
                  DIN / JIS / ASTM Crosswalk
                </Link>
              </li>
              <li>
                <Link href="/features#headless-cms" className="hover:text-sky-600 transition">
                  1-Click Headless CMS Publisher
                </Link>
              </li>
              <li>
                <Link href="/features#dealer-syndication" className="hover:text-sky-600 transition">
                  Distributor Co-Marketing
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sky-600 font-bold hover:underline">
                  All 23 Modules &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Industrial Verticals */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Industrial Verticals
            </div>
            <ul className="space-y-2 text-xs">
              {INDUSTRIAL_SECTORS.slice(0, 6).map((sec) => (
                <li key={sec.slug}>
                  <Link href={`/industries/${sec.slug}`} className="hover:text-sky-600 transition">
                    {sec.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/industries" className="text-sky-600 font-bold hover:underline">
                  All 7 Sector Taxonomies &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Solutions & Enterprise */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Plans &amp; Integrations
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pricing" className="hover:text-sky-600 transition font-semibold text-slate-800">
                  Transparent Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-sky-600 transition">
                  WordPress VIP Integration
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-sky-600 transition">
                  Webflow CMS Integration
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-sky-600 transition">
                  Shopify B2B &amp; Hydrogen
                </Link>
              </li>
              <li>
                <Link href="/integrations#developer-api" className="hover:text-sky-600 transition">
                  Developer REST API &amp; Webhooks
                </Link>
              </li>
              <li>
                <Link href="/pricing#roi-calculator" className="hover:text-sky-600 transition">
                  Industrial ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/pricing#enterprise" className="hover:text-sky-600 transition">
                  Enterprise SAML &amp; SCIM
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div>
            &copy; {new Date().getFullYear()} ForgeFlow Systems Inc. All rights reserved. Industrial SEO &amp; AEO Content Engine.
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2">
            <Link href="/pricing" className="hover:text-slate-800 transition">
              Pricing
            </Link>
            <Link href="/features" className="hover:text-slate-800 transition">
              Features
            </Link>
            <Link href="/industries" className="hover:text-slate-800 transition">
              Industries
            </Link>
            <Link href="/integrations" className="hover:text-slate-800 transition">
              Integrations
            </Link>
            <Link href="/trust" className="hover:text-slate-800 transition font-medium text-slate-700">
              Trust &amp; Security
            </Link>
            <span className="hidden sm:inline">&bull;</span>
            <span className="text-[11px] font-mono text-slate-400">Pure Software SaaS • Zero Hardware</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
