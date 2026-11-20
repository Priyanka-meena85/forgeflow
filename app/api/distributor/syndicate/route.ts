import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface DistributorHub {
  id: string;
  distributorName: string;
  region: string;
  cityState: string;
  syndicatedDomain: string;
  canonicalUrl: string;
  inventoryStatus: "IN_STOCK" | "LOW_STOCK" | "DIRECT_SHIP";
  assignedPhone: string;
  status: "ACTIVE" | "PAUSED";
  lastSyndicatedAt: string;
  leadCount: number;
}

const memoryDistributors: Map<string, DistributorHub[]> = new Map([
  [
    "seed-org-industrial",
    [
      {
        id: "dist_1",
        distributorName: "Grainger Industrial Supply (Dallas DC)",
        region: "Southwest US",
        cityState: "Dallas, TX",
        syndicatedDomain: "grainger-partner.accudrive.io/tx",
        canonicalUrl: "https://accudrive.example.com/articles/stamping-die-galling",
        inventoryStatus: "IN_STOCK",
        assignedPhone: "+1 (214) 555-0192",
        status: "ACTIVE",
        lastSyndicatedAt: "2 hours ago",
        leadCount: 42,
      },
      {
        id: "dist_2",
        distributorName: "Motion Industries Regional Hub",
        region: "Southeast US",
        cityState: "Atlanta, GA",
        syndicatedDomain: "motion-partner.accudrive.io/se",
        canonicalUrl: "https://accudrive.example.com/articles/stamping-die-galling",
        inventoryStatus: "IN_STOCK",
        assignedPhone: "+1 (404) 555-0144",
        status: "ACTIVE",
        lastSyndicatedAt: "5 hours ago",
        leadCount: 29,
      },
      {
        id: "dist_3",
        distributorName: "Ferguson Commercial & Industrial Hub",
        region: "Midwest US",
        cityState: "Chicago, IL",
        syndicatedDomain: "ferguson-partner.accudrive.io/il",
        canonicalUrl: "https://accudrive.example.com/articles/stamping-die-galling",
        inventoryStatus: "DIRECT_SHIP",
        assignedPhone: "+1 (312) 555-0188",
        status: "ACTIVE",
        lastSyndicatedAt: "1 day ago",
        leadCount: 17,
      },
    ],
  ],
]);

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const hubs = memoryDistributors.get(orgId) || memoryDistributors.get("seed-org-industrial") || [];

    return NextResponse.json({
      success: true,
      hubs,
      totalLeadsGenerated: hubs.reduce((acc, h) => acc + h.leadCount, 0),
      canonicalPolicy: "Strict rel='canonical' preservation to prevent Google search index cannibalization",
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
    const { distributorId, action } = body;

    const hubs = memoryDistributors.get(orgId) || memoryDistributors.get("seed-org-industrial") || [];
    const target = hubs.find((h) => h.id === distributorId);

    if (!target) {
      return NextResponse.json({ error: "Distributor partner hub not found." }, { status: 404 });
    }

    if (action === "toggle_status") {
      target.status = target.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      memoryDistributors.set(orgId, hubs);

      await recordAuditLog({
        organizationId: orgId,
        userId: session.user.id,
        userRole: session.user.role,
        action: "DISTRIBUTOR_STATUS_TOGGLED",
        resourceType: "DISTRIBUTOR_HUB",
        resourceId: target.id,
        metadata: { distributor: target.distributorName, status: target.status },
        details: { summary: `Changed syndication status to ${target.status} for ${target.distributorName}` },
      });

      return NextResponse.json({ success: true, hub: target });
    }

    if (action === "re_syndicate") {
      target.lastSyndicatedAt = "Just now";
      memoryDistributors.set(orgId, hubs);

      await recordAuditLog({
        organizationId: orgId,
        userId: session.user.id,
        userRole: session.user.role,
        action: "DISTRIBUTOR_RESYNDICATED",
        resourceType: "DISTRIBUTOR_HUB",
        resourceId: target.id,
        metadata: { distributor: target.distributorName },
        details: { summary: `Dispatched updated technical schema to ${target.distributorName}` },
      });

      return NextResponse.json({ success: true, message: `Dispatched updated canonical spec to ${target.distributorName}.` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
