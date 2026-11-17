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
        organization: { id: user.organization.id, name: user.organization.name, plan: user.organization.plan },
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ user: null });
  }
}
