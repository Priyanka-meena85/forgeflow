import path from "node:path";
import { PrismaClient } from "@prisma/client";

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.trim() && !envUrl.startsWith("file:./dev.db") && !envUrl.startsWith("file:dev.db")) {
    return envUrl.trim();
  }
  const absoluteDbPath = path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
  return `file:${absoluteDbPath}`;
}

const dbUrl = resolveDatabaseUrl();
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
