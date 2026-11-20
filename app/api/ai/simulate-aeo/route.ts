import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { simulateAeoAnswer } from "@/lib/gemini";

export async function POST(request: Request) {
  const user = await getSessionUser().catch(() => null);

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return errorResponse("Invalid request body.", 400);
  }

  const { query, title, equipment, standard, vertical, summary, engine } = body as Record<string, unknown>;

  const effectiveQuery = typeof query === "string" && query.trim() ? query.trim() : (typeof title === "string" ? title.trim() : "Industrial troubleshooting");
  const effectiveTitle = typeof title === "string" && title.trim() ? title.trim() : effectiveQuery;

  try {
    const simulation = await simulateAeoAnswer({
      query: effectiveQuery,
      title: effectiveTitle,
      equipment: typeof equipment === "string" ? equipment.trim() : undefined,
      standard: typeof standard === "string" ? standard.trim() : undefined,
      vertical: typeof vertical === "string" ? vertical.trim() : undefined,
      summary: typeof summary === "string" ? summary.trim() : undefined,
      engine: engine === "Google AI Overview"
        ? "Google AI Overview"
        : engine === "ChatGPT Search"
        ? "ChatGPT Search"
        : "Perplexity Copilot",
      company: user?.organization?.name ?? "ForgeFlow OEM Portal",
      domain: user?.organization?.website ? user.organization.website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : "industrial-oem.com",
    });

    return NextResponse.json({ simulation });
  } catch (error) {
    console.error("AEO simulation error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to simulate AEO response.",
      502,
    );
  }
}
