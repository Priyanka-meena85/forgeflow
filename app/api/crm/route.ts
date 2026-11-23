import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    pipeline: {
      activeDealsCount: 4,
      totalPipelineValueUsd: 1250000,
      stage: "ACTIVE",
    },
  });
}
