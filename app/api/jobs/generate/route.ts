import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { createGenerationJob } from "@/lib/jobs";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to queue content generation.", 401);

    // Rate Limiting on Organization level for AI generation
    const rateCheck = await checkRateLimit(
      `gen_org:${user.organizationId}`,
      RATE_LIMITS.AI_GENERATION.limit,
      RATE_LIMITS.AI_GENERATION.windowSeconds,
    );
    if (!rateCheck.success) {
      return errorResponse(
        "Generation rate limit exceeded for your workspace. Please wait before starting another batch.",
        429,
      );
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);

    const { topics, productDescription, industry, keywords } = body as Record<string, unknown>;
    if (
      !Array.isArray(topics) ||
      topics.length < 1 ||
      topics.length > 5 ||
      !topics.every((topic) => typeof topic === "string" && topic.trim().length > 2 && topic.length <= 160) ||
      typeof productDescription !== "string" ||
      productDescription.trim().length < 10 ||
      productDescription.length > 2000 ||
      typeof industry !== "string" ||
      industry.length > 120 ||
      typeof keywords !== "string" ||
      keywords.length > 1000
    ) {
      return errorResponse("Provide 1–5 topics and valid product, industry, and keyword details.", 400);
    }

    const job = await createGenerationJob(user.organizationId, user.id, {
      topics: topics.map((t) => String(t).trim()),
      productDescription: productDescription.trim(),
      industry: industry.trim(),
      keywords: keywords.trim(),
      company: user.organization?.name ?? "Enterprise Tenant",
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: job.status,
      message: `Generation job queued for ${topics.length} technical pages. Connect to SSE stream for live updates.`,
    });
  } catch (error) {
    console.error("Queue generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to queue generation job.";
    const status = message.includes("quota") ? 402 : 500;
    return errorResponse(message, status);
  }
}
