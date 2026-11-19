import { NextResponse } from "next/server";
import { getSessionUser, isOrgAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";
import { logAuditEvent } from "@/lib/audit";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to manage reviewers.", 401);
    if (!isOrgAdmin(user.role)) {
      return errorResponse("Access denied. Only organization administrators can modify reviewers.", 403);
    }

    const { id } = await params;
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid reviewer payload.", 400);

    const {
      name,
      jobTitle,
      credentials,
      yearsOfExperience,
      linkedInUrl,
      photoUrl,
      bio,
    } = body as Record<string, unknown>;

    const existing = await db.expertReviewer.findUnique({ where: { id } });
    if (!existing || (existing.organizationId !== user.organizationId && existing.organizationId !== "global")) {
      return errorResponse("Reviewer not found.", 404);
    }

    const updated = await db.expertReviewer.update({
      where: { id },
      data: {
        ...(typeof name === "string" ? { name: name.trim() } : {}),
        ...(typeof jobTitle === "string" ? { jobTitle: jobTitle.trim() } : {}),
        ...(typeof credentials === "string" ? { credentials: credentials.trim() } : {}),
        ...(typeof yearsOfExperience === "number" ? { yearsOfExperience } : {}),
        ...(typeof linkedInUrl === "string" ? { linkedInUrl: linkedInUrl.trim() } : {}),
        ...(typeof photoUrl === "string" ? { photoUrl: photoUrl.trim() } : {}),
        ...(typeof bio === "string" ? { bio: bio.trim() } : {}),
      },
    });

    return NextResponse.json({ reviewer: updated, success: true });
  } catch (error) {
    console.error("Update reviewer error:", error);
    return errorResponse("Failed to update reviewer.", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to manage reviewers.", 401);
    if (!isOrgAdmin(user.role)) {
      return errorResponse("Access denied. Only organization administrators can delete reviewers.", 403);
    }

    const { id } = await params;
    const existing = await db.expertReviewer.findUnique({ where: { id } });
    if (!existing || existing.organizationId !== user.organizationId) {
      if (existing?.organizationId === "global") {
        return errorResponse("Default system certified reviewers cannot be deleted.", 403);
      }
      return errorResponse("Reviewer not found.", 404);
    }
    const deleted = await db.expertReviewer.delete({ where: { id } });
    if (!deleted) return errorResponse("Reviewer not found.", 404);

    return NextResponse.json({ success: true, message: "Reviewer deleted." });
  } catch (error) {
    console.error("Delete reviewer error:", error);
    return errorResponse("Failed to delete reviewer.", 500);
  }
}
