import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeJson } from "@/lib/http";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return new Response("Sign in to export drafts.", { status: 401 });
  const { id } = await context.params;
  const draft = await db.draft.findFirst({
    where: { id, organizationId: user.organizationId },
  });
  if (!draft) return new Response("Draft not found.", { status: 404 });

  const sections = JSON.parse(draft.sectionsJson) as Array<{ heading: string; body: string }>;
  const faqs = JSON.parse(draft.faqsJson) as Array<{ q: string; a: string }>;
  const description = escapeHtml(draft.summary);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(draft.title)}</title>
  <meta name="description" content="${description}">
  <script type="application/ld+json">${safeJson(draft.schemaJson)}</script>
</head>
<body>
  <main>
    <h1>${escapeHtml(draft.title)}</h1>
    <p>${description}</p>
    ${sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`).join("\n")}
    <section><h2>Frequently asked questions</h2>${faqs.map((faq) => `<h3>${escapeHtml(faq.q)}</h3><p>${escapeHtml(faq.a)}</p>`).join("\n")}</section>
  </main>
</body>
</html>`;
  const filename = draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "content";
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.html"`,
      "Cache-Control": "private, no-store",
    },
  });
}
