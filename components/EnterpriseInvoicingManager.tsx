"use client";

import React, { useState } from "react";

export interface InvoiceItem {
  id: string;
  companyName: string;
  billingContactName: string;
  billingEmail: string;
  purchaseOrderNumber: string | null;
  taxIdOrGst: string | null;
  plan: string;
  amountUsd: number;
  paymentTerms: string;
  status: string;
  invoicePdfUrl: string;
  createdAt: string;
}

interface EnterpriseInvoicingManagerProps {
  invoices: InvoiceItem[];
  onRefresh: () => void;
  onActionMessage: (msg: string) => void;
}

export function EnterpriseInvoicingManager({ invoices, onRefresh, onActionMessage }: EnterpriseInvoicingManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [plan, setPlan] = useState("fleet");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!companyName.trim() || !email.trim()) {
      onActionMessage("Company name and billing email are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/billing/enterprise-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          billingContactName: contactName.trim() || "Head of Procurement",
          billingEmail: email.trim(),
          purchaseOrderNumber: poNumber.trim() || null,
          taxIdOrGst: taxId.trim() || null,
          plan,
          paymentTerms: "NET_30",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "PO submission failed");

      onActionMessage(`✔ Enterprise Net-30 invoice #${data.invoice?.invoiceNumber || "NEW"} generated.`);
      setCompanyName("");
      setContactName("");
      setEmail("");
      setPoNumber("");
      setTaxId("");
      setShowModal(false);
      onRefresh();
    } catch (e: unknown) {
      onActionMessage(e instanceof Error ? e.message : "PO submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
            <span>Enterprise Procurement: Purchase Order (PO) &amp; Net-30 Invoicing</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              ACH / Wire Transfer
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            For tier-1 equipment manufacturers requiring formal PO numbers, vendor tax IDs, and Net-30/Net-60 remittance invoices.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <span>+ Issue Net-30 Purchase Order</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600">
            <tr>
              <th className="p-3">INVOICE #</th>
              <th className="p-3">CUSTOMER / COMPANY</th>
              <th className="p-3">PO NUMBER</th>
              <th className="p-3">PLAN TIER</th>
              <th className="p-3">AMOUNT (USD)</th>
              <th className="p-3">PAYMENT TERMS</th>
              <th className="p-3">STATUS</th>
              <th className="p-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                <td className="p-3 font-mono font-bold text-indigo-700">INV-{inv.id.slice(-6).toUpperCase()}</td>
                <td className="p-3 font-medium text-slate-900">{inv.companyName}</td>
                <td className="p-3 font-mono text-slate-700">{inv.purchaseOrderNumber || "PO-PENDING"}</td>
                <td className="p-3 uppercase font-mono text-slate-600">{inv.plan}</td>
                <td className="p-3 font-bold text-slate-900">${inv.amountUsd.toLocaleString()}.00</td>
                <td className="p-3 font-mono text-slate-600">{inv.paymentTerms}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {inv.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <a
                    href={`/api/billing/invoices/${inv.id}?format=html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-[11px] font-bold border border-indigo-200 inline-flex items-center gap-1"
                  >
                    <span>📄</span>
                    <span>Print Official Invoice</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Issue Net-30 Enterprise Purchase Order</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / OEM Division</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Carrier Refrigeration Div"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Contact Person</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Jonathan Miller (VP Procurement)"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Email (Accounts Payable)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ap@carrier-equipment.com"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Tax ID / EIN / GST</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="e.g. US-EIN-12-3456789"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchase Order (PO) Number</label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="e.g. PO-2026-8941"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Contract Tier</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
                  >
                    <option value="fleet">Fleet Enterprise ($7,990 / year - 100 pgs/mo)</option>
                    <option value="growth">Growth Assembly ($2,388 / year - 25 pgs/mo)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
                <div>Payment Terms: <strong>Net-30</strong> via ACH / Fedwire transfer.</div>
                <div>Includes Vendor Tax ID: <strong>EIN 88-3920194 (ForgeFlow Systems Inc.)</strong></div>
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
                  disabled={isSubmitting || !companyName.trim() || !email.trim()}
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold shadow-sm"
                >
                  {isSubmitting ? "Generating Invoice…" : "Issue Official Net-30 Invoice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
