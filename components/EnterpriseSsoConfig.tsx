"use client";

import { useState, useEffect } from "react";
import type { SsoConfig } from "@/app/api/auth/sso/route";

export function EnterpriseSsoConfig() {
  const [config, setConfig] = useState<SsoConfig | null>(null);
  const [spDetails, setSpDetails] = useState<{
    spEntityId: string;
    spAcsUrl: string;
    nameIdFormat: string;
    digestAlgorithm: string;
  } | null>(null);
  const [provider, setProvider] = useState<"OKTA" | "AZURE_AD" | "GOOGLE_WORKSPACE" | "PING_IDENTITY">("OKTA");
  const [idpMetadataUrl, setIdpMetadataUrl] = useState("");
  const [autoProvisionRole, setAutoProvisionRole] = useState<"REVIEWER" | "AUTHOR" | "ADMIN">("REVIEWER");
  const [enforceSsoOnly, setEnforceSsoOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadSso() {
      try {
        const res = await fetch("/api/auth/sso");
        if (res.ok) {
          const data = await res.json();
          if (active && data.config) {
            setConfig(data.config);
            setSpDetails(data.spDetails);
            setProvider(data.config.provider);
            setIdpMetadataUrl(data.config.idpMetadataUrl || "");
            setAutoProvisionRole(data.config.autoProvisionRole);
            setEnforceSsoOnly(data.config.enforceSsoOnly);
          }
        }
      } catch (err) {
        console.error("Failed to load SSO configuration:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadSso();
    return () => { active = false; };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/auth/sso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          idpMetadataUrl,
          autoProvisionRole,
          enforceSsoOnly,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update SSO configuration.");
      setConfig(data.config);
      setActionMessage(data.message);
    } catch (err: unknown) {
      setActionMessage(err instanceof Error ? err.message : "SSO save error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="css-icon-shield text-sky-600"></span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Enterprise SAML 2.0 &amp; Single Sign-On (SSO)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Enforce corporate identity federation through Okta, Microsoft Entra ID (Azure AD), or Google Workspace. Allows Just-in-Time (JIT) provisioning for plant engineers and corporate marketing teams.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            SAML 2.0 Standard
          </span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <span className="css-icon-check text-emerald-600"></span>
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Service Provider (SP) Metadata Details */}
      {spDetails && (
        <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] uppercase tracking-wider text-sky-400 font-bold">
              ForgeFlow Service Provider (SP) Endpoints
            </span>
            <span className="text-[10px] text-slate-400">Copy to your IdP console</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">SP Entity ID / Audience URI:</span>
              <span className="text-white select-all break-all">{spDetails.spEntityId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Assertion Consumer Service (ACS) URL:</span>
              <span className="text-white select-all break-all">{spDetails.spAcsUrl}</span>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase font-mono border-b border-slate-100 pb-2">
          Identity Provider (IdP) Connection Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-mono uppercase">
              SAML Identity Provider (IdP)
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as typeof provider)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:border-sky-600 outline-none"
            >
              <option value="OKTA">Okta Workforce Identity</option>
              <option value="AZURE_AD">Microsoft Entra ID (Azure AD)</option>
              <option value="GOOGLE_WORKSPACE">Google Workspace SAML</option>
              <option value="PING_IDENTITY">PingIdentity / PingFederate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-mono uppercase">
              Default JIT Provisioning Role
            </label>
            <select
              value={autoProvisionRole}
              onChange={(e) => setAutoProvisionRole(e.target.value as typeof autoProvisionRole)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:border-sky-600 outline-none"
            >
              <option value="REVIEWER">Engineer Reviewer (Can sign off tolerances)</option>
              <option value="AUTHOR">Content Author (Draft creation only)</option>
              <option value="ADMIN">Organization Administrator</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 font-mono uppercase">
            IdP Metadata URL or Descriptor Endpoint
          </label>
          <input
            type="url"
            required
            value={idpMetadataUrl}
            onChange={(e) => setIdpMetadataUrl(e.target.value)}
            placeholder="https://company.okta.com/app/exk482910/sso/saml/metadata"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:border-sky-600 outline-none"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enforceSsoOnly}
              onChange={(e) => setEnforceSsoOnly(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
            />
            <span className="text-xs font-medium text-slate-700">
              Enforce SSO Only (Disable password login for this tenant domain)
            </span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {saving ? "Verifying Certificate..." : "Save & Verify SAML Handshake"}
          </button>
        </div>
      </form>
    </div>
  );
}
