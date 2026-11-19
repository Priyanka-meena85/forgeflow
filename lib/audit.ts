import { db } from "@/lib/db";

export interface LogAuditParams {
  organizationId: string;
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: 
    | "SPEC_APPROVED" 
    | "SPEC_CHANGES_REQUESTED" 
    | "DRAFT_CREATED" 
    | "DRAFT_UPDATED" 
    | "DRAFT_PUBLISHED" 
    | "REVIEWER_ASSIGNED" 
    | "REVIEWER_CREATED" 
    | "REVIEWER_DELETED"
    | "QUOTA_EXCEEDED"
    | "SUBSCRIPTION_UPDATED";
  resourceType: "DRAFT" | "REVIEW" | "REVIEWER" | "ORGANIZATION" | "JOB";
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  diff?: Record<string, unknown>;
  details?: string;
  ipAddress?: string | null;
}

export async function logAuditEvent(params: LogAuditParams) {
  try {
    const log = await db.auditLog.create({
      data: {
        organizationId: params.organizationId,
        userId: params.userId ?? null,
        userRole: params.userRole ?? null,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId ?? null,
        metadataJson: params.metadata ? JSON.stringify(params.metadata) : null,
        diffJson: params.diff ? JSON.stringify(params.diff) : null,
        detailsJson: params.details ? JSON.stringify({ summary: params.details }) : null,
        ipAddress: params.ipAddress ?? null,
      },
    });
    return log;
  } catch (error) {
    console.error("[AuditEngine] Failed to persist audit event:", error);
    return null;
  }
}

export async function getOrganizationAuditLogs(organizationId: string, limit = 50) {
  try {
    return await db.auditLog.findMany({
      where: { organizationId },
      take: limit,
    });
  } catch (error) {
    console.error("[AuditEngine] Failed to retrieve audit logs:", error);
    return [];
  }
}
