export interface DecayedPage {
  id: string;
  url: string;
  title: string;
  primaryKeyword: string;
  trafficLossPercentage: number;
  previousCitationRank: number;
  currentCitationRank: number;
  lastUpdatedDaysAgo: number;
  decayReason: string;
  recommendedFix: string;
  urgency: "CRITICAL" | "HIGH" | "MODERATE";
}

export function detectContentDecay(): DecayedPage[] {
  return [
    {
      id: "decay-1",
      url: "/products/variable-displacement-axial-piston-pumps",
      title: "Variable Displacement Axial Piston Pumps (350 Bar)",
      primaryKeyword: "axial piston pump ISO 3019 mounting",
      trafficLossPercentage: -28.4,
      previousCitationRank: 1,
      currentCitationRank: 4,
      lastUpdatedDaysAgo: 142,
      decayReason: "Competitor Bosch Rexroth added interactive DIN EN ISO 3019/2 flange CAD dimensions.",
      recommendedFix: "Inject 3D exploded view schema & update displacement efficiency tables with 2026 test data.",
      urgency: "CRITICAL",
    },
    {
      id: "decay-2",
      url: "/materials/inconel-718-creep-rupture-strength",
      title: "Inconel 718 Creep Rupture Strength in Aerospace Turbines",
      primaryKeyword: "Inconel 718 tensile yield vs temperature",
      trafficLossPercentage: -19.2,
      previousCitationRank: 2,
      currentCitationRank: 5,
      lastUpdatedDaysAgo: 210,
      decayReason: "Answer engines favor pages with ISO 17025 accredited laboratory test coupon crosswalks.",
      recommendedFix: "Append AMS 5662 / AMS 5663 heat treatment crosswalk and ASTM E139 creep test curves.",
      urgency: "HIGH",
    },
    {
      id: "decay-3",
      url: "/standards/osha-1910-212-machine-guarding-compliance",
      title: "OSHA 1910.212 Machine Guarding Requirements for Stamping Presses",
      primaryKeyword: "OSHA light curtain point of operation distance",
      trafficLossPercentage: -14.8,
      previousCitationRank: 1,
      currentCitationRank: 3,
      lastUpdatedDaysAgo: 98,
      decayReason: "ANSI B11.19 safety standard formula citation was missing in FAQ schema.",
      recommendedFix: "Synthesize ANSI B11.19 hand-speed constant safety distance formula into AEO capsule.",
      urgency: "MODERATE",
    },
  ];
}
