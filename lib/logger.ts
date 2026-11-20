/**
 * Enterprise Production Structured Logger with Correlation IDs & Sensitive Key Masking
 */

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "AUDIT";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  correlationId?: string;
  tenantId?: string;
  latencyMs?: number;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

function maskSensitiveData(obj: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {};
  const sensitiveKeys = ["password", "token", "apiKey", "secret", "authorization", "cookie"];

  for (const [k, v] of Object.entries(obj)) {
    if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
      masked[k] = "••••••••••••";
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      masked[k] = maskSensitiveData(v as Record<string, unknown>);
    } else {
      masked[k] = v;
    }
  }
  return masked;
}

export function log(level: LogLevel, message: string, meta?: {
  correlationId?: string;
  tenantId?: string;
  latencyMs?: number;
  metadata?: Record<string, unknown>;
  error?: unknown;
}) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    correlationId: meta?.correlationId,
    tenantId: meta?.tenantId,
    latencyMs: meta?.latencyMs,
    metadata: meta?.metadata ? maskSensitiveData(meta.metadata) : undefined,
  };

  if (meta?.error instanceof Error) {
    entry.error = {
      name: meta.error.name,
      message: meta.error.message,
      stack: process.env.NODE_ENV === "development" ? meta.error.stack : undefined,
    };
  }

  const jsonStr = JSON.stringify(entry);

  if (level === "ERROR") {
    console.error(jsonStr);
  } else if (level === "WARN") {
    console.warn(jsonStr);
  } else {
    console.log(jsonStr);
  }
}

export const logger = {
  info: (msg: string, meta?: Parameters<typeof log>[2]) => log("INFO", msg, meta),
  warn: (msg: string, meta?: Parameters<typeof log>[2]) => log("WARN", msg, meta),
  error: (msg: string, meta?: Parameters<typeof log>[2]) => log("ERROR", msg, meta),
  audit: (msg: string, meta?: Parameters<typeof log>[2]) => log("AUDIT", msg, meta),
};
