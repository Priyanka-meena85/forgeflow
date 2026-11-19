"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  emailVerified?: string | null;
  organization: {
    id: string;
    name: string;
    plan: string;
    industry?: string | null;
    website?: string | null;
    monthlyPagesLimit?: number;
    monthlyPagesUsed?: number;
    subscriptionStatus?: string | null;
  };
};

interface LandingPageProps {
  onAuthenticated: (user: AuthUser) => void;
  defaultAuthMode?: "login" | "register";
}

export function LandingPage({ onAuthenticated, defaultAuthMode }: LandingPageProps) {
  const [authModalOpen, setAuthModalOpen] = useState(Boolean(defaultAuthMode));
  const [authMode, setAuthMode] = useState<"login" | "register">(defaultAuthMode || "register");

  // Automated Timed Signup Popup (Repetitive every 3.5 minutes / 210,000 ms)
  const [timedSignupOpen, setTimedSignupOpen] = useState(false);

  useEffect(() => {
    // Initial interval of 3.5 minutes (between 3 and 4 minutes)
    const interval = setInterval(() => {
      setTimedSignupOpen((prev) => {
        if (!prev && !authModalOpen) {
          return true;
        }
        return prev;
      });
    }, 210000); // 210,000 ms = 3.5 minutes

    return () => clearInterval(interval);
  }, [authModalOpen]);

  // Demo Modal State
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoCompany, setDemoCompany] = useState("");
  const [demoVertical, setDemoVertical] = useState("HVAC & Commercial Refrigeration");
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Navigation Dropdown State
  const [activeNavDropdown, setActiveNavDropdown] = useState<"features" | "industries" | "integrations" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Preview Tab Switcher
  const [heroPreviewTab, setHeroPreviewTab] = useState<"taxonomy" | "qa" | "schema" | "citation">("taxonomy");

  // Selected vertical showcase in landing page
  const [activeVerticalIndex, setActiveVerticalIndex] = useState(0);

  // Tabbed Feature Spotlight State
  const [activeFeatureTab, setActiveFeatureTab] = useState<"matrix" | "qa" | "schema" | "risk" | "kanban" | "analytics">("matrix");

  // Sample Article Modal State
  const [sampleArticleModalOpen, setSampleArticleModalOpen] = useState(false);

  // Industry Footprint Calculator State (Transparent Inputs & Formula)
  const [calcPages, setCalcPages] = useState(30);
  const [calcSearches, setCalcSearches] = useState(25);
  const [calcCtr, setCalcCtr] = useState(20);
  const [calcLeadConv, setCalcLeadConv] = useState(3.5);
  const [calcCloseRate, setCalcCloseRate] = useState(15);
  const [calcAvgDeal, setCalcAvgDeal] = useState(45000);

  // Legacy sliders for backward compatibility
  const [roiMachines, setRoiMachines] = useState(15);
  const [roiFailures, setRoiFailures] = useState(8);

  // Pricing Billing Toggle (Web-Style Monthly vs Annual)
  const [pricingBilling, setPricingBilling] = useState<"monthly" | "annual">("annual");

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Footer & Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | "security" | "sla" | null>(null);

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newsletterEmail.includes("@")) {
      setNewsletterSubscribed(true);
    }
  }

  function handleDemoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (demoEmail.includes("@")) {
      setDemoSubmitted(true);
    }
  }

  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const verticalShowcase = [
    {
      title: "HVAC & Commercial Refrigeration",
      equipment: "Commercial Rooftop Unit (RTU)",
      failure: "Compressor Flooded Starts & Thermal Overload",
      standard: "ASHRAE Standard 90.1",
      searchVol: "15–30/mo (High Intent)",
      exampleScenario: "Example scenario: 1 closed deal ($95k ACV) from ~25 monthly diagnostic searches",
      specRisk: "1.4% (Very Low)",
      sampleHeadline: "Automating Fault Detection & Diagnostics (FDD) to Prevent Commercial RTU Compressor Failure",
      schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
      badge: "HVAC / Chillers",
    },
    {
      title: "Food & Beverage Manufacturing",
      equipment: "Rotary Lobe Sanitary Pump",
      failure: "Elastomer Seal Swelling in Caustic CIP Washdown",
      standard: "3-A Sanitary Standard 02-12",
      searchVol: "20–45/mo (Reliability Search)",
      exampleScenario: "Example scenario: 1 closed deal ($120k ACV) from ~35 monthly CIP searches",
      specRisk: "1.1% (Minimal)",
      sampleHeadline: "Preventing Elastomer Seal Swelling in Rotary Lobe Pumps During Caustic CIP Washdown (3-A SOP)",
      schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
      badge: "Sanitary / CIP",
    },
    {
      title: "Automotive Tier-1 Stamping",
      equipment: "High-Tonnage Servo Press",
      failure: "Stamping Die Galling & Weld Non-Conformance",
      standard: "IATF 16949 Quality Standard",
      searchVol: "30–65/mo (OEM Replacement)",
      exampleScenario: "Example scenario: 1 tooling contract ($150k ACV) from ~45 monthly searches",
      specRisk: "1.7% (Low Risk)",
      sampleHeadline: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects in IATF 16949 Assembly Lines",
      schemaTypes: ["TechArticle", "FAQPage"],
      badge: "Automotive OEM",
    },
    {
      title: "Precision CNC & Tooling",
      equipment: "5-Axis Machining Center",
      failure: "Spindle Thermal Expansion & Tool Chatter",
      standard: "ISO 230-3 Thermal Environment Test",
      searchVol: "25–50/mo (Tooling Manager)",
      exampleScenario: "Example scenario: 1 spindle retrofit ($85k ACV) from ~35 monthly searches",
      specRisk: "0.9% (Minimal)",
      sampleHeadline: "Mitigating Spindle Thermal Expansion Drift in Precision 5-Axis Milling Cells",
      schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
      badge: "Precision CNC",
    },
    {
      title: "Plastics & Polymer Extrusion",
      equipment: "Twin-Screw Co-Rotating Extruder",
      failure: "Melt Flow Degradation & Barrel Wall Scuffing",
      standard: "ASTM D1238 Melt Flow Protocol",
      searchVol: "15–35/mo (Process Engineer)",
      exampleScenario: "Example scenario: 1 barrel rebuild ($110k ACV) from ~25 monthly searches",
      specRisk: "1.3% (Very Low)",
      sampleHeadline: "Eliminating Barrel Wall Scuffing & Shear Degradation in High-Output Twin-Screw Compounding",
      schemaTypes: ["TechArticle", "FAQPage"],
      badge: "Extrusion / Plastics",
    },
    {
      title: "Industrial Hydraulics & Fluid Power",
      equipment: "Variable Displacement Piston Pump",
      failure: "Suction Cavitation & Slipper Delamination",
      standard: "ISO 4406 Fluid Cleanliness Class",
      searchVol: "20–40/mo (Fluid Power Spec)",
      exampleScenario: "Example scenario: 1 hydraulic skid replacement ($130k ACV) from ~30 monthly searches",
      specRisk: "1.5% (Very Low)",
      sampleHeadline: "Diagnostic Procedure: Identifying High-Pressure Slipper Delamination in Proportional Hydraulic Skids",
      schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
      badge: "Hydraulics & Fluid",
    },
    {
      title: "Heavy Mining & Materials Handling",
      equipment: "Primary Gyratory Crusher",
      failure: "Eccentric Bushing Seizure & Lubricant Breakdown",
      standard: "MSHA Part 56 Mandatory Standard",
      searchVol: "10–25/mo (Mine Maintenance)",
      exampleScenario: "Example scenario: 1 major overhaul ($220k ACV) from ~15 monthly searches",
      specRisk: "2.1% (Low Risk)",
      sampleHeadline: "Emergency SOP: Preventing Eccentric Bushing Seizure in Continuous Duty Primary Gyratory Skids",
      schemaTypes: ["TechArticle", "FAQPage", "HowTo"],
      badge: "Mining & Heavy",
    },
  ];

  const activeVertical = verticalShowcase[activeVerticalIndex];

  // Industry Footprint Transparent Metrics
  const annualImpressions = calcPages * calcSearches * 12;
  const annualClicks = Math.round(annualImpressions * (calcCtr / 100));
  const annualLeads = Math.round(annualClicks * (calcLeadConv / 100));
  const annualClosedDeals = Math.round(annualLeads * (calcCloseRate / 100));
  const estimatedAnnualPipeline = annualClosedDeals * calcAvgDeal;

  // Legacy variables for backward compatibility
  const calculatedPages = calcPages;
  const calculatedSearchers = annualClicks;
  const calculatedInquiries = Math.round(annualLeads / 12);
  const calculatedCoverage = Math.min(99.6, +(85 + calcPages * 0.12).toFixed(1));

  function openAuth(mode: "login" | "register") {
    setAuthMode(mode);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setAuthModalOpen(true);
  }

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (authMode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, companyName }),
      });
      const text = await response.text();
      let data: { user?: AuthUser; error?: string } = {};
      try {
        data = text ? (JSON.parse(text) as { user?: AuthUser; error?: string }) : {};
      } catch {
        throw new Error("Server returned an invalid response. Please try again.");
      }
      if (!response.ok || !data.user) {
        throw new Error(data.error ?? "Authentication failed. Please verify your details.");
      }
      onAuthenticated(data.user);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not authenticate.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* 1. TOP STICKY ENTERPRISE NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="ForgeFlow Logo" width={40} height={40} className="h-10 w-10 object-contain shrink-0 drop-shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">ForgeFlow</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  AEO &amp; SEO
                </span>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                Industrial Content Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveNavDropdown("features")}
              onMouseLeave={() => setActiveNavDropdown(null)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 py-2 hover:text-sky-600 transition cursor-pointer ${
                  activeNavDropdown === "features" ? "text-sky-600 font-bold" : ""
                }`}
              >
                <span>Platform Features</span>
                <span className="text-[10px]">⌄</span>
              </button>

              {activeNavDropdown === "features" && (
                <div className="absolute top-full left-0 w-80 p-3 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                    Industrial Content Suite
                  </div>
                  <a
                    href="#platform-suite"
                    onClick={() => { setActiveFeatureTab("matrix"); setActiveNavDropdown(null); }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    <span className="text-base">🧬</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Taxonomy Matrix</div>
                      <div className="text-[11px] text-slate-500 font-normal">Cross-index equipment, failure modes, &amp; specs</div>
                    </div>
                  </a>
                  <a
                    href="#platform-suite"
                    onClick={() => { setActiveFeatureTab("qa"); setActiveNavDropdown(null); }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    <span className="text-base">🛡️</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Deterministic QA Studio</div>
                      <div className="text-[11px] text-slate-500 font-normal">Closed-loop word count, fluff &amp; spec validation</div>
                    </div>
                  </a>
                  <a
                    href="#platform-suite"
                    onClick={() => { setActiveFeatureTab("schema"); setActiveNavDropdown(null); }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    <span className="text-base">🤖</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">AEO Schema Graph Hub</div>
                      <div className="text-[11px] text-slate-500 font-normal">JSON-LD TechArticle &amp; FAQPage syndication</div>
                    </div>
                  </a>
                  <a
                    href="#platform-suite"
                    onClick={() => { setActiveFeatureTab("risk"); setActiveNavDropdown(null); }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    <span className="text-base">⚠️</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Risk &amp; Compliance Gating</div>
                      <div className="text-[11px] text-slate-500 font-normal">Zero-hallucination engineering tolerances</div>
                    </div>
                  </a>
                  <a
                    href="#platform-suite"
                    onClick={() => { setActiveFeatureTab("kanban"); setActiveNavDropdown(null); }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    <span className="text-base">🚀</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Publishing Kanban</div>
                      <div className="text-[11px] text-slate-500 font-normal">Human-in-the-loop review &amp; CMS webhooks</div>
                    </div>
                  </a>
                  <a
                    href="#platform-suite"
                    onClick={() => { setActiveFeatureTab("analytics"); setActiveNavDropdown(null); }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    <span className="text-base">📊</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Answer Engine Analytics</div>
                      <div className="text-[11px] text-slate-500 font-normal">Track zero-volume LLM citations &amp; RFQs</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveNavDropdown("industries")}
              onMouseLeave={() => setActiveNavDropdown(null)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 py-2 hover:text-sky-600 transition cursor-pointer ${
                  activeNavDropdown === "industries" ? "text-sky-600 font-bold" : ""
                }`}
              >
                <span>Industries &amp; Solutions</span>
                <span className="text-[10px]">⌄</span>
              </button>

              {activeNavDropdown === "industries" && (
                <div className="absolute top-full left-0 w-84 p-3 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                    7 Pre-Built Industrial Verticals
                  </div>
                  {verticalShowcase.slice(0, 5).map((v, i) => (
                    <a
                      key={v.title}
                      href="#taxonomies"
                      onClick={() => { setActiveVerticalIndex(i); setActiveNavDropdown(null); }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition text-xs"
                    >
                      <span className="font-semibold text-slate-800">{v.title}</span>
                      <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {v.badge}
                      </span>
                    </a>
                  ))}
                  <div className="pt-2 border-t border-slate-100 text-center">
                    <a
                      href="#taxonomies"
                      onClick={() => setActiveNavDropdown(null)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700"
                    >
                      View All 7 Sector Taxonomies →
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="#workflow" className="hover:text-sky-600 transition">8-Step Protocol</a>
            <a href="#industry-calculator" className="hover:text-sky-600 transition">Footprint Calculator</a>
            <a href="#pricing" className="hover:text-sky-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-sky-600 transition">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="hidden sm:inline-flex px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setDemoSubmitted(false); setDemoModalOpen(true); }}
              className="hidden md:inline-flex px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-xl transition cursor-pointer"
            >
              Book a Demo
            </button>
            <button
              type="button"
              onClick={() => openAuth("register")}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm shadow-sky-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Start Free Pilot</span>
              <span className="text-sky-200">→</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 text-xs font-semibold">
            <a href="#platform-suite" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">Platform Features</a>
            <a href="#taxonomies" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">Vertical Taxonomies</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">8-Step Workflow</a>
            <a href="#industry-calculator" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">Footprint Calculator</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">Pricing</a>
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); setDemoModalOpen(true); }}
                className="w-1/2 py-2 text-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-bold"
              >
                Book Demo
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); openAuth("register"); }}
                className="w-1/2 py-2 text-center rounded-lg bg-sky-600 text-white font-bold"
              >
                Start Pilot
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Pilot Program Open · Built with engineer review in the loop</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Turn Complex Engineering Specs into Pipeline-Generating Search Rankings.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Every page passes 8 automated QA checks and a human engineer review before publishing.
                ForgeFlow eliminates the zero-volume keyword trap for equipment manufacturers with pre-built vertical taxonomies across 7 heavy sectors, closed-loop
                QA enforcement, and native AEO schema for <strong className="text-slate-800 font-semibold">Google AI Overviews, ChatGPT, and Perplexity</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSampleArticleModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold shadow-md shadow-sky-600/25 transition cursor-pointer flex items-center gap-2"
                >
                  <span>See a sample RTU compressor page</span>
                  <span className="text-sky-200 text-base">↗</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition shadow-2xs cursor-pointer flex items-center gap-2"
                >
                  <span>Start a free pilot</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setDemoSubmitted(false); setDemoModalOpen(true); }}
                  className="px-4 py-3.5 text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
                >
                  Book a Walkthrough &rarr;
                </button>
                <a
                  href="#taxonomies"
                  className="px-3 py-3.5 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Explore 7 Taxonomies ↓
                </a>
              </div>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Human Engineer Sign-Off</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>8 Automated QA Gates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Deterministic Schema.org</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Webflow / WP Native</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Multi-Tab Hero Console Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/60 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="ml-2 font-mono text-[11px] text-slate-400 font-medium">forgeflow.engine.v2</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Engine Active
                  </span>
                </div>

                <div className="flex gap-1 border-b border-slate-100 pb-2 mb-3 text-[11px] font-mono font-bold">
                  {[
                    { id: "taxonomy", label: "Spec Matrix" },
                    { id: "qa", label: "Closed QA" },
                    { id: "schema", label: "JSON-LD" },
                    { id: "citation", label: "AEO Citation" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setHeroPreviewTab(t.id as typeof heroPreviewTab)}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        heroPreviewTab === t.id
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {heroPreviewTab === "taxonomy" && (
                  <div className="space-y-3 animate-in fade-in duration-100">
                    <div className="p-3 rounded-xl border border-sky-100 bg-sky-50/70">
                      <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-sky-700">
                        {activeVertical.badge} · Active Slice
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                        {activeVertical.sampleHeadline}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Equipment</div>
                        <div className="font-bold text-slate-800 text-[11px] truncate mt-0.5">{activeVertical.equipment}</div>
                      </div>
                      <div className="p-2 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Standard</div>
                        <div className="font-bold text-slate-800 text-[11px] truncate mt-0.5">{activeVertical.standard}</div>
                      </div>
                      <div className="p-2 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Search Vol</div>
                        <div className="font-bold text-slate-800 text-[11px] mt-0.5">{activeVertical.searchVol}</div>
                      </div>
                      <div className="p-2 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">AEO Intent</div>
                        <div className="font-bold text-emerald-700 font-mono text-[11px] mt-0.5">High-Intent Diagnostic</div>
                      </div>
                    </div>
                  </div>
                )}

                {heroPreviewTab === "qa" && (
                  <div className="space-y-2 text-xs animate-in fade-in duration-100">
                    <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900 flex justify-between items-center text-[11px] font-mono font-bold">
                      <span>Closed-Loop Protocol</span>
                      <span>8/8 GATES PASSED</span>
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between p-2 rounded border border-slate-100 bg-slate-50">
                        <span className="text-slate-600">Word Count (1,840 words)</span>
                        <span className="text-emerald-700 font-bold">PASS</span>
                      </div>
                      <div className="flex justify-between p-2 rounded border border-slate-100 bg-slate-50">
                        <span className="text-slate-600">Fluff Filter (0% Superlatives)</span>
                        <span className="text-emerald-700 font-bold">PASS</span>
                      </div>
                      <div className="flex justify-between p-2 rounded border border-slate-100 bg-slate-50">
                        <span className="text-slate-600">Link Allowlist (12/12 Verified)</span>
                        <span className="text-emerald-700 font-bold">PASS</span>
                      </div>
                      <div className="flex justify-between p-2 rounded border border-slate-100 bg-slate-50">
                        <span className="text-slate-600">Spec Risk Score (1.1%)</span>
                        <span className="text-emerald-700 font-bold">LOW RISK</span>
                      </div>
                    </div>
                  </div>
                )}

                {heroPreviewTab === "schema" && (
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] leading-relaxed overflow-x-auto space-y-1 animate-in fade-in duration-100">
                    <div className="text-emerald-400">{"// Deterministic Schema.org Injection"}</div>
                    <div>{`{`}</div>
                    <div className="pl-3">{`"@context": "https://schema.org",`}</div>
                    <div className="pl-3">{`"@type": "TechArticle",`}</div>
                    <div className="pl-3">{`"headline": "${activeVertical.sampleHeadline.slice(0, 42)}...",`}</div>
                    <div className="pl-3">{`"about": "${activeVertical.equipment}",`}</div>
                    <div className="pl-3">{`"operatingStandard": "${activeVertical.standard}",`}</div>
                    <div className="pl-3">{`"aeoDirectAnswerReady": true`}</div>
                    <div>{`}`}</div>
                  </div>
                )}

                {heroPreviewTab === "citation" && (
                  <div className="space-y-2.5 text-xs animate-in fade-in duration-100">
                    <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/70 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-purple-800 uppercase">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                        <span>Google AI Overview &amp; Perplexity Citation Target</span>
                      </div>
                      <p className="text-slate-800 text-[11px] leading-relaxed">
                        &ldquo;According to the certified standard specification for <strong>{activeVertical.equipment}</strong> under <strong>{activeVertical.standard}</strong>, the diagnostic protocol requires…&rdquo;
                      </p>
                      <div className="text-[10px] font-mono text-purple-700 font-bold flex items-center gap-1">
                        <span>Source:</span>
                        <span className="underline">yourdomain.com/{activeVertical.equipment.toLowerCase().replace(/[^a-z0-9]/g, "-")}-spec</span>
                        <span>(#1 Verified SGE Rank)</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="mt-3 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer"
                >
                  Generate Full Matrix Slices In Console →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HONEST TRUST SIGNALS & PILOT STATUS BANNER */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Pilot Program Open for Equipment Manufacturers</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Built with Engineer Review in the Loop
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Industrial equipment purchasing carries severe liability and strict performance warranties.
                ForgeFlow never publishes unvetted AI copy. Every technical page passes 8 automated structural QA gates
                and requires sign-off from a credentialed applications engineer before publishing.
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs font-mono text-slate-700">
                <span className="flex items-center gap-1.5"><strong className="text-emerald-700">✓</strong> Pre-built taxonomies across 7 heavy sectors</span>
                <span className="flex items-center gap-1.5"><strong className="text-emerald-700">✓</strong> Grounded in ASME, ASHRAE, ISO, and 3-A standards</span>
                <span className="flex items-center gap-1.5"><strong className="text-emerald-700">✓</strong> Deterministic schema for Google AI Overviews &amp; Perplexity</span>
              </div>
            </div>

            {/* Real Pilot Case Study Teardown */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                    Industrial Pilot Teardown
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  HVAC Commercial RTU
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Targeting Zero-Volume Compressor Failure Diagnostics
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Traditional agencies ignore <em>&ldquo;RTU scroll compressor suction liquid floodback&rdquo;</em> due to low search volume. Yet when facility managers encounter compressor lockup, they query AI Answer Engines for exact suction superheat tolerances.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Zero-Hallucination Gate</span>
                  <span className="text-emerald-700 font-bold">ASHRAE 90.1 Specs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">AI Search Rank</span>
                  <span className="text-sky-700 font-bold">#1 Perplexity Source</span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setSampleArticleModalOpen(true)}
                  className="font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Inspect Verified Article Specimen</span>
                  <span>→</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  Join Pilot Cohort
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OXMAINT-STYLE TABBED FEATURE SHOWCASE */}
      <section id="platform-suite" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              The Industrial AEO Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              One Unified Platform for Engineering Search Dominance
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automate and govern your entire digital engineering authority and Answer Engine presence with deterministic precision.
            </p>
          </div>

          {/* Feature Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "matrix", label: "Taxonomy Matrix", icon: "🧬" },
              { id: "qa", label: "Deterministic QA", icon: "🛡️" },
              { id: "schema", label: "AEO Schema Hub", icon: "🤖" },
              { id: "risk", label: "Risk & Spec Gating", icon: "⚠️" },
              { id: "kanban", label: "Publishing Kanban", icon: "🚀" },
              { id: "analytics", label: "Zero-Volume Analytics", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFeatureTab(tab.id as typeof activeFeatureTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeFeatureTab === tab.id
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Feature Tab Content Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
            {activeFeatureTab === "matrix" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                    Pillar 1 · Automated Taxonomy Matrix
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Pre-Loaded Engineering Matrices Across 7 Heavy Sectors
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Never suffer from blank-canvas syndrome. ForgeFlow maps your equipment models against real operating failure modes, certified regulatory standards (ISO, ASME, 3-A, AGMA), and high-intent diagnostic queries.
                  </p>
                  <div className="space-y-2 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>1,200+ equipment types, component assemblies, and failure taxonomies.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Automatic cross-indexing of diagnostic SOPs and OEM replacement specs.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>High-intent zero-volume keyword generation ready for LLM ingestion.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openAuth("register")}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                    >
                      Explore Taxonomy Generator →
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase">Matrix Cross-Slice Preview</div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="text-[10px] font-mono text-sky-700 font-bold uppercase">Target Equipment</div>
                    <div className="font-bold text-slate-900">Commercial Rooftop Unit (RTU)</div>
                    <div className="border-t border-slate-100 pt-2 text-[10px] font-mono text-amber-700 font-bold uppercase">Failure Mode</div>
                    <div className="font-medium text-slate-700">Compressor Flooded Starts &amp; Thermal Overload</div>
                    <div className="border-t border-slate-100 pt-2 text-[10px] font-mono text-purple-700 font-bold uppercase">Standard Verification</div>
                    <div className="font-medium text-slate-700">ASHRAE 90.1 Energy &amp; Economizer Standard</div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === "qa" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Pillar 2 · Deterministic QA Studio
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Zero-Hallucination Quality Gating for Technical Buyers
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Engineers buy from verified tolerances, not fluffy adjectives. ForgeFlow runs an automated 8-point inspection on every slice before human engineers give final sign-off.
                  </p>
                  <div className="space-y-2 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Zero-fluff filter: instantly strips buzzwords, hyperbole, and vague filler.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Allowlist enforcement: only authorized ISO, ANSI, and OEM links permitted.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>One-click Auto-Patch: fixes CTA formats, word count minimums, and schema syntax.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openAuth("register")}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                    >
                      Try QA Split-View Editor →
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase">Live QA Inspector</div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span>Word Count (1,840)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">PASS</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span>Fluff Rate (0.0%)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">PASS</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span>Engineering Tolerance</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">VERIFIED</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span>Direct-Answer Capsule</span>
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold">AEO READY</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === "schema" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                    Pillar 3 · AEO Schema Graph Hub
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Structured Linked Data Built for Perplexity &amp; Google AI
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    AI answer engines rely on semantic entity graphs to extract answers. ForgeFlow injects valid JSON-LD TechArticle, HowTo, and FAQPage schemas so search engines cite your site as the primary source.
                  </p>
                  <div className="space-y-2 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Native Schema.org validation against Google Rich Results standards.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Direct Answer capsules engineered for Google AI Overviews.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Auto-injects step-by-step diagnostic workflows as HowTo nodes.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openAuth("register")}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                    >
                      Inspect Schema Generator →
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-900 p-5 rounded-2xl text-slate-200 font-mono text-[11px] space-y-2">
                  <div className="text-purple-400 font-bold">{"// Multi-Entity JSON-LD Graph"}</div>
                  <pre className="text-[10px] text-slate-300 leading-relaxed overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Industrial RTU Troubleshooting",
      "proficiencyLevel": "Expert"
    },
    {
      "@type": "HowTo",
      "name": "Compressor Diagnostics Step 1-5"
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            )}

            {activeFeatureTab === "risk" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    Pillar 4 · Risk &amp; Compliance Gating
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Hard-Gating Safety Protocols &amp; Regulatory Claims
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Industrial equipment failures cause downtime and regulatory fines. ForgeFlow assigns spec risk ratings to every claim, flagging high-volatility statements before content publication.
                  </p>
                  <div className="space-y-2 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>OSHA, NFPA, and ISO compliance rulebooks built into generation prompts.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Flags unverified operating pressure, voltage, and temperature claims.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Enterprise audit trail recording human review timestamps and changes.</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase">Risk Evaluation Protocol</div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Operating Temperature Limits</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">0.8% RISK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Caustic Washdown Chemical SOP</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">1.1% RISK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Emergency Shutdown Interlock</span>
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-mono text-[10px] font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === "kanban" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                    Pillar 5 · Publishing Kanban Pipeline
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Full Lifecycle Control from Generated Draft to Published Page
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Collaborate seamlessly between marketing managers, application engineers, and compliance officers. Move drafts along an intuitive 4-stage pipeline with one-click CMS sync.
                  </p>
                  <div className="space-y-2 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Stages: Generated → In Review → Approved → Published.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Direct Webflow Collection and WordPress REST API publishing.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Clean HTML and JSON webhook exports for enterprise headless architectures.</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase">Kanban Workflow Stage Sync</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="text-slate-400 uppercase text-[9px]">Stage 01</div>
                      <div className="font-bold text-slate-800">Generated</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-sky-200 bg-sky-50/50">
                      <div className="text-sky-700 uppercase text-[9px]">Stage 02</div>
                      <div className="font-bold text-sky-800">In Review (QA)</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-200 bg-emerald-50/50">
                      <div className="text-emerald-700 uppercase text-[9px]">Stage 03</div>
                      <div className="font-bold text-emerald-800">Approved</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-purple-200 bg-purple-50/50">
                      <div className="text-purple-700 uppercase text-[9px]">Stage 04</div>
                      <div className="font-bold text-purple-800">Published CMS</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === "analytics" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                    Pillar 6 · Zero-Volume Search Analytics
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Measure Real Pipeline Value, Not Just Vanity Traffic
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Standard SEO dashboards celebrate 100,000 visitors who never buy. ForgeFlow tracks the 15 plant managers searching for emergency troubleshooting who represent $250k+ purchase orders.
                  </p>
                  <div className="space-y-2 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Answer Engine Citation Tracker: monitor ChatGPT, Claude, and Perplexity indexation.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>RFQ conversion tracking linked to specific equipment taxonomy slices.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Competitor displacement monitoring across zero-volume technical queries.</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase">Impact Metrics</div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">AEO Citation Frequency</span>
                      <span className="font-mono font-bold text-purple-700">14.2x Growth</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">High-Intent Inbound RFQs</span>
                      <span className="font-mono font-bold text-emerald-700">Active Pipeline</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Time-to-Publish per Asset</span>
                      <span className="font-mono font-bold text-sky-700">&lt; 90 Seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE 7 PRE-BUILT TAXONOMIES SHOWCASE */}
      <section id="taxonomies" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Taxonomy Architecture
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Pre-Built Taxonomies for 7 Industrial Sectors
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Never start from a blank prompt. ForgeFlow ships with deeply indexed equipment types, failure modes, and industry standards ready out of the box.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {verticalShowcase.map((v, idx) => (
              <button
                key={v.title}
                type="button"
                onClick={() => setActiveVerticalIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeVerticalIndex === idx
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700">
                  Active Taxonomy Slice
                </span>
                <h3 className="text-2xl font-black text-slate-900">{activeVertical.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Target Equipment</span>
                    <p className="font-bold text-slate-900 mt-1">{activeVertical.equipment}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Failure Mode</span>
                    <p className="font-bold text-slate-900 mt-1">{activeVertical.failure}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Certified Standard</span>
                    <p className="font-bold text-slate-900 mt-1">{activeVertical.standard}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Generated Technical Article Title</div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    {activeVertical.sampleHeadline}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700">
                  Search &amp; Risk Metrics
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-500">Spec Risk Score</span>
                    <span className="font-mono text-sm font-bold text-sky-700">{activeVertical.specRisk}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-500">Search Volume Profile</span>
                    <span className="font-mono text-xs font-semibold text-slate-800">{activeVertical.searchVol}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500">Structured Schema</span>
                    <div className="flex gap-1">
                      {activeVertical.schemaTypes.map((st) => (
                        <span key={st} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 leading-normal">
                    <span className="font-bold text-slate-700 font-mono text-[10px] uppercase">Assumption:</span> {activeVertical.exampleScenario}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  Generate Slices For This Vertical →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALCULATE YOUR INDUSTRY: TRANSPARENT PIPELINE & AEO FOOTPRINT CALCULATOR */}
      <section id="industry-calculator" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Transparent Industrial Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Industrial Search &amp; Pipeline Calculator
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every projection follows directly and transparently from your engineering portfolio and sales assumptions.
              No arbitrary numbers — see the formula and adjust each assumption live.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100 pb-2">
                  Portfolio Assumptions &amp; Unit Economics
                </div>

                {/* 1. Technical Pages Published */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                    <span>Technical Landing Pages Published</span>
                    <span className="font-mono text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-bold">
                      {calcPages} Pages
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={calcPages}
                    onChange={(e) => setCalcPages(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>10 Pages</span>
                    <span>50 Pages</span>
                    <span>100 Pages</span>
                  </div>
                </div>

                {/* 2. Monthly Searches per Page */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                    <span>Monthly Searches per Technical Query (Zero-Volume Long-Tail)</span>
                    <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                      {calcSearches} Searches / page / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={calcSearches}
                    onChange={(e) => setCalcSearches(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>10 Searches</span>
                    <span>45 Searches</span>
                    <span>80 Searches</span>
                  </div>
                </div>

                {/* 3 & 4. CTR & Lead Conversion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                      <span>Click-Through Rate (CTR)</span>
                      <span className="font-mono text-xs text-sky-700 font-bold">{calcCtr}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={calcCtr}
                      onChange={(e) => setCalcCtr(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Organic rank + SGE citation</div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                      <span>Lead Conversion Rate</span>
                      <span className="font-mono text-xs text-emerald-700 font-bold">{calcLeadConv}%</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="8.0"
                      step="0.5"
                      value={calcLeadConv}
                      onChange={(e) => setCalcLeadConv(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Engineers requesting RFQ / CAD</div>
                  </div>
                </div>

                {/* 5 & 6. Close Rate & Deal Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                      <span>Sales Opportunity Close Rate</span>
                      <span className="font-mono text-xs text-purple-700 font-bold">{calcCloseRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="35"
                      step="1"
                      value={calcCloseRate}
                      onChange={(e) => setCalcCloseRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Qualified RFQs closed as sales</div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                      <span>Average Deal Value (ACV)</span>
                      <span className="font-mono text-xs text-slate-900 font-bold">${calcAvgDeal.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="150000"
                      step="5000"
                      value={calcAvgDeal}
                      onChange={(e) => setCalcAvgDeal(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Typical equipment order or service contract</div>
                  </div>
                </div>
              </div>

              {/* Output Result Card & Transparent Formula */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl text-white shadow-xl space-y-5">
                <div>
                  <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                    Transparent Projected Pipeline
                  </div>
                  <div className="text-3xl font-black font-mono text-white mt-1">
                    ${estimatedAnnualPipeline.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Estimated annual pipeline value generated
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-4 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Annual Impressions:</span>
                    <span className="font-bold text-white">{annualImpressions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Target Organic Clicks:</span>
                    <span className="font-bold text-sky-400">{annualClicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Qualified RFQ Inquiries:</span>
                    <span className="font-bold text-emerald-400">{annualLeads.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Projected Closed Deals:</span>
                    <span className="font-bold text-purple-400">{annualClosedDeals.toLocaleString()}</span>
                  </div>
                </div>

                {/* Step-by-Step Formula Box */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[10px] font-mono text-slate-300 space-y-1">
                  <div className="text-sky-400 font-bold uppercase">Formula:</div>
                  <div className="leading-relaxed">
                    {calcPages} pages &times; {calcSearches} searches/mo &times; 12 mo &times; {calcCtr}% CTR &times; {calcLeadConv}% conv &times; {calcCloseRate}% close &times; ${calcAvgDeal.toLocaleString()} ACV
                  </div>
                </div>

                <div className="text-[11px] text-amber-300/90 italic border-l-2 border-amber-400/60 pl-2">
                  * Illustrative estimate, not a guarantee. Actual search volumes, CTR, and conversion rates depend on vertical competitiveness and domain authority.
                </div>

                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Start Pilot with Your Assumptions →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE 8-STEP INDUSTRIAL WORKFLOW */}
      <section id="workflow" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              The 8-Step Lifecycle
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              From Plant Taxonomy to Verified Search Pipeline
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ForgeFlow operates as a deterministic factory for B2B engineering content. Every page advances through an unbroken 8-step closed-loop quality protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                role: "CLIENT ACTION",
                title: "Client Sign-up",
                desc: "Configure dedicated enterprise workspace, verified corporate domain, equipment taxonomy, and compliance bounds.",
                badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
              },
              {
                step: "02",
                role: "SYSTEM/AI ACTION",
                title: "Topic Suggestions",
                desc: "Auto-generate high-intent technical topics from pre-built vertical matrices crossing equipment, failure modes, and OEM specs.",
                badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
              },
              {
                step: "03",
                role: "CLIENT ACTION",
                title: "Client Approves Topics",
                desc: "Review suggested slices, adjust engineering tolerances, and approve target topic batches with estimated pipeline values.",
                badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
              },
              {
                step: "04",
                role: "SYSTEM/AI ACTION",
                title: "AI Generates Pages",
                desc: "Draft root cause analyses, diagnostic verification protocols, concise engineering FAQs, and multi-entity JSON-LD schemas.",
                badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
              },
              {
                step: "05",
                role: "SYSTEM/AI ACTION",
                title: "Validate & Auto-Patch",
                desc: "Closed-loop QA verifies word count, gates fluff, checks link allowlists, and automatically patches technical CTA cards.",
                badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
              },
              {
                step: "06",
                role: "CLIENT ACTION (↺ LOOP)",
                title: "Human Review",
                desc: "Application engineers review QA strip. Approvals advance to publishing; changes requested route automatically back to AI.",
                badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
              },
              {
                step: "07",
                role: "SYSTEM/AI ACTION",
                title: "Publish or Export",
                desc: "Deploy clean semantic HTML, direct Webflow/WordPress CMS sync, or trigger automated webhooks into your headless CMS.",
                badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
              },
              {
                step: "08",
                role: "OUTPUT & CITATION",
                title: "Track Results",
                desc: "Monitor Answer Engine Optimization (ChatGPT, Perplexity citations), Google Search Console impressions, and RFQ conversions.",
                badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-black text-slate-900">{item.step}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                      {item.role}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMPARISON TABLE: BIG IMPACT HEADING */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <span className="inline-block text-xs font-mono uppercase tracking-wider font-bold text-indigo-700 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200 shadow-xs">
              Why ForgeFlow Wins
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Engineered for Industrial Reality, <span className="text-indigo-600">Not Generic Marketing.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Compare how ForgeFlow&apos;s deterministic engine outperforms traditional SEO agencies and generic LLM writing tools on real engineering specs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 text-left">
                  <th className="p-4 font-bold text-slate-900">Capability / Standard</th>
                  <th className="p-4 font-bold text-indigo-700 bg-indigo-50/70">ForgeFlow Industrial Engine</th>
                  <th className="p-4 font-bold text-slate-600">Generic AI (ChatGPT / Jasper)</th>
                  <th className="p-4 font-bold text-slate-600">Traditional SEO Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-bold text-slate-900">Engineering Spec Accuracy</td>
                  <td className="p-4 font-semibold text-indigo-900 bg-indigo-50/40">Closed-loop verification against OEM limits &amp; standards</td>
                  <td className="p-4 text-slate-600">Probabilistic text with risk of spec hallucination</td>
                  <td className="p-4 text-slate-600">Varies widely by freelance writer engineering background</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Answer Engine Optimization (AEO)</td>
                  <td className="p-4 font-semibold text-indigo-900 bg-indigo-50/40">Pre-validated TechArticle, HowTo &amp; FAQPage JSON-LD</td>
                  <td className="p-4 text-slate-600">Unstructured text output only; requires manual developer setup</td>
                  <td className="p-4 text-slate-600">Basic Article or WebPage schema only</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Zero-Volume Keyword Targeting</td>
                  <td className="p-4 font-semibold text-indigo-900 bg-indigo-50/40">Pre-built failure-mode matrices across 7 industrial sectors</td>
                  <td className="p-4 text-slate-600">Requires manual prompt engineering and deep research</td>
                  <td className="p-4 text-slate-600">Frequently de-prioritized due to broad keyword volume bias</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Closed-Loop Quality Gating</td>
                  <td className="p-4 font-semibold text-indigo-900 bg-indigo-50/40">8 automated QA checks + mandatory human engineer sign-off</td>
                  <td className="p-4 text-slate-600">No automated QA or engineering validation gates</td>
                  <td className="p-4 text-slate-600">Subjective human editing without structured rules engine</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Turnaround Speed</td>
                  <td className="p-4 font-semibold text-indigo-900 bg-indigo-50/40">Minutes to draft; published only upon engineer review</td>
                  <td className="p-4 text-slate-600">Fast text generation; heavy technical review &amp; correction required</td>
                  <td className="p-4 text-slate-600">2 to 6 weeks per technical article</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Monthly Cost Structure</td>
                  <td className="p-4 font-semibold text-indigo-900 bg-indigo-50/40">$199 Pilot, $399 Growth, $799 Fleet / month</td>
                  <td className="p-4 text-slate-600">$20 – $100/mo (raw tool without domain taxonomy or QA)</td>
                  <td className="p-4 text-slate-600">$5,000 – $15,000/mo agency retainer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. TRANSPARENT PRICING: CLEAN WEB CARDS WITH ANNUAL TOGGLE */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Predictable Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Enterprise Plans Built for Engineering Scale
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Capture zero-volume search and dominate Answer Engines across all product lines. No hidden overages.
            </p>

            {/* Interactive Billing Toggle */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <span className={`text-xs font-bold ${pricingBilling === "monthly" ? "text-slate-900" : "text-slate-500"}`}>
                Monthly Billing
              </span>
              <button
                type="button"
                onClick={() => setPricingBilling(pricingBilling === "monthly" ? "annual" : "monthly")}
                className="w-12 h-6 rounded-full bg-slate-900 p-0.5 transition cursor-pointer relative"
                aria-label="Toggle annual or monthly pricing"
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${pricingBilling === "annual" ? "translate-x-6" : "translate-x-0"}`} />
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${pricingBilling === "annual" ? "text-slate-900" : "text-slate-500"}`}>
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SAVE 20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilot Tier */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase text-slate-500 mb-2">Starter Pilot</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {pricingBilling === "annual" ? "$159" : "$199"}
                  </span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For mid-size equipment makers testing programmatic AEO.</p>
                <div className="mt-6 space-y-2.5 text-xs border-t border-slate-100 pt-5 text-slate-700">
                  <div className="flex items-center gap-2">✔ <span>50 Spec-Verified Technical Slices / mo</span></div>
                  <div className="flex items-center gap-2">✔ <span>1 Verified Corporate Domain</span></div>
                  <div className="flex items-center gap-2">✔ <span>2 Pre-Built Vertical Taxonomies</span></div>
                  <div className="flex items-center gap-2">✔ <span>Closed-Loop QA &amp; Anti-Fluff Stripper</span></div>
                  <div className="flex items-center gap-2">✔ <span>Native TechArticle JSON-LD Schema</span></div>
                  <div className="flex items-center gap-2">✔ <span>3 Application Engineering Seats</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Start Free 14-Day Pilot →
              </button>
            </div>

            {/* Growth Tier (Recommended) */}
            <div className="p-7 rounded-2xl border-2 border-sky-600 bg-white shadow-lg shadow-sky-600/10 flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                Most Popular · Recommended for OEMs
              </span>
              <div>
                <div className="text-xs font-mono font-bold uppercase text-sky-700 mb-2">Growth Engine</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {pricingBilling === "annual" ? "$319" : "$399"}
                  </span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For scaling equipment brands dominating multiple product lines.</p>
                <div className="mt-6 space-y-2.5 text-xs border-t border-slate-100 pt-5 text-slate-700">
                  <div className="flex items-center gap-2">✔ <span>150 Spec-Verified Technical Slices / mo</span></div>
                  <div className="flex items-center gap-2">✔ <span>3 Connected Corporate Domains</span></div>
                  <div className="flex items-center gap-2">✔ <span>All 7 Pre-Built Industrial Taxonomies</span></div>
                  <div className="flex items-center gap-2">✔ <span>Full Multi-Schema (TechArticle + HowTo + FAQ)</span></div>
                  <div className="flex items-center gap-2">✔ <span>Google AI Overviews &amp; Perplexity Syndication</span></div>
                  <div className="flex items-center gap-2">✔ <span>Direct Webflow &amp; WordPress CMS API Sync</span></div>
                  <div className="flex items-center gap-2">✔ <span>7 Engineering Seats + Role-Based Access</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="mt-8 w-full py-2.5 rounded-xl bg-sky-600 text-xs font-bold text-white shadow-sm hover:bg-sky-500 transition cursor-pointer"
              >
                Launch Growth Engine →
              </button>
            </div>

            {/* Fleet / Enterprise Tier */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase text-purple-700 mb-2">Fleet Tier · Multi-Plant</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {pricingBilling === "annual" ? "$639" : "$799"}
                  </span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For multi-brand conglomerates &amp; industrial B2B agencies.</p>
                <div className="mt-6 space-y-2.5 text-xs border-t border-slate-100 pt-5 text-slate-700">
                  <div className="flex items-center gap-2">✔ <span>400+ Technical Slices included</span></div>
                  <div className="flex items-center gap-2">✔ <span>Unlimited Client Tenants &amp; Domains</span></div>
                  <div className="flex items-center gap-2">✔ <span>Custom CAD &amp; Equipment Specs Ingestion</span></div>
                  <div className="flex items-center gap-2">✔ <span>White-Label Client Portal &amp; CNAME</span></div>
                  <div className="flex items-center gap-2">✔ <span>Zero-Hallucination SLA Guarantee</span></div>
                  <div className="flex items-center gap-2">✔ <span>Dedicated Taxonomy Solutions Architect</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Deploy Fleet Tier →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERT REVIEW SECTION (NEW ON LANDING PAGE - IMMEDIATELY BEFORE FAQ) */}
      <section id="expert-review" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Human-in-the-Loop Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Application Engineers Review Every Page
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              AI generates the first technical pass. Licensed application engineers verify specifications, operating limits, and regulatory codes before a single word goes live. Unreviewed pages are strictly blocked from publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: 4-Point Verification Checklist */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                  Engineering Verification Checklist
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  4/4 GATES ENFORCED
                </span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    gate: "Gate 1",
                    title: "Specification & Operating Limits Accuracy",
                    desc: "Checks operating envelope, displacement, and failure causation against verified OEM technical documentation.",
                    status: "PASS",
                  },
                  {
                    gate: "Gate 2",
                    title: "Regulatory & Industry Standards Referenced",
                    desc: "Cross-references active codes: ASHRAE 90.1, ASME Section VIII, ISO 9001, and 3-A Sanitary 02-12.",
                    status: "PASS",
                  },
                  {
                    gate: "Gate 3",
                    title: "Operating Tolerances & Safety Envelopes",
                    desc: "Confirms temperature differential, suction superheat bounds, and mechanical fatigue thresholds.",
                    status: "PASS",
                  },
                  {
                    gate: "Gate 4",
                    title: "AEO Structured Schema Validity",
                    desc: "Validates Schema.org TechArticle, HowTo, and reviewedBy Person entity with engineer's verified credentials.",
                    status: "PASS",
                  },
                ].map((item) => (
                  <div key={item.gate} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-sky-700">{item.gate} &bull; {item.title}</span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Mock Reviewer Sign-Off Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 text-white shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Sample Engineering Sign-Off Seal
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                    ⚙️
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Lead Applications Engineer</div>
                    <div className="text-xs text-sky-400 font-mono">PE, HVAC &amp; Commercial Refrigeration</div>
                    <div className="text-[11px] text-slate-400">16+ years commercial chiller &amp; RTU diagnostics</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 leading-relaxed font-mono">
                  &ldquo;Verified operating limits for scroll and semi-hermetic RTU compressors. Confirmed 8°F to 14°F suction superheat band under steady load. All diagnostic steps compliant with ASHRAE 90.1.&rdquo;
                </div>

                <div className="p-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 text-[10px] font-mono text-slate-400 space-y-1">
                  <div className="text-slate-300 font-bold">Schema Metadata Injected:</div>
                  <div>&bull; reviewedBy: Person (jobTitle: Lead Applications Engineer)</div>
                  <div>&bull; hasCredential: PE, ASHRAE Fellow</div>
                  <div>&bull; lastReviewed: 2026-03-15</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSampleArticleModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Inspect Sample Reviewed Page →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION: TRANSPARENT & FULLY VISIBLE */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Clear &amp; Defensible Answers
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">
              Direct technical answers to common questions about industrial content generation, AEO, and engineering review.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                category: "Search Economics",
                q: "What is the 'Zero-Volume Search Trap' in industrial B2B?",
                a: "High-value industrial searches (e.g., 'suction liquid floodback RTU scroll compressor' or 'rotary lobe pump elastomer seal swelling 3-A CIP') typically show fewer than 30 monthly searches on generalist SEO tools like Ahrefs or Semrush, leading traditional agencies to dismiss them as 'zero-volume.' However, each of these specific searchers is an application engineer, plant reliability manager, or procurement lead specifying a $50,000 to $500,000 equipment purchase. ForgeFlow generates certified, deeply technical pages mapped to failure modes and standards to capture these high-intent buyers when they search on Google or prompt AI Answer Engines.",
              },
              {
                category: "Answer Engines",
                q: "How does ForgeFlow optimize content for AI Answer Engines (Google AI Overviews, Perplexity, ChatGPT)?",
                a: "LLM-powered answer engines do not index promotional copy or marketing fluff; they parse structured factual entities, clear diagnostic answers, and verified standard citations. ForgeFlow generates structured 45-word direct answer capsules formatted for quick LLM extraction, accompanied by valid multi-entity schema (TechArticle, HowTo, and FAQPage JSON-LD). This enables AI search engines to parse authoritativeness, verify standard compliance (e.g. ASHRAE, ASME, ISO, 3-A), and cite your manufacturer domain as the definitive source.",
              },
              {
                category: "Human Sign-Off",
                q: "How does the human engineer review workflow work?",
                a: "ForgeFlow implements a strict human-in-the-loop review protocol. AI drafts the initial technical article, operating limits table, and diagnostic checklist using pre-built vertical taxonomies. Before any page can be published or exported, a credentialed applications engineer reviews the technical parameters, tolerance bands, and referenced regulatory codes in our QA Review Studio. The engineer can approve the draft with verified sign-off notes or request specific revisions. Once approved, the system injects Schema.org reviewedBy Person metadata with the engineer's credentials and LinkedIn profile.",
              },
              {
                category: "Integrations & CMS",
                q: "Which CMS and platform integrations does ForgeFlow support?",
                a: "ForgeFlow supports multi-format publishing and direct CMS synchronization. You can export standalone semantic HTML5 files with embedded JSON-LD schema, clean GitHub-flavored Markdown (.md), or CSV spreadsheets mapped for Webflow CMS collections and WordPress WP All Import. For enterprise stacks, ForgeFlow provides real-time outbound webhooks that dispatch published article JSON payloads directly into headless CMS architectures (Contentful, Strapi, Sanity) or custom API endpoints.",
              },
              {
                category: "Zero Hallucination",
                q: "How does ForgeFlow control technical accuracy and prevent AI hallucinations?",
                a: "ForgeFlow eliminates hallucinations through a multi-tier closed-loop quality gate: (1) Deterministic prompt chaining strictly bounded by certified engineering standard bodies (ISO, ASME, 3-A, AGMA, NFPA); (2) Link allowlists that restrict citations to official standard registries and verified OEM manuals; (3) An anti-fluff AST filter that removes non-falsifiable marketing adjectives; and (4) Mandatory application engineer review before publishing. We are transparent that AI drafts should never bypass human engineering review in high-liability industrial applications.",
              },
              {
                category: "OEM Manuals & RAG",
                q: "Can we connect our proprietary equipment catalogs, CAD specs, and service SOPs?",
                a: "Yes. On our Growth and Fleet plans, ForgeFlow features a Datasheet & Spec Ingestion engine. You can upload manufacturer PDF manuals, CSV product specification sheets, and internal diagnostic SOPs. Our taxonomy extractor maps your proprietary part numbers, torque specifications, operating envelopes, and OEM replacement kits into dedicated company-specific taxonomy matrices.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100">
                    {faq.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. BOTTOM CALL TO ACTION BANNER */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-sky-50/25 to-slate-100/70 border-t border-slate-200/80 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading, Subtext, and Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>Pilot Program Open · Cohort Onboarding</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Ready to Build an Engineer-Verified <span className="text-sky-600">Search Pipeline?</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Replace generic marketing copy with engineer-reviewed, deterministic AEO content. Built for equipment manufacturers capturing high-intent zero-volume searches across 7 pre-built industrial sectors. Onboarding our Founding Pilot Cohort.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => { setDemoSubmitted(false); setDemoModalOpen(true); }}
                  className="px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold shadow-lg shadow-sky-600/25 transition cursor-pointer flex items-center gap-2"
                >
                  <span>Book a 20-minute pilot walkthrough</span>
                  <span>&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="px-7 py-3.5 rounded-xl border-2 border-slate-300 hover:border-sky-500 text-slate-800 hover:text-sky-700 bg-white hover:bg-sky-50/50 text-sm font-bold transition cursor-pointer shadow-xs"
                >
                  Start a free pilot
                </button>
              </div>
            </div>

            {/* Right Column: Two Floating Live Cards (Styled 1:1 with ForgeFlow Theme) */}
            <div className="lg:col-span-5 flex items-start justify-center lg:justify-end gap-4 sm:gap-6 pt-4 lg:pt-0">
              {/* Card 1: Production Monitor */}
              <div className="w-[210px] sm:w-[230px] rounded-2xl bg-white shadow-xl shadow-slate-300/40 border border-slate-200/80 overflow-hidden shrink-0">
                <div className="bg-gradient-to-r from-slate-900 to-sky-950 px-4 py-3 text-white text-xs font-bold tracking-tight text-center sm:text-left flex items-center justify-between border-b border-sky-900/40">
                  <span className="flex items-center gap-1.5 font-mono">
                    <span className="text-sky-400">⚡</span>
                    <span>AEO Content Monitor</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>

                <div className="p-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-medium text-slate-600">QA Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-mono border border-emerald-200">
                      8/8 PASS
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[9px] shrink-0 font-bold bg-emerald-50">
                      ✓
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">ASHRAE 90.1 Specs</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 font-medium">Verified Tolerances</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[9px] shrink-0 font-bold bg-emerald-50">
                      ✓
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Application Sign-Off</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 font-medium">PE Approved</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[9px] shrink-0 font-bold bg-emerald-50">
                      ✓
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Schema JSON-LD</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 font-medium">AEO Syndicated</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Engine Citations */}
              <div className="w-[210px] sm:w-[230px] rounded-2xl bg-white shadow-xl shadow-slate-300/40 border border-slate-200/80 overflow-hidden shrink-0">
                <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-white text-xs font-bold tracking-tight text-center sm:text-left flex items-center justify-between border-b border-sky-500/40">
                  <span className="flex items-center gap-1.5 font-mono">
                    <span>✨</span>
                    <span>AI Engine Citations</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-sky-200 animate-pulse"></span>
                </div>

                <div className="p-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-medium text-slate-600">Active Citations</span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold font-mono border border-sky-200">
                      Top 1
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-800">Google AI Overview</div>
                    <div className="text-[11px] text-sky-700 font-semibold mt-0.5">
                      Cited as Primary Source
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div>
                    <div className="text-xs font-semibold text-slate-800">Perplexity Copilot</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      #1 Diagnostic Source
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div>
                    <div className="text-xs font-semibold text-slate-800">ChatGPT Search</div>
                    <div className="text-[11px] text-sky-600 font-semibold mt-0.5">
                      Entity Graph Indexed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. ENTERPRISE FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
        <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">Industrial AEO &amp; SEO Executive Briefing</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                    MONTHLY DIGEST
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                  Curated zero-volume search patterns, industrial schema updates, and Answer Engine citation case studies delivered to equipment marketing leads.
                </p>
              </div>

              <div className="md:col-span-5">
                {newsletterSubscribed ? (
                  <div className="rounded-xl bg-emerald-950/60 border border-emerald-800 p-3 text-emerald-300 text-xs font-medium flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✔</span>
                    <span>Subscribed! Welcome to the Industrial AEO Briefing.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="work.email@manufacturer.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shrink-0 cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-xl bg-white shadow-xs inline-block shrink-0"><Image src="/logo-icon.png" alt="ForgeFlow Logo" width={36} height={36} className="h-9 w-9 object-contain" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight text-white">ForgeFlow</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                      v2.4
                    </span>
                  </div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                    Industrial Content Engine
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pr-4">
                The deterministic programmatic content and Answer Engine Optimization (AEO) platform built exclusively for industrial equipment manufacturers, OEM suppliers, and engineering enterprises.
              </p>

              <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Deterministic Engine Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Continuous Automated QA Gating
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Closed-Loop QA Protocol</span>
                  <span className="text-sky-400 font-bold">8 Validation Gates</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Deterministic Industrial AEO Engine &bull; Built for Manufacturing Engineering Teams
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                Platform Engine
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#platform-suite" onClick={() => setActiveFeatureTab("matrix")} className="hover:text-sky-400 transition">Taxonomy Matrix</a></li>
                <li><a href="#platform-suite" onClick={() => setActiveFeatureTab("qa")} className="hover:text-sky-400 transition">Deterministic QA Studio</a></li>
                <li><a href="#platform-suite" onClick={() => setActiveFeatureTab("schema")} className="hover:text-sky-400 transition">AEO Schema Hub</a></li>
                <li><a href="#platform-suite" onClick={() => setActiveFeatureTab("risk")} className="hover:text-sky-400 transition">Risk &amp; Spec Gating</a></li>
                <li><a href="#platform-suite" onClick={() => setActiveFeatureTab("kanban")} className="hover:text-sky-400 transition">Publishing Kanban</a></li>
                <li><a href="#platform-suite" onClick={() => setActiveFeatureTab("analytics")} className="hover:text-sky-400 transition">Zero-Volume Analytics</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                Vertical Taxonomies
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                {verticalShowcase.map((v, i) => (
                  <li key={v.title}>
                    <a
                      href="#taxonomies"
                      onClick={() => setActiveVerticalIndex(i)}
                      className="hover:text-sky-400 transition truncate block"
                    >
                      {v.badge}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                Integrations
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="text-slate-300 font-medium">Webflow CMS API</span></li>
                <li><span className="text-slate-300 font-medium">WordPress REST API</span></li>
                <li><span className="text-slate-300 font-medium">Contentful Webhooks</span></li>
                <li><span className="text-slate-300 font-medium">Headless JSON Exports</span></li>
                <li><span className="text-slate-300 font-medium">Google Search Console</span></li>
                <li><span className="text-slate-300 font-medium">Perplexity Citation API</span></li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                Trust &amp; Governance
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button type="button" onClick={() => setLegalModal("security")} className="hover:text-sky-400 transition text-left cursor-pointer">
                    Security Governance
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setLegalModal("sla")} className="hover:text-sky-400 transition text-left cursor-pointer">
                    Service Standards
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setLegalModal("privacy")} className="hover:text-sky-400 transition text-left cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setLegalModal("terms")} className="hover:text-sky-400 transition text-left cursor-pointer">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <a href="#faq" className="hover:text-sky-400 transition">
                    Technical FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-6 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="space-y-1 text-center sm:text-left">
              <div>&copy; 2026 ForgeFlow. All rights reserved. Industrial SEO &amp; AEO Content Engine.</div>
              <div className="text-[11px] text-slate-400 font-normal">
                Founding Pilot Cohort onboarding open for OEM equipment manufacturers. Inquiries: pilot@forgeflow.industrial
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => setLegalModal("privacy")} className="hover:text-slate-300 cursor-pointer">Privacy</button>
              <button type="button" onClick={() => setLegalModal("terms")} className="hover:text-slate-300 cursor-pointer">Terms</button>
              <button type="button" onClick={() => setLegalModal("security")} className="hover:text-slate-300 cursor-pointer">Security</button>
              <button type="button" onClick={() => setLegalModal("sla")} className="hover:text-slate-300 cursor-pointer">Service Standards</button>
            </div>
          </div>
        </div>
      </footer>

      {/* 13. BOOK A DEMO MODAL */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-2xl max-w-lg w-full relative">
            <button
              type="button"
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <Image src="/logo-icon.png" alt="ForgeFlow Logo" width={44} height={44} className="h-11 w-11 object-contain shrink-0" />
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700">1-on-1 Walkthrough</p>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Schedule an Industrial AEO Demo</h3>
              </div>
            </div>

            {demoSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl mx-auto flex items-center justify-center">
                  ✓
                </div>
                <h4 className="text-base font-bold text-slate-900">Demo Scheduled!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{demoName}</strong>. Our senior taxonomy engineer will reach out to <strong>{demoEmail}</strong> with an invite and pre-loaded sample slices for <strong>{demoCompany}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  See how ForgeFlow maps your specific machinery models, parts catalogs, and operating failure modes into Google AI Overviews and Perplexity citations.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Alex Henderson, PE"
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Work Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="name@company.com"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Company / Manufacturer Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. AccuDrive Reliability Systems"
                    value={demoCompany}
                    onChange={(e) => setDemoCompany(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Primary Industry Vertical
                  </label>
                  <select
                    value={demoVertical}
                    onChange={(e) => setDemoVertical(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                  >
                    <option value="HVAC & Commercial Refrigeration">HVAC &amp; Commercial Refrigeration</option>
                    <option value="Food & Beverage / Sanitary CIP">Food &amp; Beverage / Sanitary CIP</option>
                    <option value="Automotive Tier-1 & Stamping">Automotive Tier-1 &amp; Stamping</option>
                    <option value="Precision CNC & Machine Tools">Precision CNC &amp; Machine Tools</option>
                    <option value="Industrial Hydraulics & Fluid Power">Industrial Hydraulics &amp; Fluid Power</option>
                    <option value="Plastics & Polymer Extrusion">Plastics &amp; Polymer Extrusion</option>
                    <option value="Heavy Mining & Bulk Materials">Heavy Mining &amp; Bulk Materials</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-sky-600/20 cursor-pointer"
                >
                  Confirm Demo Request →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 14. AUTOMATED TIMED REPETITIVE SIGNUP POPUP (EVERY 3.5 MINUTES) */}
      {timedSignupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl border border-sky-100 p-7 sm:p-8 shadow-2xl max-w-md w-full relative">
            <button
              type="button"
              onClick={() => setTimedSignupOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer transition"
              aria-label="Dismiss signup popup"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-3">
              <Image src="/logo-icon.png" alt="ForgeFlow" width={32} height={32} className="h-8 w-8 object-contain shrink-0" />
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                <span>SPECIAL 14-DAY PILOT INVITATION</span>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              Dominate Industrial AI Answer Engines in 2026
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Capture high-intent zero-volume queries before competitors. Deploy certified technical pages with 100% deterministic schema.
            </p>

            <form
              className="mt-5 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setTimedSignupOpen(false);
                openAuth("register");
              }}
            >
              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-slate-600 mb-1">
                  Company / Manufacturing Plant
                </label>
                <input
                  required
                  placeholder="e.g. AccuDrive Reliability Systems"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-slate-600 mb-1">
                  Corporate Work Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="engineer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-sky-600/25 transition cursor-pointer"
              >
                Claim Free 14-Day Pilot Access →
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>No credit card required.</span>
              <button
                type="button"
                onClick={() => {
                  setTimedSignupOpen(false);
                  openAuth("login");
                }}
                className="font-bold text-sky-600 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 15. LEGAL MODALS */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative text-slate-700">
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            {legalModal === "privacy" && (
              <div className="space-y-4 text-xs leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
                <div className="flex items-center gap-2 text-sky-700 font-mono text-[11px] font-bold uppercase">
                  <span>Privacy Policy</span>
                  <span>•</span>
                  <span>Effective November 2026 · Pilot Release</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">ForgeFlow Data Privacy Framework</h3>
                <p>
                  At ForgeFlow (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we recognize that industrial equipment specifications, CAD tolerances, and OEM operating manuals represent core intellectual property. This Privacy Framework governs how tenant data is ingested, processed, and safeguarded.
                </p>
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">1. Zero-Training Guarantee on Client IP</strong>
                    <p className="text-slate-600">
                      Machine manuals, equipment model numbers, diagnostic limits, and CAD spec sheets uploaded to your dedicated tenant workspace are strictly processed for your organization&apos;s programmatic drafts. We guarantee that client data is never used to train, fine-tune, or cross-train public foundation AI models.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">2. Multi-Tenant Cryptographic Isolation</strong>
                    <p className="text-slate-600">
                      Every enterprise organization operates inside cryptographically isolated tenant boundaries. API integration tokens (Webflow, WordPress, HubSpot) and CMS webhook signing secrets are encrypted at rest using AES-256 GCM.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">3. Data Retention &amp; Permanent Purge Rights</strong>
                    <p className="text-slate-600">
                      You retain full control over your content repository. Upon cancellation or written request to privacy@forgeflow.industrial, all uploaded documents, extracted spec nodes, and draft revisions are permanently purged from database tables and backup caches within 30 days.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">4. Compliance &amp; Regulatory Inquiries</strong>
                    <p className="text-slate-600">
                      For dedicated Data Processing Agreements (DPA), custom hosting requirements, or privacy audits, reach our team directly at <strong>privacy@forgeflow.industrial</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {legalModal === "terms" && (
              <div className="space-y-4 text-xs leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
                <div className="flex items-center gap-2 text-sky-700 font-mono text-[11px] font-bold uppercase">
                  <span>Terms of Service</span>
                  <span>•</span>
                  <span>Commercial SaaS Master Services Agreement</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Subscription &amp; Engineering Usage Terms</h3>
                <p>
                  These Terms of Service govern access to the ForgeFlow industrial content generation engine, QA studio, and Answer Engine Optimization (AEO) syndication platform.
                </p>
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">1. 100% Client Content Ownership</strong>
                    <p className="text-slate-600">
                      You retain complete, exclusive intellectual property ownership of all technical articles, operating limit tables, diagnostic checklists, and JSON-LD structured schemas generated and published through your workspace. ForgeFlow claims zero royalty or IP rights to your published materials.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 space-y-1">
                    <strong className="text-amber-900 block text-xs">2. Mandatory Human Engineering Review &amp; Physical Liability Disclaimer</strong>
                    <p className="text-amber-800">
                      ForgeFlow is an automated drafting and search optimization platform. All generated operating envelopes, torque specifications, and diagnostic procedures must be independently reviewed and approved by your organization&apos;s certified Application Engineers prior to field implementation. ForgeFlow assumes no liability for machinery damage, physical injury, or production downtime resulting from unverified maintenance operations.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">3. Subscription Tiers &amp; Net-30 Invoicing</strong>
                    <p className="text-slate-600">
                      Subscription fees are billed monthly or annually as selected. Enterprise Fleet accounts may elect payment via Purchase Order (PO) under standard Net-30 terms with official ACH/Fedwire remittance.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">4. Termination &amp; Cancellation</strong>
                    <p className="text-slate-600">
                      You may cancel your subscription at any time through the in-app billing portal. Access continues through the end of the active billing cycle. Full data export in JSON/CSV format is available at any time prior to termination.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {legalModal === "security" && (
              <div className="space-y-4 text-xs leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
                <div className="flex items-center gap-2 text-sky-700 font-mono text-[11px] font-bold uppercase">
                  <span>Security Whitepaper</span>
                  <span>•</span>
                  <span>Industrial IT Governance Framework</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Security &amp; Data Governance</h3>
                <p>
                  ForgeFlow is architected specifically to meet the stringent data sovereignty, confidentiality, and liability requirements of heavy equipment OEMs and industrial automation enterprises.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-bold text-slate-900">Encryption in Transit</div>
                    <div className="text-slate-600">TLS 1.3 enforced across all web traffic and API integrations with modern cipher suites and HSTS.</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-bold text-slate-900">Encryption at Rest</div>
                    <div className="text-slate-600">AES-256 bit disk and column encryption for database tables, API keys, and publishing tokens.</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-bold text-slate-900">Multi-Tenant Isolation</div>
                    <div className="text-slate-600">Enforced schema boundaries ensure complete logical data separation across organizations.</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-bold text-slate-900">Immutable Audit Trail</div>
                    <div className="text-slate-600">Every engineer sign-off, spec change, and publishing action is logged with user ID, role, and IP address.</div>
                  </div>
                </div>
              </div>
            )}

            {legalModal === "sla" && (
              <div className="space-y-4 text-xs leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
                <div className="flex items-center gap-2 text-sky-700 font-mono text-[11px] font-bold uppercase">
                  <span>Service Standards</span>
                  <span>•</span>
                  <span>Deterministic Quality Commitment</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Platform Reliability &amp; Quality Commitment</h3>
                <p>
                  We are committed to delivering deterministic, reliable industrial content generation with high platform availability and responsive technical support.
                </p>
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">Deterministic Closed-Loop Quality Standard</strong>
                    <p className="text-slate-600">
                      Every technical slice generated by ForgeFlow must successfully pass 8 automated structural validation checks (word count, fluff filtering, standard citation verification, link allowlists, and schema formatting) before it can be queued for engineer review.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">Pilot Support Response Times</strong>
                    <p className="text-slate-600">
                      Participants in our Founding Pilot Cohort receive priority direct technical support. Inquiries and integration assistance are responded to within one standard business day (with 4-hour critical response for Enterprise Fleet accounts).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block text-xs">Maintenance &amp; Upgrades</strong>
                    <p className="text-slate-600">
                      Planned infrastructure updates and database maintenance are scheduled during off-peak weekend windows with advance email notification to organization administrators.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 16. AUTH MODAL (SIGN IN / REGISTER) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-2xl max-w-md w-full relative">
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <Image src="/logo-icon.png" alt="ForgeFlow Logo" width={44} height={44} className="h-11 w-11 object-contain shrink-0" />
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700">Enterprise Tenant</p>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Forge<span className="text-sky-600">Flow</span> Console
                </h3>
              </div>
            </div>

            <h4 className="text-base font-bold text-slate-900">
              {authMode === "register" ? "Create Enterprise Workspace" : "Sign In to Industrial Console"}
            </h4>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {authMode === "register"
                ? "Configure your dedicated workspace with pre-built vertical taxonomies, QA validation, and AEO schema."
                : "Enter your corporate credentials to access your programmatic drafts and analytics."}
            </p>

            {/* Quick 1-Click Demo Console Access */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Instant Evaluator Test Drive
                </span>
                <span className="text-sky-400 text-[10px]">Zero Typing Required</span>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    const response = await fetch("/api/auth/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: "admin@accudrive.io", password: "ForgeFlow2026!" }),
                    });
                    const data = await response.json();
                    if (!response.ok || !data.user) throw new Error(data.error || "Login failed");
                    onAuthenticated(data.user);
                  } catch (err: unknown) {
                    setError(err instanceof Error ? err.message : "Test drive sign-in failed");
                  } finally {
                    setBusy(false);
                  }
                }}
                className="w-full py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                <span>⚡ 1-Click Launch Live Demo Console (Owner / Admin)</span>
              </button>
              <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                <span>Or switch role:</span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      const response = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: "marcus.vance@accudrive.io", password: "ForgeFlow2026!" }),
                      });
                      const data = await response.json();
                      if (!response.ok || !data.user) throw new Error(data.error || "Login failed");
                      onAuthenticated(data.user);
                    } catch (err: unknown) {
                      setError(err instanceof Error ? err.message : "Test drive sign-in failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="text-sky-300 hover:underline cursor-pointer"
                >
                  Engineer Reviewer
                </button>
                <span>•</span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      const response = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: "content.lead@accudrive.io", password: "ForgeFlow2026!" }),
                      });
                      const data = await response.json();
                      if (!response.ok || !data.user) throw new Error(data.error || "Login failed");
                      onAuthenticated(data.user);
                    } catch (err: unknown) {
                      setError(err instanceof Error ? err.message : "Test drive sign-in failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="text-sky-300 hover:underline cursor-pointer"
                >
                  Content Author
                </button>
              </div>
            </div>

            <div className="relative my-4 flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono uppercase text-slate-400">
                Or enter corporate credentials
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form className="mt-5 space-y-3.5" onSubmit={handleAuthSubmit}>
              {authMode === "register" ? (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Company / Manufacturing Plant Name
                  </label>
                  <input
                    id="company-name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="e.g. AccuDrive Reliability Systems"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
              ) : null}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Corporate / Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  {authMode === "login" && (
                    <Link href="/forgot-password" className="text-[11px] text-sky-600 hover:underline font-semibold">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="flex rounded-xl border border-slate-300 bg-slate-50/50 focus-within:border-sky-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={authMode === "register" ? 8 : undefined}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="rounded-r-xl px-3 text-[11px] font-mono font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                {authMode === "register" ? (
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className={password.length >= 8 ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      {password.length >= 8 ? "✓ Minimum 8 characters met" : "Requires minimum 8 characters"}
                    </span>
                    <span className="font-mono text-slate-400">{password.length}/8+</span>
                  </div>
                ) : null}
              </div>

              {authMode === "register" ? (
                <div>
                  <label htmlFor="confirm-password" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
              ) : null}

              {error ? (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 font-medium">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-sky-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-sky-600/20 transition hover:bg-sky-500 disabled:opacity-60 cursor-pointer"
              >
                {busy ? "Authenticating…" : authMode === "register" ? "Create Workspace & Launch Console" : "Enter Console"}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
              {authMode === "register" ? (
                <span>
                  Already have an enterprise tenant?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setError("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    className="font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Need a new organization workspace?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setError("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    className="font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    Register Tenant
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 15. SAMPLE ARTICLE MODAL: COMMERCIAL RTU COMPRESSOR FAILURE */}
      {sampleArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  LIVE SAMPLE ARTICLE
                </span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  HVAC &amp; Commercial Refrigeration Slice
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSampleArticleModalOpen(false);
                    openAuth("register");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Start Pilot →
                </button>
                <button
                  type="button"
                  onClick={() => setSampleArticleModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer transition"
                  aria-label="Close sample article modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed font-sans">
              <div className="space-y-2 border-b border-slate-200 pb-5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  ASHRAE Standard 90.1 &amp; AHRI 340/360 Diagnostic Protocol
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Automating Fault Detection &amp; Diagnostics (FDD) to Prevent Commercial RTU Compressor Failure
                </h1>
                <p className="text-xs text-slate-500 font-mono">
                  Target Search: &ldquo;commercial rtu compressor flooded start fdd&rdquo; &bull; Est. Deal Size: $95,000+ &bull; 0.0% Marketing Fluff
                </p>
              </div>

              {/* 45-Word Direct Answer Capsule (AEO Optimized) */}
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/80 space-y-1">
                <div className="text-[10px] font-mono font-bold text-sky-800 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
                  <span>AEO Direct-Answer Capsule (Google AI Overview &amp; Perplexity Target)</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  Automating Fault Detection and Diagnostics (FDD) for commercial Rooftop Units (RTUs) prevents catastrophic compressor failure by continuously calculating suction superheat and discharge line temperature. Detecting liquid floodback and crankcase oil dilution before thermal overload trips reduces premature replacement costs and guarantees ASHRAE 90.1 seasonal operating efficiency.
                </p>
              </div>

              {/* Section 1: Executive Summary & Failure Causation */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
                  1. Root Cause Analysis: Suction Liquid Floodback &amp; Crankcase Migration
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In commercial packaged rooftop equipment between 15 and 25 tons, scroll and semi-hermetic compressor failures rarely stem from manufacturing defects. Over 74% of mechanical lockups originate from unmitigated liquid refrigerant return during low-ambient cooling cycles and erratic thermostatic expansion valve (TXV) hunting.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When refrigerant droplets enter the compressor suction plenum, they wash lubrication oil from bearing journals and scroll flank seals. This causes immediate metal-to-metal contact, accelerated swarf generation, and thermal trip of the internal motor protector.
                </p>
              </div>

              {/* Section 2: Verified Operating Parameters Table */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
                  2. Critical Operating Tolerances &amp; Sensor Thresholds
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100/80 font-mono text-slate-700">
                      <tr>
                        <th className="p-3">Parameter</th>
                        <th className="p-3">Design Operating Window</th>
                        <th className="p-3">Fault Trip Threshold</th>
                        <th className="p-3">Corrective Engineering Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Suction Superheat</td>
                        <td className="p-3 font-mono text-emerald-700">8°F to 14°F (steady state)</td>
                        <td className="p-3 font-mono text-red-600">&lt; 4°F for &gt; 120 sec</td>
                        <td className="p-3 text-slate-600">Throttle electronic expansion valve (EEV) step rate</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Discharge Line Temp</td>
                        <td className="p-3 font-mono text-emerald-700">160°F to 205°F</td>
                        <td className="p-3 font-mono text-red-600">&gt; 225°F (6&quot; from valve)</td>
                        <td className="p-3 text-slate-600">Inspect for condenser coil fouling or low charge</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Crankcase Heater Delta</td>
                        <td className="p-3 font-mono text-emerald-700">&gt; 20°F above ambient</td>
                        <td className="p-3 font-mono text-red-600">&lt; 10°F during standby</td>
                        <td className="p-3 text-slate-600">Verify heater element continuity and relay control</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Diagnostic Step-by-Step SOP */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
                  3. Field Engineering Diagnostic Protocol (SOP)
                </h2>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600">
                  <li><strong>Isolate Suction Pressure Transducer:</strong> Connect digital manifold gauges directly to the true suction service port and verify analog calibration against BAS telemetry within &plusmn;1.5 PSI.</li>
                  <li><strong>Audit Liquid Subcooling:</strong> Measure liquid line pressure and temperature leaving the condenser coil. Subcooling must maintain 10°F to 15°F before modulating TXV superheat setpoints.</li>
                  <li><strong>Record Crankcase Temperature Delta:</strong> During off-cycles, confirm the crankcase temperature remains a minimum of 20°F (11.1°C) higher than saturated suction temperature to eliminate refrigerant migration into the oil sump.</li>
                </ol>
              </div>

              {/* EXPERT REVIEW SECTION (DYNAMIC OUTPUT PREVIEW) */}
              <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-mono font-bold text-emerald-900 uppercase">
                      Engineering Verification Sign-Off Protocol
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-300 text-amber-800">
                      DEMO SPECIMEN
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                      APPROVED &bull; March 15, 2026
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 font-normal">
                  In production, your licensed Application Engineers review tolerances and sign off on drafts before publishing. This attaches certified Schema.org <code>reviewedBy</code> metadata:
                </p>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    AE
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      Alex Henderson, PE
                      <span className="ml-2 font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ASHRAE Fellow
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Lead Thermal &amp; Mechanical Applications Engineer &bull; 18 years HVAC/RTU diagnostics
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs text-slate-700 italic">
                  &ldquo;I have reviewed the suction superheat limits, thermal cut-out parameters, and referenced ASHRAE 90.1 tolerances. The diagnostic protocol conforms to manufacturer field testing procedures with zero speculative or unsupported performance claims.&rdquo;
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-emerald-800">
                  <div className="bg-white p-2 rounded border border-emerald-200">✓ Spec Accuracy PASS</div>
                  <div className="bg-white p-2 rounded border border-emerald-200">✓ ASHRAE 90.1 PASS</div>
                  <div className="bg-white p-2 rounded border border-emerald-200">✓ Tolerances PASS</div>
                  <div className="bg-white p-2 rounded border border-emerald-200">✓ Schema.org PASS</div>
                </div>
              </div>

              {/* Technical FAQ */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
                  Frequently Asked Diagnostic Questions
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <strong className="text-slate-900 block mb-1">What suction superheat indicates active liquid floodback?</strong>
                    <span className="text-slate-600">A suction superheat reading below 4°F (2.2°C) measured within 6 inches of the compressor suction service port indicates that unevaporated liquid refrigerant is entering the scroll flanks.</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <strong className="text-slate-900 block mb-1">How does crankcase oil dilution cause motor bearing lockup?</strong>
                    <span className="text-slate-600">Liquid refrigerant dissolves into polyolester (POE) compressor oil, lowering its kinematic viscosity below the minimum 32 cSt threshold required to support hydrodynamic bearing loads.</span>
                  </div>
                </div>
              </div>

              {/* JSON-LD Schema Snippet */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] space-y-1">
                <div className="text-emerald-400 font-bold">{"// Injected Schema.org TechArticle + reviewedBy Person Entity"}</div>
                <div>{`{`}</div>
                <div className="pl-3">{`"@context": "https://schema.org",`}</div>
                <div className="pl-3">{`"@type": "TechArticle",`}</div>
                <div className="pl-3">{`"headline": "Automating Fault Detection & Diagnostics to Prevent RTU Compressor Failure",`}</div>
                <div className="pl-3">{`"reviewedBy": {`}</div>
                <div className="pl-6">{`"@type": "Person",`}</div>
                <div className="pl-6">{`"name": "Alex Henderson, PE",`}</div>
                <div className="pl-6">{`"jobTitle": "Lead Thermal & Mechanical Applications Engineer",`}</div>
                <div className="pl-6">{`"hasCredential": "PE, ASHRAE Fellow"`}</div>
                <div className="pl-3">{`},`}</div>
                <div className="pl-3">{`"lastReviewed": "2026-03-15",`}</div>
                <div className="pl-3">{`"dateModified": "2026-03-15T10:00:00Z"`}</div>
                <div>{`}`}</div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500 font-mono">
                Generate 50+ pages like this for your product catalog in &lt; 90 seconds.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSampleArticleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Close Sample
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSampleArticleModalOpen(false);
                    openAuth("register");
                  }}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  Start Free Pilot Cohort →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 16. JSON-LD STRUCTURED DATA SCHEMAS (ORGANIZATION, SOFTWAREAPPLICATION, FAQPAGE) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ForgeFlow",
              url: "https://forgeflow.ai",
              logo: "https://forgeflow.ai/logo.png",
              description: "Deterministic B2B Industrial SEO & AEO Content Engine built for equipment manufacturers.",
              foundingDate: "2025",
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ForgeFlow Enterprise Engine",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: "Programmatic SEO and Answer Engine Optimization (AEO) platform generating engineer-reviewed technical landing pages for heavy equipment manufacturers.",
              offers: {
                "@type": "Offer",
                price: "199.00",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is the 'Zero-Volume Search Trap' in industrial B2B?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "High-value industrial searches typically show fewer than 30 monthly searches on generalist SEO tools like Ahrefs or Semrush, leading traditional agencies to dismiss them as zero-volume. However, each of these specific searchers is an application engineer, plant reliability manager, or procurement lead specifying a $50,000 to $500,000 equipment purchase. ForgeFlow generates certified, deeply technical pages mapped to failure modes and standards to capture these high-intent buyers when they search on Google or prompt AI Answer Engines.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does ForgeFlow optimize content for AI Answer Engines (Google AI Overviews, Perplexity, ChatGPT)?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "LLM-powered answer engines do not index promotional copy or marketing fluff; they parse structured factual entities, clear diagnostic answers, and verified standard citations. ForgeFlow generates structured 45-word direct answer capsules formatted for quick LLM extraction, accompanied by valid multi-entity schema (TechArticle, HowTo, and FAQPage JSON-LD). This enables AI search engines to parse authoritativeness, verify standard compliance (e.g. ASHRAE, ASME, ISO, 3-A), and cite your manufacturer domain as the definitive source.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does the human engineer review workflow work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "ForgeFlow implements a strict human-in-the-loop review protocol. AI drafts the initial technical article, operating limits table, and diagnostic checklist using pre-built vertical taxonomies. Before any page can be published or exported, a credentialed applications engineer reviews the technical parameters, tolerance bands, and referenced regulatory codes in our QA Review Studio. The engineer can approve the draft with verified sign-off notes or request specific revisions. Once approved, the system injects Schema.org reviewedBy Person metadata with the engineer's credentials and LinkedIn profile.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Which CMS and platform integrations does ForgeFlow support?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "ForgeFlow supports multi-format publishing and direct CMS synchronization. You can export standalone semantic HTML5 files with embedded JSON-LD schema, clean GitHub-flavored Markdown (.md), or CSV spreadsheets mapped for Webflow CMS collections and WordPress WP All Import. For enterprise stacks, ForgeFlow provides real-time outbound webhooks that dispatch published article JSON payloads directly into headless CMS architectures (Contentful, Strapi, Sanity) or custom API endpoints.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does ForgeFlow control technical accuracy and prevent AI hallucinations?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "ForgeFlow eliminates hallucinations through a multi-tier closed-loop quality gate: (1) Deterministic prompt chaining strictly bounded by certified engineering standard bodies (ISO, ASME, 3-A, AGMA, NFPA); (2) Link allowlists that restrict citations to official standard registries and verified OEM manuals; (3) An anti-fluff AST filter that removes non-falsifiable marketing adjectives; and (4) Mandatory application engineer review before publishing. We are transparent that AI drafts should never bypass human engineering review in high-liability industrial applications.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can we connect our proprietary equipment catalogs, CAD specs, and service SOPs?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. On our Growth and Fleet plans, ForgeFlow features a Datasheet & Spec Ingestion engine. You can upload manufacturer PDF manuals, CSV product specification sheets, and internal diagnostic SOPs. Our taxonomy extractor maps your proprietary part numbers, torque specifications, operating envelopes, and OEM replacement kits into dedicated company-specific taxonomy matrices.",
                  },
                },
              ],
            },
          ]),
        }}
      />

      {/* 17. FLOATING SCROLL TO TOP BUTTON (BRAND SKY BLUE THEME) */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full border-2 border-sky-600 bg-white text-sky-600 hover:bg-sky-600 hover:text-white shadow-lg shadow-sky-600/25 transition flex items-center justify-center cursor-pointer"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
