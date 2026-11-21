import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/dbDiagnostics";

export async function GET() {
  try {
    const health = await checkDatabaseHealth();
    const httpStatus = health.status === "CRITICAL" ? 503 : 200;
    return NextResponse.json({ success: true, timestamp: new Date().toISOString(), health }, { status: httpStatus });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database diagnostic check failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
