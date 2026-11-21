import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { processErpSyncBatch, type ErpProductSpec, type ErpSyncResult } from "@/lib/erpSyncEngine";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sourceSystem, specs, existingHashes } = body;

    if (!Array.isArray(specs) || specs.length === 0) {
      return NextResponse.json({ error: "specs must be a non-empty array of technical product specifications." }, { status: 400 });
    }

    const validSources: ErpSyncResult["sourceSystem"][] = [
      "SAP_COMMERCE_CLOUD",
      "AKENEO_PIM",
      "SALSIFY",
      "CUSTOM_ERP_WEBHOOK",
    ];

    const source: ErpSyncResult["sourceSystem"] = validSources.includes(sourceSystem)
      ? sourceSystem
      : "CUSTOM_ERP_WEBHOOK";

    const orgId = session.user.organizationId || "seed-org-industrial";
    const result = await processErpSyncBatch(
      source,
      specs as ErpProductSpec[],
      existingHashes || {},
      orgId,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "ERP synchronization failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
