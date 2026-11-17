import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);
  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string") {
    return errorResponse("Email and password are required.", 400);
  }

  const user = await db.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { organization: true },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return errorResponse("Email or password is incorrect.", 401);
  }

  await createSession(user.id);
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      organization: { id: user.organization.id, name: user.organization.name, plan: user.organization.plan },
    },
  });
}
