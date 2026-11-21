"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import { PricingCTAButton } from "@/components/PricingCTAButton";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [calcPages, setCalcPages] = useState(40);
  const [calcSearches, setCalcSearches] = useState(35);
  const [calcAvgDeal, setCalcAvgDeal] = useState(75000);
  const [calcCloseRate, setCalcCloseRate] = useState(15);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Dynamic ROI calculation
  const annualClicks = Math.round(calcPages * calcSearches * 12 * 0.22);
  const annualLeads = Math.round(annualClicks * 0.04);
  const annualClosedDeals = Math.max(1, Math.round(annualLeads * (calcCloseRate / 100)));
  const estimatedPipeline = annualClosedDeals * calcAvgDeal;

  const pricingTiers = [
    {
      name: "Industrial Pilot",
      badge: "Regional Specialists & OEMs",
      highlight: false,
      description: "For regional equipment manufacturers, distributors, and precision job shops modernizing their technical catalog with dedicated onboarding.",
      annualPrice: 799,
      monthlyPrice: 999,
      annualTotal: "$9,588 billed annually (Includes Assisted Onboarding)",
      monthlyTotal: "billed month-to-month",
      features: [
        "50 verified technical pages / month",
        "1 pre-built vertical taxonomy (HVAC, Sanitary, Tooling, etc.)",
        "Deterministic QA Studio (spec & fluff check)",
        "JSON-LD TechArticle & FAQPage schema generator",
        "Export clean HTML, Markdown & JSON-LD",
        "Dedicated Solution Architect onboarding session",
        "5 team member seats (Reviewer & Author)",
        "Standard email & ticket support (12h SLA)",
      ],
      notIncluded: [
        "Interactive 3D CAD Component Inspector",
        "Direct 1-Click Headless CMS Publishing",
        "Multi-lingual DIN / JIS Standards Crosswalk",
        "Enterprise SAML SSO & SCIM Provisioning",
      ],
      ctaText: "Start 14-Day Pilot",
      ctaMode: "register" as const,
    },
    {
      name: "Growth OEM / Tier-1",
      badge: "Most Popular",
      highlight: true,
      description: "For mid-market machinery manufacturers, Tier-1 automotive suppliers, and national equipment brands displacing competitor PDFs.",
      annualPrice: 1499,
      monthlyPrice: 1799,
      annualTotal: "$17,988 billed annually (Save $3,600)",
      monthlyTotal: "billed month-to-month",
      features: [
        "200 verified technical pages / month",
        "3 pre-built industrial vertical taxonomies",
        "Live AI Search Engine Simulator (Google SGE & Perplexity)",
        "Interactive 3D CAD Tolerance Inspector (WebGL 360°)",
        "STEP CAD to Schema automated extractor (AP203/214)",
        "1-Click Direct Headless CMS Publisher (WordPress VIP & Webflow)",
        "Multi-lingual DIN / JIS / ASTM Standards Crosswalk",
        "Reverse-IP Buyer Intent & PE Contact Discovery",
        "Slack Review Bot & Human-in-the-Loop Kanban",
        "15 team member seats with role-based permissions",
        "Priority engineering support (4h SLA)",
      ],
      notIncluded: [
        "Multi-brand distributor custom subdomains",
        "Enterprise SAML 2.0 & SCIM Okta integration",
      ],
      ctaText: "Launch Growth Console →",
      ctaMode: "register" as const,
    },
    {
      name: "Enterprise Global Leader",
      badge: "Multinational OEMs",
      highlight: false,
      description: "For global conglomerate OEMs, multi-brand holding corporations, and worldwide distributor dealer networks.",
      annualPrice: 3499,
      monthlyPrice: 3999,
      annualTotal: "$41,988 billed annually (Dedicated Support & SLA)",
      monthlyTotal: "billed month-to-month",
      features: [
        "Unlimited verified technical pages / month",
        "All 7+ pre-built industrial vertical taxonomies",
        "Distributor Co-Marketing & dealer custom subdomains",
        "Full Enterprise SAML 2.0 & Okta SSO integration",
        "SCIM 2.0 automated user provisioning & deauth",
        "Tri-Model AI COGS Router (Claude 3.5, GPT-4o, DeepSeek)",
        "OEM MDF Dealer Co-Op Invoicing & Fund Allocation",
        "Shopify B2B / Hydrogen headless catalog sync",
        "Dedicated Chief Reliability Engineer account manager",
        "Custom technical whitepaper PDF generation",
        "99.9% Uptime SLA & SOC2 Type II audit report",
        "Unlimited seats across global engineering offices",
      ],
      notIncluded: [],
      ctaText: "Deploy Enterprise Suite",
      ctaMode: "register" as const,
    },
  ];

  const comparisonCategories = [
    {
      category: "AEO Architecture & Content",
      items: [
        { feature: "Verified Technical Pages / Mo", pilot: "30 Pages", growth: "100 Pages", enterprise: "Unlimited" },
        { feature: "Pre-Built Industrial Taxonomies", pilot: "1 Vertical", growth: "3 Verticals", enterprise: "All 7+ Verticals" },
        { feature: "Live AI Search Simulator (SGE / Perplexity)", pilot: "—", growth: "Included", enterprise: "Included (Full)" },
        { feature: "Deterministic Spec & Fluff Sanitizer", pilot: "Included", growth: "Included", enterprise: "Included (Custom rules)" },
        { feature: "JSON-LD TechArticle & FAQ Syndication", pilot: "Included", growth: "Included", enterprise: "Included (Multi-lang)" },
        { feature: "Competitor Citation Steal Matrix", pilot: "Basic", growth: "Full", enterprise: "Autonomous Radar" },
      ],
    },
    {
      category: "Engineering & 3D CAD Tools",
      items: [
        { feature: "Interactive 3D CAD Exploded View Inspector", pilot: "—", growth: "Included", enterprise: "Included (Custom 3D)" },
        { feature: "STEP CAD File to Schema Extractor", pilot: "—", growth: "Included", enterprise: "Included (Batch)" },
        { feature: "Global Standards Crosswalk (DIN / JIS / ASTM)", pilot: "—", growth: "Included", enterprise: "Included (Custom specs)" },
        { feature: "Technical Whitepaper PDF Generator", pilot: "—", growth: "Standard", enterprise: "Custom Branded" },
      ],
    },
    {
      category: "Publishing & Integrations",
      items: [
        { feature: "Direct 1-Click WordPress VIP Publisher", pilot: "—", growth: "Included", enterprise: "Included" },
        { feature: "Webflow CMS Collection API v2 Connector", pilot: "—", growth: "Included", enterprise: "Included" },
        { feature: "Shopify B2B / Hydrogen Connector", pilot: "—", growth: "—", enterprise: "Included" },
        { feature: "Developer REST API v1 & Webhooks", pilot: "—", growth: "300 req/min", enterprise: "Dedicated Cluster" },
        { feature: "Distributor Co-Marketing Subdomains", pilot: "—", growth: "—", enterprise: "Unlimited Subdomains" },
      ],
    },
    {
      category: "Security, Governance & Support",
      items: [
        { feature: "SAML 2.0 / Okta Enterprise SSO", pilot: "—", growth: "—", enterprise: "Included" },
        { feature: "SCIM 2.0 User Provisioning", pilot: "—", growth: "—", enterprise: "Included" },
        { feature: "Role-Based Access Control (Admin / Reviewer / Author)", pilot: "3 Seats", growth: "10 Seats", enterprise: "Unlimited" },
        { feature: "SLA Guarantee", pilot: "Standard 24h", growth: "Priority 4h", enterprise: "99.9% Uptime SLA" },
        { feature: "SOC2 Type II / ISO 27001 Multi-Tenant RLS", pilot: "Included", growth: "Included", enterprise: "Included" },
      ],
    },
  ];

  const pricingFaqs = [
    {
      q: "Why is ForgeFlow priced based on verified pages rather than generic token credits?",
      a: "Generic AI tools charge for raw tokens without ensuring engineering accuracy. ForgeFlow prices per verified technical page with 100% deterministic QA, validated engineering tolerances, and native AEO schema, giving you transparent ROI tied to closed industrial pipeline.",
    },
    {
      q: "What happens if our engineering team needs to switch between industrial verticals?",
      a: "Growth OEM and Enterprise plans allow you to dynamically assign and switch vertical taxonomies (e.g. from HVAC RTUs to Sanitary Pumps or Automotive Stamping) directly in your tenant dashboard without paying extra fees.",
    },
    {
      q: "Can we integrate our existing WordPress VIP or Webflow site without engineering assistance?",
      a: "Yes. ForgeFlow includes native 1-click publishing webhooks. You enter your CMS application credentials once, and technical articles publish with automated canonical tags and JSON-LD schema injection in under 3 seconds.",
    },
    {
      q: "How does the annual discount work?",
      a: "Selecting annual billing saves 20% on all plans (equal to 2.4 months free). All annual plans include our 14-day zero-risk trial and dedicated onboarding with our technical SEO engineering specialists.",
    },
    {
      q: "Do you offer custom procurement agreements and enterprise security reviews?",
      a: "Yes. Enterprise Global Leader customers receive our complete SOC2 Type II audit package, vendor security questionnaire responses, custom MSA terms, and enterprise invoicing with net-30 payment terms.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      <PublicNavbar activeNav="pricing" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>TRANSPARENT INDUSTRIAL B2B PRICING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-humanist">
            Outrank Legacy Competitors in <br className="hidden sm:inline" />
            <span className="text-sky-600">AI Answer Engines</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Zero fluff, zero hallucination. Fixed predictable pricing that undercuts horizontal SEO agencies while delivering pre-built industrial taxonomies, deterministic QA, and native AEO schema.
          </p>

          {/* Billing Toggle (Monthly vs Annual) */}
          <div className="pt-4 flex items-center justify-center">
            <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200 flex items-center shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${billingCycle === "annual"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                <span>Annual Billing</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  Save 20%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                Monthly Billing
              </button>
            </div>
          </div>

          {/* Enterprise Trust Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              SOC2 Type II Certified
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              99.9% Uptime SLA Guarantee
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Okta SAML 2.0 &amp; SCIM 2.0
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              14-Day Free Pilot
            </span>
          </div>
        </div>
      </section>

      {/* 3 Main Pricing Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier) => {
            const price = billingCycle === "annual" ? tier.annualPrice : tier.monthlyPrice;
            const subtitle = billingCycle === "annual" ? tier.annualTotal : tier.monthlyTotal;

            return (
              <div
                key={tier.name}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 relative ${tier.highlight
                  ? "bg-white border-2 border-sky-500 shadow-xl shadow-sky-500/10 ring-4 ring-sky-100"
                  : "bg-white border border-slate-200 shadow-xs hover:shadow-md"
                  }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-600 text-white shadow-xs tracking-wider uppercase">
                    ⭐ Recommended for OEMs &amp; Tier-1s
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 font-humanist">{tier.name}</h2>
                      <span className="text-[11px] font-mono text-slate-500">{tier.badge}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[40px]">
                    {tier.description}
                  </p>

                  {/* Price Block */}
                  <div className="pt-2 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900 font-humanist">${price}</span>
                      <span className="text-xs text-slate-500 font-medium">/ month</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">{subtitle}</div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Included Capabilities:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span className="css-icon-check text-emerald-600 shrink-0 mt-0.5"></span>
                          <span>{feat}</span>
                        </li>
                      ))}
                      {tier.notIncluded.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-slate-400">
                          <span className="text-slate-300 shrink-0 mt-0.5">&times;</span>
                          <span className="line-through">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-slate-100">
                  <PricingCTAButton
                    planName={tier.name}
                    priceId={
                      tier.name === "Industrial Pilot"
                        ? (billingCycle === "annual" ? "price_starter_annual" : "price_starter_monthly")
                        : tier.name === "Growth OEM / Tier-1"
                        ? (billingCycle === "annual" ? "price_growth_annual" : "price_growth_monthly")
                        : "enterprise"
                    }
                    label={tier.ctaText}
                    billingCycle={billingCycle}
                    highlight={tier.highlight}
                  />
                  <p className="text-[10.5px] text-center text-slate-400 mt-2 font-mono">
                    14-day free pilot • No credit card required
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Transparent ROI Calculator */}
      <section id="roi-calculator" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-mono font-bold uppercase text-sky-700 tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Interactive ROI Modeler
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Calculate Your Industrial Pipeline Return
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Industrial B2B search has zero consumer fluff. When a plant manager searches for a specific RTU compressor fault, one closed sale covers years of software subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
            {/* Sliders Column */}
            <div className="space-y-5">
              <div>
                <label htmlFor="slider-pages" className="flex justify-between text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                  <span>Technical Pages Published</span>
                  <span className="font-mono text-sky-700">{calcPages} pages</span>
                </label>
                <input
                  id="slider-pages"
                  type="range"
                  min={10}
                  max={200}
                  step={5}
                  value={calcPages}
                  onChange={(e) => setCalcPages(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                  aria-label="Technical Pages Published"
                />
                <span className="text-[10px] text-slate-400">Spec sheets, troubleshooting SOPs &amp; crosswalks</span>
              </div>

              <div>
                <label htmlFor="slider-searches" className="flex justify-between text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                  <span>Monthly Searches per Fault / Query</span>
                  <span className="font-mono text-sky-700">{calcSearches} searches/mo</span>
                </label>
                <input
                  id="slider-searches"
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={calcSearches}
                  onChange={(e) => setCalcSearches(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                  aria-label="Monthly Searches per Fault"
                />
                <span className="text-[10px] text-slate-400">High-intent zero-volume diagnostic search volume</span>
              </div>

              <div>
                <label htmlFor="slider-deal-value" className="flex justify-between text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                  <span>Average Equipment Deal Value (ACV)</span>
                  <span className="font-mono text-sky-700">${calcAvgDeal.toLocaleString()}</span>
                </label>
                <input
                  id="slider-deal-value"
                  type="range"
                  min={15000}
                  max={300000}
                  step={5000}
                  value={calcAvgDeal}
                  onChange={(e) => setCalcAvgDeal(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                  aria-label="Average Equipment Deal Value"
                />
                <span className="text-[10px] text-slate-400">Typical replacement unit, retrofit, or maintenance contract</span>
              </div>

              <div>
                <label htmlFor="slider-close-rate" className="flex justify-between text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                  <span>Sales Opportunity Win Rate</span>
                  <span className="font-mono text-sky-700">{calcCloseRate}%</span>
                </label>
                <input
                  id="slider-close-rate"
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={calcCloseRate}
                  onChange={(e) => setCalcCloseRate(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                  aria-label="Sales Opportunity Win Rate"
                />
                <span className="text-[10px] text-slate-400">Sales qualification to contract signature</span>
              </div>
            </div>

            {/* Pipeline Output Column */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between border border-slate-800 shadow-md">
              <div>
                <div className="text-[10.5px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Estimated 12-Month Net New Pipeline
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2 font-mono">
                  ${estimatedPipeline.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Based on capturing 22% CTR in Google SGE &amp; Perplexity citations
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] font-mono text-slate-400 block">Annual Inquiries</span>
                    <span className="text-base font-bold text-white font-mono">{annualLeads} RFQs</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] font-mono text-slate-400 block">Closed Contracts</span>
                    <span className="text-base font-bold text-white font-mono">{annualClosedDeals} Deals</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 mt-6">
                <Link
                  href="/?mode=register"
                  className="block w-full py-2.5 text-center bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Capture This Pipeline &rarr;
                </Link>
                <div className="text-[10px] text-slate-400 text-center mt-2 font-mono">
                  Payback period: Typically achieved within 1st closed RFQ deal
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
            Deep Capability Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
            Compare Plan Capabilities Side-by-Side
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 px-6 font-bold text-slate-900 font-humanist text-sm">Capability / Spec</th>
                  <th className="py-4 px-4 font-bold text-slate-700 text-center">Industrial Pilot</th>
                  <th className="py-4 px-4 font-bold text-sky-700 bg-sky-50/50 text-center">Growth OEM</th>
                  <th className="py-4 px-4 font-bold text-purple-700 text-center">Enterprise Global</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonCategories.map((cat) => (
                  <Fragment key={cat.category}>
                    <tr className="bg-slate-100/70 border-y border-slate-200 font-mono text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <td colSpan={4} className="py-2.5 px-6">{cat.category}</td>
                    </tr>
                    {cat.items.map((item) => (
                      <tr key={item.feature} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-6 font-semibold text-slate-800">{item.feature}</td>
                        <td className="py-3 px-4 text-center text-slate-600 font-mono">{item.pilot}</td>
                        <td className="py-3 px-4 text-center font-bold text-sky-800 bg-sky-50/30 font-mono">{item.growth}</td>
                        <td className="py-3 px-4 text-center font-bold text-purple-800 font-mono">{item.enterprise}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Procurement &amp; Licensing
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {pricingFaqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-xs font-mono text-slate-400">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Contact Banner */}
      <section id="enterprise" className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>ENTERPRISE VOLUME &amp; MULTI-BRAND HOLDINGS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-humanist">
            Need Custom Taxonomies, Dealer Invoicing, or SAML SSO?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Our enterprise solutions team works directly with corporate VPs of Marketing and Chief Reliability Engineers to configure custom CAD parsers and multi-tenant RLS boundaries.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-sky-600/30 cursor-pointer"
            >
              Start Free 14-Day Pilot &rarr;
            </Link>
            <Link
              href="/features"
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Review Technical Architecture
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
