import { PrismaClient, UserRole, DraftStatus, InvitationStatus, ReviewStatus } from "@prisma/client";

// Ensure process.env.DATABASE_URL is populated for PostgreSQL
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.trim() && !envUrl.startsWith("file:")) {
    return envUrl.trim();
  }
  return "postgresql://postgres:postgres@localhost:5432/industrial_seo_saas?schema=public";
}

const dbUrl = resolveDatabaseUrl();
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
  process.env.DATABASE_URL = dbUrl;
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
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadataJson: string | null;
  ipAddress: string | null;
  createdAt: Date;
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
}

const globalStore = globalThis as unknown as {
  __forgeflow_store__?: FallbackStore;
  prisma?: PrismaClient;
};

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
      id: generateId("org_"),
      name: args.data.name,
      slug: args.data.slug ?? null,
      website: args.data.website ?? null,
      productDescription: args.data.productDescription ?? null,
      industry: args.data.industry ?? null,
      keywords: args.data.keywords ?? null,
      plan: args.data.plan ?? "free",
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
  async create(args: { data: Partial<FallbackUser> & { email: string; passwordHash: string; organizationId: string } }): Promise<FallbackUser> {
    const user: FallbackUser = {
      id: generateId("usr_"),
      email: args.data.email,
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
  async findMany(args: { where?: { organizationId?: string; status?: DraftStatus }; orderBy?: { createdAt?: "asc" | "desc" } }): Promise<FallbackDraft[]> {
    const list: FallbackDraft[] = [];
    for (const d of store.drafts.values()) {
      if (args.where?.organizationId && d.organizationId !== args.where.organizationId) continue;
      if (args.where?.status && d.status !== args.where.status) continue;
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
  async create(args: { data: { organizationId: string; userId?: string | null; action: string; resourceType: string; resourceId?: string | null; metadataJson?: string | null; ipAddress?: string | null } }): Promise<FallbackAuditLog> {
    const log: FallbackAuditLog = {
      id: generateId("log_"),
      organizationId: args.data.organizationId,
      userId: args.data.userId ?? null,
      action: args.data.action,
      resourceType: args.data.resourceType,
      resourceId: args.data.resourceId ?? null,
      metadataJson: args.data.metadataJson ?? null,
      ipAddress: args.data.ipAddress ?? null,
      createdAt: new Date(),
    };
    store.auditLogs.set(log.id, log);
    return log;
  },
  async findMany(args: { where: { organizationId: string }; take?: number }): Promise<FallbackAuditLog[]> {
    const res: FallbackAuditLog[] = [];
    for (const l of store.auditLogs.values()) {
      if (l.organizationId === args.where.organizationId) res.push(l);
    }
    res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return args.take ? res.slice(0, args.take) : res;
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

let postgresAvailable = true;
let lastPostgresCheck = 0;
const POSTGRES_RETRY_INTERVAL_MS = 30000;

function getActivePrisma(): PrismaClient | null {
  if (!realPrisma) return null;
  if (!postgresAvailable && Date.now() - lastPostgresCheck <= POSTGRES_RETRY_INTERVAL_MS) {
    return null;
  }
  return realPrisma;
}

function handlePostgresError(e: unknown, op: string) {
  const err = e as Error & { code?: string };
  if (err.code === "P2002") throw err;
  postgresAvailable = false;
  lastPostgresCheck = Date.now();
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
              postgresAvailable = true;
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

  async $transaction<T>(
    fnOrArray: ((tx: FallbackDbInterface) => Promise<T>) | Array<Promise<T>>,
  ): Promise<T | T[]> {
    if (typeof fnOrArray === "function") {
      const client = getActivePrisma();
      if (client) {
        try {
          const res = await (client as unknown as { $transaction: (f: unknown) => Promise<T> }).$transaction(fnOrArray);
          postgresAvailable = true;
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
