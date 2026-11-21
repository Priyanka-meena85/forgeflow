import { MetadataRoute } from "next";
import { INDUSTRIAL_SECTORS, IndustrySector } from "@/lib/industriesDirectory";
import { db } from "@/lib/db";
import { getSitemapEntries } from "@/lib/publishScheduler";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://forgeflow.ai";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/integrations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vs/clearscope`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const industryRoutes: MetadataRoute.Sitemap = INDUSTRIAL_SECTORS.map((sector: IndustrySector) => ({
    url: `${baseUrl}/industries/${sector.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamically query database for all published technical drafts
  let dynamicArticleRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedDrafts = await db.draft.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        keyword: true,
        publishedUrl: true,
        publishedAt: true,
        updatedAt: true,
      },
      take: 1000,
    });

    dynamicArticleRoutes = publishedDrafts.map((draft) => {
      const slug = draft.publishedUrl
        ? draft.publishedUrl
        : `${baseUrl}/articles/${draft.keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      return {
        url: slug.startsWith("http") ? slug : `${baseUrl}${slug.startsWith("/") ? "" : "/"}${slug}`,
        lastModified: draft.publishedAt || draft.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      };
    });
  } catch (err) {
    console.warn("[Sitemap Engine] Database query skipped or offline, using scheduler fallback:", err);
  }

  // Include scheduled / published queue articles
  const schedulerEntries: MetadataRoute.Sitemap = getSitemapEntries().map((entry) => ({
    url: entry.url,
    lastModified: new Date(entry.lastmod),
    changeFrequency: entry.changefreq,
    priority: entry.priority,
  }));

  return [...staticRoutes, ...industryRoutes, ...dynamicArticleRoutes, ...schedulerEntries];
}
