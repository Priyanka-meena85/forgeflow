import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orgName = searchParams.get("org") || session.user.name || "Apex Motion Systems GmbH";
    const auditPeriod = searchParams.get("period") || "Q4 2026";

    const report = {
      meta: {
        reportId: `EXECUTIVE-AEO-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        organizationName: orgName,
        auditPeriod,
        complianceStandard: "ISO 27001 / ITAR Zero-Retention Certified",
      },
      executiveSummary: {
        overallAeoScore: 89,
        aeoScoreDelta: "+24% YoY",
        verifiedTechnicalSpecsCount: 1420,
        estimatedPipelineInfluenced: "$2,840,000",
        rfqConversionLift: "3.4x vs Traditional Organic Search",
        verdict: "Strong Tier-1 Answer Engine Moat established in Hydraulic & Servo Motion.",
      },
      aiEngineVisibility: [
        {
          engine: "ChatGPT Search (GPT-4o)",
          marketSharePct: 41,
          primaryCitationRate: "84.2%",
          status: "DOMINANT",
          topTrigger: "Servo Actuator ASME Y14.5 Tolerance Callouts",
        },
        {
          engine: "Perplexity Pro (Sonar Large)",
          marketSharePct: 29,
          primaryCitationRate: "78.6%",
          status: "DOMINANT",
          topTrigger: "ISO 4401 Subplate Proportional Valve Hydraulic Schematics",
        },
        {
          engine: "Google AI Overviews (SGE)",
          marketSharePct: 22,
          primaryCitationRate: "91.0%",
          status: "DOMINANT",
          topTrigger: "Stainless 316L Cryogenic Seal Operating Limits",
        },
        {
          engine: "Claude / Anthropic Search",
          marketSharePct: 8,
          primaryCitationRate: "71.4%",
          status: "STABLE",
          topTrigger: "DIN EN 10204 3.1 Material Test Certificate Compliance",
        },
      ],
      competitorDisplacement: [
        {
          competitor: "Parker Hannifin",
          displacedQueriesCount: 84,
          citationWinRate: "68%",
          topDisplacedPartCategory: "High-Pressure Hydraulic Proportional Valves",
        },
        {
          competitor: "Bosch Rexroth",
          displacedQueriesCount: 62,
          citationWinRate: "74%",
          topDisplacedPartCategory: "Variable Displacement Axial Piston Pumps",
        },
        {
          competitor: "SMC Corporation",
          displacedQueriesCount: 47,
          citationWinRate: "62%",
          topDisplacedPartCategory: "Pneumatic ISO 15552 Cylinders with Magnetic Sensors",
        },
      ],
      influencedEnterpriseAccounts: [
        { account: "Boeing Commercial Airplanes", ipConfidence: "99%", visits: 18, partsInspected: ["TITANIUM-FLANGE-ASME-B16.5"], estimatedRfqValue: "$450,000" },
        { account: "Caterpillar Inc. (Peoria Facility)", ipConfidence: "98%", visits: 24, partsInspected: ["HEAVY-DUTY-CYLINDER-CAT440"], estimatedRfqValue: "$620,000" },
        { account: "Siemens Energy AG", ipConfidence: "97%", visits: 14, partsInspected: ["CRYOGENIC-BALL-VALVE-316L"], estimatedRfqValue: "$380,000" },
      ],
      strategicActionPlan: [
        "Synthesize schema for remaining 180 legacy PDF specification sheets before Q1 distributor refresh.",
        "Implement Direct RFQ Deep-Linking for Grainger and DigiKey syndication nodes.",
        "Enable ITAR CAD IP zero-retention ephemeral memory purging across all regional engineering plants.",
      ],
    };

    return NextResponse.json({ success: true, report });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Report generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
