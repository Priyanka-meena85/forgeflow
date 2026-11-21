import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ForgeFlow Industrial AEO & SEO SaaS",
  description: "ForgeFlow's commitment to industrial data privacy, GDPR, CCPA, and enterprise CAD file governance.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
