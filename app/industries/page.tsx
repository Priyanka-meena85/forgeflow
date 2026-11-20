"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import { INDUSTRIAL_SECTORS } from "@/lib/industriesDirectory";

export default function IndustriesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Heavy Machinery & Equipment",
    "Process & Precision Manufacturing",
    "Automotive & Assembly",
  ];

  const filteredSectors = selectedCategory === "All"
    ? INDUSTRIAL_SECTORS
    : INDUSTRIAL_SECTORS.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      <PublicNavbar activeNav="industries" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PRE-BUILT VERTICAL TAXONOMIES &amp; STANDARDS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-humanist">
            Certified Engineering Content for <br className="hidden sm:inline" />
            <span className="text-sky-600">Industrial Manufacturing</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every sector has unique failure modes, governing standards, and metallurgical tolerances. Explore our verified taxonomy hubs to see how plant engineers search for your equipment.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Industrial Sectors */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSectors.map((sector) => (
            <div
              key={sector.slug}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group hover:border-sky-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    {sector.standardsBadge}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    {sector.avgDealValue}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition font-humanist">
                    {sector.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Equipment: {sector.equipment}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {sector.heroSnippet}
                </p>

                {/* Technical highlights block */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Primary Failure:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px] text-right">
                      {sector.failureMode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Search Intent:</span>
                    <span className="font-mono text-slate-700 font-bold">
                      {sector.searchVol.split("(")[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Hallucination Risk:</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {sector.specRisk}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">
                  {sector.schemaTypes.join(" • ")}
                </div>
                <Link
                  href={`/industries/${sector.slug}`}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 group-hover:bg-sky-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Explore Hub</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
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
