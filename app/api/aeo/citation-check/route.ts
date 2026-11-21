import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeCitationCheck, type CitationCheckRequest } from "@/lib/aeoScraperEngine";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { query, partNumber, brandName, targetUrl, engine } = body;

    if (!query || !partNumber) {
      return NextResponse.json({ error: "query and partNumber are required." }, { status: 400 });
    }

    const params: CitationCheckRequest = {
      query: String(query).trim(),
      partNumber: String(partNumber).trim(),
      brandName: String(brandName || "OEM Manufacturer").trim(),
      targetUrl: String(targetUrl || "https://example-industrial.com").trim(),
      engine: engine === "perplexity" || engine === "google_sge" ? engine : "chatgpt",
    };

    const result = await executeCitationCheck(params);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Citation check failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
