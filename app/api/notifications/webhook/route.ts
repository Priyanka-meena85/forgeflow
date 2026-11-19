import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { webhookUrl, channelName, eventType, draftTitle, equipment } = body;

    const orgId = session.user.organizationId || "seed-org-industrial";
    const title = draftTitle || "Root Cause Protocol: Stamping Die Galling & Weld Inspection";
    const eq = equipment || "Servo Stamping Press";

    const payload = {
      text: `🚨 *Engineering Review Alert* (${eventType || "DRAFT_PENDING_SIGN_OFF"})`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🚨 New Industrial Slice Awaiting Application Sign-Off",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Topic:*\n${title}` },
            { type: "mrkdwn", text: `*Equipment:*\n${eq}` },
            { type: "mrkdwn", text: `*Standard:*\nASHRAE 90.1 / IATF 16949` },
            { type: "mrkdwn", text: `*Author:*\n${session.user.name || session.user.email}` },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "✓ Approve Tolerances" },
              style: "primary",
              url: `http://localhost:8080/?tab=qa&status=approved`,
            },
            {
              type: "button",
              text: { type: "plain_text", text: "✎ Request Edits" },
              style: "danger",
              url: `http://localhost:8080/?tab=qa&status=revisions`,
            },
          ],
        },
      ],
    };

    let dispatched = false;
    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatched = response.ok;
      } catch (e) {
        console.warn("Outbound webhook fetch error:", e);
      }
    }

    // Always log to audit trail
    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "DISPATCHED_SLACK_WEBHOOK",
      resourceType: "ORGANIZATION",
      metadata: {
        channelName: channelName || "#engineering-reviews",
        eventType: eventType || "REVIEW_ALERT",
        liveDispatched: dispatched,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Simulated Slack alert sent to ${channelName || "#engineering-reviews"}.`,
      payload,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to dispatch webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
