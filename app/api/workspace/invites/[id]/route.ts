import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to manage invitations.", 401);

    if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
      return errorResponse("Only workspace owners and administrators can revoke invitations.", 403);
    }

    const { id } = await params;
    const invitation = await db.invitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.organizationId !== user.organizationId) {
      return errorResponse("Invitation not found.", 404);
    }

    await db.invitation.delete({ where: { id: invitation.id } });

    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: "INVITATION_REVOKED",
        resourceType: "Invitation",
        resourceId: invitation.id,
        metadataJson: JSON.stringify({ email: invitation.email }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Invitation has been revoked.",
    });
  } catch (error) {
    console.error("Revoke invite error:", error);
    return errorResponse("Failed to revoke invitation.", 500);
  }
}
