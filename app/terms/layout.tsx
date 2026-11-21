import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ForgeFlow Industrial AEO & SEO SaaS",
  description: "Enterprise terms of service, acceptable use policy, and SLA commitments for ForgeFlow Industrial AEO platform.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
