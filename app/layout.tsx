import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { AnalyticsScript } from "@/components/AnalyticsScript";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0284c7",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://forgeflow.industrial.com"),
  title: "ForgeFlow | Enterprise Industrial SEO & AEO Content Engine",
  description:
    "Plan • Generate • Optimize • Grow. Pre-built industrial taxonomies, closed-loop structural QA validation, and native AEO/GEO schema for manufacturing and industrial B2B companies.",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-humanist bg-[#fafaf9] text-stone-900 selection:bg-sky-100 selection:text-sky-900" suppressHydrationWarning>
        {children}
        <CookieConsentBanner />
        <AnalyticsScript />
      </body>
    </html>
  );
}
