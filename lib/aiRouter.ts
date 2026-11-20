export type ModelProvider = "GEMINI_1_5_PRO" | "CLAUDE_3_5_SONNET" | "GPT_4O";

export interface ModelPricing {
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  displayName: string;
}

export const PRICING_TABLE: Record<ModelProvider, ModelPricing> = {
  GEMINI_1_5_PRO: {
    inputCostPerMillion: 1.25,
    outputCostPerMillion: 5.0,
    displayName: "Google Gemini 1.5 Pro (Primary Industrial)",
  },
  CLAUDE_3_5_SONNET: {
    inputCostPerMillion: 3.0,
    outputCostPerMillion: 15.0,
    displayName: "Anthropic Claude 3.5 Sonnet (Secondary Fallback)",
  },
  GPT_4O: {
    inputCostPerMillion: 2.5,
    outputCostPerMillion: 10.0,
    displayName: "OpenAI GPT-4o (Tertiary Failover)",
  },
};

export interface TokenUsageRecord {
  id: string;
  organizationId: string;
  provider: ModelProvider;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  wasFallback: boolean;
  timestamp: Date;
}

interface CogsStore {
  records: TokenUsageRecord[];
  providerHealth: Record<ModelProvider, { isHealthy: boolean; lastChecked: Date; failureCount: number }>;
}

const globalCogs = globalThis as unknown as {
  __forgeflow_cogs_store__?: CogsStore;
};

const cogsStore: CogsStore = globalCogs.__forgeflow_cogs_store__ ?? {
  records: [
    {
      id: "cogs_init_1",
      organizationId: "global",
      provider: "GEMINI_1_5_PRO",
      inputTokens: 1840,
      outputTokens: 890,
      totalTokens: 2730,
      estimatedCostUsd: 0.00675,
      latencyMs: 780,
      wasFallback: false,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "cogs_init_2",
      organizationId: "global",
      provider: "GEMINI_1_5_PRO",
      inputTokens: 2100,
      outputTokens: 1120,
      totalTokens: 3220,
      estimatedCostUsd: 0.00822,
      latencyMs: 840,
      wasFallback: false,
      timestamp: new Date(Date.now() - 1800000),
    },
  ],
  providerHealth: {
    GEMINI_1_5_PRO: { isHealthy: true, lastChecked: new Date(), failureCount: 0 },
    CLAUDE_3_5_SONNET: { isHealthy: true, lastChecked: new Date(), failureCount: 0 },
    GPT_4O: { isHealthy: true, lastChecked: new Date(), failureCount: 0 },
  },
};
globalCogs.__forgeflow_cogs_store__ = cogsStore;

/**
 * Calculates exact USD cost per token usage
 */
export function calculateTokenCost(provider: ModelProvider, inputTokens: number, outputTokens: number): number {
  const pricing = PRICING_TABLE[provider];
  const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPerMillion;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPerMillion;
  return Number((inputCost + outputCost).toFixed(6));
}

/**
 * Executes an AI generation task with Tri-Model Fallback:
 * Gemini 1.5 Pro -> Claude 3.5 Sonnet -> GPT-4o
 */
export async function executeTriModelGeneration<T>(args: {
  organizationId: string;
  task: (provider: ModelProvider) => Promise<{ result: T; inputTokens: number; outputTokens: number }>;
}): Promise<{ result: T; record: TokenUsageRecord }> {
  const providerPriority: ModelProvider[] = ["GEMINI_1_5_PRO", "CLAUDE_3_5_SONNET", "GPT_4O"];
  let lastError: Error | null = null;

  for (let i = 0; i < providerPriority.length; i++) {
    const provider = providerPriority[i];
    const isFallback = i > 0;
    const startTime = Date.now();

    try {
      const { result, inputTokens, outputTokens } = await args.task(provider);
      const latencyMs = Date.now() - startTime;
      const costUsd = calculateTokenCost(provider, inputTokens, outputTokens);

      const record: TokenUsageRecord = {
        id: `cogs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        organizationId: args.organizationId,
        provider,
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        estimatedCostUsd: costUsd,
        latencyMs,
        wasFallback: isFallback,
        timestamp: new Date(),
      };

      cogsStore.records.push(record);
      cogsStore.providerHealth[provider].isHealthy = true;
      cogsStore.providerHealth[provider].lastChecked = new Date();

      return { result, record };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Router] Provider ${provider} failed (${lastError.message}). Attempting next fallback...`);
      cogsStore.providerHealth[provider].failureCount++;
      cogsStore.providerHealth[provider].lastChecked = new Date();
      if (cogsStore.providerHealth[provider].failureCount >= 3) {
        cogsStore.providerHealth[provider].isHealthy = false;
      }
    }
  }

  throw new Error(`All 3 AI Model Providers failed: ${lastError?.message || "Unknown error"}`);
}

export function getCogsSummaryForOrg(organizationId: string) {
  const records = cogsStore.records.filter((r) => r.organizationId === organizationId || r.organizationId === "global");
  const totalTokens = records.reduce((acc, r) => acc + r.totalTokens, 0);
  const totalCostUsd = records.reduce((acc, r) => acc + r.estimatedCostUsd, 0);
  const avgLatency = records.length ? Math.round(records.reduce((acc, r) => acc + r.latencyMs, 0) / records.length) : 800;

  // Assuming $799/month Starter Plan amortized per generated page (~$15.98 revenue/page)
  const estimatedRevenuePerBatch = records.length * 15.98;
  const grossMarginPercent = estimatedRevenuePerBatch > 0
    ? Number((((estimatedRevenuePerBatch - totalCostUsd) / estimatedRevenuePerBatch) * 100).toFixed(2))
    : 99.85;

  return {
    totalGenerations: records.length,
    totalTokens,
    totalCostUsd: Number(totalCostUsd.toFixed(4)),
    averageCostPerPageUsd: records.length ? Number((totalCostUsd / records.length).toFixed(4)) : 0.0075,
    averageLatencyMs: avgLatency,
    grossMarginPercent,
    providerHealth: cogsStore.providerHealth,
    recentRecords: records.slice(-10).reverse(),
  };
}
