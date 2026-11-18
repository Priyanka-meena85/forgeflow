import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { generateSecureToken } from "@/lib/tokens";
import { errorResponse } from "@/lib/http";

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to resend verification email.", 401);

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Your email address is already verified.",
        alreadyVerified: true,
      });
    }

    // Invalidate existing verification tokens for this user
    await db.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new secure token (24h expiry)
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

    const emailResult = await sendVerificationEmail({
      to: user.email,
      token,
      name: user.name || user.organization?.name,
    });

    return NextResponse.json({
      success: true,
      message: `Verification link sent to ${user.email}. Please check your inbox.`,
      previewUrl: emailResult.previewUrl,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to resend verification email.",
      500,
    );
  }
}
