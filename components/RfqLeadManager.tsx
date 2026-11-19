"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RfqLead } from "@/app/api/leads/route";

interface RfqLeadManagerProps {
  onActionMessage: (msg: string) => void;
}

export function RfqLeadManager({ onActionMessage }: RfqLeadManagerProps) {
  const [leads, setLeads] = useState<RfqLead[]>([]);
  const [totalPipeline, setTotalPipeline] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(data.leads || []);
        setTotalPipeline(data.totalPipelineUsd || 0);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const copyEmbedCode = () => {
    const code = `<div class="forgeflow-rfq-widget" data-org="seed-org-industrial" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:28px 0;">
  <h4 style="margin:0 0 8px;font-size:16px;color:#0f172a;">🛠️ Request Factory Certified Diagnostic Tolerances</h4>
  <p style="font-size:12px;color:#475569;margin:0 0 16px;">Direct engineering support from certified applications engineers. We benchmark operating limits against official OEM manuals.</p>
  <form action="https://forgeflow.industrial/api/leads" method="POST" style="display:flex;gap:8px;flex-wrap:wrap;">
    <input type="email" name="contactEmail" placeholder="engineer@plant.com" required style="padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;flex:1;min-width:200px;" />
    <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:bold;font-size:12px;cursor:pointer;">Get Certified SOP →</button>
  </form>
</div>`;
    navigator.clipboard.writeText(code);
    onActionMessage("✔ In-page RFQ capture widget embed code copied to clipboard!");
  };

  const getStatusBadge = (status: RfqLead["status"]) => {
    switch (status) {
      case "QUALIFIED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "NEW":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "CONTACTED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CLOSED_WON":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
            <span>Inbound RFQ &amp; Lead Capture (Pipeline Attribution)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ${(totalPipeline / 1000).toFixed(0)}k Pipeline
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Plant engineers and procurement leads who requested OEM quotes or downloaded verified SOP checklists directly from your published articles.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowEmbedModal(true)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            📋 In-Page Lead Hook Embed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-xs text-slate-400 py-4 text-center">Loading inbound inquiries…</div>
      ) : leads.length === 0 ? (
        <div className="text-xs text-slate-500 py-3 italic">No leads captured yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Lead &amp; Company</th>
                <th className="py-2.5 px-3">Target Machinery</th>
                <th className="py-2.5 px-3">Inquiry Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Est. Deal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{lead.contactName}</div>
                    <div className="text-[11px] text-slate-500">{lead.companyName} &bull; <span className="font-mono text-slate-400">{lead.contactEmail}</span></div>
                    {lead.draftTitle && (
                      <div className="text-[10px] text-sky-700 truncate max-w-xs mt-0.5 font-medium">
                        Via: {lead.draftTitle}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 text-[11px]">
                    {lead.equipmentModel || "General Industrial Machinery"}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] font-mono font-medium text-slate-700">
                      {lead.inquiryType.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ${(lead.estimatedValueUsd / 1000).toFixed(0)}k USD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-lg w-full space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm">Embed In-Page RFQ Hook</h4>
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Paste this responsive HTML snippet into your WordPress, Webflow, or HubSpot template. It displays an authoritative engineering lead capture box right below diagnostic tolerance tables.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] overflow-x-auto max-h-48 border border-slate-800">
              <code>{`<div class="forgeflow-rfq-widget" data-org="seed-org-industrial">
  <h4>🛠️ Request Factory Certified Diagnostic Tolerances</h4>
  <p>Direct engineering support from certified applications engineers...</p>
  <form action="/api/leads" method="POST">...</form>
</div>`}</code>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer shadow-xs"
              >
                Copy Embed Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
