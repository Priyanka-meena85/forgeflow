import { db } from "@/lib/db";

export interface SpecChunk {
  documentId: string;
  documentTitle: string;
  fileName: string;
  category: "TOLERANCE" | "PRESSURE" | "TEMPERATURE" | "STANDARD" | "CRITICAL_LIMIT" | "GENERAL";
  parameter: string;
  valueOrRange: string;
  contextSnippet: string;
}

export interface IngestionResult {
  documentId: string;
  title: string;
  fileName: string;
  extractedNodesCount: number;
  extractedSpecs: Array<{ category: string; parameter: string; value: string }>;
  status: "PARSED" | "FAILED";
}

/**
 * Deterministic Spec Entity Extractor for Industrial Equipment Manuals
 * Identifies tolerances, pressures, temperatures, and compliance standards
 */
export function extractIndustrialSpecsFromText(text: string): Array<{ category: string; parameter: string; value: string }> {
  const specs: Array<{ category: string; parameter: string; value: string }> = [];

  // 1. Pressure Ranges (psig, bar, psi, kPa)
  const pressureMatches = text.match(/(?:pressure|envelope|suction|discharge|operating)[\s\w:]*?(\d+(?:\.\d+)?\s*(?:-|to)\s*\d+(?:\.\d+)?\s*(?:psig|bar|psi|kPa))/gi);
  if (pressureMatches) {
    for (const match of pressureMatches.slice(0, 3)) {
      specs.push({
        category: "PRESSURE",
        parameter: "Operating Pressure Envelope",
        value: match.trim(),
      });
    }
  }

  // 2. Temperature & Superheat / Subcooling (°F, °C, Kelvin)
  const tempMatches = text.match(/(?:superheat|subcooling|temperature|ambient|sump)[\s\w:]*?(\d+(?:\.\d+)?\s*(?:°\s*[FC]|deg\s*[FC])?\s*(?:-|to)\s*\d+(?:\.\d+)?\s*(?:°\s*[FC]|deg\s*[FC]))/gi);
  if (tempMatches) {
    for (const match of tempMatches.slice(0, 3)) {
      specs.push({
        category: "TEMPERATURE",
        parameter: "Thermal Limit / Superheat Envelope",
        value: match.trim(),
      });
    }
  }

  // 3. Clearances, Tolerances & Deflection (mm, microns, %, mm/m)
  const toleranceMatches = text.match(/(?:clearance|tolerance|tilt|parallelism|deflection|thickness)[\s\w:]*?(\d+(?:\.\d+)?\s*(?:%|mm(?:\/m)?|microns?|in|\bthou\b))/gi);
  if (toleranceMatches) {
    for (const match of toleranceMatches.slice(0, 3)) {
      specs.push({
        category: "TOLERANCE",
        parameter: "Mechanical Clearance / Deflection",
        value: match.trim(),
      });
    }
  }

  // 4. Compliance & Regulatory Standards (ASHRAE, ISO, ASME, IATF, AISE, 3-A, OSHA)
  const standardMatches = text.match(/(?:ASHRAE\s*\d+(?:\.\d+)?|ISO\s*\d+|ASME\s*[A-Z0-9.-]+|IATF\s*16949|AISE\s*No\.\s*\d+|3-A\s*Sanitary|AHRI\s*\d+)/gi);
  if (standardMatches) {
    const uniqueStandards = Array.from(new Set(standardMatches));
    for (const std of uniqueStandards.slice(0, 3)) {
      specs.push({
        category: "STANDARD",
        parameter: "Regulatory Compliance Standard",
        value: std.trim(),
      });
    }
  }

  // Fallback defaults if unstructured text was passed
  if (specs.length === 0) {
    specs.push({
      category: "GENERAL",
      parameter: "OEM Equipment Specification",
      value: text.slice(0, 80) + "…",
    });
  }

  return specs;
}

/**
 * Ingests an OEM specification manual (PDF text dump or direct spec paste)
 */
export async function ingestOemSpecDocument(args: {
  organizationId: string;
  title: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  rawText: string;
}): Promise<IngestionResult> {
  const extractedSpecs = extractIndustrialSpecsFromText(args.rawText);

  const doc = await db.specDocument.create({
    data: {
      organizationId: args.organizationId,
      title: args.title,
      fileName: args.fileName,
      fileSize: args.fileSize ?? args.rawText.length * 2,
      fileType: args.fileType ?? "application/pdf",
      extractedContent: args.rawText,
      extractedNodesJson: JSON.stringify(extractedSpecs),
      status: "PARSED",
    },
  });

  return {
    documentId: doc.id,
    title: doc.title,
    fileName: doc.fileName,
    extractedNodesCount: extractedSpecs.length,
    extractedSpecs,
    status: "PARSED",
  };
}

/**
 * RAG Grounding Engine:
 * Retrieves relevant OEM spec chunks to inject into LLM prompts for zero-hallucination generation.
 */
export async function retrieveRelevantOemSpecs(queryOrKeyword: string, organizationId?: string): Promise<SpecChunk[]> {
  const documents = await db.specDocument.findMany({
    where: organizationId ? { organizationId } : undefined,
  });

  if (!documents || documents.length === 0) {
    return [];
  }

  const queryTokens = queryOrKeyword.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  const matchedChunks: SpecChunk[] = [];

  for (const doc of documents) {
    let nodes: Array<{ category?: string; parameter?: string; value?: string }> = [];
    if (doc.extractedNodesJson) {
      try {
        nodes = JSON.parse(doc.extractedNodesJson);
      } catch {
        nodes = [];
      }
    }

    const contentLower = doc.extractedContent.toLowerCase();
    const isRelevantDoc = queryTokens.some((token) => contentLower.includes(token) || doc.title.toLowerCase().includes(token));

    if (isRelevantDoc || queryTokens.length === 0) {
      for (const node of nodes) {
        matchedChunks.push({
          documentId: doc.id,
          documentTitle: doc.title,
          fileName: doc.fileName,
          category: (node.category as SpecChunk["category"]) || "TOLERANCE",
          parameter: node.parameter || "OEM Spec",
          valueOrRange: node.value || "Specified in OEM manual",
          contextSnippet: doc.extractedContent.slice(0, 160) + "…",
        });
      }
    }
  }

  // Fallback to top specs if no exact keyword match
  if (matchedChunks.length === 0 && documents.length > 0) {
    const firstDoc = documents[0];
    if (firstDoc.extractedNodesJson) {
      try {
        const nodes = JSON.parse(firstDoc.extractedNodesJson);
        for (const node of nodes.slice(0, 3)) {
          matchedChunks.push({
            documentId: firstDoc.id,
            documentTitle: firstDoc.title,
            fileName: firstDoc.fileName,
            category: (node.category as SpecChunk["category"]) || "TOLERANCE",
            parameter: node.parameter || "OEM Spec",
            valueOrRange: node.value || "Specified in OEM manual",
            contextSnippet: firstDoc.extractedContent.slice(0, 160) + "…",
          });
        }
      } catch {
        // ignore
      }
    }
  }

  return matchedChunks.slice(0, 6);
}
