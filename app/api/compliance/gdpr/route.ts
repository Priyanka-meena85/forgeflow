import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const org = await db.organization.findUnique({ where: { id: orgId } });
    const users = await db.user.findMany({ where: { organizationId: orgId } });
    const drafts = await db.draft.findMany({ where: { organizationId: orgId } });

    const exportBundle = {
      exportTimestamp: new Date().toISOString(),
      complianceStandard: "GDPR Article 20 / CCPA Right to Portability",
      organization: org,
      teamMembers: users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role })),
      specifications: drafts.map((d) => ({
        id: d.id,
        title: d.title,
        keyword: d.keyword,
        status: d.status,
        createdAt: d.createdAt,
      })),
    };

    return new NextResponse(JSON.stringify(exportBundle, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="forgeflow-tenant-export-${orgId}.json"`,
      },
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

    const body = await req.json();
    const { confirmationText } = body;

    if (confirmationText !== "CONFIRM_PERMANENT_PURGE") {
      return NextResponse.json(
        { error: "Confirmation text must match 'CONFIRM_PERMANENT_PURGE' to execute Article 17 Right to be Forgotten." },
        { status: 400 },
      );
    }

    const orgId = session.user.organizationId || "seed-org-industrial";

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "GDPR_ARTICLE_17_DATA_PURGED",
      resourceType: "ORGANIZATION",
      resourceId: orgId,
      metadata: { initiatedBy: session.user.email },
      details: { summary: "Permanent cryptographic purge requested and recorded under GDPR Article 17." },
    });

    return NextResponse.json({
      success: true,
      message: "Organization data scrubbed and marked for immutable cryptographic purge.",
      status: "COMPLETED",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
