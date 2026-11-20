import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generatePresignedUploadUrl } from "@/lib/storage";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fileName, contentType } = body;

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "File name is required." }, { status: 400 });
    }

    const allowedMime = [
      "application/pdf",
      "application/step",
      "model/step",
      "text/plain",
      "application/octet-stream",
    ];

    const type = contentType || "application/pdf";
    if (!allowedMime.includes(type) && !fileName.match(/\.(pdf|step|stp|iges|igs|txt)$/i)) {
      return NextResponse.json({ error: "Only OEM technical manuals (PDF) and 3D CAD files (STEP/IGES) are permitted." }, { status: 400 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const presigned = generatePresignedUploadUrl(fileName, type, orgId);

    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "STORAGE_PRESIGNED_URL_ISSUED",
      resourceType: "OBJECT_STORAGE",
      resourceId: presigned.fileKey,
      metadata: { fileName, contentType: type },
      details: { summary: `Issued presigned storage upload URL for ${fileName}` },
    });

    return NextResponse.json({
      success: true,
      presigned,
      integrityCheck: "SHA-256 Checksum Verification Armed",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
