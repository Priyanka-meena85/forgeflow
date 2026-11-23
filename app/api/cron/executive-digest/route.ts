import { NextRequest, NextResponse } from "next/server";
import { dispatchWeeklyExecutiveDigest } from "@/lib/executiveDigestEngine";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Secure cron endpoint against unauthorized triggering
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    // Query real active organization owners and admins from PostgreSQL
    let recipients: { email: string; organizationName: string; organizationId: string }[] = [];
    try {
      const orgs = await db.organization.findMany({
        where: {
          subscriptionStatus: { in: ["active", "trialing"] },
        },
        include: {
          users: {
            where: { role: { in: ["OWNER", "ADMIN"] } },
            select: { email: true },
          },
        },
      });

      recipients = orgs.flatMap((org) =>
        org.users.map((u) => ({
          email: u.email,
          organizationName: org.name,
          organizationId: org.id,
        }))
      );
    } catch (dbErr) {
      console.warn("[Executive Digest Cron] DB query fallback:", dbErr);
    }

    // Fallback to configured notification email if no active organizations registered yet
    if (recipients.length === 0) {
      recipients = [
        {
          email: process.env.ADMIN_EMAIL || "executive@forgeflow.ai",
          organizationName: "Apex Motion Systems",
          organizationId: "system-root",
        },
      ];
    }

    const result = await dispatchWeeklyExecutiveDigest(recipients);

    return NextResponse.json({
      success: true,
      recipientsCount: recipients.length,
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Executive digest dispatch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
