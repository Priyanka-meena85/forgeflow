import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Case Studies & ROI Benchmarks | ForgeFlow",
  description:
    "Real-world data and verifiable ROI metrics from manufacturing OEMs, Tier-1 automotive suppliers, and precision tooling teams optimizing for AI answer engines.",
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
