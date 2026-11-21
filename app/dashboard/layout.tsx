import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ForgeFlow Mission Control | Industrial AEO Console",
  description: "Enterprise workspace for industrial taxonomies, AEO schema graphs, CAD tolerance inspection, and publishing pipeline.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
