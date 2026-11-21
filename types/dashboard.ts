export type TabKey =
  | "Mission Control"
  | "Taxonomy Matrix"
  | "QA Review Studio"
  | "Risk & Compliance"
  | "AEO Schema Hub"
  | "Publishing Pipeline"
  | "Competitor Displacer"
  | "GSC Performance"
  | "Global Standardizer"
  | "3D CAD Inspector"
  | "STEP CAD Extractor"
  | "Standards Localization"
  | "Enterprise SSO"
  | "Buyer Intent"
  | "Distributor Co-Marketing"
  | "Developer API"
  | "AI COGS & Router"
  | "Engineering Whitepapers"
  | "CRM Pipeline ROI"
  | "OEM MDF Billing"
  | "AI Share of Voice"
  | "Industrial Analytics"
  | "Workspace & Rules"
  | "Billing & Quotas"
  | "Internal Linking"
  | "Content Decay Alerts"
  | "Standards Fact-Checker"
  | "Programmatic Matrix"
  | "Claim Guardrails"
  | "Brand Voice"
  | "Regional Languages"
  | "Lead Attribution"
  | "AEO Prompt Tester"
  | "Scheduled Queue"
  | "White-Label Mode"
  | "Competitor URL Gaps"
  | "Ahrefs & SEMrush"
  | "Client ROI Report"
  | "Usage & Quotas"
  | "Taxonomy Expander"
  | "Mobile Review App"
  | "Section Regenerator"
  | "A/B Headlines"
  | "ERP Stock Router";

export type QAStatus = "Pass" | "Review" | "Fail";

export type ExpertReviewer = {
  id: string;
  name: string;
  jobTitle: string;
  credentials: string;
  yearsOfExperience: number;
  linkedInUrl?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
};

export type PageReview = {
  id?: string;
  draftId?: string;
  reviewerId: string;
  status: "PENDING" | "APPROVED" | "CHANGES_REQUESTED";
  reviewDate: string;
  reviewerNotes?: string | null;
  verificationItems: string[];
  reviewer?: ExpertReviewer | null;
};

export type Draft = {
  id: string | number;
  title: string;
  stage: "Suggested" | "Approved" | "In Review" | "Changes requested" | "Rejected" | "Published";
  keyword: string;
  qa: {
    wordCount: QAStatus;
    faqCount: QAStatus;
    ctaCount: QAStatus;
    linkAllowlist: QAStatus;
    uniqueness: QAStatus;
    fluffFilter: QAStatus;
    aeoCapsule: QAStatus;
    riskScore: QAStatus;
  };
  summary: string;
  sections: Array<{ heading: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
  schema: string;
  pageReview?: PageReview | null;
  createdAt?: string;
  updatedAt?: string;
  vertical?: string;
  equipment?: string;
  standard?: string;
  publishedUrl?: string | null;
};

export type NavItem = {
  label: TabKey;
  badge?: string;
  iconClass: string;
  adminOnly?: boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};
