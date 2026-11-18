import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { token, newPassword } = body as Record<string, unknown>;
    if (typeof token !== "string" || !token.trim()) {
      return errorResponse("Reset token is required.", 400);
    }
    if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 128) {
      return errorResponse("New password must be between 8 and 128 characters.", 400);
    }

    const tokenHash = hashToken(token.trim());
    const resetRecord = await db.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetRecord) {
      return errorResponse("This password reset link is invalid or has already been used.", 400);
    }

    if (resetRecord.expiresAt < new Date()) {
      await db.passwordResetToken.delete({ where: { id: resetRecord.id } });
      return errorResponse("This password reset link has expired. Please request a new one.", 410);
    }

    const passwordHash = await hashPassword(newPassword);

    // Update password
    const user = await db.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
      include: { organization: true },
    });

    // Invalidate all existing sessions for this user (security standard)
    await db.session.deleteMany({
      where: { userId: user.id },
    });

    // Delete used reset token
    await db.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: "PASSWORD_RESET_SUCCESS",
        resourceType: "User",
        resourceId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated. You may now sign in with your new credentials.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to reset password. Please try again.",
      500,
    );
  }
}
