import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateSecureToken } from "@/lib/tokens";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { email } = body as Record<string, unknown>;
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse("Please enter a valid email address.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: { organization: true },
    });

    // Security best practice: Always return generic message to avoid email enumeration
    const genericSuccess = {
      success: true,
      message: "If an account with that email exists, password reset instructions have been sent.",
    };

    if (!user) {
      return NextResponse.json(genericSuccess);
    }

    // Invalidate existing password reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create 1-hour secure password reset token
    const { token, tokenHash } = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      token,
      name: user.name || user.organization?.name,
    });

    return NextResponse.json({
      ...genericSuccess,
      previewUrl: emailResult.previewUrl,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to process password reset request.",
      500,
    );
  }
}
