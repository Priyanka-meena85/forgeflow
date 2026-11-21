import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Changelog | ForgeFlow Industrial AEO",
  description: "Release notes, feature launches, and infrastructure updates for the ForgeFlow Industrial AEO & SEO platform.",
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
