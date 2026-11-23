import { NextResponse } from "next/server";
import { getWhiteLabelConfig } from "@/lib/whiteLabelEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getWhiteLabelConfig("org_demo");
  return NextResponse.json({
    success: true,
    status: "ok",
    whiteLabelConfig: config,
  });
}
