"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    companySize: "50-250",
    industry: "HVAC & Commercial Refrigeration",
    useCase: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit demo request.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Industrial Architecture Walkthrough
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              See ForgeFlow In Action With Your Engineering Data
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
              Book a live 30-minute technical session with our industrial SEO and AEO solution architects. 
              We will benchmark your catalog against Perplexity, ChatGPT, and Google SGE live.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: What to Expect */}
            <div className="lg:col-span-5 space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white">What We Cover During Your Demo</h2>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800/80 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="css-icon-check text-cyan-400 text-xs"></span>
                  </div>
                  <div>
                    <strong className="text-white block font-medium">Live Answer Engine Diagnostic:</strong>
                    We query Perplexity, SGE, and Claude for your high-margin part numbers to reveal missing citation share.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800/80 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="css-icon-check text-cyan-400 text-xs"></span>
                  </div>
                  <div>
                    <strong className="text-white block font-medium">CAD to Schema Graph Extractor:</strong>
                    Watch how STEP/IGES models are ingested directly into deterministic JSON-LD schema without hallucination.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800/80 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="css-icon-check text-cyan-400 text-xs"></span>
                  </div>
                  <div>
                    <strong className="text-white block font-medium">DIN / JIS Crosswalk Localization:</strong>
                    How a single master asset translates engineering alloys and tolerances for European and Asian supply chains.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800/80 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="css-icon-check text-cyan-400 text-xs"></span>
                  </div>
                  <div>
                    <strong className="text-white block font-medium">ERP &amp; CMS Integration Blueprint:</strong>
                    Review webhooks and connectors for SAP S/4HANA, WordPress VIP, Webflow, and custom headless stacks.
                  </div>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono">
                  Enterprise-grade security • SAML 2.0 / Okta Ready • Zero Hardware
                </div>
              </div>
            </div>

            {/* Right Column: Demo Form or Confirmation */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-400">
                    <span className="css-icon-check text-2xl font-bold"></span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Demo Session Requested</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-cyan-400 font-medium">{formData.name}</span>. We received your request for{" "}
                    <span className="text-white font-medium">{formData.company}</span>. Our lead solutions engineer will review your industry domain and send calendar confirmation within 2 hours.
                  </p>
                  <div className="pt-6">
                    <Link
                      href="/features"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium text-xs transition"
                    >
                      <span>Explore Technical Features While You Wait</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white">Schedule Technical Session</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Fill in your technical scope so our architects can pre-load your industry taxonomies.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="demo-name">
                        Full Name *
                      </label>
                      <input
                        id="demo-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="demo-email">
                        Work Email *
                      </label>
                      <input
                        id="demo-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@corp-manufacturing.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="demo-company">
                        Company Name *
                      </label>
                      <input
                        id="demo-company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Apex Tooling Group"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="demo-size">
                        Company Size
                      </label>
                      <select
                        id="demo-size"
                        value={formData.companySize}
                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                      >
                        <option value="1-50">1 - 50 employees</option>
                        <option value="50-250">50 - 250 employees</option>
                        <option value="250-1000">250 - 1,000 employees</option>
                        <option value="1000+">1,000+ Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="demo-industry">
                      Primary Industrial Vertical
                    </label>
                    <select
                      id="demo-industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                    >
                      <option value="HVAC & Commercial Refrigeration">HVAC &amp; Commercial Refrigeration</option>
                      <option value="Food & Beverage Manufacturing">Food &amp; Beverage Manufacturing</option>
                      <option value="Automotive Tier-1 Stamping">Automotive Tier-1 Stamping</option>
                      <option value="Precision CNC & Tooling">Precision CNC &amp; Tooling</option>
                      <option value="Plastics & Polymer Extrusion">Plastics &amp; Polymer Extrusion</option>
                      <option value="Industrial Valves & Actuators">Industrial Valves &amp; Actuators</option>
                      <option value="Heavy Equipment & Hydraulics">Heavy Equipment &amp; Hydraulics</option>
                      <option value="Other Manufacturing Vertical">Other Manufacturing Vertical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="demo-usecase">
                      Current Challenges / Goals (Optional)
                    </label>
                    <textarea
                      id="demo-usecase"
                      rows={3}
                      value={formData.useCase}
                      onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                      placeholder="e.g. We have 4,000 legacy PDF spec sheets that are invisible to Perplexity and Google SGE..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Submitting Request..." : "Request Live Architecture Demo &rarr;"}
                    </button>
                    <p className="text-[11px] text-center text-slate-500 mt-2">
                      Zero commitment. NDA honored on request. No credit card required.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
