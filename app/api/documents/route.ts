import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ingestOemSpecDocument } from "@/lib/rag";
import { recordAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const docs = await db.specDocument.findMany({
      where: { organizationId: orgId },
    });

    return NextResponse.json({
      success: true,
      count: docs.length,
      documents: docs.map((d) => ({
        id: d.id,
        title: d.title,
        fileName: d.fileName,
        fileSize: d.fileSize,
        fileType: d.fileType,
        extractedSpecs: d.extractedNodesJson ? JSON.parse(d.extractedNodesJson) : [],
        snippet: d.extractedContent.slice(0, 150) + "…",
        status: d.status,
        createdAt: d.createdAt,
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

    const { title, fileName, rawText, fileSize, fileType } = body;

    if (!title || !rawText) {
      return NextResponse.json({ error: "Title and rawText (or extracted manual contents) are required." }, { status: 400 });
    }

    const result = await ingestOemSpecDocument({
      organizationId: orgId,
      title,
      fileName: fileName || `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
      fileSize: fileSize || rawText.length,
      fileType: fileType || "application/pdf",
      rawText,
    });

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "OEM_DOCUMENT_INGESTED",
      resourceType: "SPEC_DOCUMENT",
      resourceId: result.documentId,
      metadata: {
        title: result.title,
        extractedNodesCount: result.extractedNodesCount,
        specs: result.extractedSpecs.map((s) => `${s.parameter}: ${s.value}`),
      },
      details: {
        summary: `Ingested OEM document '${result.title}' and parsed ${result.extractedNodesCount} certified engineering tolerances.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully ingested and parsed '${result.title}' with ${result.extractedNodesCount} zero-hallucination tolerance nodes.`,
      document: result,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
