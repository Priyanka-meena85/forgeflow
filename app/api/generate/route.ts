import { NextResponse } from "next/server";
import { DraftStatus } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { serializeDraft } from "@/lib/drafts";
import { errorResponse } from "@/lib/http";
import { generateIndustrialDraftPages, type GeneratedPage } from "@/lib/gemini";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { checkQuota, recordPageUsage } from "@/lib/billing";
import { logAuditEvent } from "@/lib/audit";

function isGeneratedPage(value: unknown): value is GeneratedPage {
  if (!value || typeof value !== "object") return false;
  const page = value as Record<string, unknown>;
  return (
    typeof page.title === "string" &&
    typeof page.keyword === "string" &&
    typeof page.summary === "string" &&
    Array.isArray(page.sections) &&
    page.sections.length >= 2 &&
    page.sections.length <= 8 &&
    page.sections.every(
      (section) =>
        section &&
        typeof section === "object" &&
        typeof (section as Record<string, unknown>).heading === "string" &&
        typeof (section as Record<string, unknown>).body === "string",
    ) &&
    Array.isArray(page.faqs) &&
    page.faqs.length >= 2 &&
    page.faqs.length <= 10 &&
    page.faqs.every(
      (faq) =>
        faq &&
        typeof faq === "object" &&
        typeof (faq as Record<string, unknown>).q === "string" &&
        typeof (faq as Record<string, unknown>).a === "string",
    )
  );
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return errorResponse("Sign in to generate content.", 401);

  // Rate limit generation per workspace
  const rateCheck = await checkRateLimit(
    `gen_org:${user.organizationId}`,
    RATE_LIMITS.AI_GENERATION.limit,
    RATE_LIMITS.AI_GENERATION.windowSeconds,
  );
  if (!rateCheck.success) {
    return errorResponse(
      "Generation rate limit exceeded for your workspace. Please wait before generating again.",
      429,
    );
  }

  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (!hasGemini && !hasOpenAI) {
    return errorResponse("AI generation is not configured. Add GEMINI_API_KEY or OPENAI_API_KEY to your environment.", 503);
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

  // Enforce monthly quota limit
  const quota = await checkQuota(user.organizationId, topics.length);
  if (!quota.allowed) {
    return errorResponse(quota.error || "Monthly page generation quota exceeded.", 402);
  }

  let pages: GeneratedPage[] = [];

  // 1. Try Gemini first if configured (Default & Recommended)
  if (hasGemini) {
    try {
      pages = await generateIndustrialDraftPages({
        topics: topics as string[],
        productDescription: productDescription.trim(),
        industry: (industry as string).trim(),
        keywords: (keywords as string).trim(),
        company: user.organization?.name ?? "Enterprise Tenant",
      });
    } catch (geminiError) {
      console.error("Gemini draft generation error:", geminiError);
      // If OpenAI is available, fall through to try OpenAI
      if (!hasOpenAI) {
        return errorResponse("Gemini generation failed. Please verify your GEMINI_API_KEY.", 502);
      }
    }
  }

  // 2. Fallback to OpenAI if Gemini was not available or failed
  if (pages.length === 0 && hasOpenAI) {
    const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.deepseek.com/v1").replace(/\/+$/, "");
    const model = process.env.OPENAI_MODEL ?? "deepseek-chat";
    const prompt = [
      "Create a batch of technical industrial B2B SaaS SEO landing page drafts.",
      'Return only valid JSON with this shape: {"pages":[{"title":"string","keyword":"string","summary":"string","sections":[{"heading":"string","body":"string"}],"faqs":[{"q":"string","a":"string"}]}]}.',
      "Create exactly one page per provided topic, keep factual claims cautious, and do not invent customer results, certifications, or product capabilities.",
      "Each page needs 3-5 useful sections and 2-4 concise FAQs. Lead sections with a direct answer. Avoid generic filler.",
      `Company: ${user.organization?.name ?? "Enterprise Tenant"}`,
      `Product: ${productDescription.trim()}`,
      `Industry: ${industry.trim()}`,
      `Keywords and examples: ${keywords.trim()}`,
      `Topics: ${JSON.stringify(topics)}`,
    ].join("\n");

    try {
      const providerResponse = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
        }),
        signal: AbortSignal.timeout(55_000),
      });

      if (!providerResponse.ok) {
        const detail = await providerResponse.text();
        console.error("OpenAI provider error:", providerResponse.status, detail);
        return errorResponse(`AI provider returned an error (${providerResponse.status}).`, 502);
      }

      const completion: unknown = await providerResponse.json();
      const choice = (completion as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0];
      if (typeof choice?.message?.content === "string") {
        const result = JSON.parse(choice.message.content) as { pages?: GeneratedPage[] };
        if (Array.isArray(result?.pages)) {
          pages = result.pages;
        }
      }
    } catch (error) {
      console.error("OpenAI provider request failed:", error);
      return errorResponse("AI provider could not be reached.", 502);
    }
  }

  if (!Array.isArray(pages) || pages.length !== (topics as string[]).length || !pages.every(isGeneratedPage)) {
    return errorResponse("AI provider response did not match the required page structure. Please retry.", 502);
  }

  const storedDrafts = await db.$transaction(
    pages.map((page) => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      };
      return db.draft.create({
        data: {
          organizationId: user.organizationId,
          title: page.title.slice(0, 180),
          keyword: page.keyword.slice(0, 240),
          summary: page.summary.slice(0, 2000),
          sectionsJson: JSON.stringify(page.sections),
          faqsJson: JSON.stringify(page.faqs),
          schemaJson: JSON.stringify(schema),
          status: DraftStatus.IN_REVIEW,
        },
      });
    }),
  );

  // Increment usage count in organization
  await recordPageUsage(user.organizationId, storedDrafts.length);

  // Record audit logs
  for (const d of storedDrafts) {
    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      userRole: user.role,
      action: "DRAFT_CREATED",
      resourceType: "DRAFT",
      resourceId: d.id,
      metadata: { title: d.title, keyword: d.keyword },
      details: `Generated industrial draft "${d.title}".`,
    });
  }

  return NextResponse.json({ drafts: storedDrafts.map((d) => serializeDraft(d)) }, { status: 201 });
}
