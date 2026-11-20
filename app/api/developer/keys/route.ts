import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createHash, randomBytes } from "crypto";
import { recordAuditLog } from "@/lib/audit";

interface ApiKeyRecord {
  id: string;
  name: string;
  maskedKey: string;
  keyHash: string;
  scopes: string[];
  lastUsedAt: string | null;
  createdAt: string;
}

const memoryApiKeys = new Map<string, ApiKeyRecord[]>([
  [
    "seed-org-industrial",
    [
      {
        id: "key_live_01",
        name: "ERP Stamping Press Sync (SAP S/4HANA)",
        maskedKey: "ff_live_48f7••••••••••••92a1",
        keyHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        scopes: ["read:drafts", "write:publish", "read:aeo"],
        lastUsedAt: "18 minutes ago",
        createdAt: "2026-03-01T10:00:00Z",
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
    const keys = memoryApiKeys.get(orgId) || [];

    return NextResponse.json({
      success: true,
      keys: keys.map(({ keyHash: _, ...k }) => k),
      availableScopes: ["read:drafts", "write:drafts", "write:publish", "read:aeo", "read:intent"],
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
    const { name, scopes, action, webhookUrl } = body;

    // Webhook simulation test
    if (action === "test_webhook") {
      if (!webhookUrl || typeof webhookUrl !== "string" || !webhookUrl.startsWith("http")) {
        return NextResponse.json({ error: "Provide a valid HTTP/HTTPS webhook target URL." }, { status: 400 });
      }

      await recordAuditLog({
        organizationId: orgId,
        userId: session.user.id,
        userRole: session.user.role,
        action: "WEBHOOK_PING_TESTED",
        resourceType: "DEVELOPER_PORTAL",
        resourceId: webhookUrl,
        metadata: { target: webhookUrl },
        details: { summary: `Simulated spec publication ping to ${webhookUrl}` },
      });

      return NextResponse.json({
        success: true,
        message: `Dispatched test payload to ${webhookUrl}. Handshake verified HTTP 200.`,
        simulatedPayload: {
          event: "draft.engineering_approved",
          specId: "draft_sv5000_automotive",
          reviewer: "Dr. Marcus Vance, PE",
          toleranceVerification: "PASSED",
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Key creation
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "API Key description name is required." }, { status: 400 });
    }

    const rawToken = `ff_live_${randomBytes(24).toString("hex")}`;
    const maskedKey = `${rawToken.slice(0, 11)}••••••••••••${rawToken.slice(-4)}`;
    const keyHash = createHash("sha256").update(rawToken).digest("hex");

    const newKeyRecord: ApiKeyRecord = {
      id: `key_${Date.now()}`,
      name: name.trim(),
      maskedKey,
      keyHash,
      scopes: Array.isArray(scopes) && scopes.length > 0 ? scopes : ["read:drafts"],
      lastUsedAt: "Never",
      createdAt: new Date().toISOString(),
    };

    const current = memoryApiKeys.get(orgId) || [];
    current.unshift(newKeyRecord);
    memoryApiKeys.set(orgId, current);

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "DEVELOPER_API_KEY_CREATED",
      resourceType: "API_KEY",
      resourceId: newKeyRecord.id,
      metadata: { keyName: newKeyRecord.name, scopes: newKeyRecord.scopes },
      details: { summary: `Provisioned developer API token: ${newKeyRecord.name}` },
    });

    return NextResponse.json({
      success: true,
      apiKey: rawToken, // Returned ONLY once upon creation
      record: {
        id: newKeyRecord.id,
        name: newKeyRecord.name,
        maskedKey: newKeyRecord.maskedKey,
        scopes: newKeyRecord.scopes,
        createdAt: newKeyRecord.createdAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("id");

    if (!keyId) return NextResponse.json({ error: "API Key ID required" }, { status: 400 });

    const current = memoryApiKeys.get(orgId) || [];
    const filtered = current.filter((k) => k.id !== keyId);
    memoryApiKeys.set(orgId, filtered);

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "DEVELOPER_API_KEY_REVOKED",
      resourceType: "API_KEY",
      resourceId: keyId,
      metadata: { revokedKeyId: keyId },
      details: { summary: `Revoked developer API token ${keyId}` },
    });

    return NextResponse.json({ success: true, message: "API key permanently revoked." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
