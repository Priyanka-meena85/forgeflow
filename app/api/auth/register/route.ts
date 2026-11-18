import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createSession, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { email, password, companyName } = body as Record<string, unknown>;
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128 ||
      typeof companyName !== "string" ||
      companyName.trim().length < 2 ||
      companyName.trim().length > 100
    ) {
      return errorResponse("Enter a valid email, company name, and password (8–128 characters).", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    const user = await db.$transaction(async (transaction) => {
      const organization = await transaction.organization.create({
        data: { name: companyName.trim() },
      });
      return transaction.user.create({
        data: { email: normalizedEmail, passwordHash, organizationId: organization.id },
        include: { organization: true },
      });
    });

    await createSession(user.id);
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        organization: { id: user.organization.id, name: user.organization.name, plan: user.organization.plan },
      },
    });
  } catch (error) {
    if (
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") ||
      (Boolean(error) && typeof error === "object" && (error as { code?: string }).code === "P2002")
    ) {
      return errorResponse("An account with this email already exists. Please sign in instead.", 409);
    }
    console.error("Register error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create workspace. Please try again.",
      500,
    );
  }
}
