import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Features | ForgeFlow — 23-Module Industrial AEO Suite",
  description: "ForgeFlow's 4 architectural pillars: Live AI Answer Engine Simulator (Google SGE, Perplexity, ChatGPT), Deterministic Engineering QA Studio, 3D CAD WebGL Inspector, and 1-Click Headless CMS Publisher. Built for industrial OEMs.",
  openGraph: {
    title: "ForgeFlow Platform Features — Zero-Hallucination Industrial AEO",
    description: "23 enterprise modules across 4 pillars for industrial manufacturers. Live SERP simulation, deterministic QA, 3D CAD, and headless CMS publishing.",
    type: "website",
  },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
