import { NextRequest, NextResponse } from "next/server";
import { dispatchWeeklyExecutiveDigest } from "@/lib/executiveDigestEngine";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Secure cron endpoint against unauthorized triggering
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const recipients = [
      {
        email: "executive@apexmotion.com",
        organizationName: "Apex Motion Systems GmbH",
        organizationId: "seed-org-industrial",
      },
    ];

    const result = await dispatchWeeklyExecutiveDigest(recipients);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Executive digest dispatch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
