"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import { INDUSTRIAL_SECTORS } from "@/lib/industriesDirectory";

export default function IndustriesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Heavy Machinery & Equipment",
    "Process & Precision Manufacturing",
    "Automotive & Assembly",
  ];

  const filteredSectors = useMemo(() => {
    return INDUSTRIAL_SECTORS.filter((sector) => {
      const matchesCategory = selectedCategory === "All" || sector.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sector.title.toLowerCase().includes(q) ||
        sector.equipment.toLowerCase().includes(q) ||
        sector.standard.toLowerCase().includes(q) ||
        sector.failureMode.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      <PublicNavbar activeNav="industries" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>7 PRE-BUILT SECTOR TAXONOMIES • ZERO CONSUMER FLUFF</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight font-humanist">
            Certified Engineering Content for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 bg-clip-text text-transparent">
              Industrial Manufacturing
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every sector has unique failure modes, governing standards, and metallurgical tolerances. Explore our verified taxonomy hubs to see how plant engineers search for your equipment.
          </p>

          {/* Search & Category Filter */}
          <div className="pt-4 max-w-xl mx-auto space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by equipment, standard (ASHRAE, ISO, 3-A), or failure mode..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs text-slate-900 shadow-xs outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              />
              <span className="css-icon-search absolute left-3.5 top-3 text-slate-400 text-xs"></span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {categories.map((cat) => {
                const count =
                  cat === "All"
                    ? INDUSTRIAL_SECTORS.length
                    : INDUSTRIAL_SECTORS.filter((s) => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${selectedCategory === cat ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4-COLUMN INDUSTRIAL ARCHITECTURE SHOWCASE (Matches iFactory AI & Features layout) */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                Manufacturing Vertical Taxonomy Architecture
              </span>
              <h2 className="text-xl font-black text-slate-900 font-humanist">
                Pre-Built Engineering Knowledge Bases
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                7 Pre-Built Taxonomies
              </span>
              <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-800 px-2.5 py-1 rounded-full border border-sky-200">
                100% Deterministic
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1: Heavy Machinery & Thermal */}
            <div className="space-y-3">
              <div className="font-mono text-[10.5px] font-bold uppercase text-slate-400 tracking-wider pb-1 border-b border-slate-100">
                Heavy Machinery &amp; Thermal
              </div>
              <Link
                href="/industries/hvac-commercial-refrigeration"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 transition group"
              >
                <div className="font-bold text-slate-900 group-hover:text-sky-600 text-xs flex items-center justify-between">
                  <span>HVAC &amp; Commercial Chillers</span>
                  <span className="text-[9.5px] font-mono text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded font-bold">ASHRAE</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Compressor floodback, oil foaming &amp; low delta-T loop mitigation.
                </p>
              </Link>
              <Link
                href="/industries/heavy-mining-materials"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 transition group"
              >
                <div className="font-bold text-slate-900 group-hover:text-sky-600 text-xs flex items-center justify-between">
                  <span>Heavy Mining &amp; Excavation</span>
                  <span className="text-[9.5px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">MSHA</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Planetary slewing drives, trunnion bearing galling &amp; crushing circuits.
                </p>
              </Link>
            </div>

            {/* Column 2: Process & Sanitary Fluids */}
            <div className="space-y-3">
              <div className="font-mono text-[10.5px] font-bold uppercase text-slate-400 tracking-wider pb-1 border-b border-slate-100">
                Process &amp; Sanitary Fluids
              </div>
              <Link
                href="/industries/food-beverage-manufacturing"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 transition group"
              >
                <div className="font-bold text-slate-900 group-hover:text-sky-600 text-xs flex items-center justify-between">
                  <span>Food &amp; Beverage Processing</span>
                  <span className="text-[9.5px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">3-A Sanitary</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  CIP caustic seal degradation, rotary lobe pump elastomer swelling.
                </p>
              </Link>
              <Link
                href="/industries/industrial-hydraulics-fluid"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 transition group"
              >
                <div className="font-bold text-slate-900 group-hover:text-sky-600 text-xs flex items-center justify-between">
                  <span>Hydraulics &amp; Fluid Power</span>
                  <span className="text-[9.5px] font-mono text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded font-bold">ISO 4406</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  High-pressure piston pump cavitation, varnishing &amp; micron contamination.
                </p>
              </Link>
            </div>

            {/* Column 3: Precision Metalworking & Plastics */}
            <div className="space-y-3">
              <div className="font-mono text-[10.5px] font-bold uppercase text-slate-400 tracking-wider pb-1 border-b border-slate-100">
                Precision Metal &amp; Polymer
              </div>
              <Link
                href="/industries/automotive-tier1-stamping"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 transition group"
              >
                <div className="font-bold text-slate-900 group-hover:text-sky-600 text-xs flex items-center justify-between">
                  <span>Automotive Tier-1 Stamping</span>
                  <span className="text-[9.5px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-bold">IATF 16949</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Die galling, punch thermal deformation &amp; press ram deflection.
                </p>
              </Link>
              <Link
                href="/industries/precision-cnc-tooling"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 transition group"
              >
                <div className="font-bold text-slate-900 group-hover:text-sky-600 text-xs flex items-center justify-between">
                  <span>Precision CNC &amp; Tooling</span>
                  <span className="text-[9.5px] font-mono text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded font-bold">ISO 230-3</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Spindle thermal growth, ballscrew backlash &amp; harmonic chatter.
                </p>
              </Link>
            </div>

            {/* Column 4: Standards Governance Card */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between border border-slate-800 shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                    Standards Governance
                  </span>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                    Zero Risk
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="css-icon-check text-emerald-400"></span>
                    <span>ASHRAE 90.1 &amp; Standard 15</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="css-icon-check text-emerald-400"></span>
                    <span>3-A Sanitary Standard 02-12</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="css-icon-check text-emerald-400"></span>
                    <span>IATF 16949 / ISO 9001</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="css-icon-check text-emerald-400"></span>
                    <span>ISO 230-3 Spindle Thermal</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link
                  href="/features#standards-crosswalk"
                  className="block w-full py-2.5 px-3 text-center bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  View Global Crosswalk &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Industrial Sectors */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-humanist">
              Pre-Configured Sector Taxonomies
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredSectors.length} of {INDUSTRIAL_SECTORS.length} engineering verticals
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Certified Zero-Hallucination
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSectors.map((sector) => (
            <div
              key={sector.slug}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group hover:border-sky-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    {sector.standard}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {sector.avgDealValue} ACV
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition font-humanist">
                    {sector.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Equipment: {sector.equipment}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {sector.heroSnippet}
                </p>

                {/* Technical highlights block */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Primary Fault Mode:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px] text-right">
                      {sector.failureMode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Search Volume:</span>
                    <span className="font-mono text-slate-700 font-bold">
                      {sector.searchVol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Tolerance Standard:</span>
                    <span className="font-mono text-sky-700 font-bold">
                      {sector.standardsBadge}
                    </span>
                  </div>
                </div>

                {/* High-Intent Search Query Pill */}
                <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-[11px] text-sky-900 font-mono flex items-center gap-1.5">
                  <span className="css-icon-search text-sky-600 shrink-0"></span>
                  <span className="truncate">&quot;{sector.sampleHeadline}&quot;</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">
                  {sector.schemaTypes.slice(0, 2).join(" • ")}
                </div>
                <Link
                  href={`/industries/${sector.slug}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-sky-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Explore Sector Taxonomy</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY GENERIC AI FAILS IN INDUSTRIAL MANUFACTURING */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Engineering Reality Check
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-humanist">
              Why Generic AI Fails in Industrial B2B Search
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Plant engineers and maintenance directors search with exact technical specifications, not vague conversational queries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-humanist">
                Generic AI Inventing Tolerances
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard LLMs hallucinate plausible-sounding numbers (e.g. recommending 450 PSI on a 250 PSI sanitary pump), leading to immediate rejection by reliability engineers.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-rose-200 text-[11px] font-mono text-rose-700">
                ForgeFlow: Enforces strict physical bound checks against ASHRAE &amp; 3-A norms.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-humanist">
                Unindexed PDF Engineering Manuals
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                OEMs keep their highest-value troubleshooting guides trapped inside 200-page scanned PDFs that Google AI Overviews and Perplexity cannot easily parse or cite.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-[11px] font-mono text-amber-800">
                ForgeFlow: Converts PDF manuals into high-velocity 45-word AEO answer capsules.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-humanist">
                Missing Structured Engineering Schema
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard blog engines emit generic BlogPosting schema. Google requires TechArticle and FAQPage with step-by-step diagnostic workflows for answer engine indexing.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-[11px] font-mono text-emerald-800">
                ForgeFlow: Injects deterministic JSON-LD with verified equipment SKUs and standards.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CUSTOM PROPRIETARY TAXONOMIES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-humanist">
            Don&apos;t See Your Exact Equipment Line?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Our engineering ingestion pipeline converts your existing CAD files, PDF manuals, and ERP master data into custom vertical taxonomies in under 48 hours.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/?mode=register"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-sky-600/30 cursor-pointer"
            >
              Request Custom Taxonomy Ingest &rarr;
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Review Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
