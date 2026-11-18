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
    if (!user) return errorResponse("Sign in to review drafts.", 401);

    const { id } = await params;
    const draft = await db.draft.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!draft) return errorResponse("Draft not found.", 404);

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { action, comment } = body as Record<string, unknown>;

    const statusMap: Record<string, DraftStatus> = {
      approve: DraftStatus.APPROVED,
      request_changes: DraftStatus.CHANGES_REQUESTED,
      reject: DraftStatus.ARCHIVED,
      publish: DraftStatus.PUBLISHED,
    };

    if (typeof action !== "string" || !statusMap[action.toLowerCase()]) {
      return errorResponse("Invalid review action. Choose approve, request_changes, or reject.", 400);
    }

    const nextStatus = statusMap[action.toLowerCase()];
    const reviewComment = typeof comment === "string" ? comment.trim().slice(0, 2000) : draft.reviewComment;

    const updated = await db.draft.update({
      where: { id: draft.id },
      data: {
        status: nextStatus,
        reviewComment,
        ...(nextStatus === DraftStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
      },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: `DRAFT_REVIEW_${action.toUpperCase()}`,
        resourceType: "Draft",
        resourceId: draft.id,
        metadataJson: JSON.stringify({ nextStatus, comment: reviewComment }),
      },
    });

    return NextResponse.json({ draft: serializeDraft(updated) });
  } catch (error) {
    console.error("Review draft error:", error);
    return errorResponse("Failed to update review status.", 500);
  }
}
