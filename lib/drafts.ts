import type { Draft } from "@prisma/client";

export function serializeDraft(draft: Draft) {
  return {
    id: draft.id,
    title: draft.title,
    keyword: draft.keyword,
    summary: draft.summary,
    status: draft.status,
    reviewComment: draft.reviewComment,
    sections: JSON.parse(draft.sectionsJson) as Array<{ heading: string; body: string }>,
    faqs: JSON.parse(draft.faqsJson) as Array<{ q: string; a: string }>,
    schema: JSON.parse(draft.schemaJson) as Record<string, unknown>,
    createdAt: draft.createdAt.toISOString(),
    updatedAt: draft.updatedAt.toISOString(),
  };
}
