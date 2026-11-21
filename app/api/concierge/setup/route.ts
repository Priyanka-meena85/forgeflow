import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";
import { captureTelemetry } from "@/lib/telemetry";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { companyName, contactName, email, catalogSize, primaryStandards, targetLaunchDays } = body;

    if (!companyName || !email) {
      return NextResponse.json({ error: "Company name and contact email are required." }, { status: 400 });
    }

    const sowId = `SOW-FORGEFLOW-${Date.now()}`;
    const sow = {
      sowId,
      createdAt: new Date().toISOString(),
      client: {
        companyName: String(companyName).trim(),
        contactName: String(contactName || "Engineering Director").trim(),
        email: String(email).trim().toLowerCase(),
        estimatedCatalogSkus: Number(catalogSize) || 250,
        primaryStandards: Array.isArray(primaryStandards) ? primaryStandards : ["ASME Y14.5", "ISO 10303", "DIN EN 10204"],
      },
      deliverables: [
        "Phase 1: Automated 3D CAD/STEP & PDF spec sheet ingestion and OCR extraction",
        "Phase 2: ASME Y14.5 GD&T tolerance & ISO material callout ontology mapping",
        "Phase 3: Schema.org Product & TechArticle JSON-LD injection across full catalog",
        "Phase 4: ChatGPT Search & Perplexity citation verification & displacement audit",
        "Phase 5: Reverse-IP Enterprise Deanonymization & RFQ Attribution dashboard provisioning",
      ],
      commercials: {
        implementationFee: "$4,500 (One-Time White-Glove Concierge Sprint)",
        monthlySubscription: "$1,499 / Month (Growth OEM Tier)",
        serviceLevelAgreement: "99.9% Uptime with Dedicated Solutions Engineer",
        targetDelivery: `${targetLaunchDays || 30} Business Days from Kickoff`,
      },
      status: "ENGAGEMENT_CONFIRMED",
    };

    const orgId = session?.user?.organizationId || "guest-concierge-lead";
    await recordAuditLog({
      organizationId: orgId,
      userId: session?.user?.id || "unauth-prospect",
      userRole: session?.user?.role || "GUEST",
      action: "CONCIERGE_ONBOARDING_REQUESTED",
      resourceType: "COMMERCIAL_SOW",
      resourceId: sowId,
      metadata: { companyName, email, catalogSize },
      details: { summary: `White-glove assisted onboarding requested for ${companyName} (${catalogSize} SKUs).` },
    });

    await captureTelemetry({
      level: "INFO",
      message: `Enterprise Concierge Onboarding Registered: ${companyName}`,
      context: { sowId, companyName, email },
    });

    return NextResponse.json({
      success: true,
      message: "White-Glove Assisted Onboarding engagement registered. Your Dedicated Industrial Solutions Engineer will reach out within 2 business hours.",
      sow,
    }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
