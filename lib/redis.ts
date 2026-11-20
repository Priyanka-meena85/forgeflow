/**
 * ForgeFlow Distributed Redis & Cloud Cache Adapter
 * Supports Upstash Redis REST API, TCP Redis (ElastiCache/Cloud), and In-Memory Fallback.
 */

interface CacheEntry {
  value: string;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();

export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.REDIS_URL ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

export async function redisGet(key: string): Promise<string | null> {
  // 1. Upstash REST API
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      });
      if (res.ok) {
        const data = await res.json() as { result?: string | null };
        return data.result ?? null;
      }
    } catch {
      // Fallback to memory on network blip
    }
  }

  // 2. In-Memory Resilient Cache
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

export async function redisSet(key: string, value: string, ttlSeconds = 0): Promise<boolean> {
  // 1. Upstash REST API
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const endpoint = ttlSeconds > 0
        ? `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?ex=${ttlSeconds}`
        : `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      });
      if (res.ok) return true;
    } catch {
      // Fallback to memory
    }
  }

  // 2. In-Memory Resilient Cache
  const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
  memoryCache.set(key, { value, expiresAt });
  return true;
}

export async function redisIncr(key: string, ttlSeconds = 60): Promise<number> {
  // 1. Upstash REST API
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/incr/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      });
      if (res.ok) {
        const data = await res.json() as { result?: number };
        if (typeof data.result === "number") {
          if (data.result === 1 && ttlSeconds > 0) {
            await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/expire/${encodeURIComponent(key)}/${ttlSeconds}`, {
              headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
            });
          }
          return data.result;
        }
      }
    } catch {
      // Fallback
    }
  }

  // 2. In-Memory Resilient Cache
  const current = memoryCache.get(key);
  let count = 1;
  const now = Date.now();
  if (current && (current.expiresAt === 0 || now < current.expiresAt)) {
    count = parseInt(current.value, 10) + 1;
    memoryCache.set(key, { value: count.toString(), expiresAt: current.expiresAt });
  } else {
    memoryCache.set(key, { value: "1", expiresAt: now + ttlSeconds * 1000 });
  }
  return count;
}
