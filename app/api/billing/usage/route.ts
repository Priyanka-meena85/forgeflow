import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { getBillingSummary } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to view usage details.", 401);

    const summary = await getBillingSummary(user.organizationId);
    if (!summary) return errorResponse("Organization billing profile not found.", 404);

    return NextResponse.json({
      success: true,
      billing: summary,
    });
  } catch (error) {
    console.error("Billing usage fetch error:", error);
    return errorResponse("Failed to fetch billing usage.", 500);
  }
}
