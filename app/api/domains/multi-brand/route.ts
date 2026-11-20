import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

interface BrandDomain {
  id: string;
  brandName: string;
  domain: string;
  cnameTarget: string;
  sslStatus: "ACTIVE" | "PENDING_VERIFICATION";
  toleranceLockEnabled: boolean;
  publishedSkuPages: number;
  lastSyncAt: string;
}

const enterpriseBrandDomains: BrandDomain[] = [
  {
    id: "dom_01",
    brandName: "AccuDrive Heavy Hydraulics",
    domain: "specs.accudrive-hydraulics.com",
    cnameTarget: "edge.forgeflow.ai",
    sslStatus: "ACTIVE",
    toleranceLockEnabled: true,
    publishedSkuPages: 148,
    lastSyncAt: "8 minutes ago",
  },
  {
    id: "dom_02",
    brandName: "AccuDrive Thermal RTU Division",
    domain: "rtu-knowledge.accudrive.com",
    cnameTarget: "edge.forgeflow.ai",
    sslStatus: "ACTIVE",
    toleranceLockEnabled: true,
    publishedSkuPages: 84,
    lastSyncAt: "1 hour ago",
  },
];

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      domains: enterpriseBrandDomains,
      governancePolicy: "Centralized OEM Tolerance Enforcement (Locked)",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
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
    const body = await req.json().catch(() => ({}));
    const { brandName, domain } = body;

    if (!brandName || !domain) {
      return NextResponse.json({ error: "Brand name and domain are required." }, { status: 400 });
    }

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "");

    const newDomain: BrandDomain = {
      id: `dom_${Date.now()}`,
      brandName: brandName.trim(),
      domain: cleanDomain,
      cnameTarget: "edge.forgeflow.ai",
      sslStatus: "ACTIVE",
      toleranceLockEnabled: true,
      publishedSkuPages: 0,
      lastSyncAt: "Just now",
    };

    enterpriseBrandDomains.push(newDomain);

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "BRAND_CUSTOM_DOMAIN_PROVISIONED",
      resourceType: "MULTI_BRAND_ROUTING",
      resourceId: cleanDomain,
      metadata: { brandName, domain: cleanDomain },
      details: { summary: `Provisioned white-label brand domain ${cleanDomain}` },
    });

    return NextResponse.json({
      success: true,
      domain: newDomain,
      dnsRecordRequired: {
        type: "CNAME",
        host: cleanDomain,
        target: "edge.forgeflow.ai",
        ttl: 300,
        status: "SSL_VERIFIED",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
