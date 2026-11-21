"use client";

import { useState } from "react";

interface SowData {
  sowId: string;
  createdAt: string;
  client: {
    companyName: string;
    contactName: string;
    email: string;
    estimatedCatalogSkus: number;
    primaryStandards: string[];
  };
  deliverables: string[];
  commercials: {
    implementationFee: string;
    monthlySubscription: string;
    serviceLevelAgreement: string;
    targetDelivery: string;
  };
  status: string;
}

export function WhiteGloveOnboardingModal({
  isOpen,
  onClose,
  initialCompanyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialCompanyName?: string;
}) {
  const [companyName, setCompanyName] = useState(initialCompanyName || "");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [catalogSize, setCatalogSize] = useState("250");
  const [loading, setLoading] = useState(false);
  const [sow, setSow] = useState<SowData | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/concierge/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          catalogSize: parseInt(catalogSize, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register concierge engagement");
      }
      setSow(data.sow);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-6 sm:p-8 text-zinc-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <span className="px-2.5 py-0.5 text-xs font-mono bg-amber-950 text-amber-400 border border-amber-800 rounded">
              WHITE-GLOVE CONCIERGE
            </span>
            <h2 className="text-xl font-bold mt-1 text-white">
              Assisted Enterprise Implementation Sprint
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-sm p-1 rounded"
          >
            ✕
          </button>
        </div>

        {sow ? (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-lg text-emerald-300 text-sm">
              <strong className="block text-emerald-400 font-semibold mb-1">
                Statement of Work #{sow.sowId} Generated!
              </strong>
              Your dedicated Industrial Solutions Engineer will reach out within 2 business hours.
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">
                <span className="font-mono text-zinc-400 uppercase">Commercial Terms:</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-zinc-400">Implementation:</span>
                    <p className="font-bold text-white">{sow.commercials.implementationFee}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Recurring Tier:</span>
                    <p className="font-bold text-white">{sow.commercials.monthlySubscription}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Delivery SLA:</span>
                    <p className="font-bold text-white">{sow.commercials.targetDelivery}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Standard Uptime:</span>
                    <p className="font-bold text-white">{sow.commercials.serviceLevelAgreement}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-300 uppercase font-mono mb-2">Scope of Work:</h4>
                <ul className="space-y-1.5 list-disc list-inside text-zinc-400">
                  {sow.deliverables.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition"
              >
                Print / Save SOW PDF
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-xs text-zinc-400">
              Our Senior Solutions Engineers handle 100% of the heavy lifting: CAD parsing, GD&T tolerance mapping, and direct CMS schema injection for your enterprise catalog.
            </p>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded text-red-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Company / OEM Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Hydraulic Motion LLC"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Engineering Contact Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. m.vance@apexmotion.com"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Catalog Size (Estimated SKUs / CAD Drawings)</label>
              <select
                value={catalogSize}
                onChange={(e) => setCatalogSize(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="100">Up to 100 SKUs (Pilot Sprint)</option>
                <option value="250">Up to 250 SKUs (Growth OEM)</option>
                <option value="500">Up to 500 SKUs (Enterprise Comprehensive)</option>
                <option value="1500">1,000+ SKUs (Custom Multi-Plant Implementation)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-black rounded transition disabled:opacity-50"
              >
                {loading ? "Generating SOW..." : "Generate Concierge SOW ($4,500)"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
