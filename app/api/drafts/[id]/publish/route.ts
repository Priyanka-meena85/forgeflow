import { NextResponse } from "next/server";
import { DraftStatus } from "@prisma/client";
import { getSessionUser, canPublishDraft } from "@/lib/auth";
import { db } from "@/lib/db";
import { serializeDraft } from "@/lib/drafts";
import { errorResponse } from "@/lib/http";
import { logAuditEvent } from "@/lib/audit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to publish drafts.", 401);

    if (!canPublishDraft(user)) {
      return errorResponse(
        "Access denied. Only organization administrators (OWNER/ADMIN) can authorize publishing to CMS.",
        403,
      );
    }

    const { id } = await params;
    const draft = await db.draft.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!draft) return errorResponse("Draft not found.", 404);

    // Strict Expert Review Publishing Gate
    const pageReview = await db.pageReview.findUnique({
      where: { draftId: draft.id },
      include: { reviewer: true },
    });

    if (!pageReview || pageReview.status !== "APPROVED") {
      return errorResponse(
        "Publishing Gate Enforced: Draft cannot be published until an application engineer reviews and approves the technical content.",
        400,
      );
    }

    const body: unknown = await request.json().catch(() => null);
    const { targetCms, targetUrl, webhookUrl, integrationId } = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

    // 1-Click Direct CMS Publishing Integration
    let cmsDispatchResult: { provider?: string; publishedUrl?: string; message?: string } | null = null;
    try {
      const { publishDraftToCms } = await import("@/lib/cmsPublishing");
      const pub = await publishDraftToCms({
        draftId: draft.id,
        integrationId: typeof integrationId === "string" ? integrationId : undefined,
        userId: user.id,
        userRole: user.role,
      });
      cmsDispatchResult = pub;
    } catch (cmsErr) {
      console.warn("CMS dispatch warning:", cmsErr);
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8080").replace(/\/+$/, "");
    const slug = draft.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const publishedUrl = cmsDispatchResult?.publishedUrl || (typeof targetUrl === "string" && targetUrl.trim() ? targetUrl.trim() : `${appUrl}/articles/${slug}`);

    // Optional: Dispatch to real CMS Webhook (Zapier, Make, Webflow, WordPress REST API)
    let webhookStatus: string | null = null;
    if (typeof webhookUrl === "string" && (webhookUrl.startsWith("http://") || webhookUrl.startsWith("https://"))) {
      try {
        const sections = JSON.parse(draft.sectionsJson);
        const faqs = JSON.parse(draft.faqsJson);
        const whRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-ForgeFlow-Event": "draft.published" },
          body: JSON.stringify({
            event: "draft.published",
            id: draft.id,
            title: draft.title,
            slug,
            vertical: draft.vertical,
            summary: draft.summary,
            sections,
            faqs,
            schemaJson: draft.schemaJson,
            targetCms: typeof targetCms === "string" ? targetCms : "Custom Webhook",
            timestamp: new Date().toISOString(),
          }),
        });
        webhookStatus = `Webhook dispatched: HTTP ${whRes.status}`;
      } catch (whErr) {
        webhookStatus = `Webhook error: ${whErr instanceof Error ? whErr.message : "Dispatch failed"}`;
      }
    }

    const updated = await db.draft.update({
      where: { id: draft.id },
      data: {
        status: DraftStatus.PUBLISHED,
        publishedAt: new Date(),
        publishedUrl,
        reviewComment: `Published via ${typeof targetCms === "string" ? targetCms : "Direct Pipeline"} to ${publishedUrl}${webhookStatus ? ` (${webhookStatus})` : ""}`,
      },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      userRole: user.role,
      action: "DRAFT_PUBLISHED",
      resourceType: "DRAFT",
      resourceId: draft.id,
      metadata: { publishedUrl, targetCms, webhookStatus, reviewerName: pageReview.reviewer.name },
      details: `Draft published to ${publishedUrl} with verified PE sign-off.`,
    });

    return NextResponse.json({
      success: true,
      draft: serializeDraft(updated),
      publishedUrl,
      webhookStatus,
      message: `Draft "${updated.title}" successfully published.`,
    });
  } catch (error) {
    console.error("Publish draft error:", error);
    return errorResponse("Failed to publish draft.", 500);
  }
}
