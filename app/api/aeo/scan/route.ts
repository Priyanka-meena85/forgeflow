import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { runOrganizationAeoScan } from "@/lib/aeoTracker";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const summary = await runOrganizationAeoScan(orgId);

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "AEO_AUDIT_SCAN_COMPLETED",
      resourceType: "AEO_TRACKER",
      resourceId: `scan_${Date.now()}`,
      metadata: {
        totalMonitored: summary.totalMonitored,
        googleCitedCount: summary.googleCitedCount,
        perplexityCitedCount: summary.perplexityCitedCount,
        aggregateCitationShare: `${summary.aggregateCitationShare}%`,
      },
      details: {
        summary: `Completed real-time AEO citation audit across ${summary.totalMonitored} queries with ${summary.aggregateCitationShare}% LLM visibility rate.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `AEO Citation Scan finished: ${summary.googleCitedCount}/${summary.totalMonitored} cited in Google AI Overviews, ${summary.perplexityCitedCount}/${summary.totalMonitored} cited in Perplexity.`,
      summary,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
