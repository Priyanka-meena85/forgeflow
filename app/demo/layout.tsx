import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Enterprise Demo | ForgeFlow Industrial AEO & SEO",
  description:
    "Schedule a 1-on-1 architecture demonstration of ForgeFlow. See real-time answer engine tracking, CAD schema extraction, and DIN/JIS standards crosswalk in action.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
