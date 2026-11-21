import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { parseStepFileContent } from "@/lib/cadStepParser";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { stepContent, partName } = body;

    if (!stepContent || typeof stepContent !== "string") {
      return NextResponse.json({ error: "STEP/CAD content text is required." }, { status: 400 });
    }

    // Safety boundary for in-memory string parsing (5MB max)
    if (stepContent.length > 5 * 1024 * 1024) {
      return NextResponse.json({
        error: "STEP file content exceeds maximum allowable direct payload size (5MB). For large assembly models, please use direct S3/R2 presigned storage ingestion.",
      }, { status: 413 });
    }

    const parsed = parseStepFileContent(stepContent, partName || "Servo Stamping Progressive Die Assembly");

    const orgId = session.user.organizationId || "seed-org-industrial";
    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "CAD_STEP_PARSED_TO_SCHEMA",
      resourceType: "CAD_ENGINE",
      resourceId: parsed.partNumber,
      metadata: { partName: parsed.partName, cadStandard: parsed.cadStandard },
      details: { summary: `Extracted ${parsed.operatingTolerances.length} tolerance nodes and Schema.org graph from 3D CAD definition.` },
    });

    return NextResponse.json({
      success: true,
      parsed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
