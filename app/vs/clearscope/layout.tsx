import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ForgeFlow vs Clearscope: Head-to-Head Comparison for Industrial B2B",
  description:
    "See why manufacturing OEMs and industrial marketers choose ForgeFlow over Clearscope. Architectural comparison of CAD STEP extraction, DIN/JIS crosswalks, and AEO answer engine tracking.",
};

export default function ClearscopeComparisonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
