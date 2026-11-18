import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendInvitationEmail } from "@/lib/email";
import { generateSecureToken } from "@/lib/tokens";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to invite members.", 401);

    // Only OWNER or ADMIN can invite
    if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
      return errorResponse("Only workspace owners and administrators can invite team members.", 403);
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { email, role } = body as Record<string, unknown>;
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse("Please provide a valid work email address.", 400);
    }

    const validRoles: Record<string, UserRole> = {
      ADMIN: UserRole.ADMIN,
      REVIEWER: UserRole.REVIEWER,
      MEMBER: UserRole.MEMBER,
    };
    const targetRole = typeof role === "string" && validRoles[role.toUpperCase()] ? validRoles[role.toUpperCase()] : UserRole.MEMBER;

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user is already an active member of this organization
    const existingMember = await db.user.findFirst({
      where: { email: normalizedEmail, organizationId: user.organizationId },
    });
    if (existingMember) {
      return errorResponse("A team member with this email address already belongs to this workspace.", 409);
    }

    // Revoke any previous pending invitations for this email in this org
    const existingInvites = await db.invitation.findMany({
      where: { email: normalizedEmail, organizationId: user.organizationId },
    });
    for (const inv of existingInvites) {
      await db.invitation.delete({ where: { id: inv.id } });
    }

    // Create 7-day invitation token
    const { token, tokenHash } = generateSecureToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await db.invitation.create({
      data: {
        tokenHash,
        email: normalizedEmail,
        role: targetRole,
        organizationId: user.organizationId,
        invitedById: user.id,
        expiresAt,
      },
    });

    const emailResult = await sendInvitationEmail({
      to: normalizedEmail,
      token,
      organizationName: user.organization.name,
      inviterName: user.name || user.email,
      role: targetRole,
    });

    // Audit log
    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: "INVITATION_CREATED",
        resourceType: "Invitation",
        resourceId: invitation.id,
        metadataJson: JSON.stringify({ email: normalizedEmail, role: targetRole }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${normalizedEmail} as ${targetRole}.`,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt.toISOString(),
      },
      previewUrl: emailResult.previewUrl,
    });
  } catch (error) {
    console.error("Create invite error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to send invitation.",
      500,
    );
  }
}
