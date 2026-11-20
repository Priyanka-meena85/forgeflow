import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { verifyChainIntegrity, getAuditChain } from "@/lib/tamperAudit";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const integrity = verifyChainIntegrity();
    const chain = getAuditChain();

    return NextResponse.json({
      success: true,
      standard: "SOC 2 Type II / ISO 27001 Cryptographic Tamper-Evidence",
      integrity,
      recentChainedBlocks: chain.slice(-10),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
