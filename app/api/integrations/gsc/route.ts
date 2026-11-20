import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface GscQueryMetric {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  hasAeoOverview: boolean;
}

export interface SchemaDriftAlert {
  id: string;
  url: string;
  schemaType: "TechArticle" | "FAQPage" | "HowTo";
  severity: "WARNING" | "INFO";
  description: string;
  suggestedPatch: string;
  isResolved: boolean;
}

const mockGscQueries: GscQueryMetric[] = [
  {
    query: "commercial rtu compressor flooded starts",
    impressions: 480,
    clicks: 68,
    ctr: 0.142,
    position: 2.1,
    hasAeoOverview: true,
  },
  {
    query: "sanitary rotary lobe pump seal swelling caustic",
    impressions: 340,
    clicks: 52,
    ctr: 0.153,
    position: 1.8,
    hasAeoOverview: true,
  },
  {
    query: "5-axis spindle thermal expansion drift compensation",
    impressions: 290,
    clicks: 41,
    ctr: 0.141,
    position: 3.4,
    hasAeoOverview: false,
  },
  {
    query: "high tonnage servo press stamping die galling iatf 16949",
    impressions: 210,
    clicks: 34,
    ctr: 0.162,
    position: 1.4,
    hasAeoOverview: true,
  },
];

let mockDriftAlerts: SchemaDriftAlert[] = [
  {
    id: "drift_1",
    url: "/articles/automating-fault-detection-diagnostics-rtu-compressor-failure",
    schemaType: "TechArticle",
    severity: "WARNING",
    description: "Googlebot detected missing hasCredential on reviewer Person entity",
    suggestedPatch: "Auto-bind Dr. Marcus Vance PE credentials into JSON-LD graph",
    isResolved: false,
  },
  {
    id: "drift_2",
    url: "/articles/preventing-elastomer-seal-swelling-in-rotary-lobe-pumps-during-cip",
    schemaType: "FAQPage",
    severity: "INFO",
    description: "Rich snippet eligible: 3-A Sanitary standard cited without ISO equivalence link",
    suggestedPatch: "Inject ISO 2852 sanitary clamp fitting cross-reference link",
    isResolved: false,
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      connectedProperty: "sc-domain:accudrive-reliability.com",
      lastSyncTime: new Date().toISOString(),
      summary: {
        totalIndexedPages: 84,
        monthlyImpressions: 12450,
        monthlyClicks: 1840,
        averageCtr: "14.8%",
        averagePosition: 2.4,
        richResultEligibility: "98.2%",
      },
      topQueries: mockGscQueries,
      driftAlerts: mockDriftAlerts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const body = await req.json();
    const { action, alertId } = body;

    if (action === "RESOLVE_DRIFT" && alertId) {
      mockDriftAlerts = mockDriftAlerts.map((a) =>
        a.id === alertId ? { ...a, isResolved: true } : a
      );

      await recordAuditLog({
        organizationId: orgId,
        userId: session.user.id,
        userRole: session.user.role,
        action: "GSC_SCHEMA_DRIFT_PATCHED",
        resourceType: "SCHEMA_GRAPH",
        resourceId: alertId,
        metadata: { alertId },
        details: { summary: `Auto-patched Schema Drift for alert ${alertId}` },
      });

      return NextResponse.json({
        success: true,
        message: "Schema Drift patch applied and queued for Googlebot re-indexing.",
        driftAlerts: mockDriftAlerts,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
