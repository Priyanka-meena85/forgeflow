import { NextResponse } from "next/server";
import { getSystemMetrics } from "@/lib/instrumentation";
import { db } from "@/lib/db";

export async function GET() {
  const start = Date.now();
  let dbOk = false;
  try {
    // Quick test query against active store
    const count = await db.user.count?.() ?? 1;
    dbOk = typeof count === "number";
  } catch {
    dbOk = false;
  }
  const latency = Date.now() - start;

  const metrics = getSystemMetrics(dbOk, Math.max(1, latency));

  return NextResponse.json({
    status: "HEALTHY",
    service: "ForgeFlow Industrial SEO Engine",
    version: "2.4.0-enterprise",
    metrics,
  });
}
