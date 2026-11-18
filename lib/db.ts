import path from "node:path";
import { PrismaClient } from "@prisma/client";

// Ensure process.env.DATABASE_URL is always populated immediately across all platforms
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.trim() && !envUrl.startsWith("file:./dev.db") && !envUrl.startsWith("file:dev.db")) {
    return envUrl.trim();
  }
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
  const baseDir = isServerless ? "/tmp" : path.join(process.cwd(), "prisma");
  const absoluteDbPath = path.join(baseDir, "dev.db").replace(/\\/g, "/");
  return `file:${absoluteDbPath}`;
}

const dbUrl = resolveDatabaseUrl();
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl;
}

// Resilient in-memory fallback store for zero-config deployments & serverless functions
interface FallbackOrg {
  id: string;
  name: string;
  website: string | null;
  productDescription: string | null;
  industry: string | null;
  keywords: string | null;
  plan: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: Date;
}

interface FallbackUser {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  organizationId: string;
  createdAt: Date;
  organization?: FallbackOrg | null;
}

interface FallbackSession {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  user?: (FallbackUser & { organization?: FallbackOrg | null }) | null;
}

interface FallbackDraft {
  id: string;
  organizationId: string;
  title: string;
  keyword: string;
  summary: string;
  sectionsJson: string;
  faqsJson: string;
  schemaJson: string;
  status: string;
  reviewComment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface FallbackStore {
  organizations: Map<string, FallbackOrg>;
  users: Map<string, FallbackUser>;
  sessions: Map<string, FallbackSession>;
  drafts: Map<string, FallbackDraft>;
}

const globalStore = globalThis as unknown as {
  __forgeflow_store__?: FallbackStore;
  prisma?: PrismaClient;
};

const store: FallbackStore = globalStore.__forgeflow_store__ ?? {
  organizations: new Map(),
  users: new Map(),
  sessions: new Map(),
  drafts: new Map(),
};
globalStore.__forgeflow_store__ = store;

function generateId(prefix = "cmw"): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
}

