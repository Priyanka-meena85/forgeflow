import type { Draft } from "@prisma/client";

export interface SerializedDraftReview {
  id?: string;
  reviewerId: string;
  status: "PENDING" | "APPROVED" | "CHANGES_REQUESTED";
  reviewDate: string;
  reviewerNotes: string | null;
  verificationItems: string[];
  reviewer: {
    id: string;
    name: string;
    jobTitle: string;
    credentials: string;
    yearsOfExperience: number;
    linkedInUrl: string | null;
    photoUrl: string | null;
    bio: string | null;
  } | null;
}

export interface SerializedDraft {
  id: string;
  organizationId: string;
  title: string;
  keyword: string;
  vertical: string | null;
  targetEquipment: string | null;
  complianceStandard: string | null;
  summary: string;
  status: string;
  reviewComment: string | null;
  specRiskScore: number | null;
  pipelineValueMin: number | null;
  pipelineValueMax: number | null;
  searchVolume: string | null;
  publishedAt: string | null;
  publishedUrl: string | null;
  sections: Array<{ heading: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
  schema: Record<string, unknown>;
  pageReview?: SerializedDraftReview | null;
  qaScores: {
    wordCount: "Pass" | "Fail";
    faqCount: "Pass" | "Fail";
    ctaCount: "Pass" | "Fail";
    linkAllowlist: "Pass" | "Fail";
    uniqueness: "Pass" | "Fail";
    fluffFilter: "Pass" | "Fail";
    aeoCapsule: "Pass" | "Fail";
    riskScore: "Low" | "Review" | "High";
  };
  createdAt: string;
  updatedAt: string;
}

function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function serializeDraft(
  draft: Draft,
  review?: SerializedDraftReview | null | unknown,
): SerializedDraft {
  const actualReview =
    review && typeof review === "object" && "status" in review
      ? (review as SerializedDraftReview)
      : null;
  const defaultQa = {
    wordCount: "Pass" as const,
    faqCount: "Pass" as const,
    ctaCount: "Pass" as const,
    linkAllowlist: "Pass" as const,
    uniqueness: "Pass" as const,
    fluffFilter: "Pass" as const,
    aeoCapsule: "Pass" as const,
    riskScore: "Low" as const,
  };

  return {
    id: draft.id,
    organizationId: draft.organizationId,
    title: draft.title,
    keyword: draft.keyword,
    vertical: draft.vertical,
    targetEquipment: draft.targetEquipment,
    complianceStandard: draft.complianceStandard,
    summary: draft.summary,
    status: draft.status,
    reviewComment: draft.reviewComment,
    specRiskScore: draft.specRiskScore,
    pipelineValueMin: draft.pipelineValueMin,
    pipelineValueMax: draft.pipelineValueMax,
    searchVolume: draft.searchVolume,
    publishedAt: draft.publishedAt ? draft.publishedAt.toISOString() : null,
    publishedUrl: draft.publishedUrl,
    sections: safeJsonParse<Array<{ heading: string; body: string }>>(draft.sectionsJson, []),
    faqs: safeJsonParse<Array<{ q: string; a: string }>>(draft.faqsJson, []),
    schema: safeJsonParse<Record<string, unknown>>(draft.schemaJson, {}),
    pageReview: actualReview ?? null,
    qaScores: safeJsonParse<typeof defaultQa>(draft.qaScoresJson, defaultQa),
    createdAt: draft.createdAt.toISOString(),
    updatedAt: draft.updatedAt.toISOString(),
  };
}
