// lib/redis.ts
// Redis client with connection pooling and error handling
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      if (times > 3) {
        console.error("[Redis] Max retries reached, giving up");
        return null;
      }
      const delay = Math.min(times * 200, 2000);
      console.log(`[Redis] Retrying connection in ${delay}ms (attempt ${times})`);
      return delay;
    },
    reconnectOnError(err: Error) {
      const targetErrors = ["READONLY", "ECONNREFUSED"];
      return targetErrors.some((e) => err.message.includes(e));
    },
    lazyConnect: false,
    enableReadyCheck: true,
  });

  redis.on("connect", () => {
    console.log("[Redis] Connected successfully");
  });

  redis.on("error", (err: Error) => {
    console.error("[Redis] Connection error:", err.message);
  });

  return redis;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// ─── Cache Helpers ────────────────────────────────────────────────────────────

const DEFAULT_TTL = 3600; // 1 hour

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch {
    console.error(`[Redis] Cache get failed for key: ${key}`);
    return null;
  }
}

export async function setCache(
  key: string,
  data: unknown,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
  } catch {
    console.error(`[Redis] Cache set failed for key: ${key}`);
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    console.error(`[Redis] Cache invalidation failed for pattern: ${pattern}`);
  }
}

export async function getCacheOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached) return cached;

  const fresh = await fetcher();
  await setCache(key, fresh, ttl);
  return fresh;
}

export default redis;
