import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCogsSummaryForOrg } from "@/lib/aiRouter";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const summary = getCogsSummaryForOrg(orgId);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
