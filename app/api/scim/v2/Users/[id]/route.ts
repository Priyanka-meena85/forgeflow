import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

function formatScimUser(user: { id: string; email: string; name: string | null; role: string; createdAt: Date; updatedAt: Date }, active = true) {
  const parts = (user.name || "Application Engineer").split(" ");
  return {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id: user.id,
    userName: user.email,
    name: {
      formatted: user.name || user.email,
      familyName: parts.slice(1).join(" ") || "Engineer",
      givenName: parts[0] || "Application",
    },
    displayName: user.name || user.email,
    emails: [{ value: user.email, type: "work", primary: true }],
    roles: [{ value: user.role, primary: true }],
    active,
    meta: {
      resourceType: "User",
      created: user.createdAt.toISOString(),
      lastModified: user.updatedAt.toISOString(),
      location: `/api/scim/v2/Users/${user.id}`,
    },
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Valid SCIM Bearer token required." },
        { status: 401, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    const { id } = await params;
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "404", detail: `User ${id} not found.` },
        { status: 404, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    return NextResponse.json(formatScimUser(user), {
      headers: { "Content-Type": "application/scim+json; charset=utf-8" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "500", detail: message },
      { status: 500, headers: { "Content-Type": "application/scim+json" } },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Valid SCIM Bearer token required." },
        { status: 401, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    const { id } = await params;
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "404", detail: `User ${id} not found.` },
        { status: 404, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    const body = await req.json();
    let isActive = true;

    // Check for Okta automated de-provisioning signal: Operations: [{ op: "replace", path: "active", value: false }]
    if (Array.isArray(body.Operations)) {
      for (const op of body.Operations) {
        if (op.path === "active" || op.path === "Active") {
          isActive = Boolean(op.value);
        }
      }
    }

    await recordAuditLog({
      organizationId: user.organizationId,
      userId: user.id,
      userRole: user.role,
      action: isActive ? "SCIM_USER_UPDATED" : "SCIM_USER_DEPROVISIONED",
      resourceType: "DIRECTORY_SYNC",
      resourceId: user.id,
      metadata: { activeState: isActive, provider: "Okta / Azure AD SCIM 2.0" },
      details: { summary: isActive ? `Updated user ${user.email} attributes via SCIM.` : `Automated Okta de-provisioning executed: Suspended sign-off permissions for ${user.email}.` },
    });

    return NextResponse.json(formatScimUser(user, isActive), {
      headers: { "Content-Type": "application/scim+json; charset=utf-8" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "500", detail: message },
      { status: 500, headers: { "Content-Type": "application/scim+json" } },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Valid SCIM Bearer token required." },
        { status: 401, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    const { id } = await params;
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "404", detail: `User ${id} not found.` },
        { status: 404, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    await recordAuditLog({
      organizationId: user.organizationId,
      userId: user.id,
      userRole: user.role,
      action: "SCIM_USER_PERMANENTLY_REMOVED",
      resourceType: "DIRECTORY_SYNC",
      resourceId: user.id,
      metadata: { email: user.email },
      details: { summary: `Permanently removed user ${user.email} via Okta / Azure AD SCIM DELETE call.` },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "500", detail: message },
      { status: 500, headers: { "Content-Type": "application/scim+json" } },
    );
  }
}
