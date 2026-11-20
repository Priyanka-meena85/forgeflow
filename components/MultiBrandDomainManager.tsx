"use client";

import { useEffect, useState } from "react";

interface BrandDomain {
  id: string;
  brandName: string;
  domain: string;
  cnameTarget: string;
  sslStatus: "ACTIVE" | "PENDING_VERIFICATION";
  toleranceLockEnabled: boolean;
  publishedSkuPages: number;
  lastSyncAt: string;
}

export function MultiBrandDomainManager() {
  const [domains, setDomains] = useState<BrandDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const loadDomains = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/domains/multi-brand");
      const data = await res.json();
      if (res.ok && data.domains) {
        setDomains(data.domains);
      }
    } catch {
      setStatusMsg("Failed to load multi-brand domain registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomains();
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !domainInput) return;

    setSubmitting(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/domains/multi-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, domain: domainInput }),
      });
      const data = await res.json();
      if (res.ok && data.domain) {
        setDomains((prev) => [...prev, data.domain]);
        setBrandName("");
        setDomainInput("");
        setStatusMsg(`Provisioned white-label domain ${data.domain.domain} with active SSL.`);
      } else {
        setStatusMsg(data.error || "Failed to add domain.");
      }
    } catch {
      setStatusMsg("Network error adding domain.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-premium p-6 rounded-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
              MULTI-BRAND OEM SUITE
            </span>
            <span className="text-xs text-stone-500 font-mono">Centralized Tolerance Governance</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 tracking-tight">
            White-Label Brand &amp; Subdomain Hub
          </h3>
          <p className="text-xs text-stone-600">
            Route AEO specifications across multiple OEM sub-brands with unified DIN/ISO tolerance locks and automated edge SSL.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDomains}
          disabled={loading}
          className="btn-secondary-premium px-3 py-1.5 text-xs self-start sm:self-auto"
        >
          <span className="css-icon-refresh mr-1.5"></span>
          <span>Refresh Domains</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-fade-in">
          <span>{statusMsg}</span>
          <button type="button" onClick={() => setStatusMsg("")} className="text-emerald-700 hover:text-emerald-900 font-bold">
            <span className="css-icon-cross"></span>
          </button>
        </div>
      )}

      {/* Domain Registry Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200/80 shadow-2xs">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50/80 border-b border-stone-200/80 text-[11px] font-mono uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-2.5">Sub-Brand Name</th>
              <th className="px-4 py-2.5">Custom Domain Route</th>
              <th className="px-4 py-2.5">Edge CNAME</th>
              <th className="px-4 py-2.5">SSL Status</th>
              <th className="px-4 py-2.5">Tolerance Lock</th>
              <th className="px-4 py-2.5">Live Specs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {domains.map((dom) => (
              <tr key={dom.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-stone-900">{dom.brandName}</td>
                <td className="px-4 py-3 font-mono text-sky-700 font-semibold">{dom.domain}</td>
                <td className="px-4 py-3 font-mono text-stone-500">{dom.cnameTarget}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="css-icon-check"></span> ACTIVE SSL
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    <span className="css-icon-shield"></span> LOCKED
                  </span>
                </td>
                <td className="px-4 py-3 font-mono font-bold text-stone-800">{dom.publishedSkuPages} pages</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Brand Domain Form */}
      <form onSubmit={handleAddDomain} className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 space-y-3">
        <div className="flex items-center gap-2">
          <span className="css-icon-plus text-sky-600"></span>
          <span className="text-xs font-bold text-stone-900">Provision New Sub-Brand Custom Domain</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Sub-Brand Name (e.g. AccuDrive Aerospace)"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="input-premium"
            required
          />
          <input
            type="text"
            placeholder="Domain (e.g. aero-specs.accudrive.com)"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            className="input-premium"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary-premium py-2 px-4 text-xs font-bold"
          >
            {submitting ? "Provisioning Route…" : "+ Provision Domain"}
          </button>
        </div>
      </form>
    </div>
  );
}
