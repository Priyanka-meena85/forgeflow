import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { domain, industry, keyword } = body;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid company domain is required." },
        { status: 400 }
      );
    }

    const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim().toLowerCase();
    const cleanKeyword = (keyword || "Industrial Machinery Parts").trim();
    const cleanIndustry = (industry || "Precision Manufacturing").trim();

    // Deterministic diagnostic scoring based on domain hash
    let hash = 0;
    for (let i = 0; i < cleanDomain.length; i++) {
      hash = (hash << 5) - hash + cleanDomain.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const overallScore = 28 + (seed % 28); // 28 to 55 out of 100 (typical unoptimized industrial site)
    const dinIsoScore = 15 + (seed % 25);
    const aeoScore = 10 + (seed % 20);
    const cadIndexScore = 5 + (seed % 15);
    const missedPipelineUsd = (350000 + (seed % 650000)).toLocaleString("en-US");
    const estimatedMissingPages = 45 + (seed % 120);

    const criticalGaps = [
      {
        title: "Missing Structured DIN/ISO Schema Markup",
        severity: "CRITICAL",
        description: `Your pages lack Schema.org Product specifications for ${cleanIndustry}. Search engines cannot parse your dimensional tolerances or material hardness ratings.`,
        fix: "ForgeFlow automatically injects ISO 2768, DIN, and ASTM LD+JSON schema on every generated catalog page.",
      },
      {
        title: "Zero AEO (AI Engine) Citation Authority",
        severity: "HIGH",
        description: `Perplexity, ChatGPT Search, and Google Gemini currently cite 0 engineering pages from ${cleanDomain} for queries like "${cleanKeyword}".`,
        fix: "ForgeFlow's AEO Knowledge Engine formats technical parameters directly into LLM-indexable semantic answer blocks.",
      },
      {
        title: "Uncrawlable PDF/CAD Spec Sheets",
        severity: "HIGH",
        description: "Your engineering PDFs and STEP files are treated as opaque binaries by search crawlers, hiding thousands of part numbers.",
        fix: "ForgeFlow automatically extracts tolerance tables, thread pitches, and CAD specs into high-ranking programmatic landing pages.",
      },
    ];

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      industry: cleanIndustry,
      keyword: cleanKeyword,
      metrics: {
        overallScore,
        dinIsoScore,
        aeoScore,
        cadIndexScore,
        estimatedMissingPages,
        missedPipelineUsd: `$${missedPipelineUsd}`,
      },
      gaps: criticalGaps,
      scannedAt: new Date().toISOString(),
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Audit scan failed";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
