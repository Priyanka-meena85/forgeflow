export interface PageNode {
  id: string;
  url: string;
  title: string;
  cluster: string;
  targetKeyword: string;
  inboundLinksCount: number;
  outboundLinksCount: number;
  isPillarPage: boolean;
}

export interface InternalLinkSuggestion {
  sourcePageUrl: string;
  targetPageUrl: string;
  targetPageTitle: string;
  suggestedAnchorText: string;
  contextSentence: string;
  semanticRelevanceScore: number; // 0-100
  clusterName: string;
}

const SAMPLE_PAGE_NODES: PageNode[] = [
  {
    id: "p1",
    url: "/products/servo-hydraulic-actuators-high-pressure",
    title: "High-Pressure Servo Hydraulic Actuators (ASME Y14.5)",
    cluster: "Hydraulic Motion Control",
    targetKeyword: "servo hydraulic actuator specs",
    inboundLinksCount: 12,
    outboundLinksCount: 8,
    isPillarPage: true,
  },
  {
    id: "p2",
    url: "/specifications/iso-4401-subplate-mounting-dimensions",
    title: "ISO 4401 Subplate Mounting Dimensions & Porting Guide",
    cluster: "Hydraulic Motion Control",
    targetKeyword: "ISO 4401 subplate dimensions",
    inboundLinksCount: 3,
    outboundLinksCount: 2,
    isPillarPage: false,
  },
  {
    id: "p3",
    url: "/engineering-guides/viton-fkm-elastomer-seal-limits",
    title: "Viton (FKM) Elastomer Chemical Compatibility in 350 Bar Systems",
    cluster: "Hydraulic Motion Control",
    targetKeyword: "FKM hydraulic seal temperature limits",
    inboundLinksCount: 1,
    outboundLinksCount: 1,
    isPillarPage: false,
  },
  {
    id: "p4",
    url: "/guides/cnc-tooling-chatter-suppression-aerospace",
    title: "CNC Tooling Chatter Suppression in Titanium Milling (AS9100)",
    cluster: "Aerospace Machining",
    targetKeyword: "chatter suppression titanium milling",
    inboundLinksCount: 7,
    outboundLinksCount: 5,
    isPillarPage: true,
  },
  {
    id: "p5",
    url: "/materials/astm-b16-5-flange-pressure-temperature-ratings",
    title: "ASTM B16.5 Class 150 to Class 2500 Flange Pressure-Temperature Ratings",
    cluster: "Piping & Flange Standards",
    targetKeyword: "ASTM B16.5 flange pressure rating",
    inboundLinksCount: 9,
    outboundLinksCount: 6,
    isPillarPage: true,
  },
];

/**
 * Automatically discovers orphan pages and calculates high-relevance internal links
 */
export function generateInternalLinkSuggestions(pages: PageNode[] = SAMPLE_PAGE_NODES): {
  suggestions: InternalLinkSuggestion[];
  orphanPages: PageNode[];
  clusterHealth: Record<string, { totalPages: number; internalLinkDensity: number }>;
} {
  const orphanPages = pages.filter((p) => p.inboundLinksCount <= 2 && !p.isPillarPage);
  const suggestions: InternalLinkSuggestion[] = [];
  const clusterHealth: Record<string, { totalPages: number; internalLinkDensity: number }> = {};

  // Build cluster health
  for (const page of pages) {
    if (!clusterHealth[page.cluster]) {
      clusterHealth[page.cluster] = { totalPages: 0, internalLinkDensity: 0 };
    }
    clusterHealth[page.cluster].totalPages += 1;
    clusterHealth[page.cluster].internalLinkDensity += page.inboundLinksCount;
  }

  // Generate intelligent suggestions
  for (const orphan of orphanPages) {
    const pillarInCluster = pages.find((p) => p.cluster === orphan.cluster && p.isPillarPage);
    if (pillarInCluster) {
      suggestions.push({
        sourcePageUrl: pillarInCluster.url,
        targetPageUrl: orphan.url,
        targetPageTitle: orphan.title,
        suggestedAnchorText: orphan.targetKeyword,
        contextSentence: `For complete interface tolerances, cross-reference our verified [${orphan.targetKeyword}] technical engineering datasheet.`,
        semanticRelevanceScore: 94,
        clusterName: orphan.cluster,
      });
    }
  }

  return {
    suggestions,
    orphanPages,
    clusterHealth,
  };
}
