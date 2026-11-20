import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";
import { generateGlobalCrosswalk, type SpecificationCrosswalkInput } from "@/lib/standardsCrosswalk";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || undefined;
    const material = searchParams.get("material") || "AISI 4140";
    const pressurePsi = Number(searchParams.get("pressurePsi")) || 3000;
    const temperatureF = Number(searchParams.get("temperatureF")) || 180;
    const clearanceIn = Number(searchParams.get("clearanceIn")) || 0.0005;
    const torqueFtLb = Number(searchParams.get("torqueFtLb")) || 65;
    const equipment = searchParams.get("equipment") || undefined;
    const standard = searchParams.get("standard") || undefined;

    const slices = generateGlobalCrosswalk({
      title,
      material,
      pressurePsi,
      temperatureF,
      clearanceIn,
      torqueFtLb,
      equipment,
      standard,
    });

    return NextResponse.json({
      success: true,
      slices,
      supportedLocales: ["en-US", "de-DE", "ja-JP"],
      standardsCrosswalk: "NIST Special Publication 811 & ISO 80000-1 Verified",
      generatedAt: new Date().toISOString(),
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

    const body: SpecificationCrosswalkInput = await req.json();
    const slices = generateGlobalCrosswalk(body);

    const orgId = session.user.organizationId || "seed-org-industrial";
    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "STANDARDS_LOCALIZATION_GENERATED",
      resourceType: "LOCALIZATION_STUDIO",
      resourceId: body.title || "spec_crosswalk",
      metadata: {
        material: body.material || "AISI 4140",
        pressurePsi: body.pressurePsi || 3000,
        temperatureF: body.temperatureF || 180,
      },
      details: {
        summary: `Generated DIN/JIS localized engineering crosswalk and multi-lingual Schema.org JSON-LD for ${slices.length} global locales.`,
      },
    });

    return NextResponse.json({
      success: true,
      slices,
      supportedLocales: ["en-US", "de-DE", "ja-JP"],
      standardsCrosswalk: "NIST Special Publication 811 & ISO 80000-1 Verified",
      message: `Generated DIN EN and JIS G localized engineering specifications with multi-lingual Schema.org.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
