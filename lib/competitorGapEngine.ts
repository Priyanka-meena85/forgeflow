// lib/competitorGapEngine.ts
// Scan a competitor URL and extract missing topic clusters

export interface CompetitorPage {
  url: string;
  title: string;
  mainKeyword: string;
  wordCount: number;
  headings: string[];
  topicsDetected: string[];
  hasSchema: boolean;
  hasFaq: boolean;
}

export interface GapReport {
  competitorDomain: string;
  scannedPages: number;
  gapTopics: GapTopic[];
  coverageScore: number; // 0-100, lower = more gaps
  generatedAt: string;
}

export interface GapTopic {
  topic: string;
  competitorHas: boolean;
  youHave: boolean;
  estimatedVolume: number;
  difficulty: "Low" | "Medium" | "High";
  suggestedTitle: string;
  suggestedSlug: string;
  priority: "Critical" | "High" | "Medium" | "Low";
}

/** Deterministic mock scanner — replace with real scraper / GSC API in prod */
export function analyzeCompetitorGaps(
  competitorUrl: string,
  yourTopics: string[]
): GapReport {
  const domain = new URL(
    competitorUrl.startsWith("http") ? competitorUrl : `https://${competitorUrl}`
  ).hostname.replace("www.", "");

  const competitorTopics: Array<{
    topic: string;
    volume: number;
    difficulty: "Low" | "Medium" | "High";
  }> = [
    { topic: "CNC machining tolerances ISO 2768", volume: 1200, difficulty: "Medium" },
    { topic: "Rotary lobe pump CIP validation 3-A standard", volume: 880, difficulty: "Low" },
    { topic: "Industrial bearing selection guide DIN 625", volume: 2400, difficulty: "High" },
    { topic: "Gate valve pressure rating API 600", volume: 1900, difficulty: "Medium" },
    { topic: "Scroll compressor food grade ISO 8573", volume: 740, difficulty: "Low" },
    { topic: "Predictive maintenance vibration analysis ISO 10816", volume: 3200, difficulty: "High" },
    { topic: "Hydraulic seal failure modes Parker catalog", volume: 560, difficulty: "Low" },
    { topic: "Conveyor belt tension calculation CEMA", volume: 1100, difficulty: "Medium" },
    { topic: "Heat exchanger fouling factor TEMA standards", volume: 820, difficulty: "Medium" },
    { topic: "Variable frequency drive harmonics IEEE 519", volume: 1500, difficulty: "High" },
  ];

  const gapTopics: GapTopic[] = competitorTopics.map((ct) => {
    const youHave = yourTopics.some(
      (t) => t.toLowerCase().includes(ct.topic.split(" ")[0].toLowerCase())
    );
    const isGap = !youHave;
    return {
      topic: ct.topic,
      competitorHas: true,
      youHave,
      estimatedVolume: ct.volume,
      difficulty: ct.difficulty,
      suggestedTitle: `${ct.topic} — Complete Guide for Industrial Engineers`,
      suggestedSlug: `/${ct.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      priority: isGap
        ? ct.volume > 1500
          ? "Critical"
          : ct.volume > 800
            ? "High"
            : "Medium"
        : "Low",
    };
  });

  const gaps = gapTopics.filter((g) => !g.youHave).length;
  const coverageScore = Math.round(((competitorTopics.length - gaps) / competitorTopics.length) * 100);

  return {
    competitorDomain: domain,
    scannedPages: competitorTopics.length,
    gapTopics: gapTopics.sort((a, b) => b.estimatedVolume - a.estimatedVolume),
    coverageScore,
    generatedAt: new Date().toISOString(),
  };
}

export type { GapReport as CompetitorGapReport };
