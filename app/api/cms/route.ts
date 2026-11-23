import { NextResponse } from "next/server";
import { listCmsIntegrations } from "@/lib/cmsIntegrationEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const integrations = listCmsIntegrations();
  return NextResponse.json({
    success: true,
    status: "ok",
    integrations,
  });
}
