import { NextResponse } from "next/server";
import { PLAN_CONFIGS } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "ok",
    plans: Object.values(PLAN_CONFIGS),
  });
}
