/**
 * Production APM & Health Instrumentation for ForgeFlow
 */

export interface SystemMetrics {
  uptimeSeconds: number;
  memoryUsageMb: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  nodeVersion: string;
  environment: string;
  databaseStatus: "CONNECTED" | "FALLBACK_IN_MEMORY" | "DEGRADED";
  databaseLatencyMs: number;
  queueDepth: number;
  timestamp: string;
}

const startTime = Date.now();

export function getSystemMetrics(dbConnected: boolean, dbLatencyMs = 4): SystemMetrics {
  const mem = process.memoryUsage();
  return {
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    memoryUsageMb: {
      rss: Math.round(mem.rss / 1024 / 1024),
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
      external: Math.round(mem.external / 1024 / 1024),
    },
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
    databaseStatus: dbConnected ? "CONNECTED" : "FALLBACK_IN_MEMORY",
    databaseLatencyMs: dbLatencyMs,
    queueDepth: 0,
    timestamp: new Date().toISOString(),
  };
}
