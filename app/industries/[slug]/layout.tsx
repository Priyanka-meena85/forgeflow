import type { Metadata } from "next";
import { getIndustryBySlug } from "@/lib/industriesDirectory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = getIndustryBySlug(slug);
  if (!sector) {
    return { title: "Industry Not Found | ForgeFlow" };
  }
  return {
    title: `${sector.title} AEO Content | ForgeFlow — ${sector.standard}`,
    description: `Certified zero-hallucination AEO content for ${sector.title}. ${sector.capsuleText.substring(0, 120)}... Standard: ${sector.standard}. Avg. deal value: ${sector.avgDealValue}.`,
    openGraph: {
      title: `${sector.title} — Industrial AEO Content | ForgeFlow`,
      description: `Engineer-verified content and Answer Engine Optimization for ${sector.title} manufacturers. Covers ${sector.equipment} with ${sector.standard} compliance.`,
      type: "website",
    },
  };
}

export default function IndustrySectorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
