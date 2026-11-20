"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { INDUSTRIAL_SECTORS } from "@/lib/industriesDirectory";

interface PublicNavbarProps {
  onOpenAuth?: (mode: "login" | "register") => void;
  onOpenDemo?: () => void;
  activeNav?: "home" | "features" | "industries" | "pricing" | "integrations";
}

export function PublicNavbar({ onOpenAuth, onOpenDemo, activeNav = "home" }: PublicNavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<"features" | "industries" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs font-humanist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo-icon.png"
              alt="ForgeFlow Logo"
              width={38}
              height={38}
              className="h-9 w-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
              priority
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Forge<span className="text-sky-600">Flow</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  AEO &amp; SEO
                </span>
              </div>
              <p className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                Industrial Content Engine
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links with Mega-Menus */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
          {/* 1. Features Mega-Menu (Matches iFactory AI Solutions reference) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("features")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/features"
              className={`flex items-center gap-1.5 py-2 hover:text-sky-600 transition cursor-pointer ${
                activeNav === "features" || activeDropdown === "features" ? "text-sky-600 font-bold" : ""
              }`}
            >
              <span>Platform Features</span>
              <span aria-hidden="true" className="text-[10px] text-slate-400">⌄</span>
            </Link>

            {activeDropdown === "features" && (
              <div className="absolute top-full -left-12 w-[840px] p-5 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Industrial Content Suite &amp; Architecture
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      23 Modules
                    </span>
                  </div>
                  <Link
                    href="/features"
                    onClick={() => setActiveDropdown(null)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <span>View Complete Feature Matrix</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

                <div className="grid grid-cols-4 gap-4 text-xs">
                  {/* Column 1: AEO & AI Search */}
                  <div className="space-y-2">
                    <div className="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      AI Search Architecture
                    </div>
                    <Link
                      href="/features#serp-simulator"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-search text-sky-600"></span>
                        <span>AI SERP Simulator</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        Google SGE, Perplexity &amp; ChatGPT live answer preview
                      </p>
                    </Link>
                    <Link
                      href="/features#schema-hub"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-gear text-sky-600"></span>
                        <span>AEO Schema Hub</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        Deterministic JSON-LD TechArticle &amp; FAQ syndication
                      </p>
                    </Link>
                    <Link
                      href="/features#competitor-displacer"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-bolt text-sky-600"></span>
                        <span>Citation Steal Matrix</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        Displace competitor PDFs on zero-volume queries
                      </p>
                    </Link>
                  </div>

                  {/* Column 2: Engineering QA & Specs */}
                  <div className="space-y-2">
                    <div className="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Engineering QA &amp; Risk
                    </div>
                    <Link
                      href="/features#deterministic-qa"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-shield text-sky-600"></span>
                        <span>Deterministic QA</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        Closed-loop word count, fluff &amp; spec validation
                      </p>
                    </Link>
                    <Link
                      href="/features#standards-crosswalk"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-gear text-sky-600"></span>
                        <span>DIN / JIS Crosswalk</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        1-Click global unit &amp; alloy localization
                      </p>
                    </Link>
                    <Link
                      href="/features#cad-inspector"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-box text-sky-600"></span>
                        <span>3D CAD Inspector</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        WebGL 360° exploded view &amp; tolerance tooltips
                      </p>
                    </Link>
                  </div>

                  {/* Column 3: Direct Headless CMS */}
                  <div className="space-y-2">
                    <div className="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Publishing &amp; Distribution
                    </div>
                    <Link
                      href="/features#headless-cms"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-launch text-sky-600"></span>
                        <span>1-Click CMS Publisher</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        WordPress VIP, Webflow &amp; Shopify B2B connectors
                      </p>
                    </Link>
                    <Link
                      href="/features#dealer-syndication"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-grid text-sky-600"></span>
                        <span>Dealer Co-Marketing</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        Multi-brand subdomain publishing with rel=canonical
                      </p>
                    </Link>
                    <Link
                      href="/features#kanban"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                        <span className="css-icon-check text-sky-600"></span>
                        <span>Publishing Kanban</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                        Chief reliability engineer sign-off gate
                      </p>
                    </Link>
                  </div>

                  {/* Column 4: Enterprise Hub & CTA */}
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Enterprise Grade
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-600">
                        <li className="flex items-center gap-1.5 font-medium">
                          <span className="css-icon-check text-emerald-600"></span>
                          <span>SAML 2.0 &amp; Okta SSO</span>
                        </li>
                        <li className="flex items-center gap-1.5 font-medium">
                          <span className="css-icon-check text-emerald-600"></span>
                          <span>SCIM User Provisioning</span>
                        </li>
                        <li className="flex items-center gap-1.5 font-medium">
                          <span className="css-icon-check text-emerald-600"></span>
                          <span>Tri-Model AI COGS Router</span>
                        </li>
                        <li className="flex items-center gap-1.5 font-medium">
                          <span className="css-icon-check text-emerald-600"></span>
                          <span>SOC2 / ISO 27001 Multi-Tenant RLS</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-slate-200 mt-2">
                      <Link
                        href="/features"
                        onClick={() => setActiveDropdown(null)}
                        className="block w-full py-2 px-3 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
                      >
                        Explore All Features &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Industries Mega-Menu (Matches iFactory AI Industry reference) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("industries")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/industries"
              className={`flex items-center gap-1.5 py-2 hover:text-sky-600 transition cursor-pointer ${
                activeNav === "industries" || activeDropdown === "industries" ? "text-sky-600 font-bold" : ""
              }`}
            >
              <span>Industries &amp; Verticals</span>
              <span aria-hidden="true" className="text-[10px] text-slate-400">⌄</span>
            </Link>

            {activeDropdown === "industries" && (
              <div className="absolute top-full -left-48 w-[880px] p-5 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Pre-Built Industrial Verticals &amp; Standards
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Zero Hallucination
                    </span>
                  </div>
                  <Link
                    href="/industries"
                    onClick={() => setActiveDropdown(null)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <span>View All Industries Directory</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

                <div className="grid grid-cols-4 gap-4 text-xs">
                  {/* Column 1: Heavy Machinery */}
                  <div className="space-y-1.5">
                    <div className="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                      Heavy Machinery
                    </div>
                    {INDUSTRIAL_SECTORS.filter((s) => s.category === "Heavy Machinery & Equipment").slice(0, 3).map((sector) => (
                      <Link
                        key={sector.slug}
                        href={`/industries/${sector.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                      >
                        <div className="font-semibold text-slate-900 group-hover:text-sky-600 flex items-center justify-between">
                          <span className="truncate">{sector.title}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
                          {sector.standard.split("&")[0]}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 2: Process Manufacturing */}
                  <div className="space-y-1.5">
                    <div className="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                      Process Manufacturing
                    </div>
                    {INDUSTRIAL_SECTORS.filter((s) => s.category === "Process & Precision Manufacturing").map((sector) => (
                      <Link
                        key={sector.slug}
                        href={`/industries/${sector.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                      >
                        <div className="font-semibold text-slate-900 group-hover:text-sky-600 flex items-center justify-between">
                          <span className="truncate">{sector.title}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
                          {sector.standard.split("&")[0]}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 3: Automotive & Advanced Assembly */}
                  <div className="space-y-1.5">
                    <div className="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                      Automotive &amp; Assembly
                    </div>
                    {INDUSTRIAL_SECTORS.filter((s) => s.category === "Automotive & Assembly").map((sector) => (
                      <Link
                        key={sector.slug}
                        href={`/industries/${sector.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                      >
                        <div className="font-semibold text-slate-900 group-hover:text-sky-600 flex items-center justify-between">
                          <span className="truncate">{sector.title}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
                          {sector.standard.split("&")[0]}
                        </div>
                      </Link>
                    ))}
                    {INDUSTRIAL_SECTORS.filter((s) => s.category === "Heavy Machinery & Equipment").slice(3, 4).map((sector) => (
                      <Link
                        key={sector.slug}
                        href={`/industries/${sector.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="block p-2 rounded-xl hover:bg-slate-50 transition group"
                      >
                        <div className="font-semibold text-slate-900 group-hover:text-sky-600 flex items-center justify-between">
                          <span className="truncate">{sector.title}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
                          {sector.standard.split("&")[0]}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 4: Integration Column (Matches reference image 4!) */}
                  <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono font-bold text-sky-800 uppercase tracking-wider mb-2">
                        CMS &amp; System Integration
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <Link
                          href="/integrations#wordpress"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white text-slate-700 font-medium transition"
                        >
                          <span className="css-icon-launch text-sky-600"></span>
                          <span>WordPress VIP REST API</span>
                        </Link>
                        <Link
                          href="/integrations#webflow"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white text-slate-700 font-medium transition"
                        >
                          <span className="css-icon-grid text-sky-600"></span>
                          <span>Webflow Collection API</span>
                        </Link>
                        <Link
                          href="/integrations#shopify"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white text-slate-700 font-medium transition"
                        >
                          <span className="css-icon-card text-sky-600"></span>
                          <span>Shopify B2B &amp; Hydrogen</span>
                        </Link>
                        <Link
                          href="/integrations#rest-api"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white text-slate-700 font-medium transition"
                        >
                          <span className="css-icon-gear text-sky-600"></span>
                          <span>Developer REST API v1</span>
                        </Link>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-sky-200 mt-2">
                      <Link
                        href="/integrations"
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center justify-between"
                      >
                        <span>Integrations Hub</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Direct Link to Dedicated Integrations Page */}
          <Link
            href="/integrations"
            className={`py-2 hover:text-sky-600 transition cursor-pointer ${
              activeNav === "integrations" ? "text-sky-600 font-bold" : ""
            }`}
          >
            Integrations
          </Link>

          {/* 4. Direct Link to Dedicated Pricing Page (User specifically requested separate page!) */}
          <Link
            href="/pricing"
            className={`py-2 hover:text-sky-600 transition cursor-pointer ${
              activeNav === "pricing" ? "text-sky-600 font-bold" : ""
            }`}
          >
            Pricing
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Demo Access Button */}
          {onOpenDemo && (
            <button
              type="button"
              onClick={onOpenDemo}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs font-bold transition cursor-pointer"
            >
              Book A Demo
            </button>
          )}

          {/* Sign In Button */}
          {onOpenAuth ? (
            <button
              type="button"
              onClick={() => onOpenAuth("login")}
              className="px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 text-xs font-bold transition cursor-pointer"
            >
              Sign In
            </button>
          ) : (
            <Link
              href="/?mode=login"
              className="px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 text-xs font-bold transition inline-block"
            >
              Sign In
            </Link>
          )}

          {/* Primary Call to Action */}
          {onOpenAuth ? (
            <button
              type="button"
              onClick={() => onOpenAuth("register")}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold tracking-tight shadow-md shadow-sky-600/20 transition cursor-pointer"
            >
              Launch Console &rarr;
            </button>
          ) : (
            <Link
              href="/?mode=register"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold tracking-tight shadow-md shadow-sky-600/20 transition inline-block"
            >
              Launch Console &rarr;
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          {onOpenAuth ? (
            <button
              type="button"
              onClick={() => onOpenAuth("login")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100"
            >
              Sign In
            </button>
          ) : (
            <Link
              href="/?mode=login"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 inline-block"
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <span aria-hidden="true" className={mobileMenuOpen ? "css-icon-cross" : "css-icon-grid"}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <nav aria-label="Mobile navigation" className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-900 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Platform Features Suite
            </Link>
            <Link
              href="/industries"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Industries Directory (7 Sectors)
            </Link>
            <Link
              href="/integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              CMS &amp; System Integrations
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Pricing &amp; Plans
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {onOpenDemo && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-50 transition"
              >
                Book A Demo
              </button>
            )}
            {onOpenAuth ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth("register");
                }}
                className="w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs cursor-pointer hover:bg-sky-500 transition"
              >
                Launch Console &rarr;
              </button>
            ) : (
              <Link
                href="/?mode=register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs hover:bg-sky-500 transition"
              >
                Launch Console &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
