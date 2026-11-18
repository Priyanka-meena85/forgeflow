import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForgeFlow | Enterprise Industrial SEO & AEO Content Engine",
  description:
    "Pre-built industrial taxonomies, closed-loop structural QA validation, and native AEO/GEO schema for manufacturing and industrial B2B companies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
        {children}
      </body>
    </html>
  );
}
