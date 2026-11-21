import { redisGet, redisSet } from "./redis";

export interface IdempotencyRecord {
  key: string;
  processedAt: string;
  resourceId?: string;
  responseStatus: number;
  responseBody?: unknown;
}

/**
 * Checks whether an event/request has already been processed within the TTL window.
 * Prevents double-billing and duplicate quota consumption.
 */
export async function checkIdempotency(key: string): Promise<{ isDuplicate: boolean; record: IdempotencyRecord | null }> {
  if (!key) return { isDuplicate: false, record: null };

  const storageKey = `idempotency:${key}`;
  const raw = await redisGet(storageKey);

  if (raw) {
    try {
      const record = JSON.parse(raw) as IdempotencyRecord;
      return { isDuplicate: true, record };
    } catch {
      return { isDuplicate: true, record: null };
    }
  }

  return { isDuplicate: false, record: null };
}

/**
 * Marks an event/request as processed with a specified TTL (default: 86400s / 24 hours).
 */
export async function recordIdempotency(
  key: string,
  responseStatus = 200,
  responseBody?: unknown,
  ttlSeconds = 86400
): Promise<void> {
  if (!key) return;

  const storageKey = `idempotency:${key}`;
  const record: IdempotencyRecord = {
    key,
    processedAt: new Date().toISOString(),
    responseStatus,
    responseBody,
  };

  await redisSet(storageKey, JSON.stringify(record), ttlSeconds);
}
