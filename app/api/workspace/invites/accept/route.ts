import { NextResponse } from "next/server";
import { InvitationStatus } from "@prisma/client";
import { createSession, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { token, name, password } = body as Record<string, unknown>;
    if (typeof token !== "string" || !token.trim()) {
      return errorResponse("Invitation token is required.", 400);
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return errorResponse("Password must be between 8 and 128 characters.", 400);
    }

    const tokenHash = hashToken(token.trim());
    const invitation = await db.invitation.findUnique({
      where: { tokenHash },
      include: { organization: true },
    });

    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      return errorResponse("This invitation is invalid or has already been used.", 400);
    }

    if (invitation.expiresAt < new Date()) {
      await db.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      return errorResponse("This invitation has expired. Please ask the administrator to invite you again.", 410);
    }

    const passwordHash = await hashPassword(password);
    const displayName = typeof name === "string" && name.trim().length > 0 ? name.trim() : null;

    // Check if a user with this email already exists in system
    let user = await db.user.findUnique({
      where: { email: invitation.email },
    });

    if (user) {
      // User exists: update organization and role
      user = await db.user.update({
        where: { id: user.id },
        data: {
          organizationId: invitation.organizationId,
          role: invitation.role,
          name: displayName || user.name,
          emailVerified: new Date(),
          passwordHash,
        },
        include: { organization: true },
      });
    } else {
      // Create new team user
      user = await db.user.create({
        data: {
          email: invitation.email,
          name: displayName,
          passwordHash,
          role: invitation.role,
          organizationId: invitation.organizationId,
          emailVerified: new Date(),
        },
        include: { organization: true },
      });
    }

    // Mark invitation accepted
    await db.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED },
    });

    // Create session and log in
    await createSession(user.id);

    // Audit log
    await db.auditLog.create({
      data: {
        organizationId: invitation.organizationId,
        userId: user.id,
        action: "INVITATION_ACCEPTED",
        resourceType: "User",
        resourceId: user.id,
        metadataJson: JSON.stringify({ email: user.email, role: invitation.role }),
      },
    });

    const org = await db.organization.findUnique({
      where: { id: invitation.organizationId },
    });

    return NextResponse.json({
      success: true,
      message: `You have successfully joined ${org?.name ?? "the organization"}.`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: {
          id: org?.id ?? user.organizationId,
          name: org?.name ?? "Enterprise Tenant",
          plan: org?.plan ?? "enterprise",
        },
      },
    });
  } catch (error) {
    console.error("Accept invite error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to accept invitation. Please try again.",
      500,
    );
  }
}
