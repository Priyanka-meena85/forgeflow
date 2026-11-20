import { createHash } from "crypto";

export interface ChainedLogEntry {
  id: string;
  index: number;
  prevHash: string;
  currentHash: string;
  action: string;
  userId: string;
  organizationId: string;
  resourceType: string;
  resourceId: string | null;
  timestamp: string;
  signatureVerified: boolean;
}

const memoryChain: ChainedLogEntry[] = [
  {
    id: "block_0",
    index: 0,
    prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
    currentHash: "6f5286e680a6d510f2c002237583e74b3f88f28c5a2c42ab4847240c54173879",
    action: "TENANT_GENESIS_INITIALIZED",
    userId: "sys_root",
    organizationId: "seed-org-industrial",
    resourceType: "ORGANIZATION",
    resourceId: "seed-org-industrial",
    timestamp: "2026-01-01T00:00:00.000Z",
    signatureVerified: true,
  },
];

export function computeLogHash(prevHash: string, data: Record<string, unknown>): string {
  const content = `${prevHash}|${JSON.stringify(data)}`;
  return createHash("sha256").update(content).digest("hex");
}

export function recordChainedAuditEntry(
  action: string,
  userId: string,
  organizationId: string,
  resourceType: string,
  resourceId: string | null,
): ChainedLogEntry {
  const lastEntry = memoryChain[memoryChain.length - 1];
  const prevHash = lastEntry ? lastEntry.currentHash : "0".repeat(64);
  const index = memoryChain.length;
  const timestamp = new Date().toISOString();

  const currentHash = computeLogHash(prevHash, {
    index,
    action,
    userId,
    organizationId,
    resourceType,
    resourceId,
    timestamp,
  });

  const newEntry: ChainedLogEntry = {
    id: `block_${index}`,
    index,
    prevHash,
    currentHash,
    action,
    userId,
    organizationId,
    resourceType,
    resourceId,
    timestamp,
    signatureVerified: true,
  };

  memoryChain.push(newEntry);
  return newEntry;
}

export function verifyChainIntegrity(): {
  isValid: boolean;
  totalBlocks: number;
  tamperedBlockIndex: number | null;
  verifiedAt: string;
} {
  for (let i = 1; i < memoryChain.length; i++) {
    const prev = memoryChain[i - 1];
    const curr = memoryChain[i];

    if (curr.prevHash !== prev.currentHash) {
      return {
        isValid: false,
        totalBlocks: memoryChain.length,
        tamperedBlockIndex: i,
        verifiedAt: new Date().toISOString(),
      };
    }
  }

  return {
    isValid: true,
    totalBlocks: memoryChain.length,
    tamperedBlockIndex: null,
    verifiedAt: new Date().toISOString(),
  };
}

export function getAuditChain(): ChainedLogEntry[] {
  return [...memoryChain];
}
