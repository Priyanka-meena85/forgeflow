import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { token } = body as Record<string, unknown>;
    if (typeof token !== "string" || !token.trim()) {
      return errorResponse("Verification token is required.", 400);
    }

    const tokenHash = hashToken(token.trim());
    const verificationRecord = await db.verificationToken.findUnique({
      where: { tokenHash },
    });

    if (!verificationRecord) {
      return errorResponse("This verification link is invalid or has already been used.", 400);
    }

    if (verificationRecord.expiresAt < new Date()) {
      await db.verificationToken.delete({ where: { id: verificationRecord.id } });
      return errorResponse("This verification link has expired. Please request a new one.", 410);
    }

    // Mark email verified
    const updatedUser = await db.user.update({
      where: { id: verificationRecord.userId },
      data: { emailVerified: new Date() },
      include: { organization: true },
    });

    // Clean up used token
    await db.verificationToken.delete({ where: { id: verificationRecord.id } });

    // Record audit log
    await db.auditLog.create({
      data: {
        organizationId: updatedUser.organizationId,
        userId: updatedUser.id,
        action: "EMAIL_VERIFIED",
        resourceType: "User",
        resourceId: updatedUser.id,
        metadataJson: JSON.stringify({ email: updatedUser.email }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Work email successfully verified.",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified ? updatedUser.emailVerified.toISOString() : null,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to verify email. Please try again.",
      500,
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?status=missing", request.url));
  }

  const tokenHash = hashToken(token.trim());
  const verificationRecord = await db.verificationToken.findUnique({
    where: { tokenHash },
  });

  if (!verificationRecord) {
    return NextResponse.redirect(new URL("/verify-email?status=invalid", request.url));
  }

  if (verificationRecord.expiresAt < new Date()) {
    await db.verificationToken.delete({ where: { id: verificationRecord.id } });
    return NextResponse.redirect(new URL("/verify-email?status=expired", request.url));
  }

  // Mark email verified
  await db.user.update({
    where: { id: verificationRecord.userId },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({ where: { id: verificationRecord.id } });

  return NextResponse.redirect(new URL("/verify-email?status=success", request.url));
}
