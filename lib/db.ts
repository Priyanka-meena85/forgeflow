import { PrismaClient, UserRole, DraftStatus, InvitationStatus, ReviewStatus } from "@prisma/client";
import net from "net";

// Ensure process.env.DATABASE_URL is populated for PostgreSQL with PgBouncer tuning
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  let base = envUrl && envUrl.trim() && !envUrl.startsWith("file:")
    ? envUrl.trim()
    : "postgresql://postgres:postgres@localhost:5432/industrial_seo_saas?schema=public";

  // Enterprise PgBouncer & High-Availability Connection Pool Sizing
  if (base.startsWith("postgresql://") && !base.includes("connection_limit")) {
    const separator = base.includes("?") ? "&" : "?";
    base = `${base}${separator}pgbouncer=true&connection_limit=20&pool_timeout=10`;
  }
  return base;
}

const dbUrl = resolveDatabaseUrl();
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
  process.env.DATABASE_URL = dbUrl;
}

// -----------------------------------------------------------------------------
// Row-Level Security (RLS) & Multi-Tenant Context Isolation
// -----------------------------------------------------------------------------
interface TenantIsolationContext {
  activeTenantId: string | null;
}

const currentTenantContext: TenantIsolationContext = {
  activeTenantId: null,
};

export function setTenantContext(organizationId: string | null) {
  currentTenantContext.activeTenantId = organizationId;
}

export function getTenantContext(): string | null {
  return currentTenantContext.activeTenantId;
}

export async function withTenantContext<T>(organizationId: string, fn: () => Promise<T>): Promise<T> {
  const previous = currentTenantContext.activeTenantId;
  currentTenantContext.activeTenantId = organizationId;
  try {
    return await fn();
  } finally {
    currentTenantContext.activeTenantId = previous;
  }
}

