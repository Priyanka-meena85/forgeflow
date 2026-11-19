"use client";

import React, { useState } from "react";

export interface CmsIntegration {
  id: string;
  provider: string;
  name: string;
  endpointUrl: string;
  status: string;
  autoPublishApproved: boolean;
}

interface CmsPublishingManagerProps {
  integrations: CmsIntegration[];
  onRefresh: () => void;
  onActionMessage: (msg: string) => void;
}

export function CmsPublishingManager({ integrations, onRefresh, onActionMessage }: CmsPublishingManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [provider, setProvider] = useState("WEBFLOW");
  const [name, setName] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !endpointUrl.trim()) {
      onActionMessage("Connector name and API endpoint URL are required.");
      return;
    }
    setIsAdding(true);
    try {
      const res = await fetch("/api/cms/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          name: name.trim(),
          endpointUrl: endpointUrl.trim(),
          apiKey: apiKey.trim() || null,
          autoPublishApproved: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add connector");

      onActionMessage(`Connected 1-Click Publishing connector: ${name}`);
      setName("");
      setEndpointUrl("");
      setApiKey("");
      setShowModal(false);
      onRefresh();
    } catch (e: unknown) {
      onActionMessage(e instanceof Error ? e.message : "Failed to add connector.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
            Connected CMS Endpoints &amp; Syndication Targets
          </h3>
          <p className="text-xs text-slate-500">
            Publish approved engineering articles to Webflow collections, WordPress REST API, or HubSpot in 1 click.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <span>+ Connect New CMS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map((cms) => (
          <div key={cms.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold uppercase text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {cms.provider}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{cms.name}</div>
            <div className="font-mono text-slate-500 text-[11px] truncate">{cms.endpointUrl}</div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Auto-Publish on PE Sign-off:</span>
              <strong className="text-emerald-700 font-bold">Enabled</strong>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Connect New CMS Target</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
              >
                <span className="css-icon-cross"></span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">CMS Platform Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="WEBFLOW">Webflow Collection API v2</option>
                  <option value="WORDPRESS">WordPress REST API (/wp/v2/posts)</option>
                  <option value="HUBSPOT">HubSpot CMS Blog Post API</option>
                  <option value="WEBHOOK">Custom Secure Webhook (HMAC-SHA256)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Integration Label / Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Plant Engineering Knowledge Hub"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">API Endpoint / Destination URL</label>
                <input
                  type="url"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://api.webflow.com/v2/collections/... or https://domain.com/wp-json/wp/v2/posts"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bearer Token / API Key (Optional)</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="wfl_live_... or Application Password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isAdding || !name.trim() || !endpointUrl.trim()}
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-sm"
                >
                  {isAdding ? "Connecting…" : "Save Connector"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
