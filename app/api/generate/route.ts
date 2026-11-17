import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { serializeDraft } from "@/lib/drafts";
import { errorResponse } from "@/lib/http";

type GeneratedPage = {
  title: string;
  keyword: string;
  summary: string;
  sections: Array<{ heading: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
};

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

  if (!process.env.OPENAI_API_KEY) {
    return errorResponse("AI generation is not configured. Add OPENAI_API_KEY to your environment.", 503);
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

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.deepseek.com/v1").replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL ?? "deepseek-chat";
  const prompt = [
    "Create a batch of technical industrial B2B SaaS SEO landing page drafts.",
    "Return only valid JSON with this shape: {\"pages\":[{\"title\":\"string\",\"keyword\":\"string\",\"summary\":\"string\",\"sections\":[{\"heading\":\"string\",\"body\":\"string\"}],\"faqs\":[{\"q\":\"string\",\"a\":\"string\"}]}]}.",
    "Create exactly one page per provided topic, keep factual claims cautious, and do not invent customer results, certifications, or product capabilities.",
    "Each page needs 3-5 useful sections and 2-4 concise FAQs. Lead sections with a direct answer. Avoid generic filler.",
    `Company: ${user.organization.name}`,
    `Product: ${productDescription.trim()}`,
    `Industry: ${industry.trim()}`,
    `Keywords and examples: ${keywords.trim()}`,
    `Topics: ${JSON.stringify(topics)}`,
  ].join("\n");

  let providerResponse: Response;
  try {
    providerResponse = await fetch(`${baseUrl}/chat/completions`, {
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
  } catch (error) {
    console.error("AI provider request failed:", error);
    return errorResponse("AI provider could not be reached. Check the configured endpoint and try again.", 502);
  }

  if (!providerResponse.ok) {
    const detail = await providerResponse.text();
    console.error("AI provider returned an error:", providerResponse.status, detail);
    return errorResponse(`AI provider returned an error (${providerResponse.status}).`, 502);
  }

  const completion: unknown = await providerResponse.json();
  const choice = (completion as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0];
  if (typeof choice?.message?.content !== "string") {
    return errorResponse("AI provider returned an empty response.", 502);
  }

  let result: unknown;
  try {
    result = JSON.parse(choice.message.content);
  } catch {
    return errorResponse("AI provider returned content that was not valid JSON. Please retry.", 502);
  }

  const pages = (result as { pages?: unknown })?.pages;
  if (!Array.isArray(pages) || pages.length !== topics.length || !pages.every(isGeneratedPage)) {
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
          status: "in_review",
        },
      });
    }),
  );

  return NextResponse.json({ drafts: storedDrafts.map(serializeDraft) }, { status: 201 });
}
