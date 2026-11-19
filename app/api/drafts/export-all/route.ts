import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeJson } from "@/lib/http";

function escapeCsvField(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return new Response("Sign in to export drafts.", { status: 401 });

  const url = new URL(request.url);
  const format = (url.searchParams.get("format") || "csv").toLowerCase();

  const drafts = await db.draft.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
  });

  const timestamp = new Date().toISOString().slice(0, 10);

  // 1. BULK CSV EXPORT (WEBFLOW & CMS COMPATIBLE)
  if (format === "csv" || format === "webflow") {
    const headers = [
      "ID",
      "Title",
      "Slug",
      "Status",
      "Review Status",
      "Reviewed By",
      "Vertical",
      "Target Query",
      "Pipeline Min",
      "Pipeline Max",
      "Summary",
      "Body Sections",
      "FAQs",
      "Schema JSON-LD",
      "Created At",
    ];

    const rows = await Promise.all(
      drafts.map(async (d) => {
        const pageReview = await db.pageReview.findUnique({
          where: { draftId: d.id },
          include: { reviewer: true },
        });

        const slug = d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const sections = JSON.parse(d.sectionsJson || "[]") as Array<{ heading: string; body: string }>;
        const faqs = JSON.parse(d.faqsJson || "[]") as Array<{ q: string; a: string }>;
        const bodyContent = sections.map((s) => `## ${s.heading}\n${s.body}`).join("\n\n");
        const faqsContent = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

        return [
          d.id,
          d.title,
          slug,
          d.status,
          pageReview ? pageReview.status : "NOT_REVIEWED",
          pageReview?.reviewer?.name || "Unassigned",
          d.vertical || "Industrial OEM",
          d.keyword,
          String(d.pipelineValueMin || 0),
          String(d.pipelineValueMax || 0),
          d.summary,
          bodyContent,
          faqsContent,
          d.schemaJson || "{}",
          d.createdAt.toISOString(),
        ].map(escapeCsvField).join(",");
      }),
    );

    const csv = `${headers.join(",")}\n${rows.join("\n")}\n`;
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="forgeflow-batch-export-${timestamp}.csv"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  // 2. BULK MARKDOWN BUNDLE (.md)
  if (format === "markdown" || format === "md") {
    const mdBundle = drafts.map((d) => {
      const sections = JSON.parse(d.sectionsJson || "[]") as Array<{ heading: string; body: string }>;
      const faqs = JSON.parse(d.faqsJson || "[]") as Array<{ q: string; a: string }>;
      return `# ${d.title}

- **ID**: \`${d.id}\`
- **Status**: ${d.status}
- **Vertical**: ${d.vertical || "Industrial OEM"}
- **Target Query**: \`${d.keyword}\`
- **Pipeline Value**: $${(d.pipelineValueMin || 0).toLocaleString()} - $${(d.pipelineValueMax || 0).toLocaleString()}

## Summary
${d.summary}

${sections.map((s) => `### ${s.heading}\n\n${s.body}\n`).join("\n")}

### Frequently Asked Questions
${faqs.map((f) => `#### ${f.q}\n${f.a}\n`).join("\n")}

### JSON-LD Schema
\`\`\`json
${safeJson(d.schemaJson || "{}")}
\`\`\`

---
`;
    }).join("\n\n");

    return new Response(mdBundle, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="forgeflow-batch-${timestamp}.md"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  // 3. BULK JSON EXPORT
  const jsonOutput = await Promise.all(
    drafts.map(async (d) => {
      const pageReview = await db.pageReview.findUnique({
        where: { draftId: d.id },
        include: { reviewer: true },
      });

      return {
        id: d.id,
        title: d.title,
        slug: d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        status: d.status,
        reviewStatus: pageReview ? pageReview.status : "NOT_REVIEWED",
        reviewedBy: pageReview?.reviewer ? pageReview.reviewer.name : null,
        vertical: d.vertical,
        keyword: d.keyword,
        pipelineValueMin: d.pipelineValueMin,
        pipelineValueMax: d.pipelineValueMax,
        summary: d.summary,
        sections: JSON.parse(d.sectionsJson || "[]"),
        faqs: JSON.parse(d.faqsJson || "[]"),
        schema: JSON.parse(d.schemaJson || "{}"),
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };
    }),
  );

  return new Response(JSON.stringify(jsonOutput, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="forgeflow-batch-${timestamp}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
