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
    | "SUBSCRIPTION_UPDATED"
    | "1_CLICK_CMS_PUBLISHED"
    | "CMS_INTEGRATION_CONNECTED"
    | "OEM_DOCUMENT_INGESTED"
    | "AEO_AUDIT_SCAN_COMPLETED"
    | "ENTERPRISE_INVOICE_GENERATED"
    | (string & {});
  resourceType: 
    | "DRAFT" 
    | "REVIEW" 
    | "REVIEWER" 
    | "ORGANIZATION" 
    | "JOB"
    | "SPEC_DOCUMENT"
    | "CMS_INTEGRATION"
    | "AEO_TRACKER"
    | "INVOICE"
    | (string & {});
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  diff?: Record<string, unknown>;
  details?: string | Record<string, unknown>;
  ipAddress?: string | null;
}

export async function logAuditEvent(params: LogAuditParams) {
  try {
    const detailsJson = typeof params.details === "string" 
      ? JSON.stringify({ summary: params.details }) 
      : params.details 
        ? JSON.stringify(params.details) 
        : null;

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
        detailsJson,
        ipAddress: params.ipAddress ?? null,
      },
    });
    return log;
  } catch (error) {
    console.error("[AuditEngine] Failed to persist audit event:", error);
    return null;
  }
}

export const recordAuditLog = logAuditEvent;

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
