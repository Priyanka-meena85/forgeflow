import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { scanQueryCitation } from "@/lib/aeoTracker";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const queries = await db.aeoTrackerQuery.findMany({
      where: { organizationId: orgId },
    });

    const googleCited = queries.filter((q) => q.googleAeoCited).length;
    const perplexityCited = queries.filter((q) => q.perplexityCited).length;
    const chatGptIndexed = queries.filter((q) => q.chatGptIndexed).length;
    const total = queries.length;
    const citationRate = total > 0 ? Math.round(((googleCited + perplexityCited) / (total * 2)) * 100) : 0;

    return NextResponse.json({
      success: true,
      summary: {
        totalMonitored: total,
        googleCited,
        perplexityCited,
        chatGptIndexed,
        citationRate,
      },
      queries: queries.map((q) => ({
        id: q.id,
        keyword: q.keyword,
        targetUrl: q.targetUrl,
        googleAeoCited: q.googleAeoCited,
        googleAeoPosition: q.googleAeoPosition,
        perplexityCited: q.perplexityCited,
        perplexityCitationIndex: q.perplexityCitationIndex,
        chatGptIndexed: q.chatGptIndexed,
        aiSnippetSummary: q.aiSnippetSummary,
        lastCheckedAt: q.lastCheckedAt,
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
    const { keyword, targetUrl, draftId } = body;

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required." }, { status: 400 });
    }

    const scan = await scanQueryCitation({
      keyword,
      targetUrl: targetUrl || `https://accudrive.example.com/articles/${keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    });

    const created = await db.aeoTrackerQuery.create({
      data: {
        organizationId: orgId,
        draftId: draftId || null,
        keyword,
        targetUrl: scan.targetUrl,
        googleAeoCited: scan.googleAeoCited,
        googleAeoPosition: scan.googleAeoPosition,
        perplexityCited: scan.perplexityCited,
        perplexityCitationIndex: scan.perplexityCitationIndex,
        chatGptIndexed: scan.chatGptIndexed,
        aiSnippetSummary: scan.aiSnippetSummary,
        lastCheckedAt: scan.scannedAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: `AEO query '${keyword}' added and verified in live LLM citation indices.`,
      query: created,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
