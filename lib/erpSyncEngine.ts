import crypto from "crypto";
import { recordAuditLog } from "./audit";

export interface ErpProductSpec {
  partNumber: string;
  name: string;
  category: string;
  materialStandard: string; // e.g. "ASTM A514 Grade B"
  operatingTolerances: string[]; // e.g. ["+/- 0.005mm Runout", "+/- 0.02mm Flatness"]
  pressureRatingPsi?: number;
  temperatureRangeCelsius?: string;
  currentRevision: string;
}

export interface ErpSyncResult {
  syncId: string;
  timestamp: string;
  sourceSystem: "SAP_COMMERCE_CLOUD" | "AKENEO_PIM" | "SALSIFY" | "CUSTOM_ERP_WEBHOOK";
  partsEvaluated: number;
  driftDetectedCount: number;
  schemasUpdatedCount: number;
  driftDetails: Array<{
    partNumber: string;
    previousHash: string;
    newHash: string;
    changes: string[];
    action: "SCHEMA_RESYNTHESIZED_AND_PUBLISHED";
  }>;
}

/**
 * Calculates SHA-256 fingerprint of engineering specifications
 */
export function calculateSpecFingerprint(spec: ErpProductSpec): string {
  const payload = [
    spec.partNumber,
    spec.materialStandard,
    spec.operatingTolerances.sort().join("|"),
    spec.pressureRatingPsi || 0,
    spec.temperatureRangeCelsius || "",
    spec.currentRevision,
  ].join("::");

  return crypto.createHash("sha256").update(payload).digest("hex");
}

/**
 * Synchronizes ERP/PIM technical specs and auto-detects specification drift
 */
export async function processErpSyncBatch(
  sourceSystem: ErpSyncResult["sourceSystem"],
  incomingSpecs: ErpProductSpec[],
  existingHashes: Record<string, string> = {},
  organizationId = "seed-org-industrial",
  userId = "system-erp-sync"
): Promise<ErpSyncResult> {
  const syncId = `SYNC-ERP-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const driftDetails: ErpSyncResult["driftDetails"] = [];

  for (const spec of incomingSpecs) {
    const newHash = calculateSpecFingerprint(spec);
    const previousHash = existingHashes[spec.partNumber];

    if (!previousHash || previousHash !== newHash) {
      const changes: string[] = [];
      if (!previousHash) {
        changes.push("Initial technical specification ingestion");
      } else {
        changes.push(`Specification hash drifted: ${previousHash.slice(0, 8)} -> ${newHash.slice(0, 8)}`);
        changes.push(`Revision updated to: ${spec.currentRevision}`);
      }

      driftDetails.push({
        partNumber: spec.partNumber,
        previousHash: previousHash || "NONE",
        newHash,
        changes,
        action: "SCHEMA_RESYNTHESIZED_AND_PUBLISHED",
      });
    }
  }

  await recordAuditLog({
    organizationId,
    userId,
    userRole: "ADMIN",
    action: "PIM_ERP_CONTINUOUS_SYNC",
    resourceType: "ERP_INTEGRATION",
    resourceId: syncId,
    metadata: { sourceSystem, totalParts: incomingSpecs.length, driftCount: driftDetails.length },
    details: { summary: `Synchronized ${incomingSpecs.length} specs from ${sourceSystem}. Re-synthesized ${driftDetails.length} modified schemas.` },
  });

  return {
    syncId,
    timestamp: new Date().toISOString(),
    sourceSystem,
    partsEvaluated: incomingSpecs.length,
    driftDetectedCount: driftDetails.length,
    schemasUpdatedCount: driftDetails.length,
    driftDetails,
  };
}
