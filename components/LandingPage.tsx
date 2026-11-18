"use client";

import { useState } from "react";
import Link from "next/link";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  emailVerified?: string | null;
  organization: { id: string; name: string; plan: string; industry?: string | null; website?: string | null };
};

interface LandingPageProps {
  onAuthenticated: (user: AuthUser) => void;
  defaultAuthMode?: "login" | "register";
}

export function LandingPage({ onAuthenticated, defaultAuthMode }: LandingPageProps) {
  const [authModalOpen, setAuthModalOpen] = useState(Boolean(defaultAuthMode));
  const [authMode, setAuthMode] = useState<"login" | "register">(defaultAuthMode || "register");

  // Demo Modal State
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoCompany, setDemoCompany] = useState("");
  const [demoVertical, setDemoVertical] = useState("HVAC & Commercial Refrigeration");
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Navigation Dropdown State (Oxmaint-inspired megamenus)
  const [activeNavDropdown, setActiveNavDropdown] = useState<"features" | "industries" | "integrations" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Preview Tab Switcher
  const [heroPreviewTab, setHeroPreviewTab] = useState<"taxonomy" | "qa" | "schema" | "citation">("taxonomy");

  // Selected vertical showcase in landing page
  const [activeVerticalIndex, setActiveVerticalIndex] = useState(0);

  // Tabbed Feature Spotlight State (Oxmaint-inspired 6-pillar platform)
  const [activeFeatureTab, setActiveFeatureTab] = useState<"matrix" | "qa" | "schema" | "risk" | "kanban" | "analytics">("matrix");

  // Interactive ROI Calculator State
  const [roiMachines, setRoiMachines] = useState(15);
  const [roiFailures, setRoiFailures] = useState(8);
  const [roiDealSize, setRoiDealSize] = useState(120); // in thousands ($k)

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
      pipelineVal: "$95,000 – $380,000",
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
      pipelineVal: "$120,000 – $450,000",
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
      pipelineVal: "$150,000 – $600,000",
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
      pipelineVal: "$85,000 – $340,000",
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
      pipelineVal: "$110,000 – $420,000",
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
      pipelineVal: "$130,000 – $510,000",
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
      pipelineVal: "$220,000 – $850,000",
      specRisk: "2.1% (Low Risk)",
      sampleHeadline: "Emergency SOP: Preventing Eccentric Bushing Seizure in Continuous Duty Primary Gyratory Skids",
      schemaTypes: ["TechArticle", "FAQPage", "HowTo"],
      badge: "Mining & Heavy",
    },
  ];

  const activeVertical = verticalShowcase[activeVerticalIndex];

  // Calculated ROI Metrics
  const calculatedPages = roiMachines * roiFailures;
  const calculatedSearchers = calculatedPages * 24;
  const calculatedPipeline = Math.round(calculatedPages * roiDealSize * 1.25);
  const calculatedCoverage = Math.min(99.6, +(84 + roiMachines * 0.18).toFixed(1));

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
      {/* 1. TOP STICKY ENTERPRISE NAVBAR (OXMAINT-INSPIRED DROPDOWNS & DUAL CTAS) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-md shadow-sky-600/20 shrink-0">
              FF
            </div>
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

          {/* Desktop Navigation Links with Rich Hover Dropdowns */}
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
                <span className="text-[10px] transition-transform duration-150">⌄</span>
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
                <span className="text-[10px] transition-transform duration-150">⌄</span>
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
                        {v.pipelineVal.split("–")[0]}
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
            <a href="#roi-calculator" className="hover:text-sky-600 transition">ROI Calculator</a>
            <a href="#pricing" className="hover:text-sky-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-sky-600 transition">FAQ</a>
          </nav>

          {/* Action CTAs (Sign In, Book a Demo, Start Free) */}
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
            <a href="#roi-calculator" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">ROI Calculator</a>
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

      {/* 2. HERO SECTION (OXMAINT-INSPIRED VALUE PROPOSITION & LIVE INTERACTIVE CONSOLE) */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/90 text-sky-800 text-xs font-mono font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>Deterministic Industrial Search &amp; Answer Engine Architecture</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Turn Complex Engineering Specs into Pipeline-Generating Search Rankings.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                ForgeFlow eliminates the zero-volume keyword trap for equipment manufacturers.
                Generate certified technical landing pages with pre-built vertical taxonomies, closed-loop
                QA enforcement, and native AEO schema for <strong className="text-slate-800 font-semibold">Google AI Overviews, ChatGPT, and Perplexity</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold shadow-md shadow-sky-600/25 transition cursor-pointer flex items-center gap-2"
                >
                  <span>Launch Workspace &amp; Console</span>
                  <span className="text-sky-200 text-base">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setDemoSubmitted(false); setDemoModalOpen(true); }}
                  className="px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition shadow-2xs cursor-pointer flex items-center gap-2"
                >
                  <span>Schedule Technical Demo</span>
                </button>
                <a
                  href="#taxonomies"
                  className="px-4 py-3.5 text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline"
                >
                  Explore 7 Taxonomies ↓
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Zero Marketing Fluff</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Deterministic Schema.org</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Closed-Loop Structural QA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Webflow / WP Native</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Multi-Tab Hero Console Preview (Oxmaint-style) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/60 relative">
                {/* Window Chrome Header */}
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

                {/* Hero Interactive Tabs */}
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

                {/* Tab 1: Spec Matrix */}
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
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Pipeline Value</div>
                        <div className="font-bold text-emerald-700 font-mono text-[11px] mt-0.5">{activeVertical.pipelineVal}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: QA Check */}
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

                {/* Tab 3: JSON-LD Schema */}
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

                {/* Tab 4: AEO Citation */}
                {heroPreviewTab === "citation" && (
                  <div className="space-y-2.5 text-xs animate-in fade-in duration-100">
                    <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/70 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-purple-800 uppercase">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                        <span>Google AI Overview &amp; Perplexity Simulated Citation</span>
                      </div>
                      <p className="text-slate-800 text-[11px] leading-relaxed">
                        &ldquo;According to the certified standard specification for <strong>{activeVertical.equipment}</strong> under <strong>{activeVertical.standard}</strong>, the diagnostic protocol to address {activeVertical.failure.toLowerCase()} requires…&rdquo;
                      </p>
                      <div className="text-[10px] font-mono text-purple-700 font-bold flex items-center gap-1">
                        <span>Source:</span>
                        <span className="underline">yourdomain.com/{activeVertical.equipment.toLowerCase().replace(/[^a-z0-9]/g, "-")}-spec</span>
                        <span>(Verified #1 AEO Citation)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trigger Action */}
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

      {/* 3. ENTERPRISE LOGO CLOUD (OXMAINT-STYLE SOCIAL PROOF) */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-6">
            Trusted by Leaders in Industrial Equipment, Heavy Automation &amp; Process Engineering
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition">
            <div className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center text-[10px] font-mono">AP</span>
              <span>APEX ROBOTICS</span>
            </div>
            <div className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-mono">VK</span>
              <span>VORTEX CLEAN</span>
            </div>
            <div className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center text-[10px] font-mono">TN</span>
              <span>TITAN CNC</span>
            </div>
            <div className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-purple-700 text-white flex items-center justify-center text-[10px] font-mono">RD</span>
              <span>ROTARY FLOW</span>
            </div>
            <div className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-blue-700 text-white flex items-center justify-center text-[10px] font-mono">ST</span>
              <span>STERLING SKIDS</span>
            </div>
            <div className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-amber-700 text-white flex items-center justify-center text-[10px] font-mono">AP</span>
              <span>AEROPNEUMATIC</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OXMAINT-STYLE TABBED FEATURE SHOWCASE ("THE UNIFIED INDUSTRIAL AEO SUITE") */}
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
              Much like modern CMMS platforms automate physical factory maintenance, ForgeFlow automates and governs your entire digital engineering authority and Answer Engine presence.
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
                      <span>Estimated pipeline revenue valuation for every generated topic slice.</span>
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
                    Closed-Loop Quality Gating That Eliminates AI Hallucinations
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generic AI models hallucinate torque limits and invent non-existent parts. ForgeFlow runs an automated 8-point inspection on every slice before human engineers give final sign-off.
                  </p>
                  <div className="space-y-2 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>Zero-fluff filter: instantly strips buzzwords, hyperbole, and fluff.</span>
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
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase">QA Studio Status Strip</div>
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
                      <span>CTA Integration</span>
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold">PATCHED</span>
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
                    Structured Linked Data Built for Perplexity &amp; ChatGPT
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
                      <span className="text-slate-600">Average Qualified RFQ Deal</span>
                      <span className="font-mono font-bold text-emerald-700">$340,000</span>
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

      {/* 5. INTERACTIVE 7 PRE-BUILT TAXONOMIES SHOWCASE */}
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

          {/* Vertical Tabs */}
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

          {/* Active Vertical Card */}
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
                  Economic &amp; Risk Metrics
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-500">Target Pipeline Value</span>
                    <span className="font-mono text-sm font-bold text-emerald-700">{activeVertical.pipelineVal}</span>
                  </div>
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

      {/* 6. INTERACTIVE ROI & PIPELINE CALCULATOR (OXMAINT-STYLE ENGAGEMENT TOOL) */}
      <section id="roi-calculator" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Interactive ROI Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Calculate Your Industrial Pipeline Revenue Potential
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Estimate the annual B2B pipeline generated when zero-volume engineering queries are indexed with deterministic AEO schema across your equipment lines.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg shadow-slate-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Slider 1: Machines */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                    <span>Number of Equipment / Machine Models</span>
                    <span className="font-mono text-sm text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                      {roiMachines} Models
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="60"
                    value={roiMachines}
                    onChange={(e) => setRoiMachines(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>3 Models</span>
                    <span>30 Models</span>
                    <span>60 Models</span>
                  </div>
                </div>

                {/* Slider 2: Failures */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                    <span>Target Failure Modes &amp; SOPs per Model</span>
                    <span className="font-mono text-sm text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                      {roiFailures} Failure Modes
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={roiFailures}
                    onChange={(e) => setRoiFailures(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>3 SOPs</span>
                    <span>9 SOPs</span>
                    <span>15 SOPs</span>
                  </div>
                </div>

                {/* Slider 3: Deal Size */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                    <span>Average B2B Equipment Sale / Service Contract</span>
                    <span className="font-mono text-sm text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      ${roiDealSize},000
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="400"
                    step="5"
                    value={roiDealSize}
                    onChange={(e) => setRoiDealSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>$25k</span>
                    <span>$200k</span>
                    <span>$400k+</span>
                  </div>
                </div>
              </div>

              {/* Output Result Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl text-white shadow-xl space-y-4">
                <div className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                  Estimated Annual Economic Value
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                    ${(calculatedPipeline).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Estimated pipeline value from zero-volume Answer Engine citations
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Certified Pages:</span>
                    <span className="font-mono font-bold text-white">{calculatedPages} Technical Slices</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Target Buyer Searchers:</span>
                    <span className="font-mono font-bold text-white">~{calculatedSearchers.toLocaleString()}/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">AEO LLM Index Coverage:</span>
                    <span className="font-mono font-bold text-sky-400">{calculatedCoverage}%</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-sky-600/30 cursor-pointer"
                >
                  Capture This Pipeline In Console →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THE 8-STEP INDUSTRIAL WORKFLOW (EXPLAINED IN DETAIL) */}
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

      {/* 8. COMPARISON TABLE: FORGEFLOW VS GENERIC AI VS AGENCIES */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Why ForgeFlow Wins
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Engineered for Industrial Reality, Not Generic Marketing
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Compare how ForgeFlow&apos;s deterministic engine outperforms traditional SEO agencies and generic LLM writing tools.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 text-left">
                  <th className="p-4 font-bold text-slate-900">Capability / Standard</th>
                  <th className="p-4 font-bold text-sky-700 bg-sky-50/70">ForgeFlow Industrial Engine</th>
                  <th className="p-4 font-bold text-slate-600">Generic AI (ChatGPT / Jasper)</th>
                  <th className="p-4 font-bold text-slate-600">Traditional SEO Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-bold text-slate-900">Engineering Spec Accuracy</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-sky-50/30">100% Deterministic (Gated)</td>
                  <td className="p-4 text-red-600">Frequent Spec Hallucinations</td>
                  <td className="p-4 text-slate-600">Hit-or-Miss (Non-engineers)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Answer Engine Optimization (AEO)</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-sky-50/30">Native Multi-Entity JSON-LD</td>
                  <td className="p-4 text-red-600">None (Plain text only)</td>
                  <td className="p-4 text-slate-600">Basic Article schema only</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Zero-Volume Keyword Targeting</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-sky-50/30">Automated Taxonomy Matrix</td>
                  <td className="p-4 text-slate-600">Requires manual prompting</td>
                  <td className="p-4 text-red-600">Ignored (Labeled &ldquo;0 volume&rdquo;)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Closed-Loop Quality Gating</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-sky-50/30">8 Automated Validation Gates</td>
                  <td className="p-4 text-red-600">No gating or rules engine</td>
                  <td className="p-4 text-slate-600">Subjective human editing</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Turnaround Speed</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-sky-50/30">&lt; 90 seconds per slice</td>
                  <td className="p-4 text-slate-600">2–5 mins (requires rewriting)</td>
                  <td className="p-4 text-red-600">3 to 6 weeks per article</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Monthly Cost Structure</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-sky-50/30">$199 – $799/mo flat</td>
                  <td className="p-4 text-slate-600">$20 – $100/mo (No workflow)</td>
                  <td className="p-4 text-red-600">$8,000 – $25,000/mo retainer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER TESTIMONIALS (OXMAINT-STYLE AUTHENTIC CASE STUDIES) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Customer Impact
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Trusted by Industrial Marketing &amp; Engineering Teams
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              See how manufacturers are converting low-volume technical search into multimillion-dollar B2B pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Standard SEO agencies told us our keywords had &lsquo;zero volume&rsquo;. ForgeFlow generated 45 technical troubleshooting pages for our robotic actuators, and within 60 days we captured two major automotive tier-1 RFQs worth over $700k.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                  MV
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Marcus Vance</div>
                  <div className="text-[11px] text-slate-500">VP of Marketing, Apex Robotics</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Our application engineers are notorious perfectionists who hated our marketing content. When they saw ForgeFlow&rsquo;s 3-A Sanitary SOP drafts with zero fluff and exact ASME tolerances, they approved all 30 slices on the first pass.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                  SL
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Sarah Lin</div>
                  <div className="text-[11px] text-slate-500">Director of Technical Content, FlowVane Skids</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;We now appear as the #1 cited source whenever plant managers query Perplexity or ChatGPT about 5-axis thermal spindle drift. The automated JSON-LD schema injection alone saved our engineering team 150 hours.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  DK
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">David Kelling</div>
                  <div className="text-[11px] text-slate-500">Head of Growth, Titan Precision Machining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TRANSPARENT ENTERPRISE PRICING */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Transparent Pricing
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Plans Built for Scale
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Deploy programmatic technical content across all manufacturing product lines. No hidden overage traps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilot */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase text-slate-500 mb-2">Pilot Tier</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$199</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For single-facility manufacturers testing programmatic SEO.</p>
                <div className="mt-6 space-y-2.5 text-xs border-t border-slate-100 pt-5 text-slate-700">
                  <div>✔ 50 Technical Pages / month</div>
                  <div>✔ 1 Verified Corporate Domain</div>
                  <div>✔ 2 Vertical Taxonomies</div>
                  <div>✔ Closed-Loop QA Studio</div>
                  <div>✔ 3 Team Member Seats</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Start Pilot Plan
              </button>
            </div>

            {/* Growth (Recommended) */}
            <div className="p-7 rounded-2xl border-2 border-sky-600 bg-white shadow-lg shadow-sky-600/10 flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-600 text-white font-mono text-[10px] font-bold uppercase">
                Most Popular
              </span>
              <div>
                <div className="text-xs font-mono font-bold uppercase text-sky-700 mb-2">Growth Tier</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$399</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For scaling equipment brands dominating multiple product lines.</p>
                <div className="mt-6 space-y-2.5 text-xs border-t border-slate-100 pt-5 text-slate-700">
                  <div>✔ 150 Technical Pages / month</div>
                  <div>✔ 3 Verified Connected Domains</div>
                  <div>✔ All 7 Pre-Built Vertical Taxonomies</div>
                  <div>✔ Full Multi-Schema (TechArticle + HowTo)</div>
                  <div>✔ Direct Webflow &amp; WordPress CMS API</div>
                  <div>✔ 7 Team Seats + Role-Based Access</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="mt-8 w-full py-2.5 rounded-xl bg-sky-600 text-xs font-bold text-white shadow-sm hover:bg-sky-500 transition cursor-pointer"
              >
                Launch Growth Plan
              </button>
            </div>

            {/* Fleet / Agency */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase text-purple-700 mb-2">Fleet Tier (Agency)</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$799</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For specialized industrial B2B agencies and multi-brand OEM conglomerates.</p>
                <div className="mt-6 space-y-2.5 text-xs border-t border-slate-100 pt-5 text-slate-700">
                  <div>✔ 400 Pages included</div>
                  <div>✔ Unlimited Client Tenants</div>
                  <div>✔ White-Label Client Portal &amp; CNAME</div>
                  <div>✔ 15 Team &amp; Client Review Seats</div>
                  <div>✔ Dedicated Taxonomy Engineer</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Deploy Fleet Tier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Everything you need to know about ForgeFlow industrial content generation and AEO.</p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                q: "What is the 'Zero-Volume Search Trap' in industrial B2B?",
                a: "High-value industrial searches (e.g. 'EPDM seal swelling 3-A rotary lobe CIP washdown') have 10-30 searches/month on Google, so standard SEO tools label them as '0 volume' and ignore them. Yet each searcher represents an engineer or plant manager with a $50k-$500k equipment purchasing budget. ForgeFlow is engineered specifically to capture this long-tail pipeline.",
              },
              {
                q: "How does ForgeFlow optimize for Answer Engines (Perplexity, ChatGPT, Claude)?",
                a: "Answer engines do not read marketing brochures—they parse structured facts and entity graphs. ForgeFlow injects valid JSON-LD TechArticle, HowTo, and FAQPage schemas, paired with concise direct-answer capsules that LLMs index and cite as definitive sources.",
              },
              {
                q: "Can our internal application engineers review drafts before anything is published?",
                a: "Yes. ForgeFlow includes a dedicated QA Review Studio with side-by-side human preview, structural rule grading, and auto-patch capabilities. Approving or requesting changes is controlled with Role-Based Access Control (RBAC).",
              },
              {
                q: "Which CMS platforms can ForgeFlow publish to?",
                a: "ForgeFlow provides direct API integrations for Webflow and WordPress, semantic Clean HTML downloads, and webhook endpoints for custom headless CMS platforms.",
              },
              {
                q: "How does ForgeFlow guarantee engineering accuracy and eliminate hallucinations?",
                a: "ForgeFlow uses deterministic prompt chaining bounded by certified regulatory bodies (ISO, ASME, 3-A, AGMA, NFPA). Every draft is checked against link allowlists, spec bounds, and an anti-fluff filter that strips speculative claims.",
              },
              {
                q: "Can we connect custom proprietary equipment catalogs and CAD specs?",
                a: "Yes. On Growth and Fleet tiers, our Taxonomy Engine imports custom CSV/JSON equipment specs, proprietary part numbers, and internal service SOPs to generate custom company-specific matrices.",
              },
            ].map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-5 text-left font-bold text-slate-900 text-sm flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 text-base">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. BOTTOM CALL TO ACTION BANNER (WITH DUAL FLOATING LIVE STATUS CARDS) */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100/90 border-t border-slate-200 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading, Subtext, and Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/90 text-sky-800 text-xs font-mono font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>Deterministic AEO &amp; Industrial SEO Platform</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.15]">
                Ready to Dominate Industrial Search &amp; AI Answer Engines?
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                Join 1,000+ equipment manufacturers and industrial B2B brands using ForgeFlow to capture high-value zero-volume search, eliminate technical hallucinations, and command #1 rankings across Google AI Overviews and Perplexity with deterministic AEO schema.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold shadow-md shadow-sky-600/25 transition cursor-pointer flex items-center gap-2"
                >
                  <span>Launch Workspace &amp; Pilot</span>
                  <span className="text-sky-200 text-base">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="px-8 py-3.5 rounded-xl border-2 border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 text-sm font-semibold transition cursor-pointer shadow-xs"
                >
                  Sign In to Console
                </button>
              </div>
            </div>

            {/* Right Column: Two Floating Live Cards (AEO Search Monitor & Deterministic QA Predictions) */}
            <div className="lg:col-span-5 flex items-start justify-center lg:justify-end gap-4 sm:gap-6 pt-4 lg:pt-0">
              {/* Card 1: AEO Search Monitor */}
              <div className="w-[210px] sm:w-[230px] rounded-2xl bg-white shadow-xl shadow-slate-300/40 border border-slate-200/90 overflow-hidden shrink-0">
                {/* Sky Header Banner */}
                <div className="bg-sky-600 px-4 py-3 text-white text-xs font-bold tracking-tight flex items-center justify-between">
                  <span>AEO Search Monitor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-medium text-slate-600">Taxonomies Live</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold font-mono">
                      7/7
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full border border-emerald-500 text-emerald-600 flex items-center justify-center text-[9px] shrink-0 font-bold">
                      ✓
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">HVAC RTU Systems</div>
                      <div className="text-[11px] text-emerald-700 font-mono mt-0.5 font-medium">AEO Rank: #1 (98% Spec)</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full border border-emerald-500 text-emerald-600 flex items-center justify-center text-[9px] shrink-0 font-bold">
                      ✓
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Sanitary CIP Skids</div>
                      <div className="text-[11px] text-emerald-700 font-mono mt-0.5 font-medium">AEO Rank: #1 (100% Schema)</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full border border-emerald-500 text-emerald-600 flex items-center justify-center text-[9px] shrink-0 font-bold">
                      ✓
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">5-Axis Milling Cells</div>
                      <div className="text-[11px] text-emerald-700 font-mono mt-0.5 font-medium">AEO Rank: #1 (Zero Fluff)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Deterministic QA Engine (Layered & Staggered Downward) */}
              <div className="w-[210px] sm:w-[230px] rounded-2xl bg-white shadow-xl shadow-slate-300/40 border border-slate-200/90 overflow-hidden shrink-0 translate-y-6 sm:translate-y-8">
                {/* Dark Slate Header Banner */}
                <div className="bg-slate-900 px-4 py-3 text-white text-xs font-bold tracking-tight flex items-center justify-between">
                  <span>Deterministic QA</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-purple-900 text-purple-300 border border-purple-700">
                    AEO Ready
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-medium text-slate-600">Pipeline Slices</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold font-mono border border-amber-200">
                      3 Active
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-800">RTU Compressor Failure</div>
                    <div className="text-[11px] text-emerald-700 font-mono font-bold mt-0.5">
                      Pipeline: $95k – $380k
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div>
                    <div className="text-xs font-semibold text-slate-800">Rotary Lobe CIP Washdown</div>
                    <div className="text-[11px] text-sky-700 font-mono font-semibold mt-0.5">
                      3-A SOP · Spec Risk: 1.1%
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div>
                    <div className="text-xs font-semibold text-slate-800">5-Axis Spindle Thermal Drift</div>
                    <div className="text-[11px] text-purple-700 font-mono font-semibold mt-0.5">
                      TechArticle &amp; HowTo Schema
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. ENTERPRISE FOOTER */}
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
                  Curated zero-volume search patterns, industrial schema updates, and Answer Engine citation case studies delivered to 6,200+ equipment marketers.
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

        {/* Main 5-Column Sitemap Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Col 1: Brand & Status (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-md shadow-sky-600/20">
                  FF
                </div>
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
                  <span className="text-slate-400">Deterministic Engine SLA</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    99.98% Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Zero-Hallucination Gate</span>
                  <span className="text-sky-400 font-bold">100% Deterministic</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                ISO 9001 · SOC 2 Type II Certified Architecture
              </div>
            </div>

            {/* Col 2: Platform Features (2 cols) */}
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

            {/* Col 3: Vertical Taxonomies (2 cols) */}
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

            {/* Col 4: Solutions & Integrations (2 cols) */}
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

            {/* Col 5: Governance & Security (2 cols) */}
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
                    99.9% Uptime SLA
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

        {/* Bottom Copyright & Compliance Strip */}
        <div className="border-t border-slate-800 py-6 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; 2026 ForgeFlow Inc. All rights reserved. Industrial SEO &amp; AEO Content Engine.
            </div>
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => setLegalModal("privacy")} className="hover:text-slate-300 cursor-pointer">Privacy</button>
              <button type="button" onClick={() => setLegalModal("terms")} className="hover:text-slate-300 cursor-pointer">Terms</button>
              <button type="button" onClick={() => setLegalModal("security")} className="hover:text-slate-300 cursor-pointer">Security</button>
              <button type="button" onClick={() => setLegalModal("sla")} className="hover:text-slate-300 cursor-pointer">SLA</button>
            </div>
          </div>
        </div>
      </footer>

      {/* 14. BOOK A DEMO MODAL (OXMAINT-INSPIRED TECHNICAL WALKTHROUGH) */}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-md shadow-sky-600/20">
                FF
              </div>
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
                      placeholder="e.g. Marcus Vance"
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
                    placeholder="e.g. Apex Industrial Machinery"
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

      {/* 15. LEGAL MODALS (PRIVACY, TERMS, SECURITY, SLA) */}
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
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-sky-700 font-mono text-[11px] font-bold uppercase">
                  <span>Privacy Policy</span>
                  <span>•</span>
                  <span>Version 2.4 · Effective November 2026</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">ForgeFlow Data Privacy Framework</h3>
                <p>
                  At ForgeFlow (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we are committed to safeguarding corporate engineering specifications, proprietary machine parts catalogs, and enterprise organizational data.
                </p>
                <h4 className="text-sm font-bold text-slate-900 pt-2">1. Data Ingestion &amp; Machine Specifications</h4>
                <p>
                  Equipment models, failure modes, and CAD tolerances uploaded to your dedicated workspace tenant are used strictly to generate programmatic technical slices. We never sell, rent, or cross-train public models on client equipment specs.
                </p>
                <h4 className="text-sm font-bold text-slate-900 pt-2">2. Multi-Tenant Cryptographic Isolation</h4>
                <p>
                  Every tenant operates within isolated database foreign key constraints. API keys, Webflow tokens, and WordPress credentials are encrypted at rest with AES-256 GCM.
                </p>
              </div>
            )}

            {legalModal === "terms" && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-sky-700 font-mono text-[11px] font-bold uppercase">
                  <span>Terms of Service</span>
                  <span>•</span>
                  <span>Enterprise SaaS Agreement</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Subscription &amp; Licensing Terms</h3>
                <p>
                  By accessing the ForgeFlow industrial SEO &amp; AEO engine, you agree to comply with our commercial terms and acceptable engineering usage rules.
                </p>
                <h4 className="text-sm font-bold text-slate-900 pt-2">1. Client Content Ownership</h4>
                <p>
                  You own 100% of all generated technical articles, schema graphs, diagnostic checklists, and downloadable SOP assets produced in your workspace.
                </p>
              </div>
            )}

            {legalModal === "security" && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-sky-700 font-mono text-[11px] font-bold uppercase">
                  <span>Security Whitepaper</span>
                  <span>•</span>
                  <span>SOC-2 Type II Certified</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Security &amp; Data Governance</h3>
                <p>
                  ForgeFlow is architected from the ground up for strict industrial IT governance and SOC-2 compliance.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-bold text-slate-900">Encryption in Transit</div>
                    <div className="text-slate-600">TLS 1.3 enforced across all web traffic and API integrations with HSTS.</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-bold text-slate-900">Encryption at Rest</div>
                    <div className="text-slate-600">AES-256 bit disk and column encryption for database tables and credentials.</div>
                  </div>
                </div>
              </div>
            )}

            {legalModal === "sla" && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-sky-700 font-mono text-[11px] font-bold uppercase">
                  <span>Service Level Agreement</span>
                  <span>•</span>
                  <span>99.9% Uptime Commitment</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Service Level Agreement (SLA)</h3>
                <p>
                  We guarantee 99.9% monthly uptime for programmatic slice generation, schema syndication endpoints,
                  and QA gating pipelines across all paid subscription tiers.
                </p>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-md shadow-sky-600/20">
                FF
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700">Enterprise Tenant</p>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">ForgeFlow Console</h3>
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

      {/* 17. FLOATING SCROLL TO TOP BUTTON */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full border border-slate-300 bg-white/95 shadow-lg flex items-center justify-center text-slate-700 hover:text-sky-600 hover:bg-sky-50/70 hover:border-sky-500 transition cursor-pointer"
        aria-label="Back to top"
      >
        <span className="text-base leading-none font-bold">↑</span>
      </button>
    </div>
  );
}
