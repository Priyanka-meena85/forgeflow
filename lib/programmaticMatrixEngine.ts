export interface MatrixDimension {
  equipments: string[];
  industries: string[];
  problems: string[];
}

export interface GeneratedMatrixPage {
  slug: string;
  equipment: string;
  industry: string;
  problem: string;
  h1Title: string;
  primaryKeyword: string;
  targetPersona: "Plant Manager (ROI)" | "Maintenance Engineer (Technical)" | "Procurement Officer (Vendor Comparison)";
  estimatedMonthlySearchVolume: number;
}

export const DEFAULT_MATRIX_DIMENSIONS: MatrixDimension = {
  equipments: [
    "High-Pressure Servo Hydraulic Actuator",
    "Variable Displacement Axial Piston Pump",
    "Cryogenic Flanged Ball Valve",
    "Precision CNC Spindle Assembly",
  ],
  industries: [
    "Automotive Body Stamping",
    "Aerospace Structural Milling",
    "Semiconductor Vacuum Chambers",
    "Heavy Earthmoving & Mining",
  ],
  problems: [
    "High-Cycle Fatigue Seal Breakdown",
    "Thermal Expansion Dimensional Drift",
    "Contamination Ingress in Harsh Environments",
    "Excessive Cycle Vibration & Chatter",
  ],
};

export function generateProgrammaticMatrix(
  dimensions: MatrixDimension = DEFAULT_MATRIX_DIMENSIONS
): GeneratedMatrixPage[] {
  const pages: GeneratedMatrixPage[] = [];

  for (const eq of dimensions.equipments) {
    for (const ind of dimensions.industries) {
      for (const prob of dimensions.problems) {
        const slug = `${eq.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-for-${ind.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${prob.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        
        let targetPersona: GeneratedMatrixPage["targetPersona"] = "Maintenance Engineer (Technical)";
        if (prob.includes("Fatigue") || prob.includes("Drift")) {
          targetPersona = "Maintenance Engineer (Technical)";
        } else if (prob.includes("Vibration") || ind.includes("Automotive")) {
          targetPersona = "Plant Manager (ROI)";
        } else {
          targetPersona = "Procurement Officer (Vendor Comparison)";
        }

        pages.push({
          slug,
          equipment: eq,
          industry: ind,
          problem: prob,
          h1Title: `${eq} Solutions for ${ind}: Eliminating ${prob}`,
          primaryKeyword: `${eq} in ${ind} ${prob}`,
          targetPersona,
          estimatedMonthlySearchVolume: Math.floor(Math.random() * 450) + 90,
        });
      }
    }
  }

  return pages;
}
