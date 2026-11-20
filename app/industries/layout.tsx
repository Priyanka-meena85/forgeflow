import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Verticals Directory | ForgeFlow — 7 Pre-Built Sector Taxonomies",
  description: "7 pre-built industrial vertical taxonomies with zero-hallucination engineering tolerances: HVAC & Refrigeration (ASHRAE 90.1), Food & Beverage (3-A Sanitary), Automotive Tier-1 (IATF 16949), Precision CNC (ISO 230-3), Plastics, Hydraulics, and Heavy Mining.",
  openGraph: {
    title: "ForgeFlow Industries Directory — Pre-Built Industrial Verticals",
    description: "Browse 7 engineering-certified industrial content verticals for equipment manufacturers, OEM suppliers, and distributors.",
    type: "website",
  },
};

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
