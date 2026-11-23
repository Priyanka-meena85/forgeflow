import { NextResponse } from "next/server";
import { getDistributorNetworkSummary } from "@/lib/distributorNetworkEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getDistributorNetworkSummary();
  return NextResponse.json({
    success: true,
    status: "ok",
    distributorNetwork: summary,
  });
}
