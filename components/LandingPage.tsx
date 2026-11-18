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

  // Selected vertical showcase in landing page
  const [activeVerticalIndex, setActiveVerticalIndex] = useState(0);

  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
    },
    {
      title: "Industrial Hydraulics & Fluid Power",
      equipment: "Variable Displacement Piston Pump",
      failure: "Suction Cavitation & Slipper Slipper Delamination",
      standard: "ISO 4406 Fluid Cleanliness Class",
      searchVol: "20–40/mo (Fluid Power Spec)",
      pipelineVal: "$130,000 – $510,000",
      specRisk: "1.5% (Very Low)",
      sampleHeadline: "Diagnostic Procedure: Identifying High-Pressure Slipper Delamination in Proportional Hydraulic Skids",
      schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
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
    },
  ];

  const activeVertical = verticalShowcase[activeVerticalIndex];

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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-md shadow-sky-600/20">
              FF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">ForgeFlow</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  AEO & SEO
                </span>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                Industrial Content Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#taxonomies" className="hover:text-sky-600 transition">Vertical Taxonomies</a>
            <a href="#qa-engine" className="hover:text-sky-600 transition">Closed-Loop QA</a>
            <a href="#workflow" className="hover:text-sky-600 transition">8-Step Pipeline</a>
            <a href="#aeo-schema" className="hover:text-sky-600 transition">AEO Schema</a>
            <a href="#pricing" className="hover:text-sky-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-sky-600 transition">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuth("register")}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm shadow-sky-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Start Free Pilot</span>
              <span className="text-sky-200">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/90 text-sky-800 text-xs font-mono font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>Deterministic Search &amp; Answer Engine Architecture</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Turn Complex Engineering Specs into Pipeline-Generating Search Rankings.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                ForgeFlow eliminates the zero-volume keyword trap for equipment manufacturers.
                Generate certified technical landing pages with pre-built vertical taxonomies, closed-loop
                QA enforcement, and native AEO schema for <strong className="text-slate-800 font-semibold">Google, ChatGPT, and Perplexity</strong>.
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
                <a
                  href="#taxonomies"
                  className="px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition shadow-2xs"
                >
                  Explore 7 Pre-Built Taxonomies
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

            {/* Right Column: Interactive Live Product Slice Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 relative">
                {/* Window Chrome Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="ml-2 font-mono text-[11px] text-slate-400 font-medium">forgeflow-console.preview</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                    AEO Ready
                  </span>
                </div>

                {/* Sliced Technical Card */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/60">
                    <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-sky-700">
                      Sample Generated Topic Slice
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                      {activeVertical.sampleHeadline}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Search Intent</div>
                      <div className="font-bold text-slate-800 mt-0.5">Maintenance SOP / Spec</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Search Volume</div>
                      <div className="font-bold text-slate-800 mt-0.5">{activeVertical.searchVol}</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Pipeline Value</div>
                      <div className="font-bold text-emerald-700 font-mono mt-0.5">{activeVertical.pipelineVal}</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Spec Risk Rating</div>
                      <div className="font-bold text-sky-700 font-mono mt-0.5">{activeVertical.specRisk}</div>
                    </div>
                  </div>

                  {/* Structural QA Status Strip */}
                  <div className="border border-slate-200/80 rounded-xl p-3 bg-white space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-500 flex justify-between">
                      <span>Closed-Loop QA Verification</span>
                      <span className="text-emerald-700 font-semibold">ALL GATES PASSED</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Word Count: 1,840</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Fluff Filter: 0%</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Allowlist: Verified</span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">TechArticle Schema</span>
                    </div>
                  </div>

                  {/* Trigger Action */}
                  <button
                    type="button"
                    onClick={() => openAuth("register")}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer"
                  >
                    Generate Full Matrix Slices In Console →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF & KEY METRICS STRIP */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">$1.8M+</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Average Pipeline Captured
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-600 font-mono">7 Verticals</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Pre-Built Industrial Taxonomies
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">100%</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Deterministic Schema Graph
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">&lt;0.8%</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Spec Risk with Closed-Loop QA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 8-STEP INDUSTRIAL WORKFLOW (EXPLAINED IN DETAIL) */}
      <section id="workflow" className="py-20 bg-slate-50 border-b border-slate-200">
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
                role: "CLIENT ACTION (↺ FEEDBACK LOOP)",
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
                role: "OUTPUT",
                title: "Track Results",
                desc: "Monitor Answer Engine Optimization (ChatGPT, Perplexity citations), Google Search Console impressions, and RFQ conversions.",
                badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between">
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

      {/* 6. CLOSED-LOOP QA & AEO ENGINE */}
      <section id="qa-engine" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Closed-Loop Enforcement
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Why Generic AI Fails in Industrial B2B
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Industrial plant managers and reliability engineers reject generic marketing fluff. ForgeFlow enforces 8 closed-loop validation gates before any content touches your CMS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Without ForgeFlow */}
            <div className="rounded-2xl border border-red-200 bg-white p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-red-100 pb-3">
                <h3 className="text-base font-bold text-red-900">Standard AI Copy (ChatGPT / Jasper)</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                  FAILS COMPLIANCE
                </span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Filled with generic buzzwords (&ldquo;revolutionary&rdquo;, &ldquo;game-changing&rdquo;, &ldquo;synergistic&rdquo;).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Hallucinates maintenance specs, inspection intervals, and torque tolerances.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>No structured Answer Engine schema (invisible to Perplexity, Claude, ChatGPT citations).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Lacks downloadable SOP checklists, engineering CTAs, or direct ERP/CMS endpoints.</span>
                </li>
              </ul>
            </div>

            {/* With ForgeFlow */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <h3 className="text-base font-bold text-emerald-900">ForgeFlow Deterministic Protocol</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  CERTIFIED INDUSTRIAL
                </span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Zero fluff filter: automatically strips marketing superlatives and vague filler.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Deterministic OEM and standard bounds (3-A Sanitary, IATF 16949, ASHRAE, ISO 230-3).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Multi-schema graph: native TechArticle, HowToStep, and FAQPage JSON-LD markup.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>Automated auto-patch: injects high-intent technical CTA blocks and approved citations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRANSPARENT ENTERPRISE PRICING */}
      <section id="pricing" className="py-20 bg-white border-b border-slate-200">
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

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Everything you need to know about ForgeFlow industrial content generation.</p>
          </div>

          <div className="space-y-4 text-xs">
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
            ].map((faq) => (
              <div key={faq.q} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION BANNER */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-black tracking-tight">
            Ready to Dominate Industrial Search &amp; Answer Engines?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Launch your dedicated enterprise tenant today. Pre-loaded with 7 vertical taxonomies, closed-loop QA validation, and AEO schema generation.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => openAuth("register")}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-600/30 transition cursor-pointer"
            >
              Create Free Workspace Tenant →
            </button>
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Sign In to Existing Console
            </button>
          </div>
        </div>
      </section>

      {/* 10. ENTERPRISE FOOTER */}
      <footer className="py-8 bg-white text-xs text-slate-500 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-sky-600 text-white text-xs font-bold flex items-center justify-center">
              FF
            </div>
            <span className="font-bold text-slate-800">ForgeFlow Technologies</span>
            <span>— Industrial SEO &amp; AEO Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Deterministic Schema Engine</span>
            <span>•</span>
            <span>PostgreSQL Enterprise Core</span>
            <span>•</span>
            <span>© 2026 ForgeFlow</span>
          </div>
        </div>
      </footer>

      {/* 11. AUTH MODAL (SIGN IN / REGISTER) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-2xl max-w-md w-full relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Modal Header */}
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

            {/* Auth Form */}
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
    </div>
  );
}
