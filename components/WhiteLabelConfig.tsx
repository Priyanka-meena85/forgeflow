"use client";

import { useState } from "react";
import { type WhiteLabelConfig, generateThemeCss } from "@/lib/whiteLabelEngine";

const DEFAULT_CONFIG: WhiteLabelConfig = {
  orgId: "org_demo",
  enabled: false,
  brandName: "ForgeFlow Industrial SEO",
  logoUrl: "",
  primaryColor: "#4F46E5",
  accentColor: "#0EA5E9",
  customDomain: "",
  supportEmail: "support@forgeflow.io",
  hideForgeflowBranding: false,
  customLoginHeadline: "Industrial SEO & AEO Platform",
  customFooterText: "Powered by ForgeFlow",
  reportFooterLogo: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function WhiteLabelConfig() {
  const [config, setConfig] = useState<WhiteLabelConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);
  const [previewCss, setPreviewCss] = useState("");

  const update = <K extends keyof WhiteLabelConfig>(key: K, value: WhiteLabelConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setPreviewCss(generateThemeCss(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-900">White-Label Mode</h2>
            <p className="text-sm text-slate-500 mt-1">
              Rebrand the entire platform under your agency name. Clients see your logo,
              your colors, your domain. ForgeFlow branding hidden completely.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-slate-700">Enable White-Label</span>
            <div
              onClick={() => update("enabled", !config.enabled)}
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${config.enabled ? "bg-indigo-600" : "bg-slate-300"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${config.enabled ? "translate-x-5" : "translate-x-1"}`}
              />
            </div>
          </label>
        </div>

        {!config.enabled && (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
            White-label is currently disabled. Enable it to show your brand to clients.
          </div>
        )}
      </div>

      <div className={`space-y-6 ${!config.enabled ? "opacity-50 pointer-events-none" : ""}`}>
        {/* Branding */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Brand Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Brand Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                value={config.brandName}
                onChange={(e) => update("brandName", e.target.value)}
                placeholder="ContentForge by TechAgency"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Custom Domain</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-mono"
                value={config.customDomain}
                onChange={(e) => update("customDomain", e.target.value)}
                placeholder="seo.youragency.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Support Email</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                value={config.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Logo URL</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-mono"
                value={config.logoUrl}
                onChange={(e) => update("logoUrl", e.target.value)}
                placeholder="https://cdn.youragency.com/logo.png"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-slate-600">Primary Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-mono"
                  value={config.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Accent Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => update("accentColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-mono"
                  value={config.accentColor}
                  onChange={(e) => update("accentColor", e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Live color preview */}
          <div
            className="mt-4 rounded-xl p-4 text-white text-sm font-semibold"
            style={{ background: config.primaryColor }}
          >
            {config.brandName} — Preview Button
            <span
              className="ml-3 inline-block rounded-full px-3 py-0.5 text-xs font-bold"
              style={{ background: config.accentColor }}
            >
              CTA
            </span>
          </div>
        </div>

        {/* Copy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">UI Copy</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Login Page Headline</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                value={config.customLoginHeadline}
                onChange={(e) => update("customLoginHeadline", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Footer Text</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                value={config.customFooterText}
                onChange={(e) => update("customFooterText", e.target.value)}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.hideForgeflowBranding}
                onChange={(e) => update("hideForgeflowBranding", e.target.checked)}
                className="accent-indigo-600 w-4 h-4"
              />
              <span className="text-sm text-slate-700">
                Hide &quot;Powered by ForgeFlow&quot; from all client-facing pages
              </span>
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Save White-Label Config
          </button>
          {saved && (
            <span className="text-sm text-green-700 font-semibold">Saved successfully</span>
          )}
        </div>

        {/* CSS preview */}
        {previewCss && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Generated CSS Variables (inject in _app)
            </h3>
            <pre className="rounded-lg bg-slate-900 p-4 text-xs font-mono text-cyan-400">
              {previewCss}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
