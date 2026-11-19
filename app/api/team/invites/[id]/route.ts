import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { revokeTeamInvitation } from "@/lib/team";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== UserRole.OWNER && session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Only Owners and Admins can revoke invitations." }, { status: 403 });
    }

    const { id } = await params;
    const orgId = session.user.organizationId || "seed-org-industrial";

    await revokeTeamInvitation({
      invitationId: id,
      organizationId: orgId,
      revokedByUserId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Invitation revoked successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to revoke invitation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
