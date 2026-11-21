import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://forgeflow.ai";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/_next/",
          "/accept-invite/",
          "/verify-email/",
          "/reset-password/",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/industries/", "/features/", "/blog/"],
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/industries/", "/features/", "/blog/"],
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/industries/", "/features/", "/blog/"],
        disallow: ["/api/", "/dashboard/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
