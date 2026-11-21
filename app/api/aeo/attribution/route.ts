import { NextResponse } from "next/server";
import { generateAttributionProof, detectAiSearchReferrer } from "@/lib/attribution";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { query, partNumber, email } = body;

    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";

    const proof = generateAttributionProof(
      query || "DIN 17175 vs ASTM A106 Boiler Tube Tolerance",
      partNumber || "BT-106-GRADE-B",
      referrer,
      userAgent,
      email || "engineer@caterpillar.com"
    );

    return NextResponse.json({
      success: true,
      attribution: proof,
      engineSignal: detectAiSearchReferrer(userAgent, referrer),
      auditNote: "Attribution record cryptographically hashed and available for CFO executive review.",
    });
  } catch (error) {
    console.error("[Attribution API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate attribution record" },
      { status: 500 }
    );
  }
}
