/**
 * Industrial Telemetry, Structured Audit Logging & Observability
 * Handles Sentry DSN event forwarding, correlation tracking, and production telemetry.
 */

export type SeverityLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export interface TelemetryEvent {
  message: string;
  level: SeverityLevel;
  correlationId?: string;
  timestamp?: string;
  context?: Record<string, unknown>;
  error?: Error | unknown;
}

export async function captureTelemetry(event: TelemetryEvent): Promise<void> {
  const timestamp = event.timestamp || new Date().toISOString();
  const correlationId = event.correlationId || `tel_${Date.now()}`;

  // Structured Log Output for CloudWatch / Datadog / Vercel Logs
  const logPayload = {
    timestamp,
    correlationId,
    level: event.level,
    message: event.message,
    context: event.context,
    error: event.error instanceof Error ? {
      name: event.error.name,
      message: event.error.message,
      stack: event.error.stack,
    } : event.error,
  };

  if (event.level === "ERROR" || event.level === "CRITICAL") {
    console.error(`[TELEMETRY][${event.level}][${correlationId}]`, JSON.stringify(logPayload));
  } else if (event.level === "WARN") {
    console.warn(`[TELEMETRY][WARN][${correlationId}]`, JSON.stringify(logPayload));
  } else {
    console.info(`[TELEMETRY][INFO][${correlationId}]`, JSON.stringify(logPayload));
  }

  // Direct Sentry HTTP Envelope Ingestion (works without heavy native npm dependencies)
  const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (sentryDsn && (event.level === "ERROR" || event.level === "CRITICAL")) {
    try {
      const dsnUrl = new URL(sentryDsn);
      const projectId = dsnUrl.pathname.replace(/^\//, "");
      const publicKey = dsnUrl.username;
      const sentryHost = dsnUrl.host;

      if (publicKey && projectId) {
        const sentryApiUrl = `https://${sentryHost}/api/${projectId}/store/`;
        const sentryPayload = {
          event_id: correlationId.replace(/[^a-f0-9]/gi, "").slice(0, 32).padEnd(32, "0"),
          timestamp,
          logger: "forgeflow.production",
          platform: "javascript",
          level: event.level.toLowerCase(),
          message: event.message,
          extra: event.context,
        };

        await fetch(sentryApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Sentry-Auth": `Sentry sentry_version=7, sentry_client=forgeflow-telemetry/1.0, sentry_key=${publicKey}`,
          },
          body: JSON.stringify(sentryPayload),
        }).catch(() => {
          // graceful background swallow so user request is never blocked
        });
      }
    } catch {
      // Ignore Sentry network dispatch errors
    }
  }
}
