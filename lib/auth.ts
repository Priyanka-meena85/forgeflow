import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const scrypt = promisify(nodeScrypt);
const sessionCookie = "forgeflow_session";
const sessionDurationMs = 30 * 24 * 60 * 60 * 1000;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, keyHex] = stored.split(":");
  if (!salt || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function tokenDigest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionDurationMs);

  await db.session.create({
    data: { tokenHash: tokenDigest(token), userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: tokenDigest(token) },
    include: { user: { include: { organization: true } } },
  });

  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await db.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

export async function getSession() {
  const user = await getSessionUser();
  if (!user) return null;
  return { user };
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: tokenDigest(token) } });
  }
  cookieStore.delete(sessionCookie);
}

// -----------------------------------------------------------------------------
// Industrial Role-Based Access Control (RBAC) System
// -----------------------------------------------------------------------------

export function isOrgAdmin(role?: string | null): boolean {
  if (!role) return false;
  return role === "OWNER" || role === "ADMIN";
}

export function isEngineerReviewer(role?: string | null): boolean {
  if (!role) return false;
  return role === "REVIEWER" || role === "OWNER" || role === "ADMIN";
}

export function isAuthor(role?: string | null): boolean {
  if (!role) return false;
  return role === "AUTHOR" || role === "MEMBER" || role === "REVIEWER" || role === "OWNER" || role === "ADMIN";
}

export function canApproveSpec(user?: { role: string } | null): boolean {
  return isEngineerReviewer(user?.role);
}

export function canPublishDraft(user?: { role: string } | null): boolean {
  return isOrgAdmin(user?.role);
}

export function canManageBilling(user?: { role: string } | null): boolean {
  return isOrgAdmin(user?.role);
}

export function canManageTeam(user?: { role: string } | null): boolean {
  return isOrgAdmin(user?.role);
}
