import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS & System Integrations | ForgeFlow — WordPress, Webflow, Shopify & More",
  description: "1-Click direct publishing to WordPress VIP REST API, Webflow Collection API v2, Shopify B2B/Hydrogen, Contentful webhooks, SAP ERP, and Developer REST API. Zero-latency deterministic content syndication for industrial OEMs.",
  openGraph: {
    title: "ForgeFlow Integrations Hub — CMS & Enterprise System Connectors",
    description: "Connect ForgeFlow to your existing CMS and enterprise stack. WordPress VIP, Webflow, Shopify B2B, Contentful, SAP ERP, REST API, and Slack review bot.",
    type: "website",
  },
};

export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
