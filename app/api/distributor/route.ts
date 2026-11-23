import { NextResponse } from "next/server";
import { queryDistributorStock } from "@/lib/distributorStockEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const sampleStock = queryDistributorStock("OEM-5000-SV");
  return NextResponse.json({
    success: true,
    sampleStock,
  });
}
