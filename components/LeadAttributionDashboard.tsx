"use client";

import { useState, useEffect } from "react";

interface ContentPageLead {
  pageUrl: string;
  pageTitle: string;
  equipment: string;
  vertical: string;
  sessions: number;
  rfqCount: number;
  rfqValue: number;
  demoRequests: number;
  avgTimeOnPage: number; // seconds
  conversionRate: number; // %
  topCompany: string;
  lastLeadDate: string;
}

interface AttributionSummary {
  totalRfqs: number;
  totalDemos: number;
  totalPipelineValue: number;
  topPage: string;
  avgCvr: number;
}

const MOCK_PAGES: ContentPageLead[] = [
  {
    pageUrl: "/cnc-machining-automotive-india",
    pageTitle: "CNC Precision Machining for Automotive OEMs — India",
    equipment: "CNC Machining Centre",
    vertical: "Automotive",
    sessions: 4812,
    rfqCount: 23,
    rfqValue: 1870000,
    demoRequests: 8,
    avgTimeOnPage: 194,
    conversionRate: 4.78,
    topCompany: "Motherson Group",
    lastLeadDate: "2026-11-20",
  },
  {
    pageUrl: "/rotary-lobe-pump-pharma",
    pageTitle: "Sanitary Rotary Lobe Pumps — Pharmaceutical GMP",
    equipment: "Rotary Lobe Pump",
    vertical: "Pharma",
    sessions: 3240,
    rfqCount: 18,
    rfqValue: 1260000,
    demoRequests: 5,
    avgTimeOnPage: 221,
    conversionRate: 5.56,
    topCompany: "Sun Pharma",
    lastLeadDate: "2026-11-19",
  },
  {
    pageUrl: "/industrial-bearing-textile",
    pageTitle: "High-Load Bearings for Textile Machinery",
    equipment: "Deep Groove Ball Bearing",
    vertical: "Textile",
    sessions: 2110,
    rfqCount: 11,
    rfqValue: 540000,
    demoRequests: 3,
    avgTimeOnPage: 148,
    conversionRate: 5.21,
    topCompany: "Arvind Mills",
    lastLeadDate: "2026-11-18",
  },
  {
    pageUrl: "/valve-oil-gas-india",
    pageTitle: "High-Pressure Valves for Oil & Gas Upstream India",
    equipment: "Gate Valve",
    vertical: "Oil & Gas",
    sessions: 1820,
    rfqCount: 7,
    rfqValue: 980000,
    demoRequests: 4,
    avgTimeOnPage: 268,
    conversionRate: 3.85,
    topCompany: "ONGC",
    lastLeadDate: "2026-11-17",
  },
  {
    pageUrl: "/compressor-food-processing",
    pageTitle: "Oil-Free Air Compressors for Food Processing Lines",
    equipment: "Scroll Compressor",
    vertical: "Food & Beverage",
    sessions: 1540,
    rfqCount: 9,
    rfqValue: 410000,
    demoRequests: 2,
    avgTimeOnPage: 173,
    conversionRate: 5.84,
    topCompany: "Haldirams",
    lastLeadDate: "2026-11-15",
  },
];

