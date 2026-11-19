import { db } from "@/lib/db";
import { UserRole, InvitationStatus } from "@prisma/client";
import { randomBytes, createHash } from "node:crypto";
import { sendInvitationEmail } from "@/lib/email";
import { recordAuditLog } from "@/lib/audit";

export interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  isCurrentUser?: boolean;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  invitedByName?: string;
}

/**
 * Get all members and pending invitations for an organization
 */
export async function getOrganizationTeam(organizationId: string, currentUserId?: string): Promise<{
  members: TeamMember[];
  invitations: TeamInvitation[];
}> {
  const users = await db.user.findMany({
    where: { organizationId },
  });

  const members: TeamMember[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    isCurrentUser: currentUserId === u.id,
  }));

  const invites = await db.invitation.findMany({
    where: {
      organizationId,
      status: InvitationStatus.PENDING,
    },
  });

  const invitations: TeamInvitation[] = invites.map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role,
    status: inv.status,
    expiresAt: inv.expiresAt,
    createdAt: inv.createdAt,
  }));

  return { members, invitations };
}

/**
 * Invite a new member to the organization
 */
export async function inviteTeamMember(args: {
  organizationId: string;
  organizationName: string;
  invitedByUserId: string;
  invitedByUserName: string;
  email: string;
  role: UserRole;
}): Promise<{ invitationId: string; emailSent: boolean }> {
  const normalizedEmail = args.email.trim().toLowerCase();

  // 1. Check if user already exists in org
  const existingUser = await db.user.findFirst({
    where: { email: normalizedEmail, organizationId: args.organizationId },
  });
  if (existingUser) {
    throw new Error(`User with email '${normalizedEmail}' is already a member of this workspace.`);
  }

  // 2. Generate secure token
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // 3. Create invitation record
  const invitation = await db.invitation.create({
    data: {
      tokenHash,
      email: normalizedEmail,
      role: args.role,
      organizationId: args.organizationId,
      invitedById: args.invitedByUserId,
      expiresAt,
      status: InvitationStatus.PENDING,
    },
  });

  // 4. Send invitation email
  const emailResult = await sendInvitationEmail({
    to: normalizedEmail,
    token,
    organizationName: args.organizationName,
    inviterName: args.invitedByUserName,
    role: args.role,
  });

  // 5. Record Audit Trail
  await recordAuditLog({
    organizationId: args.organizationId,
    userId: args.invitedByUserId,
    userRole: "ADMIN",
    action: "INVITED_TEAM_MEMBER",
    resourceType: "ORGANIZATION",
    metadata: {
      invitedEmail: normalizedEmail,
      role: args.role,
      invitationId: invitation.id,
    },
  });

  return {
    invitationId: invitation.id,
    emailSent: emailResult.success,
  };
}

/**
 * Revoke a pending invitation
 */
export async function revokeTeamInvitation(args: {
  invitationId: string;
  organizationId: string;
  revokedByUserId: string;
}): Promise<void> {
  const invitation = await db.invitation.findUnique({
    where: { id: args.invitationId },
  });

  if (!invitation || invitation.organizationId !== args.organizationId) {
    throw new Error("Invitation not found or unauthorized.");
  }

  await db.invitation.update({
    where: { id: args.invitationId },
    data: { status: InvitationStatus.REVOKED },
  });

  await recordAuditLog({
    organizationId: args.organizationId,
    userId: args.revokedByUserId,
    userRole: "ADMIN",
    action: "REVOKED_INVITATION",
    resourceType: "ORGANIZATION",
    metadata: {
      invitationId: args.invitationId,
      email: invitation.email,
    },
  });
}
