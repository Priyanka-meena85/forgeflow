export type HeroLayoutVariant = "SPLIT_CAD_SPEC_CARD" | "TECHNICAL_DATA_TABLE_HERO" | "DIRECT_AEO_ANSWER_CAPSULE";
export type SectionOrderingSequence = "TOLERANCES_FIRST" | "FAILURE_ANALYSIS_FIRST" | "CAD_BENCHMARK_FIRST";
export type DiagramPresentationStyle = "SCHEMATIC_CROSS_SECTION" | "EXPLODED_ASSEMBLY_CANVAS" | "DIMENSIONAL_ISOMETRIC";

export interface PageStructuralDNA {
  variantId: string;
  heroLayout: HeroLayoutVariant;
  sectionSequence: SectionOrderingSequence;
  diagramStyle: DiagramPresentationStyle;
  tableDensity: "COMPACT_MIL_SPEC" | "EXPANDED_ISO_METRIC";
}

/**
 * Assigns pseudorandom but deterministic structural DNA based on slug hash
 * to eliminate template footprint penalties across programmatic batches.
 */
export function getStructuralDnaForPage(slug: string): PageStructuralDNA {
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const heroVariants: HeroLayoutVariant[] = [
    "SPLIT_CAD_SPEC_CARD",
    "TECHNICAL_DATA_TABLE_HERO",
    "DIRECT_AEO_ANSWER_CAPSULE",
  ];

  const sequences: SectionOrderingSequence[] = [
    "TOLERANCES_FIRST",
    "FAILURE_ANALYSIS_FIRST",
    "CAD_BENCHMARK_FIRST",
  ];

  const diagramStyles: DiagramPresentationStyle[] = [
    "SCHEMATIC_CROSS_SECTION",
    "EXPLODED_ASSEMBLY_CANVAS",
    "DIMENSIONAL_ISOMETRIC",
  ];

  return {
    variantId: `DNA-${hash % 999}`,
    heroLayout: heroVariants[hash % heroVariants.length],
    sectionSequence: sequences[(hash + 1) % sequences.length],
    diagramStyle: diagramStyles[(hash + 2) % diagramStyles.length],
    tableDensity: hash % 2 === 0 ? "COMPACT_MIL_SPEC" : "EXPANDED_ISO_METRIC",
  };
}
