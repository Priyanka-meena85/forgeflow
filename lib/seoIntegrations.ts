// lib/seoIntegrations.ts
// Ahrefs / SEMrush mock connector — swap API keys and endpoints in prod

export interface KeywordRankData {
  keyword: string;
  position: number;
  prevPosition: number;
  volume: number;
  difficulty: number;
  url: string;
  cpc: number;
  source: "ahrefs" | "semrush" | "gsc";
}

export interface SeoIntegrationConfig {
  provider: "ahrefs" | "semrush";
  apiKey: string;
  connected: boolean;
  domain: string;
  lastSyncAt?: string;
}

const mockRankings: KeywordRankData[] = [
  { keyword: "CNC machining automotive India", position: 4, prevPosition: 7, volume: 1200, difficulty: 42, url: "/cnc-machining-automotive-india", cpc: 2.4, source: "ahrefs" },
  { keyword: "rotary lobe pump pharmaceutical", position: 2, prevPosition: 2, volume: 880, difficulty: 31, url: "/rotary-lobe-pump-pharma-gmp", cpc: 3.1, source: "ahrefs" },
  { keyword: "industrial bearing textile machinery India", position: 8, prevPosition: 11, volume: 540, difficulty: 28, url: "/industrial-bearing-textile", cpc: 1.8, source: "semrush" },
  { keyword: "gate valve oil gas upstream India", position: 15, prevPosition: 18, volume: 1900, difficulty: 55, url: "/valve-oil-gas-india", cpc: 4.2, source: "semrush" },
  { keyword: "oil free compressor food processing BIS", position: 6, prevPosition: 9, volume: 740, difficulty: 22, url: "/compressor-food-processing", cpc: 2.0, source: "ahrefs" },
  { keyword: "ISO 9001 certified pump manufacturer India", position: 3, prevPosition: 5, volume: 2200, difficulty: 38, url: "/iso-certified-pump-manufacturer", cpc: 2.8, source: "ahrefs" },
];

export async function fetchKeywordRankings(
  config: SeoIntegrationConfig
): Promise<KeywordRankData[]> {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, 300));
  return mockRankings.filter(
    (r) => config.provider === "ahrefs" ? r.source === "ahrefs" : r.source === "semrush"
  );
}

export function rankDelta(current: number, prev: number): { label: string; positive: boolean } {
  const delta = prev - current;
  if (delta === 0) return { label: "—", positive: true };
  return { label: delta > 0 ? `+${delta}` : `${delta}`, positive: delta > 0 };
}
