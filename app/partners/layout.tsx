import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner & Agency Reseller Program | ForgeFlow",
  description:
    "Partner with ForgeFlow. Earn 20-25% recurring commissions, unlock co-marketing MDF funds, and modernize your industrial clients for the AI search era.",
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