function fmt(n: number) {
  if (n >= 1000000) return `\u20B9${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `\u20B9${(n / 1000).toFixed(0)}K`;
  return `\u20B9${n}`;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

export function LeadAttributionDashboard() {
  const [pages, setPages] = useState<ContentPageLead[]>([]);
  const [summary, setSummary] = useState<AttributionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<keyof ContentPageLead>("rfqValue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedVertical, setSelectedVertical] = useState<string>("All");
  const [selectedPage, setSelectedPage] = useState<ContentPageLead | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setPages(MOCK_PAGES);
      const total = MOCK_PAGES.reduce(
        (acc, p) => ({
          totalRfqs: acc.totalRfqs + p.rfqCount,
          totalDemos: acc.totalDemos + p.demoRequests,
          totalPipelineValue: acc.totalPipelineValue + p.rfqValue,
          topPage: p.rfqValue > (MOCK_PAGES.find((x) => x.pageTitle === acc.topPage)?.rfqValue ?? 0)
            ? p.pageTitle
            : acc.topPage,
          avgCvr: 0,
        }),
        { totalRfqs: 0, totalDemos: 0, totalPipelineValue: 0, topPage: "", avgCvr: 0 }
      );
      total.avgCvr =
        MOCK_PAGES.reduce((s, p) => s + p.conversionRate, 0) / MOCK_PAGES.length;
      total.topPage = [...MOCK_PAGES].sort((a, b) => b.rfqValue - a.rfqValue)[0].pageTitle;
      setSummary(total);
      setLoading(false);
    }, 600);
  }, []);

  const verticals = ["All", ...Array.from(new Set(MOCK_PAGES.map((p) => p.vertical)))];

  const filtered = pages
    .filter((p) => selectedVertical === "All" || p.vertical === selectedVertical)
    .sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === "desc" ? bv - av : av - bv;
    });

  const toggleSort = (key: keyof ContentPageLead) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Lead Attribution Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Track which content pages generated RFQs, demo requests, and pipeline value.
          Industrial content ROI — per page, per vertical.
        </p>
      </div>

      {/* KPI summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total RFQs Generated", value: summary.totalRfqs, sub: "from content pages" },
            { label: "Demo Requests", value: summary.totalDemos, sub: "qualified leads" },
            { label: "Pipeline Influenced", value: fmt(summary.totalPipelineValue), sub: "total RFQ value" },
            { label: "Avg. CVR", value: `${summary.avgCvr.toFixed(2)}%`, sub: "sessions to RFQ" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="text-2xl font-bold text-indigo-700">{kpi.value}</div>
              <div className="text-sm font-semibold text-slate-700 mt-1">{kpi.label}</div>
              <div className="text-xs text-slate-400">{kpi.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {verticals.map((v) => (
          <button
            key={v}
            onClick={() => setSelectedVertical(v)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border ${
              selectedVertical === v
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: "pageTitle", label: "Content Page" },
                  { key: "vertical", label: "Vertical" },
                  { key: "sessions", label: "Sessions" },
                  { key: "rfqCount", label: "RFQs" },
                  { key: "rfqValue", label: "Pipeline Value" },
                  { key: "demoRequests", label: "Demos" },
                  { key: "conversionRate", label: "CVR %" },
                  { key: "avgTimeOnPage", label: "Avg. Time" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="text-left p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 select-none"
                    onClick={() => toggleSort(col.key as keyof ContentPageLead)}
                  >
                    {col.label}{" "}
                    {sortKey === col.key ? (sortDir === "desc" ? "v" : "^") : ""}
                  </th>
                ))}
                <th className="p-3 font-semibold text-slate-600">Top Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr
                  key={p.pageUrl}
                  className="hover:bg-indigo-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedPage(p)}
                >
                  <td className="p-3">
                    <div className="font-medium text-slate-800 max-w-48 truncate">{p.pageTitle}</div>
                    <div className="text-slate-400 font-mono text-xs">{p.pageUrl}</div>
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {p.vertical}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{p.sessions.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="font-bold text-indigo-700">{p.rfqCount}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-green-700">{fmt(p.rfqValue)}</span>
                  </td>
                  <td className="p-3 font-mono">{p.demoRequests}</td>
                  <td className="p-3">
                    <span
                      className={`font-bold ${p.conversionRate >= 5 ? "text-green-600" : p.conversionRate >= 3 ? "text-amber-600" : "text-red-500"}`}
                    >
                      {p.conversionRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 font-mono">{fmtTime(p.avgTimeOnPage)}</td>
                  <td className="p-3 text-slate-600">{p.topCompany}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page detail drawer */}
      {selectedPage && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-xs">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedPage.pageTitle}</h3>
              <a
                href={selectedPage.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:underline font-mono"
              >
                {selectedPage.pageUrl}
              </a>
            </div>
            <button
              onClick={() => setSelectedPage(null)}
              className="text-slate-400 hover:text-slate-700 text-lg leading-none"
            >
              x
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: "RFQs", value: selectedPage.rfqCount },
              { label: "Pipeline Value", value: fmt(selectedPage.rfqValue) },
              { label: "Demo Requests", value: selectedPage.demoRequests },
              { label: "CVR", value: `${selectedPage.conversionRate}%` },
              { label: "Sessions", value: selectedPage.sessions.toLocaleString() },
              { label: "Avg. Time on Page", value: fmtTime(selectedPage.avgTimeOnPage) },
              { label: "Top Lead Company", value: selectedPage.topCompany },
              { label: "Last Lead Date", value: selectedPage.lastLeadDate },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-xl border border-indigo-100 p-3">
                <div className="text-sm font-bold text-indigo-700">{m.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-700">
            <span className="font-semibold">Attribution insight: </span>
            This page generates{" "}
            <strong className="text-indigo-700">
              {fmt(Math.round(selectedPage.rfqValue / selectedPage.rfqCount))} avg. RFQ value
            </strong>{" "}
            and converts at{" "}
            <strong
              className={selectedPage.conversionRate >= 5 ? "text-green-600" : "text-amber-600"}
            >
              {selectedPage.conversionRate}%
            </strong>{" "}
            — producing{" "}
            <strong>{fmt(selectedPage.rfqValue)}</strong> in total pipeline. Priority: publish
            companion pages in this vertical cluster to compound returns.
          </div>
        </div>
      )}
    </div>
  );
}
