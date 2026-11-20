/**
 * Zero-Trust Runtime Environment Configuration & Secrets Validator
 * Ensures production deployments have required cloud services configured.
 */

export interface EnvValidationReport {
  isProductionReady: boolean;
  environment: string;
  configuredServices: {
    database: boolean;
    redis: boolean;
    cloudStorage: boolean;
    stripe: boolean;
    sentry: boolean;
    aiProviders: {
      gemini: boolean;
      anthropic: boolean;
      openai: boolean;
    };
  };
  warnings: string[];
}

export function validateEnvironment(): EnvValidationReport {
  const isProd = process.env.NODE_ENV === "production";
  const warnings: string[] = [];

  const hasDb = Boolean(process.env.DATABASE_URL);
  const hasRedis = Boolean(process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL);
  const hasR2 = Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID);
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
  const hasSentry = Boolean(process.env.SENTRY_DSN);

  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);

  if (isProd) {
    if (!hasDb) warnings.push("DATABASE_URL is not configured for production PostgreSQL.");
    if (!hasRedis) warnings.push("REDIS_URL or UPSTASH_REDIS_REST_URL is missing; queue running in fallback mode.");
    if (!hasR2) warnings.push("R2 credentials missing; presigned uploads operating in mock storage mode.");
    if (!hasStripe) warnings.push("STRIPE_SECRET_KEY missing; billing operating in simulated test mode.");
    if (!hasGemini && !hasAnthropic && !hasOpenAi) {
      warnings.push("No LLM API keys provided; tri-model router operating in deterministic taxonomy mode.");
    }
  }

  return {
    isProductionReady: warnings.length === 0,
    environment: process.env.NODE_ENV || "development",
    configuredServices: {
      database: hasDb,
      redis: hasRedis,
      cloudStorage: hasR2,
      stripe: hasStripe,
      sentry: hasSentry,
      aiProviders: {
        gemini: hasGemini,
        anthropic: hasAnthropic,
        openai: hasOpenAi,
      },
    },
    warnings,
  };
}
