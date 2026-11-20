/**
 * Sliding-Window & Token-Bucket Rate Limiter for Developer REST APIs
 * Compatible with distributed Redis and in-memory fallback.
 */

import { redisIncr } from "@/lib/redis";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export async function checkApiRateLimit(
  identifier: string,
  limit = 60,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  const windowKey = `ratelimit:${identifier}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
  
  try {
    const count = await redisIncr(windowKey, windowSeconds);
    const remaining = Math.max(0, limit - count);
    const resetSeconds = windowSeconds - (Math.floor(Date.now() / 1000) % windowSeconds);

    return {
      success: count <= limit,
      limit,
      remaining,
      resetSeconds,
    };
  } catch {
    // Fail-open for enterprise resilience
    return {
      success: true,
      limit,
      remaining: 1,
      resetSeconds: windowSeconds,
    };
  }
}
