import { NextResponse } from "next/server";
import { DraftStatus } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { serializeDraft } from "@/lib/drafts";
import { errorResponse } from "@/lib/http";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to publish drafts.", 401);

    const { id } = await params;
    const draft = await db.draft.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!draft) return errorResponse("Draft not found.", 404);

    const body: unknown = await request.json().catch(() => null);
    const { targetCms, targetUrl } = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const slug = draft.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const publishedUrl = typeof targetUrl === "string" ? targetUrl : `${appUrl}/articles/${slug}`;

    const updated = await db.draft.update({
      where: { id: draft.id },
      data: {
        status: DraftStatus.PUBLISHED,
        publishedAt: new Date(),
        publishedUrl,
        reviewComment: `Published via ${typeof targetCms === "string" ? targetCms : "Direct Webhook"} to ${publishedUrl}`,
      },
    });

    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: "DRAFT_PUBLISHED",
        resourceType: "Draft",
        resourceId: draft.id,
        metadataJson: JSON.stringify({ publishedUrl, targetCms }),
      },
    });

    return NextResponse.json({
      success: true,
      draft: serializeDraft(updated),
      publishedUrl,
      message: `Draft "${updated.title}" successfully published.`,
    });
  } catch (error) {
    console.error("Publish draft error:", error);
    return errorResponse("Failed to publish draft.", 500);
  }
}
