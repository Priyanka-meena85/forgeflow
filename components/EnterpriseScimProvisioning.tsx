"use client";

import { useState } from "react";

export function EnterpriseScimProvisioning() {
  const [tokenCopied, setTokenCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [testingDeauth, setTestingDeauth] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const scimBaseUrl = typeof window !== "undefined" ? `${window.location.origin}/api/scim/v2` : "http://localhost:8080/api/scim/v2";
  const scimBearerToken = "scim_live_okta_7f9a2b8e4c1d6e3f5a0b9c8d7e6f5a4b";

  const handleSimulateDeauth = async () => {
    setTestingDeauth(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/scim/v2/Users/seed-usr-author", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${scimBearerToken}`,
          "Content-Type": "application/scim+json",
        },
        body: JSON.stringify({
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
          Operations: [{ op: "replace", path: "active", value: false }],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestResult(`Success: Automated de-provisioning signal verified. User "${data.userName}" active state updated to: ${data.active}.`);
      } else {
        setTestResult(`SCIM Error (${res.status}): ${data.detail || "De-provisioning failed."}`);
      }
    } catch {
      setTestResult("Network error testing SCIM de-provisioning.");
    } finally {
      setTestingDeauth(false);
    }
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                RFC 7643 &bull; RFC 7644
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Okta &bull; Azure AD &bull; PingFederate</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              SCIM 2.0 Automated User Provisioning &amp; De-Provisioning
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Enterprise compliance requires automated lifecycle management. When application engineers leave your organization, Okta or Azure AD immediately revokes their QA review and sign-off access in ForgeFlow without manual intervention.
            </p>
          </div>
        </div>

        {testResult && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
            <span>{testResult}</span>
            <button onClick={() => setTestResult(null)} className="text-emerald-700 hover:text-emerald-950 text-xs font-bold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
            Directory Sync Credentials
          </h3>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              SCIM 2.0 Base URL
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={scimBaseUrl}
                className="w-full bg-slate-50 border border-slate-300 font-mono text-xs px-3.5 py-2 rounded-xl text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(scimBaseUrl);
                  setUrlCopied(true);
                  setTimeout(() => setUrlCopied(false), 2000);
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
              >
                {urlCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              SCIM OAuth Bearer Token
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={scimBearerToken}
                className="w-full bg-slate-50 border border-slate-300 font-mono text-xs px-3.5 py-2 rounded-xl text-slate-900 outline-none select-all"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(scimBearerToken);
                  setTokenCopied(true);
                  setTimeout(() => setTokenCopied(false), 2000);
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
              >
                {tokenCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Supported RFC Attributes:</span>
            <p className="font-mono text-[11px]">userName, name.formatted, emails.work, active, roles, meta</p>
          </div>
        </div>

        {/* Live Simulation Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono mb-2">
              Automated Lifecycle Test Drive
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Simulate an Okta employee termination webhook. ForgeFlow will process the RFC 7644 `PATCH active: false` operation and immediately freeze sign-off permissions for that reviewer in the audit chain.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto space-y-1">
              <span className="text-[10px] text-sky-400 font-bold uppercase block">Okta Inbound Payload Sample:</span>
              <pre>{JSON.stringify({ schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"], Operations: [{ op: "replace", path: "active", value: false }] }, null, 2)}</pre>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateDeauth}
            disabled={testingDeauth}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            {testingDeauth ? "Executing SCIM De-Provisioning…" : "Dispatch Test De-Provisioning Call"}
          </button>
        </div>
      </div>
    </div>
  );
}