// -----------------------------------------------------------------------------
// In-Memory Fallback Interfaces (Matches Prisma PostgreSQL Models Exactly)
// -----------------------------------------------------------------------------
export interface FallbackOrg {
  id: string;
  name: string;
  slug: string | null;
  website: string | null;
  productDescription: string | null;
  industry: string | null;
  keywords: string | null;
  plan: string;
  subscriptionStatus?: string | null;
  monthlyPagesLimit?: number;
  monthlyPagesUsed?: number;
  billingCycleStart?: Date;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  complianceRulesJson: string | null;
  brandVoiceJson: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackUser {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  role: UserRole;
  emailVerified: Date | null;
  image: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  organization?: FallbackOrg | null;
}

export interface FallbackMembership {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  user?: FallbackUser | null;
  organization?: FallbackOrg | null;
}

export interface FallbackSession {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  user?: (FallbackUser & { organization?: FallbackOrg | null }) | null;
}

export interface FallbackVerificationToken {
  id: string;
  tokenHash: string;
  userId: string;
  email: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface FallbackPasswordResetToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface FallbackInvitation {
  id: string;
  tokenHash: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  organizationId: string;
  invitedById: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  organization?: FallbackOrg | null;
  invitedBy?: FallbackUser | null;
}

export interface FallbackDraft {
  id: string;
  organizationId: string;
  authorId: string | null;
  title: string;
  keyword: string;
  vertical: string | null;
  targetEquipment: string | null;
  complianceStandard: string | null;
  summary: string;
  sectionsJson: string;
  faqsJson: string;
  schemaJson: string;
  status: DraftStatus;
  qaScoresJson: string | null;
  specRiskScore: number | null;
  pipelineValueMin: number | null;
  pipelineValueMax: number | null;
  searchVolume: string | null;
  reviewComment: string | null;
  publishedAt: Date | null;
  publishedUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackContentRevision {
  id: string;
  draftId: string;
  revisionNumber: number;
  title: string;
  sectionsJson: string;
  faqsJson: string;
  schemaJson: string;
  qaScoresJson: string | null;
  changeSummary: string | null;
  changedById: string | null;
  createdAt: Date;
}

export interface FallbackAuditLog {
  id: string;
  organizationId: string;
  userId: string | null;
  userRole?: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadataJson: string | null;
  diffJson?: string | null;
  detailsJson?: string | null;
  ipAddress: string | null;
  createdAt: Date;
}

export interface FallbackGenerationJob {
  id: string;
  organizationId: string;
  userId: string | null;
  status: string;
  progress: number;
  currentStep: string;
  totalItems: number;
  completedItems: number;
  inputDataJson: string;
  resultDraftIdsJson: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackExpertReviewer {
  id: string;
  organizationId: string;
  name: string;
  jobTitle: string;
  credentials: string;
  yearsOfExperience: number;
  linkedInUrl: string | null;
  photoUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackPageReview {
  id: string;
  draftId: string;
  reviewerId: string;
  status: ReviewStatus;
  reviewDate: Date;
  reviewerNotes: string | null;
  verificationItemsJson: string | null;
  createdAt: Date;
  updatedAt: Date;
  reviewer?: FallbackExpertReviewer | null;
}

export interface FallbackSpecDocument {
  id: string;
  organizationId: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  extractedContent: string;
  extractedNodesJson: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackCmsIntegration {
  id: string;
  organizationId: string;
  provider: string;
  name: string;
  endpointUrl: string;
  apiKey: string | null;
  targetCollectionId: string | null;
  status: string;
  autoPublishApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackAeoTrackerQuery {
  id: string;
  organizationId: string;
  draftId: string | null;
  keyword: string;
  targetUrl: string;
  googleAeoCited: boolean;
  googleAeoPosition: number | null;
  perplexityCited: boolean;
  perplexityCitationIndex: number | null;
  chatGptIndexed: boolean;
  aiSnippetSummary: string | null;
  lastCheckedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackInvoiceRequest {
  id: string;
  organizationId: string;
  companyName: string;
  billingContactName: string;
  billingEmail: string;
  purchaseOrderNumber: string | null;
  taxIdOrGst: string | null;
  plan: string;
  amountUsd: number;
  paymentTerms: string;
  status: string;
  invoicePdfUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackStore {
  organizations: Map<string, FallbackOrg>;
  users: Map<string, FallbackUser>;
  memberships: Map<string, FallbackMembership>;
  sessions: Map<string, FallbackSession>;
  verificationTokens: Map<string, FallbackVerificationToken>;
  passwordResetTokens: Map<string, FallbackPasswordResetToken>;
  invitations: Map<string, FallbackInvitation>;
  drafts: Map<string, FallbackDraft>;
  contentRevisions: Map<string, FallbackContentRevision>;
  auditLogs: Map<string, FallbackAuditLog>;
  expertReviewers: Map<string, FallbackExpertReviewer>;
  pageReviews: Map<string, FallbackPageReview>;
  generationJobs: Map<string, FallbackGenerationJob>;
  specDocuments: Map<string, FallbackSpecDocument>;
  cmsIntegrations: Map<string, FallbackCmsIntegration>;
  aeoTrackerQueries: Map<string, FallbackAeoTrackerQuery>;
  invoiceRequests: Map<string, FallbackInvoiceRequest>;
}

interface ForgeFlowGlobalStore {
  __forgeflow_store__?: FallbackStore;
  prisma?: PrismaClient;
  __forgeflow_pg_available__?: boolean;
  __forgeflow_last_pg_check__?: number;
  __forgeflow_pg_probing__?: boolean;
}

const globalStore = globalThis as unknown as ForgeFlowGlobalStore;

function parseDbHostPort(rawUrl: string): { host: string; port: number } {
  try {
    const url = new URL(rawUrl);
    return {
      host: url.hostname || "localhost",
      port: parseInt(url.port || "5432", 10),
    };
  } catch {
    return { host: "localhost", port: 5432 };
  }
}

function probeSocket(host: string, port: number, timeoutMs = 80): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;

    socket.setTimeout(timeoutMs);

    socket.on("connect", () => {
      resolved = true;
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.on("error", () => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(false);
      }
    });

    try {
      socket.connect(port, host);
    } catch {
      resolve(false);
    }
  });
}

async function checkPostgresAvailability(force = false): Promise<boolean> {
  const now = Date.now();
  const lastCheck = globalStore.__forgeflow_last_pg_check__ ?? 0;
  if (!force && now - lastCheck < 60000 && typeof globalStore.__forgeflow_pg_available__ === "boolean") {
    return globalStore.__forgeflow_pg_available__;
  }

  if (globalStore.__forgeflow_pg_probing__) {
    return globalStore.__forgeflow_pg_available__ ?? false;
  }

  globalStore.__forgeflow_pg_probing__ = true;
  try {
    const { host, port } = parseDbHostPort(resolveDatabaseUrl());
    const isUp = await probeSocket(host, port, 80);
    globalStore.__forgeflow_pg_available__ = isUp;
    globalStore.__forgeflow_last_pg_check__ = Date.now();
    return isUp;
  } catch {
    globalStore.__forgeflow_pg_available__ = false;
    globalStore.__forgeflow_last_pg_check__ = Date.now();
    return false;
  } finally {
    globalStore.__forgeflow_pg_probing__ = false;
  }
}

// Default to false synchronously to guarantee zero-latency execution; probe asynchronously
if (typeof globalStore.__forgeflow_pg_available__ === "undefined") {
  globalStore.__forgeflow_pg_available__ = false;
  globalStore.__forgeflow_last_pg_check__ = 0;
  void checkPostgresAvailability(true);
}

const store: FallbackStore = globalStore.__forgeflow_store__ ?? {
  organizations: new Map(),
  users: new Map(),
  memberships: new Map(),
  sessions: new Map(),
  verificationTokens: new Map(),
  passwordResetTokens: new Map(),
  invitations: new Map(),
  drafts: new Map(),
  contentRevisions: new Map(),
  auditLogs: new Map(),
  expertReviewers: new Map(),
  pageReviews: new Map(),
  generationJobs: new Map(),
  specDocuments: new Map(),
  cmsIntegrations: new Map(),
  aeoTrackerQueries: new Map(),
  invoiceRequests: new Map(),
};
globalStore.__forgeflow_store__ = store;

// Default Seed Reviewers for immediate out-of-the-box readiness
const defaultSeedReviewers: FallbackExpertReviewer[] = [
  {
    id: "rev_marcus_vance",
    organizationId: "global",
    name: "Dr. Marcus Vance, PE",
    jobTitle: "Lead Thermal & Mechanical Applications Engineer",
    credentials: "PE, ASHRAE Fellow, MS Mechanical Engineering",
    yearsOfExperience: 18,
    linkedInUrl: "https://www.linkedin.com/in/marcus-vance-pe-industrial",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    bio: "18+ years specializing in commercial HVAC rooftop unit failure mode diagnostics, ASHRAE 90.1/189.1 compliance, and industrial refrigeration compressor reliability.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "rev_elena_rostova",
    organizationId: "global",
    name: "Elena Rostova",
    jobTitle: "Principal Industrial Systems & Reliability Lead",
    credentials: "Six Sigma Black Belt, IATF 16949 Lead Auditor",
    yearsOfExperience: 14,
    linkedInUrl: "https://www.linkedin.com/in/elena-rostova-industrial-qa",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    bio: "14 years conducting root-cause failure analysis for automotive stamping presses, sanitary rotary pumps, and polymer extrusion machinery under ISO 9001 and 3-A standards.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "rev_david_chen",
    organizationId: "global",
    name: "David Chen, CMRP",
    jobTitle: "Senior Fluid Power & Hydraulics Specialist",
    credentials: "CMRP, CFPS (Fluid Power Specialist)",
    yearsOfExperience: 12,
    linkedInUrl: "https://www.linkedin.com/in/david-chen-fluid-power",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    bio: "Certified fluid power specialist focusing on high-pressure hydraulic piston pump cavitation, ISO 4406 cleanliness standards, and industrial automation safety protocols.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

for (const reviewer of defaultSeedReviewers) {
  if (!store.expertReviewers.has(reviewer.id)) {
    store.expertReviewers.set(reviewer.id, reviewer);
  }
}

// Default Seed Organization & Users for immediate out-of-the-box readiness
const defaultSeedOrg: FallbackOrg = {
  id: "seed-org-industrial",
  name: "AccuDrive Reliability Systems",
  slug: "accudrive",
  industry: "Automotive & Industrial Automation",
  website: "https://accudrive.example.com",
  productDescription: "Industrial fault detection, vibration monitoring, and predictive reliability engineering suite for automotive tier-1 manufacturing lines.",
  keywords: "servo stamping press galling, weld inspection defects, IATF 16949 compliance, predictive maintenance",
  plan: "fleet",
  subscriptionStatus: "active",
  monthlyPagesLimit: 100,
  monthlyPagesUsed: 1,
  billingCycleStart: new Date(),
  stripeCustomerId: "cus_sample_industrial_001",
  stripeSubscriptionId: "sub_sample_fleet_001",
  complianceRulesJson: null,
  brandVoiceJson: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

if (!store.organizations.has(defaultSeedOrg.id)) {
  store.organizations.set(defaultSeedOrg.id, defaultSeedOrg);
}

const defaultSeedOrgPriyanka: FallbackOrg = {
  id: "org_priyanka_dsd",
  name: "dsd",
  slug: "dsd",
  industry: "Industrial Automation & Manufacturing",
  website: "https://dsd-industrial.example.com",
  productDescription: "Industrial reliability engineering, automated asset health monitoring, and precision manufacturing systems.",
  keywords: "predictive maintenance, ISO 9001 compliance, manufacturing automation, asset uptime",
  plan: "fleet",
  subscriptionStatus: "active",
  monthlyPagesLimit: 100,
  monthlyPagesUsed: 0,
  billingCycleStart: new Date(),
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  complianceRulesJson: null,
  brandVoiceJson: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

if (!store.organizations.has(defaultSeedOrgPriyanka.id)) {
  store.organizations.set(defaultSeedOrgPriyanka.id, defaultSeedOrgPriyanka);
}

const defaultSeedUsers: FallbackUser[] = [
  {
    id: "seed-usr-priyanka",
    email: "priyankameena4656@gmail.com",
    name: "Priyanka Meena (Enterprise Owner)",
    passwordHash: "1c38c567b07e10db866e982d91cb13af:0d26fb5b7d042b3eb8aeb9379ae0d5966eaf8e9135314eac1112ed86c83b5e1c312f1756943d0006074f2b6077811345b62de1c06efde834c9804a25b554a66e",
    role: UserRole.OWNER,
    emailVerified: new Date(),
    image: null,
    organizationId: defaultSeedOrgPriyanka.id,
    organization: defaultSeedOrgPriyanka,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "seed-usr-admin",
    email: "admin@accudrive.io",
    name: "Alex Vance (Plant Reliability Lead)",
    passwordHash: "987ccf6c861ae89642d82ee853b102c5:d18e4a2208da6fe77c40d4030df18a542c787dac9807a6e55f1a69bb1b2211ecf67d7ccef8f02ef536d47c3e1b679d58340913f148dc7ef941302f0694084b45",
    role: UserRole.OWNER,
    emailVerified: new Date(),
    image: null,
    organizationId: defaultSeedOrg.id,
    organization: defaultSeedOrg,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "seed-usr-reviewer",
    email: "marcus.vance@accudrive.io",
    name: "Dr. Marcus Vance, PE",
    passwordHash: "987ccf6c861ae89642d82ee853b102c5:d18e4a2208da6fe77c40d4030df18a542c787dac9807a6e55f1a69bb1b2211ecf67d7ccef8f02ef536d47c3e1b679d58340913f148dc7ef941302f0694084b45",
    role: UserRole.REVIEWER,
    emailVerified: new Date(),
    image: null,
    organizationId: defaultSeedOrg.id,
    organization: defaultSeedOrg,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "seed-usr-author",
    email: "content.lead@accudrive.io",
    name: "Sarah Jenkins (Technical Writer)",
    passwordHash: "987ccf6c861ae89642d82ee853b102c5:d18e4a2208da6fe77c40d4030df18a542c787dac9807a6e55f1a69bb1b2211ecf67d7ccef8f02ef536d47c3e1b679d58340913f148dc7ef941302f0694084b45",
    role: UserRole.AUTHOR,
    emailVerified: new Date(),
    image: null,
    organizationId: defaultSeedOrg.id,
    organization: defaultSeedOrg,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

for (const u of defaultSeedUsers) {
  if (!store.users.has(u.id)) {
    store.users.set(u.id, u);
  }
}

// Default Seed Draft & Review for immediate testing & demonstration
const defaultSeedDraft: FallbackDraft = {
  id: "seed-draft-automotive",
  organizationId: defaultSeedOrg.id,
  authorId: "seed-usr-author",
  title: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects in IATF 16949 Assembly Lines",
  keyword: "servo stamping press die galling IATF 16949",
  vertical: "Automotive & Tier-1 Stamping",
  targetEquipment: "Servo Stamping Press",
  complianceStandard: "IATF 16949 Standard",
  summary: "Deterministic engineering protocol for automotive plant reliability managers preventing die galling and weld inspection non-conformances in IATF 16949 certified production lines.",
  sectionsJson: JSON.stringify([
    { heading: "01. Galling Mechanism in High-Strength Stamping (DP600/DP800)", body: "Micro-welding failure analysis at boundary friction contact points during high-velocity progressive stamping." },
    { heading: "02. Punch-to-Die Clearance Calibration SOP", body: "Calculated 8-10% material thickness clearance envelope to prevent burr formation and excessive tooling wear." },
  ]),
  faqsJson: JSON.stringify([
    { q: "What is the recommended die surface coating?", a: "PVD CrN or TiAlN multi-layer coatings rated above 3,000 HV." },
  ]),
  schemaJson: JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [{ "@type": "TechArticle", "headline": "Root Cause Protocol: Stamping Die Galling" }],
  }),
  status: DraftStatus.APPROVED,
  qaScoresJson: JSON.stringify({ passed: true, overallScore: 98, riskScore: "Low" }),
  specRiskScore: 0.05,
  pipelineValueMin: 150000,
  pipelineValueMax: 600000,
  searchVolume: "20-40/mo",
  reviewComment: "Verified compliant with IATF 16949 SOP and AEO readiness gates.",
  publishedAt: null,
  publishedUrl: null,
  createdAt: new Date(Date.now() - 3600000 * 24),
  updatedAt: new Date(Date.now() - 3600000 * 2),
};

if (!store.drafts.has(defaultSeedDraft.id)) {
  store.drafts.set(defaultSeedDraft.id, defaultSeedDraft);
}

const defaultSeedPageReview: FallbackPageReview = {
  id: "seed-prv-automotive",
  draftId: defaultSeedDraft.id,
  reviewerId: "rev_marcus_vance",
  status: ReviewStatus.APPROVED,
  reviewDate: new Date(Date.now() - 3600000 * 2),
  reviewerNotes: "Verified compliant with IATF 16949 SOP, AISE Technical Report No. 9, and AEO structured data standards.",
  verificationItemsJson: JSON.stringify([
    "Spec Accuracy: Verified punch-to-die 8-10% clearance against OEM manual.",
    "Operating Tolerances: Confirmed pressure and fatigue thresholds.",
    "AEO Schema Validity: Validated multi-entity JSON-LD graphs with reviewedBy Person entity.",
  ]),
  createdAt: new Date(Date.now() - 3600000 * 2),
  updatedAt: new Date(Date.now() - 3600000 * 2),
};

if (!store.pageReviews.has(defaultSeedDraft.id)) {
  store.pageReviews.set(defaultSeedDraft.id, defaultSeedPageReview);
}

// Initial Audit Trail Seeds
const defaultSeedAuditLogs: FallbackAuditLog[] = [
  {
    id: "log_initial_1",
    organizationId: defaultSeedOrg.id,
    userId: "seed-usr-reviewer",
    userRole: "REVIEWER",
    action: "SPEC_APPROVED",
    resourceType: "DRAFT",
    resourceId: "seed-draft-automotive",
    metadataJson: JSON.stringify({ reviewerName: "Dr. Marcus Vance, PE", checklistPassed: 4, standard: "IATF 16949" }),
    diffJson: null,
    detailsJson: JSON.stringify({ summary: "Verified stamping die tolerances & IATF 16949 inspection criteria." }),
    ipAddress: "127.0.0.1",
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: "log_initial_2",
    organizationId: defaultSeedOrg.id,
    userId: "seed-usr-admin",
    userRole: "OWNER",
    action: "DRAFT_PUBLISHED",
    resourceType: "DRAFT",
    resourceId: "seed-draft-automotive",
    metadataJson: JSON.stringify({ publishedUrl: "https://accudrive.example.com/articles/stamping-die-galling", targetCms: "Webflow" }),
    diffJson: null,
    detailsJson: JSON.stringify({ summary: "Published approved automotive stamping diagnostic protocol to Webflow CMS." }),
    ipAddress: "127.0.0.1",
    createdAt: new Date(Date.now() - 3600000 * 1),
  },
];

for (const l of defaultSeedAuditLogs) {
  if (!store.auditLogs.has(l.id)) {
    store.auditLogs.set(l.id, l);
  }
}

// Default Seed Spec Documents (Feature 1: RAG Engine)
const defaultSeedSpecDocuments: FallbackSpecDocument[] = [
  {
    id: "doc_carrier_rtu_48hc",
    organizationId: defaultSeedOrg.id,
    title: "Carrier WeatherMaster 48HC RTU Service Manual",
    fileName: "Carrier-48HC-Service-Manual-Tolerances.pdf",
    fileSize: 4210000,
    fileType: "application/pdf",
    extractedContent: "ASHRAE Standard 90.1 Rooftop Unit Operating Tolerances. Suction pressure range: 118-132 psig for R-410A. Normal suction superheat: 10°F to 14°F at standard ambient rating condition (95°F outdoor). Compressor floodback limit: Liquid slugging risk increases when superheat drops below 6°F for >120 continuous operating seconds. Crankcase heater must maintain sump temperature minimum 20°F above saturated suction temperature.",
    extractedNodesJson: JSON.stringify([
      { category: "TOLERANCE", parameter: "Suction Superheat", min: "10°F", max: "14°F", unit: "deg_F" },
      { category: "PRESSURE", parameter: "Suction Operating Pressure", min: "118 psig", max: "132 psig", unit: "psig" },
      { category: "CRITICAL_LIMIT", parameter: "Liquid Floodback Threshold", threshold: "< 6°F superheat for 120s" },
      { category: "STANDARD", parameter: "AHRI 340/360 & ASHRAE 90.1", compliance: "Mandatory Commercial" },
    ]),
    status: "PARSED",
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 48),
  },
  {
    id: "doc_accudrive_servo_die",
    organizationId: defaultSeedOrg.id,
    title: "AccuDrive SV-5000 Stamping Servo Calibration Spec",
    fileName: "AccuDrive-SV-5000-Die-Clearance-SOP.pdf",
    fileSize: 2840000,
    fileType: "application/pdf",
    extractedContent: "IATF 16949 Section 8.5.1 Progressive Die Galling Prevention. Maximum allowable punching die clearance tolerance: 8% to 10% of material thickness for high-strength steel (DP600/DP800). Maximum press ram tilt: 0.03 mm/m under 500-ton eccentric load. Lubricant film thickness minimum: 1.8 microns applied at 60 psi atomization pressure.",
    extractedNodesJson: JSON.stringify([
      { category: "TOLERANCE", parameter: "Die Punch Clearance", min: "8%", max: "10%", unit: "material_thickness_pct" },
      { category: "DEFLECTION", parameter: "Ram Parallelism Tilt", max: "0.03 mm/m", unit: "mm_per_m" },
      { category: "LUBRICATION", parameter: "Boundary Film Thickness", min: "1.8 microns", pressure: "60 psi" },
      { category: "STANDARD", parameter: "IATF 16949 & AISE Technical Report No. 9", compliance: "Automotive Tier 1" },
    ]),
    status: "PARSED",
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 24),
  },
];

for (const d of defaultSeedSpecDocuments) {
  if (!store.specDocuments.has(d.id)) {
    store.specDocuments.set(d.id, d);
  }
}

// Default Seed CMS Integrations (Feature 2: 1-Click Publishing)
const defaultSeedCmsIntegrations: FallbackCmsIntegration[] = [
  {
    id: "cms_webflow_portal",
    organizationId: defaultSeedOrg.id,
    provider: "WEBFLOW",
    name: "Webflow (AccuDrive Plant Engineering Hub)",
    endpointUrl: "https://api.webflow.com/v2/collections/658b1a8f9c0e2a3b4c5d6e7f/items",
    apiKey: "wfl_live_accudrive_sample_secret_key",
    targetCollectionId: "col_plant_articles_01",
    status: "ACTIVE",
    autoPublishApproved: true,
    createdAt: new Date(Date.now() - 3600000 * 72),
    updatedAt: new Date(Date.now() - 3600000 * 72),
  },
  {
    id: "cms_hubspot_oem",
    organizationId: defaultSeedOrg.id,
    provider: "HUBSPOT",
    name: "HubSpot CMS (OEM Knowledge Base)",
    endpointUrl: "https://api.hubapi.com/cms/v3/blogs/posts",
    apiKey: "pat-na1-sample-hubspot-token",
    targetCollectionId: "hubspot_blog_2026",
    status: "ACTIVE",
    autoPublishApproved: false,
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 48),
  },
  {
    id: "cms_wordpress_rest",
    organizationId: defaultSeedOrg.id,
    provider: "WORDPRESS",
    name: "WordPress REST API (Technical Journal)",
    endpointUrl: "https://journal.accudrive.example.com/wp-json/wp/v2/posts",
    apiKey: "wp_app_pass_xyz123",
    targetCollectionId: "category_reliability_eng",
    status: "ACTIVE",
    autoPublishApproved: false,
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 24),
  },
];

for (const c of defaultSeedCmsIntegrations) {
  if (!store.cmsIntegrations.has(c.id)) {
    store.cmsIntegrations.set(c.id, c);
  }
}

// Default Seed AEO Citation Queries (Feature 3: Live AEO Citation Tracker)
const defaultSeedAeoQueries: FallbackAeoTrackerQuery[] = [
  {
    id: "aeo_rtu_floodback",
    organizationId: defaultSeedOrg.id,
    draftId: "seed-draft-automotive",
    keyword: "commercial RTU suction floodback symptoms",
    targetUrl: "https://accudrive.example.com/articles/stamping-die-galling",
    googleAeoCited: true,
    googleAeoPosition: 1,
    perplexityCited: true,
    perplexityCitationIndex: 1,
    chatGptIndexed: true,
    aiSnippetSummary: "AccuDrive's diagnostic protocol is cited as the primary engineering source for rooftop unit compressor liquid slugging prevention tolerances.",
    lastCheckedAt: new Date(Date.now() - 3600000 * 4),
    createdAt: new Date(Date.now() - 3600000 * 72),
    updatedAt: new Date(Date.now() - 3600000 * 4),
  },
  {
    id: "aeo_iatf_die_galling",
    organizationId: defaultSeedOrg.id,
    draftId: "seed-draft-automotive",
    keyword: "IATF 16949 servo press die galling tolerances",
    targetUrl: "https://accudrive.example.com/articles/stamping-die-galling",
    googleAeoCited: true,
    googleAeoPosition: 1,
    perplexityCited: true,
    perplexityCitationIndex: 2,
    chatGptIndexed: true,
    aiSnippetSummary: "Cited in Google AI Overview for progressive die clearance calculation rules and PVD TiAlN coating hardness thresholds.",
    lastCheckedAt: new Date(Date.now() - 3600000 * 6),
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 6),
  },
  {
    id: "aeo_pump_cavitation",
    organizationId: defaultSeedOrg.id,
    draftId: null,
    keyword: "hydraulic piston pump cavitation ISO 4406",
    targetUrl: "https://accudrive.example.com/articles/hydraulic-pump-cavitation",
    googleAeoCited: true,
    googleAeoPosition: 2,
    perplexityCited: true,
    perplexityCitationIndex: 1,
    chatGptIndexed: true,
    aiSnippetSummary: "Perplexity Copilot referenced AccuDrive's fluid power diagnostic table as authoritative for ISO 4406 solid contaminant particle counting.",
    lastCheckedAt: new Date(Date.now() - 3600000 * 12),
    createdAt: new Date(Date.now() - 3600000 * 36),
    updatedAt: new Date(Date.now() - 3600000 * 12),
  },
];

for (const q of defaultSeedAeoQueries) {
  if (!store.aeoTrackerQueries.has(q.id)) {
    store.aeoTrackerQueries.set(q.id, q);
  }
}

// Default Seed Invoice Requests (Feature 5: Net-30 Enterprise Procurement)
const defaultSeedInvoices: FallbackInvoiceRequest[] = [
  {
    id: "inv_po_2026_8941",
    organizationId: defaultSeedOrg.id,
    companyName: "Carrier Commercial Refrigeration Division",
    billingContactName: "Jonathan Miller (VP of Procurement)",
    billingEmail: "jmiller@carrier-procurement.example.com",
    purchaseOrderNumber: "PO-2026-8941-CCR",
    taxIdOrGst: "US-EIN-12-3456789",
    plan: "fleet",
    amountUsd: 7990,
    paymentTerms: "NET_30",
    status: "INVOICED",
    invoicePdfUrl: "/api/billing/invoices/inv_po_2026_8941/download",
    createdAt: new Date(Date.now() - 3600000 * 72),
    updatedAt: new Date(Date.now() - 3600000 * 72),
  },
];

for (const inv of defaultSeedInvoices) {
  if (!store.invoiceRequests.has(inv.id)) {
    store.invoiceRequests.set(inv.id, inv);
  }
}

function generateId(prefix = "cmw"): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
}

// -----------------------------------------------------------------------------
// Real Prisma Client Singleton (PostgreSQL)
// -----------------------------------------------------------------------------
let realPrisma: PrismaClient | null = null;
try {
  realPrisma =
    globalStore.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  if (process.env.NODE_ENV !== "production") {
    globalStore.prisma = realPrisma;
  }
} catch {
  console.warn("[ForgeFlow Database] Real PostgreSQL client initialization deferred. Fallback store active.");
}

// -----------------------------------------------------------------------------
// Fallback In-Memory Model Proxies
// -----------------------------------------------------------------------------

const fallbackOrg = {
  async create(args: { data: Partial<FallbackOrg> & { name: string } }): Promise<FallbackOrg> {
    const org: FallbackOrg = {
      id: args.data.id || generateId("org_"),
      name: args.data.name,
      slug: args.data.slug ?? null,
      website: args.data.website ?? null,
      productDescription: args.data.productDescription ?? null,
      industry: args.data.industry ?? null,
      keywords: args.data.keywords ?? null,
      plan: args.data.plan ?? "free",
      subscriptionStatus: args.data.subscriptionStatus ?? "trialing",
      monthlyPagesLimit: args.data.monthlyPagesLimit ?? 5,
      monthlyPagesUsed: args.data.monthlyPagesUsed ?? 0,
      billingCycleStart: args.data.billingCycleStart ?? new Date(),
      stripeCustomerId: args.data.stripeCustomerId ?? null,
      stripeSubscriptionId: args.data.stripeSubscriptionId ?? null,
      complianceRulesJson: args.data.complianceRulesJson ?? null,
      brandVoiceJson: args.data.brandVoiceJson ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.organizations.set(org.id, org);
    return org;
  },
  async findUnique(args: { where: { id?: string; stripeCustomerId?: string; slug?: string } }): Promise<FallbackOrg | null> {
    if (args.where.id) return store.organizations.get(args.where.id) || null;
    if (args.where.stripeCustomerId) {
      for (const org of store.organizations.values()) {
        if (org.stripeCustomerId === args.where.stripeCustomerId) return org;
      }
    }
    if (args.where.slug) {
      for (const org of store.organizations.values()) {
        if (org.slug === args.where.slug) return org;
      }
    }
    return null;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackOrg> }): Promise<FallbackOrg> {
    const existing = store.organizations.get(args.where.id);
    if (!existing) throw new Error(`Organization ${args.where.id} not found.`);
    const updated: FallbackOrg = { ...existing, ...args.data, updatedAt: new Date() };
    store.organizations.set(updated.id, updated);
    return updated;
  },
};

const fallbackUser = {
  async create(args: { data: Partial<FallbackUser> & { email: string; passwordHash: string; organizationId: string; name?: string | null } }): Promise<FallbackUser> {
    const emailNorm = args.data.email.trim().toLowerCase();
    for (const existing of store.users.values()) {
      if (existing.email.toLowerCase() === emailNorm) {
        const p2002 = new Error("Unique constraint failed on the fields: (`email`)") as Error & { code?: string; meta?: unknown };
        p2002.code = "P2002";
        p2002.meta = { target: ["email"] };
        throw p2002;
      }
    }
    const user: FallbackUser = {
      id: generateId("usr_"),
      email: emailNorm,
      name: args.data.name ?? null,
      passwordHash: args.data.passwordHash,
      role: args.data.role ?? UserRole.OWNER,
      emailVerified: args.data.emailVerified ?? null,
      image: args.data.image ?? null,
      organizationId: args.data.organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    user.organization = store.organizations.get(user.organizationId) || null;
    store.users.set(user.id, user);
    return user;
  },
  async findUnique(args: { where: { id?: string; email?: string }; include?: { organization?: boolean } }): Promise<FallbackUser | null> {
    let match: FallbackUser | null = null;
    if (args.where.id) match = store.users.get(args.where.id) || null;
    else if (args.where.email) {
      for (const u of store.users.values()) {
        if (u.email.toLowerCase() === args.where.email.toLowerCase()) {
          match = u;
          break;
        }
      }
    }
    if (match && args.include?.organization) {
      return { ...match, organization: store.organizations.get(match.organizationId) || null };
    }
    return match;
  },
  async findFirst(args: { where: { id?: string; email?: string; organizationId?: string }; include?: { organization?: boolean } }): Promise<FallbackUser | null> {
    if (args.where.email) {
      for (const u of store.users.values()) {
        if (u.email.toLowerCase() === args.where.email.toLowerCase() && (!args.where.organizationId || u.organizationId === args.where.organizationId)) {
          return args.include?.organization ? { ...u, organization: store.organizations.get(u.organizationId) || null } : u;
        }
      }
    }
    return this.findUnique({ where: { id: args.where.id, email: args.where.email }, include: args.include });
  },
  async findMany(args?: { where?: { organizationId?: string } }): Promise<FallbackUser[]> {
    const orgId = args?.where?.organizationId;
    const users: FallbackUser[] = [];
    for (const u of store.users.values()) {
      if (!orgId || u.organizationId === orgId) {
        users.push({ ...u, organization: store.organizations.get(u.organizationId) || null });
      }
    }
    return users;
  },
  async update(args: { where: { id?: string; email?: string }; data: Partial<FallbackUser> }): Promise<FallbackUser> {
    let existing: FallbackUser | null = null;
    if (args.where.id) existing = store.users.get(args.where.id) || null;
    else if (args.where.email) {
      for (const u of store.users.values()) {
        if (u.email.toLowerCase() === args.where.email.toLowerCase()) {
          existing = u;
          break;
        }
      }
    }
    if (!existing) throw new Error("User not found.");
    const updated: FallbackUser = { ...existing, ...args.data, updatedAt: new Date() };
    store.users.set(updated.id, updated);
    return updated;
  },
};

const fallbackSession = {
  async create(args: { data: { tokenHash: string; userId: string; expiresAt: Date } }): Promise<FallbackSession> {
    const session: FallbackSession = {
      id: generateId("ses_"),
      tokenHash: args.data.tokenHash,
      userId: args.data.userId,
      expiresAt: args.data.expiresAt,
      createdAt: new Date(),
    };
    const user = store.users.get(session.userId);
    if (user) {
      session.user = { ...user, organization: store.organizations.get(user.organizationId) || null };
    }
    store.sessions.set(session.id, session);
    return session;
  },
  async findUnique(args: { where: { tokenHash?: string; id?: string }; include?: { user?: { include?: { organization?: boolean } } } }): Promise<FallbackSession | null> {
    let match: FallbackSession | null = null;
    if (args.where.tokenHash) {
      for (const s of store.sessions.values()) {
        if (s.tokenHash === args.where.tokenHash) {
          match = s;
          break;
        }
      }
    } else if (args.where.id) {
      match = store.sessions.get(args.where.id) || null;
    }
    if (match && args.include?.user) {
      const u = store.users.get(match.userId);
      const user = u ? { ...u, organization: store.organizations.get(u.organizationId) || null } : null;
      return { ...match, user };
    }
    return match;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackSession | null> {
    const s = store.sessions.get(args.where.id) || null;
    if (s) store.sessions.delete(args.where.id);
    return s;
  },
  async deleteMany(args: { where: { tokenHash?: string; userId?: string } }): Promise<{ count: number }> {
    let count = 0;
    for (const [id, s] of store.sessions.entries()) {
      if ((args.where.tokenHash && s.tokenHash === args.where.tokenHash) || (args.where.userId && s.userId === args.where.userId)) {
        store.sessions.delete(id);
        count++;
      }
    }
    return { count };
  },
};

const fallbackVerificationToken = {
  async create(args: { data: { tokenHash: string; userId: string; email: string; expiresAt: Date } }): Promise<FallbackVerificationToken> {
    const token: FallbackVerificationToken = {
      id: generateId("vtok_"),
      tokenHash: args.data.tokenHash,
      userId: args.data.userId,
      email: args.data.email,
      expiresAt: args.data.expiresAt,
      createdAt: new Date(),
    };
    store.verificationTokens.set(token.id, token);
    return token;
  },
  async findUnique(args: { where: { tokenHash: string } }): Promise<FallbackVerificationToken | null> {
    for (const tok of store.verificationTokens.values()) {
      if (tok.tokenHash === args.where.tokenHash) return tok;
    }
    return null;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackVerificationToken | null> {
    const tok = store.verificationTokens.get(args.where.id) || null;
    if (tok) store.verificationTokens.delete(args.where.id);
    return tok;
  },
  async deleteMany(args: { where: { userId?: string; email?: string } }): Promise<{ count: number }> {
    let count = 0;
    for (const [id, tok] of store.verificationTokens.entries()) {
      if ((args.where.userId && tok.userId === args.where.userId) || (args.where.email && tok.email === args.where.email)) {
        store.verificationTokens.delete(id);
        count++;
      }
    }
    return { count };
  },
};

const fallbackPasswordResetToken = {
  async create(args: { data: { tokenHash: string; userId: string; expiresAt: Date } }): Promise<FallbackPasswordResetToken> {
    const token: FallbackPasswordResetToken = {
      id: generateId("prtok_"),
      tokenHash: args.data.tokenHash,
      userId: args.data.userId,
      expiresAt: args.data.expiresAt,
      createdAt: new Date(),
    };
    store.passwordResetTokens.set(token.id, token);
    return token;
  },
  async findUnique(args: { where: { tokenHash: string } }): Promise<FallbackPasswordResetToken | null> {
    for (const tok of store.passwordResetTokens.values()) {
      if (tok.tokenHash === args.where.tokenHash) return tok;
    }
    return null;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackPasswordResetToken | null> {
    const tok = store.passwordResetTokens.get(args.where.id) || null;
    if (tok) store.passwordResetTokens.delete(args.where.id);
    return tok;
  },
  async deleteMany(args: { where: { userId?: string } }): Promise<{ count: number }> {
    let count = 0;
    for (const [id, tok] of store.passwordResetTokens.entries()) {
      if (args.where.userId && tok.userId === args.where.userId) {
        store.passwordResetTokens.delete(id);
        count++;
      }
    }
    return { count };
  },
};

const fallbackInvitation = {
  async create(args: { data: { tokenHash: string; email: string; role: UserRole; organizationId: string; invitedById: string; expiresAt: Date } }): Promise<FallbackInvitation> {
    const inv: FallbackInvitation = {
      id: generateId("inv_"),
      tokenHash: args.data.tokenHash,
      email: args.data.email,
      role: args.data.role,
      status: InvitationStatus.PENDING,
      organizationId: args.data.organizationId,
      invitedById: args.data.invitedById,
      expiresAt: args.data.expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.invitations.set(inv.id, inv);
    return inv;
  },
  async findUnique(args: { where: { id?: string; tokenHash?: string }; include?: { organization?: boolean; invitedBy?: boolean } }): Promise<FallbackInvitation | null> {
    let match: FallbackInvitation | null = null;
    if (args.where.id) match = store.invitations.get(args.where.id) || null;
    else if (args.where.tokenHash) {
      for (const i of store.invitations.values()) {
        if (i.tokenHash === args.where.tokenHash) {
          match = i;
          break;
        }
      }
    }
    if (match) {
      return {
        ...match,
        organization: args.include?.organization ? store.organizations.get(match.organizationId) || null : undefined,
        invitedBy: args.include?.invitedBy ? store.users.get(match.invitedById) || null : undefined,
      };
    }
    return null;
  },
  async findMany(args: { where: { organizationId?: string; email?: string; status?: InvitationStatus } }): Promise<FallbackInvitation[]> {
    const res: FallbackInvitation[] = [];
    for (const i of store.invitations.values()) {
      if (args.where.organizationId && i.organizationId !== args.where.organizationId) continue;
      if (args.where.email && i.email.toLowerCase() !== args.where.email.toLowerCase()) continue;
      if (args.where.status && i.status !== args.where.status) continue;
      res.push(i);
    }
    return res;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackInvitation> }): Promise<FallbackInvitation> {
    const existing = store.invitations.get(args.where.id);
    if (!existing) throw new Error("Invitation not found");
    const updated: FallbackInvitation = { ...existing, ...args.data, updatedAt: new Date() };
    store.invitations.set(updated.id, updated);
    return updated;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackInvitation | null> {
    const inv = store.invitations.get(args.where.id) || null;
    if (inv) store.invitations.delete(args.where.id);
    return inv;
  },
};

const fallbackDraft = {
  async create(args: { data: Partial<FallbackDraft> & { organizationId: string; title: string; keyword: string; summary: string; sectionsJson: string; faqsJson: string; schemaJson: string } }): Promise<FallbackDraft> {
    const draft: FallbackDraft = {
      id: generateId("drf_"),
      organizationId: args.data.organizationId,
      authorId: args.data.authorId ?? null,
      title: args.data.title,
      keyword: args.data.keyword,
      vertical: args.data.vertical ?? null,
      targetEquipment: args.data.targetEquipment ?? null,
      complianceStandard: args.data.complianceStandard ?? null,
      summary: args.data.summary,
      sectionsJson: args.data.sectionsJson,
      faqsJson: args.data.faqsJson,
      schemaJson: args.data.schemaJson,
      status: args.data.status ?? DraftStatus.IN_REVIEW,
      qaScoresJson: args.data.qaScoresJson ?? null,
      specRiskScore: args.data.specRiskScore ?? null,
      pipelineValueMin: args.data.pipelineValueMin ?? null,
      pipelineValueMax: args.data.pipelineValueMax ?? null,
      searchVolume: args.data.searchVolume ?? null,
      reviewComment: args.data.reviewComment ?? null,
      publishedAt: args.data.publishedAt ?? null,
      publishedUrl: args.data.publishedUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.drafts.set(draft.id, draft);

    // Initial content revision
    const rev: FallbackContentRevision = {
      id: generateId("rev_"),
      draftId: draft.id,
      revisionNumber: 1,
      title: draft.title,
      sectionsJson: draft.sectionsJson,
      faqsJson: draft.faqsJson,
      schemaJson: draft.schemaJson,
      qaScoresJson: draft.qaScoresJson,
      changeSummary: "Initial generation",
      changedById: draft.authorId,
      createdAt: new Date(),
    };
    store.contentRevisions.set(rev.id, rev);

    return draft;
  },
  async findUnique(args: { where: { id: string } }): Promise<FallbackDraft | null> {
    return store.drafts.get(args.where.id) || null;
  },
  async findFirst(args: { where: { id: string; organizationId: string } }): Promise<FallbackDraft | null> {
    const draft = store.drafts.get(args.where.id);
    if (draft && draft.organizationId === args.where.organizationId) return draft;
    return null;
  },
  async findMany(args?: { where?: { organizationId?: string; status?: DraftStatus }; orderBy?: { createdAt?: "asc" | "desc" } }): Promise<FallbackDraft[]> {
    const list: FallbackDraft[] = [];
    for (const d of store.drafts.values()) {
      if (args?.where?.organizationId && d.organizationId !== args.where.organizationId) continue;
      if (args?.where?.status && d.status !== args.where.status) continue;
      list.push(d);
    }
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return list;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackDraft> }): Promise<FallbackDraft> {
    const existing = store.drafts.get(args.where.id);
    if (!existing) throw new Error("Draft not found.");
    const updated: FallbackDraft = { ...existing, ...args.data, updatedAt: new Date() };
    store.drafts.set(updated.id, updated);
    return updated;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackDraft | null> {
    const d = store.drafts.get(args.where.id) || null;
    if (d) store.drafts.delete(args.where.id);
    return d;
  },
};

const fallbackContentRevision = {
  async create(args: { data: Partial<FallbackContentRevision> & { draftId: string; revisionNumber: number; title: string; sectionsJson: string; faqsJson: string; schemaJson: string } }): Promise<FallbackContentRevision> {
    const rev: FallbackContentRevision = {
      id: generateId("rev_"),
      draftId: args.data.draftId,
      revisionNumber: args.data.revisionNumber,
      title: args.data.title,
      sectionsJson: args.data.sectionsJson,
      faqsJson: args.data.faqsJson,
      schemaJson: args.data.schemaJson,
      qaScoresJson: args.data.qaScoresJson ?? null,
      changeSummary: args.data.changeSummary ?? null,
      changedById: args.data.changedById ?? null,
      createdAt: new Date(),
    };
    store.contentRevisions.set(rev.id, rev);
    return rev;
  },
  async findMany(args: { where: { draftId: string } }): Promise<FallbackContentRevision[]> {
    const res: FallbackContentRevision[] = [];
    for (const r of store.contentRevisions.values()) {
      if (r.draftId === args.where.draftId) res.push(r);
    }
    return res.sort((a, b) => b.revisionNumber - a.revisionNumber);
  },
};

const fallbackAuditLog = {
  async create(args: { data: { organizationId: string; userId?: string | null; userRole?: string | null; action: string; resourceType: string; resourceId?: string | null; metadataJson?: string | null; diffJson?: string | null; detailsJson?: string | null; ipAddress?: string | null } }): Promise<FallbackAuditLog> {
    const log: FallbackAuditLog = {
      id: generateId("log_"),
      organizationId: args.data.organizationId,
      userId: args.data.userId ?? null,
      userRole: args.data.userRole ?? null,
      action: args.data.action,
      resourceType: args.data.resourceType,
      resourceId: args.data.resourceId ?? null,
      metadataJson: args.data.metadataJson ?? null,
      diffJson: args.data.diffJson ?? null,
      detailsJson: args.data.detailsJson ?? null,
      ipAddress: args.data.ipAddress ?? null,
      createdAt: new Date(),
    };
    store.auditLogs.set(log.id, log);
    return log;
  },
  async findMany(args?: { where?: { organizationId?: string; resourceType?: string; resourceId?: string }; take?: number }): Promise<FallbackAuditLog[]> {
    const res: FallbackAuditLog[] = [];
    for (const l of store.auditLogs.values()) {
      if (args?.where?.organizationId && l.organizationId !== args.where.organizationId) continue;
      if (args?.where?.resourceType && l.resourceType !== args.where.resourceType) continue;
      if (args?.where?.resourceId && l.resourceId !== args.where.resourceId) continue;
      res.push(l);
    }
    res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return args?.take ? res.slice(0, args.take) : res;
  },
};

const fallbackGenerationJob = {
  async create(args: { data: { organizationId: string; userId?: string | null; inputDataJson: string; totalItems?: number; status?: string; currentStep?: string } }): Promise<FallbackGenerationJob> {
    const job: FallbackGenerationJob = {
      id: generateId("job_"),
      organizationId: args.data.organizationId,
      userId: args.data.userId ?? null,
      status: args.data.status ?? "PENDING",
      progress: 0,
      currentStep: args.data.currentStep ?? "Queued in industrial generation pipeline",
      totalItems: args.data.totalItems ?? 1,
      completedItems: 0,
      inputDataJson: args.data.inputDataJson,
      resultDraftIdsJson: null,
      error: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.generationJobs.set(job.id, job);
    return job;
  },
  async findUnique(args: { where: { id: string } }): Promise<FallbackGenerationJob | null> {
    return store.generationJobs.get(args.where.id) || null;
  },
  async findFirst(args: { where: { id?: string; organizationId?: string } }): Promise<FallbackGenerationJob | null> {
    for (const j of store.generationJobs.values()) {
      if (args.where.id && j.id !== args.where.id) continue;
      if (args.where.organizationId && j.organizationId !== args.where.organizationId) continue;
      return j;
    }
    return null;
  },
  async findMany(args?: { where?: { organizationId?: string; status?: string }; take?: number }): Promise<FallbackGenerationJob[]> {
    const res: FallbackGenerationJob[] = [];
    for (const j of store.generationJobs.values()) {
      if (args?.where?.organizationId && j.organizationId !== args.where.organizationId) continue;
      if (args?.where?.status && j.status !== args.where.status) continue;
      res.push(j);
    }
    res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return args?.take ? res.slice(0, args.take) : res;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackGenerationJob> }): Promise<FallbackGenerationJob> {
    const existing = store.generationJobs.get(args.where.id);
    if (!existing) throw new Error(`GenerationJob ${args.where.id} not found.`);
    const updated: FallbackGenerationJob = { ...existing, ...args.data, updatedAt: new Date() };
    store.generationJobs.set(updated.id, updated);
    return updated;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackGenerationJob | null> {
    const existing = store.generationJobs.get(args.where.id) || null;
    if (existing) store.generationJobs.delete(args.where.id);
    return existing;
  },
};

const fallbackSpecDocument = {
  async create(args: { data: Partial<FallbackSpecDocument> & { organizationId: string; title: string; fileName: string; extractedContent: string } }): Promise<FallbackSpecDocument> {
    const doc: FallbackSpecDocument = {
      id: args.data.id || generateId("doc_"),
      organizationId: args.data.organizationId,
      title: args.data.title,
      fileName: args.data.fileName,
      fileSize: args.data.fileSize ?? 1024 * 250,
      fileType: args.data.fileType ?? "pdf",
      extractedContent: args.data.extractedContent,
      extractedNodesJson: args.data.extractedNodesJson ?? null,
      status: args.data.status ?? "PARSED",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.specDocuments.set(doc.id, doc);
    return doc;
  },
  async findMany(args?: { where?: { organizationId?: string } }): Promise<FallbackSpecDocument[]> {
    const list: FallbackSpecDocument[] = [];
    for (const d of store.specDocuments.values()) {
      if (args?.where?.organizationId && d.organizationId !== args.where.organizationId) continue;
      list.push(d);
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  async findUnique(args: { where: { id: string } }): Promise<FallbackSpecDocument | null> {
    return store.specDocuments.get(args.where.id) || null;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackSpecDocument | null> {
    const existing = store.specDocuments.get(args.where.id) || null;
    if (existing) store.specDocuments.delete(args.where.id);
    return existing;
  },
};

const fallbackCmsIntegration = {
  async create(args: { data: Partial<FallbackCmsIntegration> & { organizationId: string; provider: string; name: string; endpointUrl: string } }): Promise<FallbackCmsIntegration> {
    const cms: FallbackCmsIntegration = {
      id: args.data.id || generateId("cms_"),
      organizationId: args.data.organizationId,
      provider: args.data.provider,
      name: args.data.name,
      endpointUrl: args.data.endpointUrl,
      apiKey: args.data.apiKey ?? null,
      targetCollectionId: args.data.targetCollectionId ?? null,
      status: args.data.status ?? "CONNECTED",
      autoPublishApproved: args.data.autoPublishApproved ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.cmsIntegrations.set(cms.id, cms);
    return cms;
  },
  async findMany(args?: { where?: { organizationId?: string } }): Promise<FallbackCmsIntegration[]> {
    const list: FallbackCmsIntegration[] = [];
    for (const c of store.cmsIntegrations.values()) {
      if (args?.where?.organizationId && c.organizationId !== args.where.organizationId) continue;
      list.push(c);
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  async findUnique(args: { where: { id: string } }): Promise<FallbackCmsIntegration | null> {
    return store.cmsIntegrations.get(args.where.id) || null;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackCmsIntegration> }): Promise<FallbackCmsIntegration> {
    const existing = store.cmsIntegrations.get(args.where.id);
    if (!existing) throw new Error(`CMS Integration ${args.where.id} not found.`);
    const updated: FallbackCmsIntegration = { ...existing, ...args.data, updatedAt: new Date() };
    store.cmsIntegrations.set(updated.id, updated);
    return updated;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackCmsIntegration | null> {
    const existing = store.cmsIntegrations.get(args.where.id) || null;
    if (existing) store.cmsIntegrations.delete(args.where.id);
    return existing;
  },
};

const fallbackAeoTrackerQuery = {
  async create(args: { data: Partial<FallbackAeoTrackerQuery> & { organizationId: string; keyword: string; targetUrl: string } }): Promise<FallbackAeoTrackerQuery> {
    const query: FallbackAeoTrackerQuery = {
      id: args.data.id || generateId("aeo_"),
      organizationId: args.data.organizationId,
      draftId: args.data.draftId ?? null,
      keyword: args.data.keyword,
      targetUrl: args.data.targetUrl,
      googleAeoCited: args.data.googleAeoCited ?? true,
      googleAeoPosition: args.data.googleAeoPosition ?? 1,
      perplexityCited: args.data.perplexityCited ?? true,
      perplexityCitationIndex: args.data.perplexityCitationIndex ?? 1,
      chatGptIndexed: args.data.chatGptIndexed ?? true,
      aiSnippetSummary: args.data.aiSnippetSummary ?? null,
      lastCheckedAt: args.data.lastCheckedAt ?? new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.aeoTrackerQueries.set(query.id, query);
    return query;
  },
  async findMany(args?: { where?: { organizationId?: string } }): Promise<FallbackAeoTrackerQuery[]> {
    const list: FallbackAeoTrackerQuery[] = [];
    for (const q of store.aeoTrackerQueries.values()) {
      if (args?.where?.organizationId && q.organizationId !== args.where.organizationId) continue;
      list.push(q);
    }
    return list.sort((a, b) => b.lastCheckedAt.getTime() - a.lastCheckedAt.getTime());
  },
  async findUnique(args: { where: { id: string } }): Promise<FallbackAeoTrackerQuery | null> {
    return store.aeoTrackerQueries.get(args.where.id) || null;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackAeoTrackerQuery> }): Promise<FallbackAeoTrackerQuery> {
    const existing = store.aeoTrackerQueries.get(args.where.id);
    if (!existing) throw new Error(`AEO query ${args.where.id} not found.`);
    const updated: FallbackAeoTrackerQuery = { ...existing, ...args.data, updatedAt: new Date() };
    store.aeoTrackerQueries.set(updated.id, updated);
    return updated;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackAeoTrackerQuery | null> {
    const existing = store.aeoTrackerQueries.get(args.where.id) || null;
    if (existing) store.aeoTrackerQueries.delete(args.where.id);
    return existing;
  },
};

const fallbackInvoiceRequest = {
  async create(args: { data: Partial<FallbackInvoiceRequest> & { organizationId: string; companyName: string; billingContactName: string; billingEmail: string; plan: string; amountUsd: number } }): Promise<FallbackInvoiceRequest> {
    const inv: FallbackInvoiceRequest = {
      id: args.data.id || generateId("inv_"),
      organizationId: args.data.organizationId,
      companyName: args.data.companyName,
      billingContactName: args.data.billingContactName,
      billingEmail: args.data.billingEmail,
      purchaseOrderNumber: args.data.purchaseOrderNumber ?? null,
      taxIdOrGst: args.data.taxIdOrGst ?? null,
      plan: args.data.plan,
      amountUsd: args.data.amountUsd,
      paymentTerms: args.data.paymentTerms ?? "NET_30",
      status: args.data.status ?? "INVOICED",
      invoicePdfUrl: args.data.invoicePdfUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.invoiceRequests.set(inv.id, inv);
    return inv;
  },
  async findMany(args?: { where?: { organizationId?: string } }): Promise<FallbackInvoiceRequest[]> {
    const list: FallbackInvoiceRequest[] = [];
    for (const i of store.invoiceRequests.values()) {
      if (args?.where?.organizationId && i.organizationId !== args.where.organizationId) continue;
      list.push(i);
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  async findUnique(args: { where: { id: string } }): Promise<FallbackInvoiceRequest | null> {
    return store.invoiceRequests.get(args.where.id) || null;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackInvoiceRequest> }): Promise<FallbackInvoiceRequest> {
    const existing = store.invoiceRequests.get(args.where.id);
    if (!existing) throw new Error(`Invoice request ${args.where.id} not found.`);
    const updated: FallbackInvoiceRequest = { ...existing, ...args.data, updatedAt: new Date() };
    store.invoiceRequests.set(updated.id, updated);
    return updated;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackInvoiceRequest | null> {
    const existing = store.invoiceRequests.get(args.where.id) || null;
    if (existing) store.invoiceRequests.delete(args.where.id);
    return existing;
  },
};

const fallbackExpertReviewer = {
  async create(args: { data: Partial<FallbackExpertReviewer> & { organizationId: string; name: string; jobTitle: string; credentials: string } }): Promise<FallbackExpertReviewer> {
    const reviewer: FallbackExpertReviewer = {
      id: generateId("rev_"),
      organizationId: args.data.organizationId,
      name: args.data.name,
      jobTitle: args.data.jobTitle,
      credentials: args.data.credentials,
      yearsOfExperience: args.data.yearsOfExperience ?? 5,
      linkedInUrl: args.data.linkedInUrl ?? null,
      photoUrl: args.data.photoUrl ?? null,
      bio: args.data.bio ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.expertReviewers.set(reviewer.id, reviewer);
    return reviewer;
  },
  async findMany(args?: { where?: { organizationId?: string } }): Promise<FallbackExpertReviewer[]> {
    const list: FallbackExpertReviewer[] = [];
    for (const r of store.expertReviewers.values()) {
      if (args?.where?.organizationId) {
        if (r.organizationId === args.where.organizationId || r.organizationId === "global") {
          list.push(r);
        }
      } else {
        list.push(r);
      }
    }
    return list;
  },
  async findUnique(args: { where: { id: string } }): Promise<FallbackExpertReviewer | null> {
    return store.expertReviewers.get(args.where.id) || null;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackExpertReviewer> }): Promise<FallbackExpertReviewer> {
    const existing = store.expertReviewers.get(args.where.id);
    if (!existing) throw new Error(`Reviewer ${args.where.id} not found.`);
    const updated: FallbackExpertReviewer = { ...existing, ...args.data, updatedAt: new Date() };
    store.expertReviewers.set(updated.id, updated);
    return updated;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackExpertReviewer | null> {
    const existing = store.expertReviewers.get(args.where.id) || null;
    if (existing) store.expertReviewers.delete(args.where.id);
    return existing;
  },
};

const fallbackPageReview = {
  async create(args: { data: { draftId: string; reviewerId: string; status?: ReviewStatus; reviewDate?: Date; reviewerNotes?: string | null; verificationItemsJson?: string | null } }): Promise<FallbackPageReview> {
    const review: FallbackPageReview = {
      id: generateId("prv_"),
      draftId: args.data.draftId,
      reviewerId: args.data.reviewerId,
      status: args.data.status ?? ReviewStatus.PENDING,
      reviewDate: args.data.reviewDate ?? new Date(),
      reviewerNotes: args.data.reviewerNotes ?? null,
      verificationItemsJson: args.data.verificationItemsJson ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.pageReviews.set(review.draftId, review);
    return review;
  },
  async findUnique(args: { where: { id?: string; draftId?: string }; include?: { reviewer?: boolean } }): Promise<FallbackPageReview | null> {
    let review: FallbackPageReview | null = null;
    if (args.where.draftId) {
      review = store.pageReviews.get(args.where.draftId) || null;
    } else if (args.where.id) {
      for (const r of store.pageReviews.values()) {
        if (r.id === args.where.id) {
          review = r;
          break;
        }
      }
    }
    if (review && args.include?.reviewer) {
      const reviewer = store.expertReviewers.get(review.reviewerId) || null;
      return { ...review, reviewer };
    }
    return review;
  },
  async findMany(args?: { where?: { reviewerId?: string; status?: ReviewStatus } }): Promise<FallbackPageReview[]> {
    const list: FallbackPageReview[] = [];
    for (const r of store.pageReviews.values()) {
      if (args?.where?.reviewerId && r.reviewerId !== args.where.reviewerId) continue;
      if (args?.where?.status && r.status !== args.where.status) continue;
      list.push(r);
    }
    return list;
  },
  async upsert(args: {
    where: { draftId: string };
    create: { draftId: string; reviewerId: string; status?: ReviewStatus; reviewDate?: Date; reviewerNotes?: string | null; verificationItemsJson?: string | null };
    update: Partial<FallbackPageReview>;
    include?: { reviewer?: boolean };
  }): Promise<FallbackPageReview> {
    let review = store.pageReviews.get(args.where.draftId);
    if (review) {
      review = { ...review, ...args.update, updatedAt: new Date() };
      store.pageReviews.set(args.where.draftId, review);
    } else {
      review = {
        id: generateId("prv_"),
        draftId: args.create.draftId,
        reviewerId: args.create.reviewerId,
        status: args.create.status ?? ReviewStatus.PENDING,
        reviewDate: args.create.reviewDate ?? new Date(),
        reviewerNotes: args.create.reviewerNotes ?? null,
        verificationItemsJson: args.create.verificationItemsJson ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.pageReviews.set(args.where.draftId, review);
    }
    if (args.include?.reviewer) {
      const reviewer = store.expertReviewers.get(review.reviewerId) || null;
      return { ...review, reviewer };
    }
    return review;
  },
  async update(args: { where: { id?: string; draftId?: string }; data: Partial<FallbackPageReview>; include?: { reviewer?: boolean } }): Promise<FallbackPageReview> {
    const targetKey = args.where.draftId ?? Array.from(store.pageReviews.values()).find((r) => r.id === args.where.id)?.draftId;
    if (!targetKey) throw new Error("Page review not found to update.");
    const existing = store.pageReviews.get(targetKey);
    if (!existing) throw new Error("Page review not found to update.");
    const updated: FallbackPageReview = { ...existing, ...args.data, updatedAt: new Date() };
    store.pageReviews.set(targetKey, updated);
    if (args.include?.reviewer) {
      const reviewer = store.expertReviewers.get(updated.reviewerId) || null;
      return { ...updated, reviewer };
    }
    return updated;
  },
  async delete(args: { where: { id?: string; draftId?: string } }): Promise<FallbackPageReview | null> {
    const targetKey = args.where.draftId ?? Array.from(store.pageReviews.values()).find((r) => r.id === args.where.id)?.draftId;
    if (!targetKey) return null;
    const existing = store.pageReviews.get(targetKey) || null;
    if (existing) store.pageReviews.delete(targetKey);
    return existing;
  },
};

function getActivePrisma(): PrismaClient | null {
  if (!realPrisma) return null;
  if (!globalStore.__forgeflow_pg_available__) {
    const now = Date.now();
    if (now - (globalStore.__forgeflow_last_pg_check__ ?? 0) > 60000 && !globalStore.__forgeflow_pg_probing__) {
      void checkPostgresAvailability(true);
    }
    return null;
  }
  return realPrisma;
}

function handlePostgresError(e: unknown, op: string) {
  const err = e as Error & { code?: string };
  if (err.code === "P2002") throw err;

  // Strict Production Enforcement: Never silently use ephemeral in-memory store in production when ENFORCE_MANAGED_DATABASE is enabled
  if (process.env.NODE_ENV === "production" && process.env.ENFORCE_MANAGED_DATABASE === "true") {
    console.error(`[DB Proxy CRITICAL] Production database cluster unreachable for ${op}: ${err.message}`);
    throw new Error(`Production database failure: Unable to execute ${op}. Managed PostgreSQL connection required.`);
  }

  globalStore.__forgeflow_pg_available__ = false;
  globalStore.__forgeflow_last_pg_check__ = Date.now();
  console.warn(`[DB Proxy] Database unavailable for ${op} (${err.code ?? err.message ?? "connection error"}). Active in-memory fallback store will be used.`);
}

function createModelProxy<T extends object>(modelName: string, fallback: T): T {
  return new Proxy(fallback, {
    get(target, prop: string | symbol) {
      if (typeof prop !== "string") {
        return Reflect.get(target, prop);
      }
      const fallbackVal = Reflect.get(target, prop);
      if (typeof fallbackVal !== "function") return fallbackVal;

      return async (...args: unknown[]) => {
        const client = getActivePrisma();
        if (client) {
          const prismaModel = Reflect.get(client, modelName) as Record<string, (...a: unknown[]) => Promise<unknown>> | undefined;
          if (prismaModel && typeof prismaModel[prop] === "function") {
            try {
              const res = await prismaModel[prop](...args);
              globalStore.__forgeflow_pg_available__ = true;
              return res;
            } catch (e) {
              handlePostgresError(e, `${modelName}.${prop}`);
            }
          }
        }
        return (fallbackVal as (...a: unknown[]) => unknown).apply(target, args);
      };
    },
  });
}

// -----------------------------------------------------------------------------
// Combined Resilient Database Interface
// -----------------------------------------------------------------------------
export interface FallbackDbInterface {
  organization: typeof fallbackOrg;
  user: typeof fallbackUser;
  session: typeof fallbackSession;
  verificationToken: typeof fallbackVerificationToken;
  passwordResetToken: typeof fallbackPasswordResetToken;
  invitation: typeof fallbackInvitation;
  draft: typeof fallbackDraft;
  contentRevision: typeof fallbackContentRevision;
  auditLog: typeof fallbackAuditLog;
  expertReviewer: typeof fallbackExpertReviewer;
  pageReview: typeof fallbackPageReview;
  generationJob: typeof fallbackGenerationJob;
  specDocument: typeof fallbackSpecDocument;
  cmsIntegration: typeof fallbackCmsIntegration;
  aeoTrackerQuery: typeof fallbackAeoTrackerQuery;
  invoiceRequest: typeof fallbackInvoiceRequest;
  $transaction<T>(fn: (tx: FallbackDbInterface) => Promise<T>): Promise<T>;
  $transaction<T>(array: Array<Promise<T>>): Promise<T[]>;
}

export const fallbackDb: FallbackDbInterface = {
  organization: createModelProxy("organization", fallbackOrg),
  user: createModelProxy("user", fallbackUser),
  session: createModelProxy("session", fallbackSession),
  verificationToken: createModelProxy("verificationToken", fallbackVerificationToken),
  passwordResetToken: createModelProxy("passwordResetToken", fallbackPasswordResetToken),
  invitation: createModelProxy("invitation", fallbackInvitation),
  draft: createModelProxy("draft", fallbackDraft),
  contentRevision: createModelProxy("contentRevision", fallbackContentRevision),
  auditLog: createModelProxy("auditLog", fallbackAuditLog),
  expertReviewer: createModelProxy("expertReviewer", fallbackExpertReviewer),
  pageReview: createModelProxy("pageReview", fallbackPageReview),
  generationJob: createModelProxy("generationJob", fallbackGenerationJob),
  specDocument: createModelProxy("specDocument", fallbackSpecDocument),
  cmsIntegration: createModelProxy("cmsIntegration", fallbackCmsIntegration),
  aeoTrackerQuery: createModelProxy("aeoTrackerQuery", fallbackAeoTrackerQuery),
  invoiceRequest: createModelProxy("invoiceRequest", fallbackInvoiceRequest),

  async $transaction<T>(
    fnOrArray: ((tx: FallbackDbInterface) => Promise<T>) | Array<Promise<T>>,
  ): Promise<T | T[]> {
    if (typeof fnOrArray === "function") {
      const client = getActivePrisma();
      if (client) {
        try {
          const res = await (client as unknown as { $transaction: (f: unknown) => Promise<T> }).$transaction(fnOrArray);
          globalStore.__forgeflow_pg_available__ = true;
          return res;
        } catch (e) {
          handlePostgresError(e, "$transaction");
        }
      }
      return fnOrArray(fallbackDb);
    }
    return Promise.all(fnOrArray);
  },
};

export const db = fallbackDb as unknown as PrismaClient;
