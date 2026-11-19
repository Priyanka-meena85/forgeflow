import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getOrganizationTeam, inviteTeamMember } from "@/lib/team";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const team = await getOrganizationTeam(orgId, session.user.id);

    return NextResponse.json({
      success: true,
      members: team.members,
      invitations: team.invitations,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch team members";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER and ADMIN can invite
    const currentRole = session.user.role;
    if (currentRole !== UserRole.OWNER && currentRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Only Organization Owners and Admins can invite team members." }, { status: 403 });
    }

    const body = await req.json();
    const { email, role } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required." }, { status: 400 });
    }

    const validRoles = [UserRole.REVIEWER, UserRole.AUTHOR, UserRole.ADMIN];
    const targetRole = validRoles.includes(role) ? role : UserRole.REVIEWER;

    const orgId = session.user.organizationId || "seed-org-industrial";
    const orgName = (session.user as { organizationName?: string; organization?: { name?: string } }).organizationName ||
      (session.user as { organizationName?: string; organization?: { name?: string } }).organization?.name ||
      "Industrial Reliability Systems";

    const result = await inviteTeamMember({
      organizationId: orgId,
      organizationName: orgName,
      invitedByUserId: session.user.id,
      invitedByUserName: session.user.name || session.user.email,
      email,
      role: targetRole,
    });

    return NextResponse.json({
      success: true,
      message: `Invitation successfully dispatched to ${email}`,
      invitationId: result.invitationId,
      emailSent: result.emailSent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to invite team member";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
