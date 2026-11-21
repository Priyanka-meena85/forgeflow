import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial AEO & Technical SEO Insights | ForgeFlow Blog",
  description:
    "Engineering guides, Answer Engine Optimization strategies, and technical whitepapers on ranking manufacturing data in Perplexity, ChatGPT, and Google SGE.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
