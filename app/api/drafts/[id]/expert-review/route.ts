import { NextResponse } from "next/server";
import { DraftStatus, ReviewStatus } from "@prisma/client";
import { getSessionUser, canApproveSpec } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";
import { injectExpertReviewSchema, DEFAULT_VERIFICATION_CHECKLIST } from "@/lib/expertReview";
import { serializeDraft } from "@/lib/drafts";
import { logAuditEvent } from "@/lib/audit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to submit expert reviews.", 401);

    if (!canApproveSpec(user)) {
      return errorResponse(
        "Access denied. Only certified application engineers (REVIEWER) or organization administrators can submit review decisions.",
        403,
      );
    }

    const { id } = await params;
    const draft = await db.draft.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!draft) return errorResponse("Draft not found.", 404);

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid review payload.", 400);

    const {
      decision, // "approve" | "changes_requested"
      reviewerId,
      reviewerNotes,
      verificationItems,
    } = body as Record<string, unknown>;

    if (decision !== "approve" && decision !== "changes_requested") {
      return errorResponse('Decision must be either "approve" or "changes_requested".', 400);
    }

    // Resolve reviewer
    let activeReviewer = null;
    if (typeof reviewerId === "string" && reviewerId.trim()) {
      const candidate = await db.expertReviewer.findUnique({ where: { id: reviewerId.trim() } });
      if (candidate && (candidate.organizationId === user.organizationId || candidate.organizationId === "global")) {
        activeReviewer = candidate;
      }
    }
    if (!activeReviewer) {
      // Check if page already has an assigned reviewer
      const existingReview = await db.pageReview.findUnique({
        where: { draftId: draft.id },
        include: { reviewer: true },
      });
      if (existingReview?.reviewer) {
        activeReviewer = existingReview.reviewer;
      } else {
        // Fallback to first available reviewer
        const reviewers = await db.expertReviewer.findMany({
          where: {
            OR: [
              { organizationId: user.organizationId },
              { organizationId: "global" },
            ],
          },
        });
        activeReviewer = reviewers[0] || null;
      }
    }

    if (!activeReviewer) {
      return errorResponse("No qualified expert reviewer found. Please create or assign a reviewer first.", 400);
    }

    const reviewStatus = decision === "approve" ? ReviewStatus.APPROVED : ReviewStatus.CHANGES_REQUESTED;
    const reviewDate = new Date();
    const notes = typeof reviewerNotes === "string" && reviewerNotes.trim()
      ? reviewerNotes.trim()
      : decision === "approve"
        ? `Approved by ${activeReviewer.name} (${activeReviewer.credentials}). All operating envelopes and regulatory standards verified.`
        : "Revisions requested: Please tighten engineering tolerances and update referenced standards.";

    const itemsToSave = Array.isArray(verificationItems) && verificationItems.length > 0
      ? verificationItems.map((item) => String(item))
      : DEFAULT_VERIFICATION_CHECKLIST;

    // Update or create the PageReview
    const updatedReview = await db.pageReview.upsert({
      where: { draftId: draft.id },
      create: {
        draftId: draft.id,
        reviewerId: activeReviewer.id,
        status: reviewStatus,
        reviewDate,
        reviewerNotes: notes,
        verificationItemsJson: JSON.stringify(itemsToSave),
      },
      update: {
        reviewerId: activeReviewer.id,
        status: reviewStatus,
        reviewDate,
        reviewerNotes: notes,
        verificationItemsJson: JSON.stringify(itemsToSave),
      },
      include: { reviewer: true },
    });

    // If approved, update draft status and inject reviewedBy schema into draft.schemaJson
    let updatedSchemaJson = draft.schemaJson;
    let nextDraftStatus = draft.status;

    if (decision === "approve") {
      nextDraftStatus = DraftStatus.APPROVED;
      const enrichedSchema = injectExpertReviewSchema(
        draft.schemaJson || "{}",
        {
          id: activeReviewer.id,
          name: activeReviewer.name,
          jobTitle: activeReviewer.jobTitle,
          credentials: activeReviewer.credentials,
          yearsOfExperience: activeReviewer.yearsOfExperience,
          linkedInUrl: activeReviewer.linkedInUrl,
          photoUrl: activeReviewer.photoUrl,
          bio: activeReviewer.bio,
        },
        reviewDate,
      );
      updatedSchemaJson = JSON.stringify(enrichedSchema, null, 2);
    } else {
      nextDraftStatus = DraftStatus.CHANGES_REQUESTED;
    }

    const updatedDraft = await db.draft.update({
      where: { id: draft.id },
      data: {
        status: nextDraftStatus,
        reviewComment: notes,
        schemaJson: updatedSchemaJson,
      },
    });

    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: decision === "approve" ? "EXPERT_REVIEW_APPROVED" : "EXPERT_REVIEW_CHANGES_REQUESTED",
        resourceType: "Draft",
        resourceId: draft.id,
        metadataJson: JSON.stringify({
          reviewerId: activeReviewer.id,
          reviewerName: activeReviewer.name,
          decision,
          reviewDate: reviewDate.toISOString(),
        }),
      },
    });

    const serializedReview = {
      id: updatedReview.id,
      reviewerId: activeReviewer.id,
      status: updatedReview.status,
      reviewDate: updatedReview.reviewDate.toISOString(),
      reviewerNotes: updatedReview.reviewerNotes,
      verificationItems: itemsToSave,
      reviewer: {
        id: activeReviewer.id,
        name: activeReviewer.name,
        jobTitle: activeReviewer.jobTitle,
        credentials: activeReviewer.credentials,
        yearsOfExperience: activeReviewer.yearsOfExperience,
        linkedInUrl: activeReviewer.linkedInUrl,
        photoUrl: activeReviewer.photoUrl,
        bio: activeReviewer.bio,
      },
    };

    // Immutably record audit log for compliance
    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      userRole: user.role,
      action: decision === "approve" ? "SPEC_APPROVED" : "SPEC_CHANGES_REQUESTED",
      resourceType: "DRAFT",
      resourceId: draft.id,
      metadata: {
        reviewerId: activeReviewer.id,
        reviewerName: activeReviewer.name,
        reviewerCredentials: activeReviewer.credentials,
        decision,
        notes: reviewerNotes ?? "",
        verifiedChecklistCount: itemsToSave.length,
      },
      details: decision === "approve" 
        ? `Application Engineer ${activeReviewer.name} approved tolerances and standards.`
        : `Changes requested by ${activeReviewer.name}: ${reviewerNotes || "Spec revisions needed"}.`,
    });

    return NextResponse.json({
      success: true,
      draft: serializeDraft(updatedDraft, serializedReview),
      review: serializedReview,
      message: decision === "approve"
        ? `Page successfully approved and signed off by ${activeReviewer.name}. Schema updated.`
        : `Changes requested and logged for ${activeReviewer.name}.`,
    });
  } catch (error) {
    console.error("Expert review submit error:", error);
    return errorResponse("Failed to record expert review.", 500);
  }
}
