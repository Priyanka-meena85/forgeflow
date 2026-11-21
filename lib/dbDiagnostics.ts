import { db } from "@/lib/db";

export interface DatabaseHealthStatus {
  status: "HEALTHY" | "DEGRADED" | "CRITICAL";
  latencyMs: number;
  connectionMode: "POSTGRESQL_DIRECT" | "PGBOUNCER_POOL" | "IN_MEMORY_FALLBACK";
  poolSizeRecommended: number;
  activePoolConfig: {
    connectionLimit: number;
    poolTimeout: number;
    pgbouncerEnabled: boolean;
  };
  advisories: string[];
}

export async function checkDatabaseHealth(): Promise<DatabaseHealthStatus> {
  const start = Date.now();
  let status: DatabaseHealthStatus["status"] = "HEALTHY";
  const advisories: string[] = [];

  const rawUrl = process.env.DATABASE_URL || "";
  const hasPgBouncer = rawUrl.includes("pgbouncer=true");
  const isPostgres = rawUrl.startsWith("postgresql://");

  let connectionMode: DatabaseHealthStatus["connectionMode"] = isPostgres
    ? hasPgBouncer
      ? "PGBOUNCER_POOL"
      : "POSTGRESQL_DIRECT"
    : "IN_MEMORY_FALLBACK";

  try {
    // Attempt a lightweight test query
    await db.user.findFirst({ select: { id: true } });
  } catch (err: unknown) {
    status = "DEGRADED";
    advisories.push(`Database probe warning: ${err instanceof Error ? err.message : "Query latency elevated"}`);
  }

  const latencyMs = Date.now() - start;

  if (connectionMode === "POSTGRESQL_DIRECT") {
    advisories.push(
      "High Concurrency Warning: PostgreSQL direct mode detected. In multi-tenant serverless environments (Vercel/AWS), attach Prisma Accelerate or Supabase Pooler to prevent max_connections exhaustion."
    );
  }

  if (latencyMs > 300) {
    status = "DEGRADED";
    advisories.push(`Query round-trip took ${latencyMs}ms, exceeding recommended 150ms enterprise SLA.`);
  }

  return {
    status,
    latencyMs,
    connectionMode,
    poolSizeRecommended: 20,
    activePoolConfig: {
      connectionLimit: 20,
      poolTimeout: 10,
      pgbouncerEnabled: hasPgBouncer,
    },
    advisories,
  };
}
