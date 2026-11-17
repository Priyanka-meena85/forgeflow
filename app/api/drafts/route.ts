import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { serializeDraft } from "@/lib/drafts";
import { errorResponse } from "@/lib/http";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return errorResponse("Sign in to access your drafts.", 401);

  const drafts = await db.draft.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ drafts: drafts.map(serializeDraft) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return errorResponse("Sign in to create drafts.", 401);

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);
  const { action, draftId, comment } = body as Record<string, unknown>;
  const allowedActions: Record<string, string> = {
    approve: "approved",
    request_changes: "changes_requested",
    reject: "rejected",
    publish: "published",
  };
  if (typeof action !== "string" || !allowedActions[action]) {
    return errorResponse("Choose approve, request_changes, reject, or publish.", 400);
  }
  if (typeof draftId !== "string" || (comment !== undefined && typeof comment !== "string")) {
    return errorResponse("A valid draft ID and optional comment are required.", 400);
  }
  if (typeof comment === "string" && comment.length > 2000) {
    return errorResponse("Comments must be 2,000 characters or fewer.", 400);
  }

  const draft = await db.draft.findFirst({
    where: { id: draftId, organizationId: user.organizationId },
  });
  if (!draft) return errorResponse("Draft not found.", 404);

  const updated = await db.draft.update({
    where: { id: draft.id },
    data: {
      status: allowedActions[action],
      reviewComment: typeof comment === "string" ? comment.trim() || null : draft.reviewComment,
    },
  });
  return NextResponse.json({ draft: serializeDraft(updated) });
}
