import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface CompetitorTarget {
  id: string;
  competitorName: string;
  query: string;
  searchEngine: "Google AI Overview" | "Perplexity Copilot";
  citedUrl: string;
  estimatedAcv: string;
  gapScore: number; // 0 - 100
  detectedWeaknesses: string[];
  recommendedCounterStrategy: string;
  counterArticleSlug: string;
}

const defaultCompetitors: CompetitorTarget[] = [
  {
    id: "comp_1",
    competitorName: "Parker Hannifin",
    query: "Variable displacement hydraulic pump cavitation symptoms",
    searchEngine: "Google AI Overview",
    citedUrl: "https://parker.com/literature/pumps/cavitation-overview.html",
    estimatedAcv: "$130,000",
    gapScore: 84,
    detectedWeaknesses: [
      "Missing ISO 4406 fluid cleanliness class thresholds",
      "No direct suction superheat / inlet pressure table",
      "Lacks Schema.org reviewedBy applications engineer credential"
    ],
    recommendedCounterStrategy: "Publish ISO 4406 Cleanliness SOP with Slipper Delamination Diagnostic Checklist",
    counterArticleSlug: "diagnostic-procedure-identifying-high-pressure-slipper-delamination",
  },
  {
    id: "comp_2",
    competitorName: "Alfa Laval",
    query: "Sanitary rotary lobe pump seal swelling during CIP washdown",
    searchEngine: "Perplexity Copilot",
    citedUrl: "https://alfalaval.com/products/fluid-handling/pumps/lobe-pumps/faq",
    estimatedAcv: "$120,000",
    gapScore: 78,
    detectedWeaknesses: [
      "Vague elastomer compatibility (fails to cite FDA 21 CFR 177.2600)",
      "Does not provide 3-A Sanitary Standard 02-12 protocol limits",
      "No 45-word direct answer capsule for answer engine ingestion"
    ],
    recommendedCounterStrategy: "Counter with 3-A SOP detailing EPDM vs FKM swelling in 2% sodium hydroxide washdown",
    counterArticleSlug: "preventing-elastomer-seal-swelling-in-rotary-lobe-pumps-during-cip",
  },
  {
    id: "comp_3",
    competitorName: "Carrier Commercial HVAC",
    query: "Commercial RTU scroll compressor flooded starts prevention",
    searchEngine: "Google AI Overview",
    citedUrl: "https://carrier.com/commercial/en/us/service/rtu-flooded-start-bulletin",
    estimatedAcv: "$95,000",
    gapScore: 92,
    detectedWeaknesses: [
      "Dated 2018 technical bulletin missing ASHRAE 90.1-2022 economizer limits",
      "No interactive suction superheat limit calculator",
      "Missing HowTo entity JSON-LD schema graph"
    ],
    recommendedCounterStrategy: "Deploy ASHRAE 90.1 compliant FDD SOP with Crankcase Heater Thermostat limits",
    counterArticleSlug: "automating-fault-detection-diagnostics-rtu-compressor-failure",
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      count: defaultCompetitors.length,
      competitors: defaultCompetitors,
      marketIntelligenceSummary: {
        totalDisplaceableQueries: defaultCompetitors.length,
        totalPipelineAtRisk: "$345,000",
        averageCompetitorGapScore: 84.6,
        opportunityLevel: "HIGH",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const body = await req.json();
    const { competitorId } = body;

    const target = defaultCompetitors.find((c) => c.id === competitorId);
    if (!target) {
      return NextResponse.json({ error: "Competitor intelligence target not found." }, { status: 404 });
    }

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "COMPETITOR_AEO_COUNTER_INITIATED",
      resourceType: "AEO_DISPLACER",
      resourceId: target.id,
      metadata: { competitorName: target.competitorName, query: target.query },
      details: { summary: `Triggered AEO Displacer against ${target.competitorName} on "${target.query}"` },
    });

    return NextResponse.json({
      success: true,
      message: `Counter-Spec draft initiated against ${target.competitorName}.`,
      targetSlug: target.counterArticleSlug,
      strategy: target.recommendedCounterStrategy,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
