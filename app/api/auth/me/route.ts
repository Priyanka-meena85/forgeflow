import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
        organization: {
          id: user.organization?.id ?? user.organizationId,
          name: user.organization?.name ?? "Enterprise Tenant",
          plan: user.organization?.plan ?? "free",
          industry: user.organization?.industry ?? null,
          website: user.organization?.website ?? null,
        },
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ user: null });
  }
}
