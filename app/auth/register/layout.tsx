import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | ForgeFlow Industrial AEO",
  description: "Start your 14-day free pilot of ForgeFlow. No credit card required. Pre-built industrial taxonomies for 7 verticals.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
