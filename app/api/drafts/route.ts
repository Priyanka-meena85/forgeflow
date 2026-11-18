import { NextResponse } from "next/server";
import { DraftStatus } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { serializeDraft } from "@/lib/drafts";
import { errorResponse } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to access your drafts.", 401);

    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");

    let statusFilter: DraftStatus | undefined = undefined;
    if (statusParam && statusParam !== "all") {
      const normalized = statusParam.toUpperCase();
      if (normalized in DraftStatus) {
        statusFilter = normalized as DraftStatus;
      }
    }

    const drafts = await db.draft.findMany({
      where: {
        organizationId: user.organizationId,
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ drafts: drafts.map(serializeDraft) });
  } catch (error) {
    console.error("Fetch drafts error:", error);
    return errorResponse("Failed to load drafts from database.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to manage drafts.", 401);

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    // Support review action update via POST /api/drafts
    const { action, draftId, comment } = body as Record<string, unknown>;
    if (typeof action === "string" && typeof draftId === "string") {
      const allowedActions: Record<string, DraftStatus> = {
        approve: DraftStatus.APPROVED,
        request_changes: DraftStatus.CHANGES_REQUESTED,
        reject: DraftStatus.ARCHIVED,
        publish: DraftStatus.PUBLISHED,
      };
      const nextStatus = allowedActions[action.toLowerCase()];
      if (!nextStatus) return errorResponse("Choose approve, request_changes, reject, or publish.", 400);

      const draft = await db.draft.findFirst({
        where: { id: draftId, organizationId: user.organizationId },
      });
      if (!draft) return errorResponse("Draft not found.", 404);

      const updated = await db.draft.update({
        where: { id: draft.id },
        data: {
          status: nextStatus,
          reviewComment: typeof comment === "string" ? comment.trim().slice(0, 2000) : draft.reviewComment,
          ...(nextStatus === DraftStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
        },
      });

      await db.auditLog.create({
        data: {
          organizationId: user.organizationId,
          userId: user.id,
          action: `DRAFT_STAGE_${action.toUpperCase()}`,
          resourceType: "Draft",
          resourceId: draft.id,
          metadataJson: JSON.stringify({ nextStatus, comment }),
        },
      });

      return NextResponse.json({ draft: serializeDraft(updated) });
    }

    const {
      title,
      keyword,
      vertical,
      targetEquipment,
      complianceStandard,
      summary,
      sections,
      faqs,
      schema,
      status,
      qaScores,
      specRiskScore,
      pipelineValueMin,
      pipelineValueMax,
      searchVolume,
    } = body as Record<string, unknown>;

    if (typeof title !== "string" || title.trim().length < 3) {
      return errorResponse("A descriptive draft title is required.", 400);
    }
    if (typeof keyword !== "string" || !keyword.trim()) {
      return errorResponse("Target keyword is required.", 400);
    }

    const sectionsJson = JSON.stringify(Array.isArray(sections) ? sections : []);
    const faqsJson = JSON.stringify(Array.isArray(faqs) ? faqs : []);
    const schemaJson = JSON.stringify(schema && typeof schema === "object" ? schema : {});
    const qaScoresJson = qaScores && typeof qaScores === "object" ? JSON.stringify(qaScores) : null;

    const draftStatus =
      typeof status === "string" && status.toUpperCase() in DraftStatus
        ? (status.toUpperCase() as DraftStatus)
        : DraftStatus.IN_REVIEW;

    const newDraft = await db.draft.create({
      data: {
        organizationId: user.organizationId,
        authorId: user.id,
        title: title.trim().slice(0, 240),
        keyword: keyword.trim().slice(0, 240),
        vertical: typeof vertical === "string" ? vertical.trim().slice(0, 80) : null,
        targetEquipment: typeof targetEquipment === "string" ? targetEquipment.trim().slice(0, 120) : null,
        complianceStandard: typeof complianceStandard === "string" ? complianceStandard.trim().slice(0, 120) : null,
        summary: typeof summary === "string" ? summary.trim().slice(0, 3000) : "",
        sectionsJson,
        faqsJson,
        schemaJson,
        status: draftStatus,
        qaScoresJson,
        specRiskScore: typeof specRiskScore === "number" ? specRiskScore : null,
        pipelineValueMin: typeof pipelineValueMin === "number" ? pipelineValueMin : null,
        pipelineValueMax: typeof pipelineValueMax === "number" ? pipelineValueMax : null,
        searchVolume: typeof searchVolume === "string" ? searchVolume.trim() : null,
      },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: "DRAFT_CREATED",
        resourceType: "Draft",
        resourceId: newDraft.id,
        metadataJson: JSON.stringify({ title: newDraft.title }),
      },
    });

    return NextResponse.json({ draft: serializeDraft(newDraft) }, { status: 201 });
  } catch (error) {
    console.error("Create draft error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create draft in database.",
      500,
    );
  }
}
