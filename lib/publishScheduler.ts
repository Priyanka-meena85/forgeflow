// lib/publishScheduler.ts
// Scheduled publish queue with cloud persistence

import { loadCloudCollection, saveCloudCollection } from "@/lib/cloudPersistence";

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

let queue: ScheduledPage[] = [...DEFAULT_QUEUE];

loadCloudCollection<ScheduledPage>("scheduled-publish", DEFAULT_QUEUE)
  .then((data) => {
    if (data && data.length > 0) {
      queue = data;
    }
  })
  .catch(() => {});

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
  saveCloudCollection("scheduled-publish", queue).catch(() => {});
  return item;
}

export function cancelScheduledPage(id: string): boolean {
  const item = queue.find((q) => q.id === id);
  if (!item || item.status !== "PENDING") return false;
  item.status = "CANCELLED";
  item.updatedAt = new Date().toISOString();
  saveCloudCollection("scheduled-publish", queue).catch(() => {});
  return true;
}

export function markPublished(id: string, publishedUrl: string): void {
  const item = queue.find((q) => q.id === id);
  if (!item) return;
  item.status = "PUBLISHED";
  item.publishedUrl = publishedUrl;
  item.updatedAt = new Date().toISOString();
  saveCloudCollection("scheduled-publish", queue).catch(() => {});
}

export function markFailed(id: string, reason: string): void {
  const item = queue.find((q) => q.id === id);
  if (!item) return;
  item.status = "FAILED";
  item.failureReason = reason;
  item.updatedAt = new Date().toISOString();
  saveCloudCollection("scheduled-publish", queue).catch(() => {});
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
