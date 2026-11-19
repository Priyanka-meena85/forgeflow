import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { getOrganizationAuditLogs } from "@/lib/audit";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to access audit trails.", 401);

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const logs = await getOrganizationAuditLogs(user.organizationId, limit);

    return NextResponse.json({
      success: true,
      count: logs.length,
      auditLogs: logs.map((l) => ({
        id: l.id,
        action: l.action,
        resourceType: l.resourceType,
        resourceId: l.resourceId,
        userRole: l.userRole,
        metadata: l.metadataJson ? JSON.parse(l.metadataJson) : null,
        diff: l.diffJson ? JSON.parse(l.diffJson) : null,
        details: l.detailsJson ? JSON.parse(l.detailsJson) : null,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt,
      })),
    });
  } catch (error) {
    console.error("[Audit API Error]:", error);
    return errorResponse("Failed to fetch audit records.", 500);
  }
}
