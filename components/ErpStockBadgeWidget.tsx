"use client";

import React, { useState } from "react";

export interface DistributorStockItem {
  id: string;
  distributorName: string;
  location: string;
  unitsInStock: number;
  leadTimeDays: number;
  unitPriceUsd: number;
  partNumber: string;
  verifiedStockDate: string;
  status: "IN_STOCK" | "LOW_STOCK" | "BACKORDER";
}

const DEFAULT_STOCK_ITEMS: DistributorStockItem[] = [
  {
    id: "dist_1",
    distributorName: "Motion Industries",
    location: "Chicago, IL Distribution Hub",
    unitsInStock: 24,
    leadTimeDays: 2,
    unitPriceUsd: 4850,
    partNumber: "AD-RLP-3A-042",
    verifiedStockDate: "Today, 09:30 AM",
    status: "IN_STOCK",
  },
  {
    id: "dist_2",
    distributorName: "Grainger Industrial Supply",
    location: "Dallas, TX Central Warehouse",
    unitsInStock: 8,
    leadTimeDays: 3,
    unitPriceUsd: 4920,
    partNumber: "AD-RLP-3A-042",
    verifiedStockDate: "Today, 11:15 AM",
    status: "LOW_STOCK",
  },
  {
    id: "dist_3",
    distributorName: "RS Components India / SE Asia",
    location: "Pune, Maharashtra Fulfilment Center",
    unitsInStock: 15,
    leadTimeDays: 4,
    unitPriceUsd: 4790,
    partNumber: "AD-RLP-3A-042-IN",
    verifiedStockDate: "Today, 08:00 AM",
    status: "IN_STOCK",
  },
];

export function ErpStockBadgeWidget() {
  const [stockList, setStockList] = useState<DistributorStockItem[]>(DEFAULT_STOCK_ITEMS);
  const [selectedItem, setSelectedItem] = useState<DistributorStockItem | null>(null);
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  const handleRequestQuote = (item: DistributorStockItem) => {
    setSelectedItem(item);
    setRfqModalOpen(true);
    setRfqSubmitted(false);
  };

  const handleConfirmRfq = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
    setTimeout(() => {
      setRfqModalOpen(false);
      setRfqSubmitted(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0 font-bold text-xs">
              📦
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Live ERP &amp; Distributor Inventory Router
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Embed live stock availability and delivery lead times directly inside technical AEO content to convert organic engineering traffic into immediate transactional RFQs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-800">ERP Sync Active (SAP S/4HANA &amp; NetSuite)</span>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Verified Distributor Stock: Sanitary Rotary Lobe Pump (Part # AD-RLP-3A-042)
          </span>
          <span className="text-xs font-mono text-slate-400">Total Available: 47 Units</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[580px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="p-3.5">Distributor Name</th>
                <th className="p-3.5">Fulfillment Hub</th>
                <th className="p-3.5 text-center">Available Stock</th>
                <th className="p-3.5 text-center">Lead Time</th>
                <th className="p-3.5 text-right">Unit Price</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {item.distributorName}
                    <span className="block text-[10px] font-mono text-slate-400 font-normal">
                      Verified {item.verifiedStockDate}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{item.location}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                        item.status === "IN_STOCK"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.unitsInStock} Units
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-mono text-slate-700 font-semibold">
                    {item.leadTimeDays} Business Days
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 font-mono">
                    ${item.unitPriceUsd.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleRequestQuote(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                    >
                      Route RFQ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFQ Routing Modal */}
      {rfqModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-5 max-h-[90dvh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Route RFQ to {selectedItem.distributorName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct B2B purchase inquiry with guaranteed stock lock
                </p>
              </div>
              <button
                onClick={() => setRfqModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {rfqSubmitted ? (
              <div className="p-6 text-center space-y-2">
                <div className="text-3xl">✓</div>
                <h4 className="font-bold text-slate-900 text-sm">RFQ Dispatched Successfully!</h4>
                <p className="text-xs text-slate-500">
                  {selectedItem.distributorName} sales engineering team has been notified. 24 units locked for 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmRfq} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Plant Name</label>
                  <input
                    required
                    type="text"
                    defaultValue="Motherson Automotive Parts Ltd."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Quantity Needed</label>
                    <input
                      required
                      type="number"
                      min={1}
                      max={selectedItem.unitsInStock}
                      defaultValue={4}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Delivery Date</label>
                    <input
                      required
                      type="date"
                      defaultValue={new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Technical Notes / Specs</label>
                  <textarea
                    rows={2}
                    defaultValue="Require 3-A Sanitary compliance test certificates and FKM food-grade seal packaging."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRfqModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                  >
                    Send Direct RFQ (${(selectedItem.unitPriceUsd * 4).toLocaleString()})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
