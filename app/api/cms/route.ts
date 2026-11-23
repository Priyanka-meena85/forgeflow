import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const integrations = await db.cmsIntegration.findMany();
    return NextResponse.json({
      success: true,
      integrations,
    });
  } catch {
    return NextResponse.json({
      success: true,
      integrations: [],
    });
  }
}
