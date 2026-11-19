import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@prisma/client";
import { createSession, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { generateSecureToken } from "@/lib/tokens";
import { errorResponse } from "@/lib/http";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rateLimit";

type RegisterTx = {
  organization: {
    create: (args: { data: { name: string } }) => Promise<{ id: string; name: string; plan?: string }>;
  };
  user: {
    create: (args: {
      data: {
        email: string;
        passwordHash: string;
        organizationId: string;
        role: UserRole;
      };
      include?: { organization: boolean };
    }) => Promise<{
      id: string;
      email: string;
      role: UserRole;
      emailVerified: Date | null;
      organizationId: string;
      organization?: { id: string; name: string; plan: string } | null;
    }>;
  };
};

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = await checkRateLimit(`register:${ip}`, 5, 60);
    if (!rateCheck.success) {
      return errorResponse("Too many registration requests. Please wait a minute before trying again.", 429);
    }

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

    const user = await (db as unknown as { $transaction: <T>(fn: (tx: RegisterTx) => Promise<T>) => Promise<T> }).$transaction(async (tx: RegisterTx) => {
      const organization = await tx.organization.create({
        data: { name: companyName.trim() },
      });
      return tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          organizationId: organization.id,
          role: UserRole.OWNER,
        },
        include: { organization: true },
      });
    });

    // Create Email Verification Token (24 hours expiry)
    const { token, tokenHash } = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.verificationToken.create({
      data: {
        tokenHash,
        userId: user.id,
        email: user.email,
        expiresAt,
      },
    });

    // Send transactional verification email (logs link to terminal in dev mode)
    const emailResult = await sendVerificationEmail({
      to: user.email,
      token,
      name: companyName,
    });

    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        organization: {
          id: user.organization?.id ?? user.organizationId,
          name: user.organization?.name ?? companyName.trim(),
          plan: user.organization?.plan ?? "free",
        },
      },
      verification: {
        sent: emailResult.success,
        previewUrl: emailResult.previewUrl,
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
