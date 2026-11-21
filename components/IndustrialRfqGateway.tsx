"use client";

import { useState } from "react";

interface IndustrialRfqGatewayProps {
  partNumber?: string;
  partName?: string;
  sourceEngine?: string;
  onSuccess?: () => void;
}

export function IndustrialRfqGateway({
  partNumber = "OEM-SV-5000-DIE",
  partName = "Progressive Stamping Tooling Die",
  sourceEngine = "Perplexity AI Verified Citation",
  onSuccess,
}: IndustrialRfqGatewayProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("500 - 2,500 units");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Dispatch attribution record + demo/lead alert
      await fetch("/api/aeo/attribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Direct RFQ for ${partName} (${partNumber})`,
          partNumber,
          email,
        }),
      });

      await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0],
          email,
          company,
          companySize: "100-500",
          industry: "Industrial Manufacturing",
          useCase: `Direct RFQ from AEO Answer: ${quantity} of ${partNumber}`,
        }),
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("RFQ Dispatch Failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-cyan-800/80 bg-slate-950 p-6 text-slate-100 font-humanist shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-950 border-b border-l border-cyan-700/80 rounded-bl-xl text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
        {sourceEngine}
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
          Direct Engineering RFQ Gateway
        </span>
        <h3 className="text-xl font-bold text-white">
          Request Production Quote &amp; Material Test Report (MTR)
        </h3>
        <p className="text-xs text-slate-400">
          Component: <strong className="text-slate-200">{partName}</strong> (Spec ID: <code className="text-cyan-400 font-mono">{partNumber}</code>)
        </p>
      </div>

      {submitted ? (
        <div className="py-6 text-center space-y-3 bg-slate-900/60 rounded-xl border border-emerald-900/60 p-4">
          <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-lg font-bold font-mono">
            OK
          </div>
          <div className="text-sm font-bold text-white">Engineering RFQ Dispatched</div>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Your production tolerance requirements and MTR request have been submitted directly to the certified applications engineering desk.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Corporate Engineering Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lead.engineer@oem.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Company / Plant Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Caterpillar Aurora Plant"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Estimated Production Batch Size
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="Prototypes (1 - 50 units)">Prototypes (1 - 50 units)</option>
              <option value="Pilot Production (50 - 500 units)">Pilot Production (50 - 500 units)</option>
              <option value="500 - 2,500 units">Volume Batch (500 - 2,500 units)</option>
              <option value="10,000+ Annual Contract">Annual Program (10,000+ units/yr)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Dispatching to Applications Engineer..." : "Submit Verified Engineering RFQ →"}
            </button>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>ITAR / ISO 9001 Compliance Honored</span>
              <span>Direct Perplexity Citation Attribution</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
