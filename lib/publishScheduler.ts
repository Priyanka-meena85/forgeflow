// lib/publishScheduler.ts
// Scheduled publish queue with filesystem persistence

import fs from "fs";
import path from "path";

export type ScheduledStatus = "PENDING" | "PUBLISHING" | "PUBLISHED" | "FAILED" | "CANCELLED";

export interface ScheduledPage {
  id: string;
  draftId: string;
  title: string;
  slug: string;
  cmsTarget: "WORDPRESS" | "WEBFLOW" | "SHOPIFY" | "WEBHOOK";
  cmsEndpoint: string;
  scheduledAt: string; // ISO 8601
  status: ScheduledStatus;
  publishedUrl?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_FILE = path.join(process.cwd(), "data", "scheduled-publish.json");

const DEFAULT_QUEUE: ScheduledPage[] = [
  {
    id: "sq_001",
    draftId: "d_001",
    title: "CNC Precision Machining for Automotive OEMs — India",
    slug: "/cnc-machining-automotive-india",
    cmsTarget: "WORDPRESS",
    cmsEndpoint: "https://specs.accudrive.io/wp-json/wp/v2/posts",
    scheduledAt: new Date(Date.now() + 3600_000).toISOString(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sq_002",
    draftId: "d_002",
    title: "Sanitary Rotary Lobe Pumps — Pharmaceutical GMP",
    slug: "/rotary-lobe-pump-pharma-gmp",
    cmsTarget: "WEBFLOW",
    cmsEndpoint: "https://api.webflow.com/v2/collections/abc123/items",
    scheduledAt: new Date(Date.now() + 86400_000).toISOString(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadQueue(): ScheduledPage[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[PublishScheduler] Storage load error; using default fallback:", err);
  }
  return [...DEFAULT_QUEUE];
}

function saveQueue(q: ScheduledPage[]) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(q, null, 2), "utf-8");
  } catch (err) {
    console.warn("[PublishScheduler] Storage write error:", err);
  }
}

let queue: ScheduledPage[] = loadQueue();

export function listScheduledPages(): ScheduledPage[] {
  return [...queue].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
}

export function schedulePageForPublish(
  page: Omit<ScheduledPage, "id" | "status" | "createdAt" | "updatedAt">
): ScheduledPage {
  const item: ScheduledPage = {
    ...page,
    id: `sq_${Date.now()}`,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  queue.push(item);
  saveQueue(queue);
  return item;
}

export function cancelScheduledPage(id: string): boolean {
  const item = queue.find((q) => q.id === id);
  if (!item || item.status !== "PENDING") return false;
  item.status = "CANCELLED";
  item.updatedAt = new Date().toISOString();
  saveQueue(queue);
  return true;
}

export function markPublished(id: string, publishedUrl: string): void {
  const item = queue.find((q) => q.id === id);
  if (!item) return;
  item.status = "PUBLISHED";
  item.publishedUrl = publishedUrl;
  item.updatedAt = new Date().toISOString();
  saveQueue(queue);
}

export function markFailed(id: string, reason: string): void {
  const item = queue.find((q) => q.id === id);
  if (!item) return;
  item.status = "FAILED";
  item.failureReason = reason;
  item.updatedAt = new Date().toISOString();
  saveQueue(queue);
}

/** Sitemap entry */
export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
}

const sitemapEntries: SitemapEntry[] = [
  { url: "https://accudrive.io/cnc-machining-automotive-india", lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: 0.9 },
  { url: "https://accudrive.io/rotary-lobe-pump-pharma-gmp", lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: 0.9 },
];

export function getSitemapEntries(): SitemapEntry[] {
  return sitemapEntries;
}

export function addSitemapEntry(entry: SitemapEntry): void {
  const existing = sitemapEntries.findIndex((e) => e.url === entry.url);
  if (existing >= 0) {
    sitemapEntries[existing] = entry;
  } else {
    sitemapEntries.push(entry);
  }
}

export function generateSitemapXml(): string {
  const entries = getSitemapEntries();
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
