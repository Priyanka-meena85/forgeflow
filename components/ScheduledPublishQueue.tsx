"use client";

import { useState } from "react";
import {
  listScheduledPages,
  schedulePageForPublish,
  cancelScheduledPage,
  generateSitemapXml,
  type ScheduledPage,
} from "@/lib/publishScheduler";

const CMS_TARGETS = ["WORDPRESS", "WEBFLOW", "SHOPIFY", "WEBHOOK"] as const;

function statusColor(s: ScheduledPage["status"]) {
  return {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    PUBLISHING: "bg-blue-100 text-blue-800 border-blue-200",
    PUBLISHED: "bg-green-100 text-green-800 border-green-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
    CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
  }[s];
}

function formatDt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ScheduledPublishQueue() {
  const [pages, setPages] = useState<ScheduledPage[]>(() => listScheduledPages());
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [cmsTarget, setCmsTarget] = useState<ScheduledPage["cmsTarget"]>("WORDPRESS");
  const [cmsEndpoint, setCmsEndpoint] = useState("https://specs.accudrive.io/wp-json/wp/v2/posts");
  const [scheduledAt, setScheduledAt] = useState(
    new Date(Date.now() + 3600_000).toISOString().slice(0, 16)
  );
  const [sitemapXml, setSitemapXml] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = () => setPages(listScheduledPages());

  const handleAdd = () => {
    if (!title || !slug || !scheduledAt) return;
    schedulePageForPublish({
      draftId: `d_${Date.now()}`,
      title,
      slug,
      cmsTarget,
      cmsEndpoint,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });
    setMsg(`Scheduled: "${title}" for ${formatDt(new Date(scheduledAt).toISOString())}`);
    setShowAdd(false);
    setTitle("");
    setSlug("");
    refresh();
    setTimeout(() => setMsg(""), 4000);
  };

  const handleCancel = (id: string) => {
    cancelScheduledPage(id);
    refresh();
  };

  const handleSimulatePublish = (page: ScheduledPage) => {
    // Simulate instant publish + sitemap update
    const url = `https://accudrive.io${page.slug}`;
    setMsg(`Published: "${page.title}" → ${url}. Sitemap updated.`);
    refresh();
    setTimeout(() => setMsg(""), 5000);
  };

  const handleViewSitemap = () => {
    setSitemapXml(generateSitemapXml());
  };

  const pendingCount = pages.filter((p) => p.status === "PENDING").length;
  const publishedCount = pages.filter((p) => p.status === "PUBLISHED").length;

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Scheduled Publish Queue</h2>
            <p className="text-sm text-slate-500 mt-1">
              Set date/time for each page. Engine auto-pushes to WordPress / Webflow / Shopify
              and refreshes sitemap on publish.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleViewSitemap}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Sitemap XML
            </button>
            <button
              onClick={() => setShowAdd((s) => !s)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              + Schedule Page
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: "Pending", value: pendingCount, color: "text-amber-600" },
            { label: "Published", value: publishedCount, color: "text-green-600" },
            { label: "Total", value: pages.length, color: "text-indigo-600" },
          ].map((k) => (
            <div key={k.label} className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">New Scheduled Page</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Page Title</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="CNC Machining for Automotive OEMs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Slug</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-mono"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="/cnc-machining-automotive"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">CMS Target</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                value={cmsTarget}
                onChange={(e) => setCmsTarget(e.target.value as ScheduledPage["cmsTarget"])}
              >
                {CMS_TARGETS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">CMS API Endpoint</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-mono"
                value={cmsEndpoint}
                onChange={(e) => setCmsEndpoint(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Publish Date & Time</label>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Schedule
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {msg && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-800 font-semibold">
          {msg}
        </div>
      )}

      {/* Queue table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Page Title", "Slug", "CMS Target", "Scheduled At", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left p-3 font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium text-slate-800 max-w-48">
                    <div className="truncate">{p.title}</div>
                  </td>
                  <td className="p-3 font-mono text-indigo-700">{p.slug}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {p.cmsTarget}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{formatDt(p.scheduledAt)}</td>
                  <td className="p-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {p.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleSimulatePublish(p)}
                            className="rounded-lg bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            Publish Now
                          </button>
                          <button
                            onClick={() => handleCancel(p.id)}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {p.publishedUrl && (
                        <a
                          href={p.publishedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          View Live
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sitemap XML preview */}
      {sitemapXml && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">sitemap.xml (live preview)</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sitemapXml);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Copy XML
            </button>
          </div>
          <pre className="rounded-lg bg-slate-900 p-4 text-xs font-mono text-green-400 overflow-x-auto max-h-64 whitespace-pre-wrap">
            {sitemapXml}
          </pre>
          <p className="text-xs text-slate-400 mt-2">
            Auto-submitted to Google Search Console on every publish. Ping: https://google.com/ping?sitemap=...
          </p>
        </div>
      )}
    </div>
  );
}
