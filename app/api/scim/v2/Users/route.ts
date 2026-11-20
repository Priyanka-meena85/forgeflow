import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";
import { UserRole } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

function formatScimUser(user: { id: string; email: string; name: string | null; role: string; createdAt: Date; updatedAt: Date }) {
  const parts = (user.name || "Application Engineer").split(" ");
  const givenName = parts[0] || "Application";
  const familyName = parts.slice(1).join(" ") || "Engineer";

  return {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id: user.id,
    userName: user.email,
    name: {
      formatted: user.name || user.email,
      familyName,
      givenName,
    },
    displayName: user.name || user.email,
    emails: [
      {
        value: user.email,
        type: "work",
        primary: true,
      },
    ],
    roles: [
      {
        value: user.role,
        primary: true,
      },
    ],
    active: true,
    meta: {
      resourceType: "User",
      created: user.createdAt.toISOString(),
      lastModified: user.updatedAt.toISOString(),
      location: `/api/scim/v2/Users/${user.id}`,
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Valid SCIM Bearer token required." },
        { status: 401, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");

    const users = await db.user.findMany();
    let filteredUsers = users;

    if (filter) {
      const match = filter.match(/userName eq "([^"]+)"/i);
      if (match && match[1]) {
        const queryEmail = match[1].toLowerCase();
        filteredUsers = users.filter((u) => u.email.toLowerCase() === queryEmail);
      }
    }

    const response = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
      totalResults: filteredUsers.length,
      startIndex: 1,
      itemsPerPage: filteredUsers.length,
      Resources: filteredUsers.map((u) => formatScimUser(u)),
    };

    return NextResponse.json(response, {
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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Valid SCIM Bearer token required." },
        { status: 401, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    const body = await req.json();
    const email = body.userName || body.emails?.[0]?.value;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "400", detail: "userName or email is required." },
        { status: 400, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    const name = body.name?.formatted || `${body.name?.givenName || ""} ${body.name?.familyName || ""}`.trim() || email.split("@")[0];
    const passwordHash = await hashPassword(`ScimProvisioned_${Date.now()}!`);

    // Check existing
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "409", detail: "User already exists in directory." },
        { status: 409, headers: { "Content-Type": "application/scim+json" } },
      );
    }

    const newUser = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        organizationId: "seed-org-industrial",
        role: UserRole.REVIEWER,
      },
    });

    await recordAuditLog({
      organizationId: "seed-org-industrial",
      userId: newUser.id,
      userRole: "REVIEWER",
      action: "SCIM_USER_PROVISIONED",
      resourceType: "DIRECTORY_SYNC",
      resourceId: newUser.id,
      metadata: { email: newUser.email, provider: "Okta / Azure AD SCIM 2.0" },
      details: { summary: `Auto-provisioned application engineer account for ${newUser.email} via SCIM 2.0.` },
    });

    return NextResponse.json(formatScimUser(newUser), {
      status: 201,
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
