import { NextResponse } from "next/server";
import { getSessionUser, isOrgAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to access reviewers.", 401);

    const reviewers = await db.expertReviewer.findMany({
      where: {
        OR: [
          { organizationId: user.organizationId },
          { organizationId: "global" },
        ],
      },
    });

    return NextResponse.json({ reviewers });
  } catch (error) {
    console.error("List reviewers error:", error);
    return errorResponse("Failed to fetch reviewers.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to manage reviewers.", 401);
    if (!isOrgAdmin(user.role)) {
      return errorResponse("Access denied. Only organization administrators can add certified reviewers.", 403);
    }

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

    if (typeof name !== "string" || !name.trim()) {
      return errorResponse("Reviewer name is required.", 400);
    }
    if (typeof jobTitle !== "string" || !jobTitle.trim()) {
      return errorResponse("Job title is required (e.g. Lead Thermal Engineer).", 400);
    }
    if (typeof credentials !== "string" || !credentials.trim()) {
      return errorResponse("Engineering credentials or certifications required (e.g. PE, ASHRAE, CMRP).", 400);
    }

    const reviewer = await db.expertReviewer.create({
      data: {
        organizationId: user.organizationId,
        name: name.trim(),
        jobTitle: jobTitle.trim(),
        credentials: credentials.trim(),
        yearsOfExperience: typeof yearsOfExperience === "number" ? yearsOfExperience : 5,
        linkedInUrl: typeof linkedInUrl === "string" ? linkedInUrl.trim() : null,
        photoUrl: typeof photoUrl === "string" ? photoUrl.trim() : null,
        bio: typeof bio === "string" ? bio.trim() : null,
      },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      userRole: user.role,
      action: "REVIEWER_CREATED",
      resourceType: "REVIEWER",
      resourceId: reviewer.id,
      metadata: { name: reviewer.name, jobTitle: reviewer.jobTitle, credentials: reviewer.credentials },
      details: `Added new certified application reviewer: ${reviewer.name} (${reviewer.credentials}).`,
    });

    return NextResponse.json({ reviewer, success: true }, { status: 201 });
  } catch (error) {
    console.error("Create reviewer error:", error);
    return errorResponse("Failed to create reviewer.", 500);
  }
}
