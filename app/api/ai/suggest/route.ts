import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { getIndustrialAeoSuggestions } from "@/lib/gemini";

export async function POST(request: Request) {
  // Check Gemini API Key
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    return errorResponse("GEMINI_API_KEY is not configured in environment.", 503);
  }

  // Attempt user session (optional in dev/demo mode, required in production if user session exists)
  const user = await getSessionUser().catch(() => null);

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return errorResponse("Invalid request body.", 400);
  }

  const { topic, equipment, standard, vertical, currentSummary } = body as Record<string, unknown>;

  if (!topic || typeof topic !== "string" || topic.trim().length < 2) {
    return errorResponse("Topic is required (minimum 2 characters).", 400);
  }

  try {
    const suggestions = await getIndustrialAeoSuggestions({
      topic: topic.trim(),
      equipment: typeof equipment === "string" ? equipment.trim() : undefined,
      standard: typeof standard === "string" ? standard.trim() : undefined,
      vertical: typeof vertical === "string" ? vertical.trim() : undefined,
      currentSummary: typeof currentSummary === "string" ? currentSummary.trim() : undefined,
    });

    return NextResponse.json({
      suggestions,
      provider: "Google Gemini",
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      organization: user?.organization?.name ?? "Industrial OEM Workspace",
    });
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to generate suggestions with Gemini.",
      502,
    );
  }
}
