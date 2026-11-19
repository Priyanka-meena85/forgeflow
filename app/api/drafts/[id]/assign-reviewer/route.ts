import { NextResponse } from "next/server";
import { ReviewStatus } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";
import { DEFAULT_VERIFICATION_CHECKLIST } from "@/lib/expertReview";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to assign reviewers.", 401);

    const { id } = await params;
    const draft = await db.draft.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!draft) return errorResponse("Draft not found.", 404);

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid payload.", 400);

    const { reviewerId } = body as Record<string, unknown>;
    if (typeof reviewerId !== "string" || !reviewerId.trim()) {
      return errorResponse("Reviewer ID is required.", 400);
    }

    const reviewer = await db.expertReviewer.findUnique({
      where: { id: reviewerId },
    });
    if (!reviewer) return errorResponse("Selected reviewer not found.", 404);

    const pageReview = await db.pageReview.upsert({
      where: { draftId: draft.id },
      create: {
        draftId: draft.id,
        reviewerId: reviewer.id,
        status: ReviewStatus.PENDING,
        reviewDate: new Date(),
        reviewerNotes: null,
        verificationItemsJson: JSON.stringify(DEFAULT_VERIFICATION_CHECKLIST),
      },
      update: {
        reviewerId: reviewer.id,
        status: ReviewStatus.PENDING,
        reviewDate: new Date(),
      },
      include: { reviewer: true },
    });

    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: "EXPERT_REVIEWER_ASSIGNED",
        resourceType: "Draft",
        resourceId: draft.id,
        metadataJson: JSON.stringify({ reviewerId: reviewer.id, reviewerName: reviewer.name }),
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: pageReview.id,
        draftId: pageReview.draftId,
        reviewerId: pageReview.reviewerId,
        status: pageReview.status,
        reviewDate: pageReview.reviewDate.toISOString(),
        reviewerNotes: pageReview.reviewerNotes,
        verificationItems: DEFAULT_VERIFICATION_CHECKLIST,
        reviewer: {
          id: reviewer.id,
          name: reviewer.name,
          jobTitle: reviewer.jobTitle,
          credentials: reviewer.credentials,
          yearsOfExperience: reviewer.yearsOfExperience,
          linkedInUrl: reviewer.linkedInUrl,
          photoUrl: reviewer.photoUrl,
          bio: reviewer.bio,
        },
      },
      message: `Assigned ${reviewer.name} to review "${draft.title}".`,
    });
  } catch (error) {
    console.error("Assign reviewer error:", error);
    return errorResponse("Failed to assign reviewer.", 500);
  }
}
