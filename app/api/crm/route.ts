import { NextResponse } from "next/server";
import { getAttributionOverview } from "@/lib/crmAttribution";

export const dynamic = "force-dynamic";

export async function GET() {
  const overview = getAttributionOverview();
  return NextResponse.json({
    success: true,
    status: "ok",
    attribution: overview,
  });
}
