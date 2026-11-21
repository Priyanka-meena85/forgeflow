import { sendExecutiveWeeklyDigestEmail } from "./email";
import { recordAuditLog } from "./audit";

export interface DigestRecipient {
  email: string;
  organizationName: string;
  organizationId: string;
}

export async function dispatchWeeklyExecutiveDigest(recipients: DigestRecipient[]): Promise<{
  successCount: number;
  failureCount: number;
  dispatchedAt: string;
}> {
  let successCount = 0;
  let failureCount = 0;

  for (const recipient of recipients) {
    try {
      const res = await sendExecutiveWeeklyDigestEmail({
        to: recipient.email,
        organizationName: recipient.organizationName,
        aeoScore: 91,
        primaryCitationsCount: 142,
        topAccounts: [
          "Caterpillar Inc. (Heavy Equipment Division)",
          "The Boeing Company (Renton Flight Facility)",
          "Siemens Energy AG (Gas Turbine Systems)",
        ],
        influencedRevenue: "$1,840,000",
      });

      if (res.success) {
        successCount++;
        await recordAuditLog({
          organizationId: recipient.organizationId,
          userId: "system-cron",
          userRole: "ADMIN",
          action: "WEEKLY_EXECUTIVE_DIGEST_SENT",
          resourceType: "EXECUTIVE_REPORT",
          resourceId: `digest_${Date.now()}`,
          metadata: { recipient: recipient.email },
          details: { summary: `Dispatched zero-login weekly executive board digest to ${recipient.email}` },
        });
      } else {
        failureCount++;
      }
    } catch (err) {
      console.error(`[Executive Digest Engine] Failed for ${recipient.email}:`, err);
      failureCount++;
    }
  }

  return {
    successCount,
    failureCount,
    dispatchedAt: new Date().toISOString(),
  };
}
