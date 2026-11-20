import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";
import { encryptSecret, maskSecret } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const integrations = await db.cmsIntegration.findMany({
      where: { organizationId: orgId },
    });

    return NextResponse.json({
      success: true,
      count: integrations.length,
      integrations: integrations.map((i) => ({
        id: i.id,
        provider: i.provider,
        name: i.name,
        endpointUrl: i.endpointUrl,
        maskedApiKey: maskSecret(i.apiKey || ""),
        targetCollectionId: i.targetCollectionId,
        status: i.status,
        autoPublishApproved: i.autoPublishApproved,
        createdAt: i.createdAt,
      })),
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

    const { provider, name, endpointUrl, apiKey, targetCollectionId, autoPublishApproved } = body;

    if (!provider || !name || !endpointUrl) {
      return NextResponse.json({ error: "Provider, name, and endpointUrl are required." }, { status: 400 });
    }

    // Encrypt CMS API Key at Rest with AES-256-GCM
    const encryptedApiKey = apiKey ? encryptSecret(apiKey) : null;

    const created = await db.cmsIntegration.create({
      data: {
        organizationId: orgId,
        provider: provider.toUpperCase(),
        name,
        endpointUrl,
        apiKey: encryptedApiKey,
        targetCollectionId: targetCollectionId || null,
        autoPublishApproved: Boolean(autoPublishApproved),
        status: "ACTIVE",
      },
    });

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "CMS_INTEGRATION_CONNECTED",
      resourceType: "CMS_INTEGRATION",
      resourceId: created.id,
      metadata: { provider: created.provider, name: created.name },
      details: { summary: `Connected 1-Click Publishing destination: ${created.name} (${created.provider})` },
    });

    return NextResponse.json({
      success: true,
      message: `CMS integration '${created.name}' successfully connected.`,
      integration: created,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
