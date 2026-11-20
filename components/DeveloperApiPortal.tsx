"use client";

import { useEffect, useState } from "react";

interface KeyItem {
  id: string;
  name: string;
  maskedKey: string;
  scopes: string[];
  lastUsedAt: string | null;
  createdAt: string;
}

export function DeveloperApiPortal() {
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["read:drafts", "write:publish"]);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("https://api.accudrive.example.com/webhooks/forgeflow");
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState("");

  const loadKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/developer/keys");
      const data = await res.json();
      if (res.ok && data.keys) {
        setKeys(data.keys);
      }
    } catch {
      setActionMsg("Failed to load developer keys.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName, scopes: selectedScopes }),
      });
      const data = await res.json();
      if (res.ok && data.apiKey) {
        setGeneratedKey(data.apiKey);
        setNewKeyName("");
        loadKeys();
      } else {
        setActionMsg(data.error || "Failed to create API key");
      }
    } catch {
      setActionMsg("Network error creating API key.");
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? Any connected ERP/CMS automations will cease functioning.")) return;
    try {
      const res = await fetch(`/api/developer/keys?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        setActionMsg("API Key revoked successfully.");
      }
    } catch {
      setActionMsg("Failed to revoke key.");
    }
  };

  const handleTestWebhook = async () => {
    setWebhookTesting(true);
    setWebhookResult(null);
    try {
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_webhook", webhookUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setWebhookResult(JSON.stringify(data.simulatedPayload, null, 2));
        setActionMsg(data.message);
      } else {
        setActionMsg(data.error || "Webhook test failed.");
      }
    } catch {
      setActionMsg("Webhook test failed due to network error.");
    } finally {
      setWebhookTesting(false);
    }
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-sky-400">
                REST v1 &bull; WEBHOOKS
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Bearer Token Auth</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Developer API &amp; Headless Integrations</h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Automate CAD spec ingestion, trigger batch programmatic generation from your ERP/PLM pipeline, and receive instantaneous webhooks upon PE engineering sign-off.
            </p>
          </div>
        </div>

        {actionMsg && (
          <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-semibold flex items-center justify-between animate-in fade-in">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg("")} className="text-sky-700 hover:text-sky-900 text-xs font-bold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Newly Generated Secret Banner */}
        {generatedKey && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="css-icon-check text-emerald-700"></span> API Key Generated Successfully
              </span>
              <button
                onClick={() => setGeneratedKey(null)}
                className="text-[11px] font-mono text-emerald-800 hover:underline cursor-pointer"
              >
                I have saved this key
              </button>
            </div>
            <p className="text-[11px] text-emerald-800">
              Copy this token immediately. For enterprise security, this secret will not be displayed again.
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={generatedKey}
                className="w-full bg-white border border-emerald-300 font-mono text-xs px-3 py-2 rounded-lg text-emerald-950 font-semibold select-all"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedKey);
                  setActionMsg("API Key copied to clipboard.");
                }}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Keys Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
              Active Enterprise API Tokens
            </h3>

            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <span className="inline-block w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : keys.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No active API keys found. Generate one below to get started.</p>
            ) : (
              <div className="space-y-3">
                {keys.map((k) => (
                  <div
                    key={k.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-slate-900">{k.name}</strong>
                        <span className="text-[10px] font-mono text-slate-500">{k.maskedKey}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {k.scopes.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-100/70 text-sky-800 border border-sky-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-2">
                        Created: {new Date(k.createdAt).toLocaleDateString()} &bull; Last used: {k.lastUsedAt || "Never"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 text-xs font-bold self-start sm:self-center cursor-pointer transition"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Webhook Dispatch Tester */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
              Live Webhook Dispatcher &amp; Event Tester
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify your listener receives cryptographically signed payloads when application engineers sign off on new operating envelopes.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-domain.com/webhooks"
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={webhookTesting}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer disabled:opacity-50"
              >
                {webhookTesting ? "Dispatching…" : "Dispatch Test Event"}
              </button>
            </div>

            {webhookResult && (
              <div className="rounded-xl bg-slate-950 p-3.5 text-emerald-400 font-mono text-[11px] overflow-x-auto space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Simulated Response Payload (HTTP 200 OK):</p>
                <pre>{webhookResult}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Generate Key Column */}
        <div className="space-y-4">
          <form onSubmit={handleCreateKey} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase font-mono">
              Generate New API Key
            </h3>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Integration Label
              </label>
              <input
                required
                placeholder="e.g. Siemens Teamcenter PLM Sync"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                Permission Scopes
              </label>
              <div className="space-y-2">
                {[
                  { id: "read:drafts", label: "read:drafts (Inspect specs & tolerances)" },
                  { id: "write:drafts", label: "write:drafts (Generate new programmatic slices)" },
                  { id: "write:publish", label: "write:publish (Deploy approved pages to CMS)" },
                  { id: "read:aeo", label: "read:aeo (Query citation tracker positions)" },
                  { id: "read:intent", label: "read:intent (Pull reverse-IP buyer signals)" },
                ].map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(s.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedScopes([...selectedScopes, s.id]);
                        else setSelectedScopes(selectedScopes.filter((x) => x !== s.id));
                      }}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="font-mono text-[11px]">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
            >
              Provision Token
            </button>
          </form>

          {/* Quick cURL Example */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white space-y-2 text-xs font-mono">
            <span className="text-[10px] text-sky-400 font-bold uppercase">Quick Curl Ingestion</span>
            <pre className="text-[10px] text-slate-300 overflow-x-auto bg-slate-950 p-2.5 rounded-lg leading-relaxed">
{`curl -X POST http://localhost:8080/api/drafts \\
  -H "Authorization: Bearer ff_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"keyword":"servo press die galling"}'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
