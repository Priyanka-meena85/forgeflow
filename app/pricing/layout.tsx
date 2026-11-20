import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans | ForgeFlow — Industrial AEO & SEO Content Engine",
  description: "Transparent pricing for industrial manufacturers. Industrial Pilot from $199/mo, Growth OEM $479/mo, Enterprise Global $1,199/mo. ROI calculator included. 14-day free pilot.",
  openGraph: {
    title: "ForgeFlow Pricing — Industrial AEO Content Engine Plans",
    description: "Deterministic AEO & SEO content plans built for OEM equipment manufacturers. Monthly/annual billing with 20% savings.",
    type: "website",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
