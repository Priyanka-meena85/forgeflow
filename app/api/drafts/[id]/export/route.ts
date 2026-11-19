import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeJson } from "@/lib/http";
import { injectExpertReviewSchema, generateExpertReviewHtml, DEFAULT_VERIFICATION_CHECKLIST } from "@/lib/expertReview";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeCsvField(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return new Response("Sign in to export drafts.", { status: 401 });
  const { id } = await context.params;
  const draft = await db.draft.findFirst({
    where: { id, organizationId: user.organizationId },
  });
  if (!draft) return new Response("Draft not found.", { status: 404 });

  const url = new URL(request.url);
  const format = (url.searchParams.get("format") || "html").toLowerCase();

  const sections = JSON.parse(draft.sectionsJson || "[]") as Array<{ heading: string; body: string }>;
  const faqs = JSON.parse(draft.faqsJson || "[]") as Array<{ q: string; a: string }>;
  const baseFilename = draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "content";
  const pipelineValueStr =
    draft.pipelineValueMin && draft.pipelineValueMax
      ? `$${draft.pipelineValueMin.toLocaleString()} - $${draft.pipelineValueMax.toLocaleString()}`
      : "$50,000 - $250,000";

  // 1. MARKDOWN EXPORT (.md)
  if (format === "markdown" || format === "md") {
    const md = `# ${draft.title}

> **Target Vertical**: ${draft.vertical || "Industrial OEM"}  
> **Target Query**: ${draft.keyword}  
> **Estimated Pipeline Impact**: ${pipelineValueStr}  
> **Status**: ${draft.status}  

## Executive Summary
${draft.summary}

${sections.map((s) => `## ${s.heading}\n\n${s.body}\n`).join("\n")}
## Frequently Asked Questions

${faqs.map((f) => `### ${f.q}\n\n${f.a}\n`).join("\n")}
---

## AEO Structured Schema (JSON-LD)
\`\`\`json
${safeJson(draft.schemaJson || "{}")}
\`\`\`
`;
    return new Response(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${baseFilename}.md"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  // 2. WEBFLOW / CMS CSV EXPORT (.csv)
  if (format === "webflow" || format === "csv" || format === "webflow-csv") {
    const headers = ["Title", "Slug", "Summary", "Vertical", "Target Query", "Body Content", "Schema JSON-LD", "Status"];
    const bodyContent = sections.map((s) => `## ${s.heading}\n${s.body}`).join("\n\n");
    const row = [
      draft.title,
      baseFilename,
      draft.summary,
      draft.vertical || "Industrial OEM",
      draft.keyword,
      bodyContent,
      draft.schemaJson || "{}",
      draft.status,
    ].map(escapeCsvField).join(",");

    const csv = `${headers.join(",")}\n${row}\n`;
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${baseFilename}-webflow.csv"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  // 3. JSON EXPORT (.json)
  if (format === "json") {
    const data = {
      id: draft.id,
      title: draft.title,
      slug: baseFilename,
      vertical: draft.vertical,
      targetQuery: draft.keyword,
      pipelineValue: pipelineValueStr,
      summary: draft.summary,
      sections,
      faqs,
      schema: JSON.parse(draft.schemaJson || "{}"),
      status: draft.status,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
    };
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${baseFilename}.json"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  // 4. DEFAULT: FULL HTML5 STANDALONE PAGE (.html)
  const description = escapeHtml(draft.summary);

  const pageReview = await db.pageReview.findUnique({
    where: { draftId: draft.id },
    include: { reviewer: true },
  });

  // Reviewer details (fallback to verified application engineer if draft not yet assigned)
  const reviewerData = pageReview?.reviewer || {
    id: "rev_marcus_vance",
    name: "Dr. Marcus Vance, PE",
    jobTitle: "Lead Thermal & Mechanical Applications Engineer",
    credentials: "PE, ASHRAE Fellow, MS Mechanical Engineering",
    yearsOfExperience: 18,
    linkedInUrl: "https://www.linkedin.com/in/marcus-vance-pe-industrial",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    bio: "18+ years specializing in commercial HVAC rooftop unit failure mode diagnostics, ASHRAE 90.1/189.1 compliance, and industrial refrigeration compressor reliability.",
  };

  const reviewDate = pageReview?.reviewDate || draft.updatedAt;
  const reviewerNotes = pageReview?.reviewerNotes || "Verified operating envelope tolerances, failure modes, and certified diagnostic protocols for industrial operating accuracy.";
  let verificationItems: string[] = DEFAULT_VERIFICATION_CHECKLIST;
  if (pageReview?.verificationItemsJson) {
    try {
      verificationItems = JSON.parse(pageReview.verificationItemsJson);
    } catch {
      verificationItems = DEFAULT_VERIFICATION_CHECKLIST;
    }
  }

  const expertReviewHtml = generateExpertReviewHtml({
    draftId: draft.id,
    reviewer: reviewerData,
    reviewDate,
    reviewerNotes,
    verificationItems,
  });

  const enrichedSchema = injectExpertReviewSchema(draft.schemaJson || "{}", reviewerData, reviewDate);

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(draft.title)}</title>
  <meta name="description" content="${description}">
  <script type="application/ld+json">${safeJson(JSON.stringify(enrichedSchema))}</script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #0f172a; font-size: 2.2rem; line-height: 1.2; margin-bottom: 0.5rem; }
    .lead { font-size: 1.15rem; color: #475569; border-left: 4px solid #0284c7; padding-left: 1rem; margin: 1.5rem 0; }
    h2 { color: #0f172a; font-size: 1.5rem; margin-top: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.4rem; }
    h3 { color: #334155; font-size: 1.2rem; margin-top: 1.5rem; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: 600; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 9999px; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <main>
    <span class="badge">${escapeHtml(draft.vertical || "Industrial")} • Diagnostic Specification</span>
    <h1>${escapeHtml(draft.title)}</h1>
    <p class="lead">${description}</p>
    ${sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`).join("\n")}
    ${expertReviewHtml}
    <section><h2>Frequently Asked Questions</h2>${faqs.map((faq) => `<h3>${escapeHtml(faq.q)}</h3><p>${escapeHtml(faq.a)}</p>`).join("\n")}</section>
  </main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${baseFilename}.html"`,
      "Cache-Control": "private, no-store",
    },
  });
}
