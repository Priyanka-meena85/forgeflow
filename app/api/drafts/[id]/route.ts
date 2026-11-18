import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { serializeDraft } from "@/lib/drafts";
import { errorResponse } from "@/lib/http";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to view draft.", 401);

    const { id } = await params;
    const draft = await db.draft.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!draft) return errorResponse("Draft not found.", 404);

    const revisions = await db.contentRevision.findMany({
      where: { draftId: draft.id },
    });

    return NextResponse.json({
      draft: serializeDraft(draft),
      revisions: revisions.map((r) => ({
        id: r.id,
        revisionNumber: r.revisionNumber,
        title: r.title,
        changeSummary: r.changeSummary,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Fetch draft error:", error);
    return errorResponse("Failed to load draft.", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to update draft.", 401);

    const { id } = await params;
    const existing = await db.draft.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!existing) return errorResponse("Draft not found.", 404);

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { title, summary, sections, faqs, schema, reviewComment, changeSummary } = body as Record<string, unknown>;

    const updatedSections = sections !== undefined ? JSON.stringify(sections) : existing.sectionsJson;
    const updatedFaqs = faqs !== undefined ? JSON.stringify(faqs) : existing.faqsJson;
    const updatedSchema = schema !== undefined ? JSON.stringify(schema) : existing.schemaJson;
    const updatedTitle = typeof title === "string" ? title.trim().slice(0, 240) : existing.title;
    const updatedSummary = typeof summary === "string" ? summary.trim().slice(0, 3000) : existing.summary;

    const updated = await db.draft.update({
      where: { id: existing.id },
      data: {
        title: updatedTitle,
        summary: updatedSummary,
        sectionsJson: updatedSections,
        faqsJson: updatedFaqs,
        schemaJson: updatedSchema,
        reviewComment: typeof reviewComment === "string" ? reviewComment.trim() : existing.reviewComment,
      },
    });

    // Fetch highest revision number
    const prevRevisions = await db.contentRevision.findMany({
      where: { draftId: existing.id },
    });
    const nextRevNum = (prevRevisions[0]?.revisionNumber ?? 0) + 1;

    // Create persistent ContentRevision
    await db.contentRevision.create({
      data: {
        draftId: existing.id,
        revisionNumber: nextRevNum,
        title: updated.title,
        sectionsJson: updated.sectionsJson,
        faqsJson: updated.faqsJson,
        schemaJson: updated.schemaJson,
        qaScoresJson: updated.qaScoresJson,
        changeSummary: typeof changeSummary === "string" ? changeSummary : "Manual edit",
        changedById: user.id,
      },
    });

    return NextResponse.json({ draft: serializeDraft(updated) });
  } catch (error) {
    console.error("Update draft error:", error);
    return errorResponse("Failed to update draft.", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to delete draft.", 401);

    const { id } = await params;
    const draft = await db.draft.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!draft) return errorResponse("Draft not found.", 404);

    await db.draft.delete({ where: { id: draft.id } });

    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: "DRAFT_DELETED",
        resourceType: "Draft",
        resourceId: draft.id,
        metadataJson: JSON.stringify({ title: draft.title }),
      },
    });

    return NextResponse.json({ success: true, message: "Draft deleted." });
  } catch (error) {
    console.error("Delete draft error:", error);
    return errorResponse("Failed to delete draft.", 500);
  }
}
