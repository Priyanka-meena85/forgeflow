interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp in seconds
}

interface WindowRecord {
  count: number;
  resetAt: number; // ms
}

// In-Memory sliding-window rate limit store for development and self-hosted environments
const memoryBuckets = new Map<string, WindowRecord>();

// Clean up stale buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryBuckets.entries()) {
    if (record.resetAt <= now) {
      memoryBuckets.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  // Mode 1: Upstash Redis (Distributed Serverless Production)
  if (redisUrl && redisToken) {
    try {
      const now = Math.floor(Date.now() / 1000);
      const windowKey = `ratelimit:${key}:${Math.floor(now / windowSeconds)}`;

      const res = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", windowKey],
          ["EXPIRE", windowKey, windowSeconds * 2],
        ]),
      });

      if (res.ok) {
        const json = (await res.json()) as Array<{ result: number }>;
        const count = json[0]?.result || 1;
        const resetAt = (Math.floor(now / windowSeconds) + 1) * windowSeconds;
        return {
          success: count <= limit,
          limit,
          remaining: Math.max(0, limit - count),
          resetAt,
        };
      }
    } catch (err) {
      console.warn("[RateLimit Engine] Upstash Redis request failed, falling back to memory:", err);
    }
  }

  // Mode 2: In-Memory Sliding Window
  const now = Date.now();
  const existing = memoryBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowSeconds * 1000;
    memoryBuckets.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt: Math.ceil(resetAt / 1000),
    };
  }

  existing.count += 1;
  const success = existing.count <= limit;
  return {
    success,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: Math.ceil(existing.resetAt / 1000),
  };
}

export const RATE_LIMITS = {
  AUTH: { limit: 10, windowSeconds: 60 }, // 10 attempts per minute
  AI_GENERATION: { limit: 20, windowSeconds: 3600 }, // 20 requests per hour
  STANDARD_API: { limit: 120, windowSeconds: 60 }, // 120 requests per minute
};