// Fallback Model Implementations
const fallbackOrg = {
  async create(args: { data: { name: string } }): Promise<FallbackOrg> {
    const org: FallbackOrg = {
      id: generateId("org_"),
      name: args.data.name,
      website: null,
      productDescription: null,
      industry: null,
      keywords: null,
      plan: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    store.organizations.set(org.id, org);
    return org;
  },
  async findUnique(args: { where: { id?: string; stripeCustomerId?: string }; select?: Record<string, boolean> }): Promise<FallbackOrg | null> {
    if (args.where.id) return store.organizations.get(args.where.id) || null;
    if (args.where.stripeCustomerId) {
      for (const org of store.organizations.values()) {
        if (org.stripeCustomerId === args.where.stripeCustomerId) return org;
      }
    }
    return null;
  },
  async update(args: { where: { id: string }; data: Partial<FallbackOrg>; select?: Record<string, boolean> }): Promise<FallbackOrg> {
    const existing = store.organizations.get(args.where.id);
    const updated: FallbackOrg = existing
      ? { ...existing, ...args.data }
      : {
          id: args.where.id,
          name: args.data.name || "Default Organization",
          website: args.data.website || null,
          productDescription: args.data.productDescription || null,
          industry: args.data.industry || null,
          keywords: args.data.keywords || null,
          plan: args.data.plan || "free",
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          createdAt: new Date(),
          ...args.data,
        };
    store.organizations.set(args.where.id, updated);
    return updated;
  },
};

const fallbackUser = {
  async create(args: {
    data: { email: string; passwordHash: string; organizationId: string };
    include?: { organization?: boolean };
  }): Promise<FallbackUser & { organization?: FallbackOrg | null }> {
    const normalizedEmail = args.data.email.trim().toLowerCase();
    for (const u of store.users.values()) {
      if (u.email.toLowerCase() === normalizedEmail) {
        const error = new Error("Unique constraint failed on the fields: (`email`)");
        (error as Error & { code: string }).code = "P2002";
        throw error;
      }
    }
    const user: FallbackUser = {
      id: generateId("usr_"),
      email: normalizedEmail,
      passwordHash: args.data.passwordHash,
      role: "owner",
      organizationId: args.data.organizationId,
      createdAt: new Date(),
    };
    store.users.set(user.id, user);
    if (args.include?.organization) {
      const org = store.organizations.get(user.organizationId) || null;
      return { ...user, organization: org };
    }
    return user;
  },
  async findUnique(args: {
    where: { email?: string; id?: string };
    include?: { organization?: boolean };
  }): Promise<(FallbackUser & { organization?: FallbackOrg | null }) | null> {
    let user: FallbackUser | null = null;
    if (args.where.id) {
      user = store.users.get(args.where.id) || null;
    } else if (args.where.email) {
      const emailLower = args.where.email.trim().toLowerCase();
      for (const u of store.users.values()) {
        if (u.email.toLowerCase() === emailLower) {
          user = u;
          break;
        }
      }
    }
    if (!user) return null;
    if (args.include?.organization) {
      const org = store.organizations.get(user.organizationId) || null;
      return { ...user, organization: org };
    }
    return user;
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
    store.sessions.set(session.tokenHash, session);
    return session;
  },
  async findUnique(args: {
    where: { tokenHash: string };
    include?: { user?: { include?: { organization?: boolean } } };
  }): Promise<(FallbackSession & { user?: (FallbackUser & { organization?: FallbackOrg | null }) | null }) | null> {
    const session = store.sessions.get(args.where.tokenHash);
    if (!session) return null;
    if (args.include?.user) {
      const user = store.users.get(session.userId);
      if (!user) return null;
      let org: FallbackOrg | null = null;
      if (args.include.user.include?.organization) {
        org = store.organizations.get(user.organizationId) || null;
      }
      return { ...session, user: { ...user, organization: org } };
    }
    return session;
  },
  async delete(args: { where: { id: string } }): Promise<FallbackSession | null> {
    for (const [key, s] of store.sessions.entries()) {
      if (s.id === args.where.id) {
        store.sessions.delete(key);
        return s;
      }
    }
    return null;
  },
  async deleteMany(args: { where: { tokenHash?: string } }): Promise<{ count: number }> {
    if (args.where.tokenHash) {
      const existed = store.sessions.delete(args.where.tokenHash);
      return { count: existed ? 1 : 0 };
    }
    return { count: 0 };
  },
};

const fallbackDraft = {
  async findMany(args?: {
    where?: { organizationId?: string };
    orderBy?: { createdAt?: "asc" | "desc" };
  }): Promise<FallbackDraft[]> {
    const list: FallbackDraft[] = [];
    for (const d of store.drafts.values()) {
      if (!args?.where?.organizationId || d.organizationId === args.where.organizationId) {
        list.push(d);
      }
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  },
  async findFirst(args: { where: { id?: string; organizationId?: string } }): Promise<FallbackDraft | null> {
    for (const d of store.drafts.values()) {
      if (
        (!args.where.id || d.id === args.where.id) &&
        (!args.where.organizationId || d.organizationId === args.where.organizationId)
      ) {
        return d;
      }
    }
    return null;
  },
  async create(args: { data: Omit<FallbackDraft, "createdAt" | "updatedAt"> }): Promise<FallbackDraft> {
    const draft: FallbackDraft = {
      ...args.data,
      id: args.data.id || generateId("drf_"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.drafts.set(draft.id, draft);
    return draft;
  },
  async update(args: {
    where: { id: string };
    data: Partial<FallbackDraft>;
  }): Promise<FallbackDraft | null> {
    const existing = store.drafts.get(args.where.id);
    if (!existing) return null;
    const updated: FallbackDraft = { ...existing, ...args.data, updatedAt: new Date() };
    store.drafts.set(args.where.id, updated);
    return updated;
  },
};

// Initialize PrismaClient safely with fallback
let realPrisma: PrismaClient | null = null;
try {
  realPrisma =
    globalStore.prisma ??
    new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log: ["error"],
    });
  if (process.env.NODE_ENV !== "production") globalStore.prisma = realPrisma;
} catch (e) {
  console.warn("Prisma client initialization notice (running with resilient fallback):", e);
}

// Base resilient adapter implementing fallback handlers
const fallbackDb = {
  organization: {
    async create(args: Parameters<typeof fallbackOrg.create>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.organization.create as unknown as (a: typeof args) => Promise<FallbackOrg>)(args);
        } catch (e) {
          console.warn("Prisma organization.create error, using fallback store:", e);
        }
      }
      return fallbackOrg.create(args);
    },
    async findUnique(args: Parameters<typeof fallbackOrg.findUnique>[0]) {
      if (realPrisma) {
        try {
          const res = await (realPrisma.organization.findUnique as unknown as (a: typeof args) => Promise<FallbackOrg | null>)(args);
          if (res) return res;
        } catch (e) {
          console.warn("Prisma organization.findUnique error, using fallback store:", e);
        }
      }
      return fallbackOrg.findUnique(args);
    },
    async update(args: Parameters<typeof fallbackOrg.update>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.organization.update as unknown as (a: typeof args) => Promise<FallbackOrg>)(args);
        } catch (e) {
          console.warn("Prisma organization.update error, using fallback store:", e);
        }
      }
      return fallbackOrg.update(args);
    },
  },
  user: {
    async create(args: Parameters<typeof fallbackUser.create>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.user.create as unknown as (a: typeof args) => Promise<FallbackUser & { organization?: FallbackOrg | null }>)(args);
        } catch (e) {
          if ((e as Error & { code?: string }).code === "P2002") throw e;
          console.warn("Prisma user.create error, using fallback store:", e);
        }
      }
      return fallbackUser.create(args);
    },
    async findUnique(args: Parameters<typeof fallbackUser.findUnique>[0]) {
      if (realPrisma) {
        try {
          const res = await (realPrisma.user.findUnique as unknown as (a: typeof args) => Promise<(FallbackUser & { organization?: FallbackOrg | null }) | null>)(args);
          if (res) return res;
        } catch (e) {
          console.warn("Prisma user.findUnique error, using fallback store:", e);
        }
      }
      return fallbackUser.findUnique(args);
    },
  },
  session: {
    async create(args: Parameters<typeof fallbackSession.create>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.session.create as unknown as (a: typeof args) => Promise<FallbackSession>)(args);
        } catch (e) {
          console.warn("Prisma session.create error, using fallback store:", e);
        }
      }
      return fallbackSession.create(args);
    },
    async findUnique(args: Parameters<typeof fallbackSession.findUnique>[0]) {
      if (realPrisma) {
        try {
          const res = await (realPrisma.session.findUnique as unknown as (a: typeof args) => Promise<(FallbackSession & { user?: (FallbackUser & { organization?: FallbackOrg | null }) | null }) | null>)(args);
          if (res) return res;
        } catch (e) {
          console.warn("Prisma session.findUnique error, using fallback store:", e);
        }
      }
      return fallbackSession.findUnique(args);
    },
    async delete(args: Parameters<typeof fallbackSession.delete>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.session.delete as unknown as (a: typeof args) => Promise<FallbackSession | null>)(args);
        } catch (e) {
          console.warn("Prisma session.delete error, using fallback store:", e);
        }
      }
      return fallbackSession.delete(args);
    },
    async deleteMany(args: Parameters<typeof fallbackSession.deleteMany>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.session.deleteMany as unknown as (a: typeof args) => Promise<{ count: number }>)(args);
        } catch (e) {
          console.warn("Prisma session.deleteMany error, using fallback store:", e);
        }
      }
      return fallbackSession.deleteMany(args);
    },
  },
  draft: {
    async findMany(args?: Parameters<typeof fallbackDraft.findMany>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.draft.findMany as unknown as (a?: typeof args) => Promise<FallbackDraft[]>)(args);
        } catch (e) {
          console.warn("Prisma draft.findMany error, using fallback store:", e);
        }
      }
      return fallbackDraft.findMany(args);
    },
    async findFirst(args: Parameters<typeof fallbackDraft.findFirst>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.draft.findFirst as unknown as (a: typeof args) => Promise<FallbackDraft | null>)(args);
        } catch (e) {
          console.warn("Prisma draft.findFirst error, using fallback store:", e);
        }
      }
      return fallbackDraft.findFirst(args);
    },
    async create(args: Parameters<typeof fallbackDraft.create>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.draft.create as unknown as (a: typeof args) => Promise<FallbackDraft>)(args);
        } catch (e) {
          console.warn("Prisma draft.create error, using fallback store:", e);
        }
      }
      return fallbackDraft.create(args);
    },
    async update(args: Parameters<typeof fallbackDraft.update>[0]) {
      if (realPrisma) {
        try {
          return await (realPrisma.draft.update as unknown as (a: typeof args) => Promise<FallbackDraft | null>)(args);
        } catch (e) {
          console.warn("Prisma draft.update error, using fallback store:", e);
        }
      }
      return fallbackDraft.update(args);
    },
  },
  async $transaction(
    arg: unknown
  ): Promise<unknown> {
    if (typeof arg === "function") {
      if (realPrisma) {
        try {
          return await (realPrisma as unknown as { $transaction: (f: unknown) => Promise<unknown> }).$transaction(arg);
        } catch (e) {
          if ((e as Error & { code?: string }).code === "P2002") throw e;
          console.warn("Prisma transaction error, executing in fallback store:", e);
        }
      }
      return (arg as (tx: {
        organization: typeof fallbackOrg;
        user: typeof fallbackUser;
        session: typeof fallbackSession;
        draft: typeof fallbackDraft;
      }) => Promise<unknown>)({
        organization: fallbackOrg,
        user: fallbackUser,
        session: fallbackSession,
        draft: fallbackDraft,
      });
    }
    if (Array.isArray(arg)) {
      if (realPrisma) {
        try {
          return await (realPrisma as unknown as { $transaction: (arr: unknown[]) => Promise<unknown[]> }).$transaction(arg);
        } catch (e) {
          console.warn("Prisma batch error, running promises:", e);
        }
      }
      return Promise.all(arg);
    }
    throw new Error("Invalid transaction argument");
  },
};

// Export typed strictly as PrismaClient so all callers enjoy perfect Prisma types & autocomplete
export const db = fallbackDb as unknown as PrismaClient;
