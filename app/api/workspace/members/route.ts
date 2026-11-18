import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to view workspace members.", 401);

    // Fetch members of user's organization
    const members = await db.user.findMany({
      where: { organizationId: user.organizationId },
    });

    // Fetch pending invitations
    const invitations = await db.invitation.findMany({
      where: { organizationId: user.organizationId },
    });

    return NextResponse.json({
      members: members.map((m) => ({
        id: m.id,
        email: m.email,
        name: m.name,
        role: m.role,
        emailVerified: m.emailVerified ? m.emailVerified.toISOString() : null,
        createdAt: m.createdAt.toISOString(),
        isCurrentUser: m.id === user.id,
      })),
      invitations: invitations.map((i) => ({
        id: i.id,
        email: i.email,
        role: i.role,
        status: i.status,
        expiresAt: i.expiresAt.toISOString(),
        createdAt: i.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Fetch members error:", error);
    return errorResponse("Failed to load workspace members.", 500);
  }
}
