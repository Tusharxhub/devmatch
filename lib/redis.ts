// lib/redis.ts
// Redis client with connection pooling and error handling
import Redis from "ioredis";
import { env } from "@/lib/env";

function logInfo(event: string, context?: Record<string, unknown>) {
  console.info(`[Redis] ${event}`, context ?? {});
}

function logWarn(event: string, context?: Record<string, unknown>) {
  console.warn(`[Redis] ${event}`, context ?? {});
}

function logError(event: string, error: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error("Unknown error");
  console.error(`[Redis] ${event}`, {
    ...context,
    name: err.name,
    message: err.message,
  });
}

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const bullMqConnectionOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
} as const;

let redisConfigValidated = false;

async function validateRedisConfig(client: Redis): Promise<void> {
  if (redisConfigValidated) return;

  try {
    const config = await client.config("GET", "maxmemory-policy");
    const policy = Array.isArray(config) ? config[1] : undefined;

    if (policy && policy !== "noeviction") {
      logWarn("eviction_policy_not_recommended", {
        expected: "noeviction",
        actual: policy,
      });
    } else if (policy === "noeviction") {
      logInfo("eviction_policy_ok", { policy });
    }

    redisConfigValidated = true;
  } catch (error) {
    // Some managed Redis providers block CONFIG reads.
    logWarn("eviction_policy_check_unavailable", {
      reason: error instanceof Error ? error.message : "unknown",
    });
  }
}

function createRedisClient(): Redis {
  const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      if (times > 3) {
        logError("max_retries_reached", new Error("Retry attempts exceeded"), {
          attempts: times,
        });
        return null;
      }
      const delay = Math.min(times * 200, 2000);
      logWarn("retrying_connection", { attempt: times, delayMs: delay });
      return delay;
    },
    reconnectOnError(err: Error) {
      const targetErrors = ["READONLY", "ECONNREFUSED"];
      return targetErrors.some((e) => err.message.includes(e));
    },
    lazyConnect: true,
    enableReadyCheck: true,
  });

  redis.on("ready", () => {
    logInfo("connected");
    void validateRedisConfig(redis);
  });

  redis.on("error", (err: Error) => {
    logError("connection_error", err);
  });

  return redis;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// ─── Cache Helpers ────────────────────────────────────────────────────────────

const DEFAULT_TTL = 3600; // 1 hour

async function ensureRedisConnection(): Promise<void> {
  if (redis.status === "ready" || redis.status === "connect") return;
  await redis.connect();
  await validateRedisConfig(redis);
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    await ensureRedisConnection();
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    logError("cache_get_failed", error, { key });
    return null;
  }
}

export async function setCache(
  key: string,
  data: unknown,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  try {
    await ensureRedisConnection();
    await redis.set(key, JSON.stringify(data), "EX", ttl);
  } catch (error) {
    logError("cache_set_failed", error, { key, ttl });
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    await ensureRedisConnection();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logError("cache_invalidation_failed", error, { pattern });
  }
}

export async function checkRedisHealth(): Promise<boolean> {
  try {
    await ensureRedisConnection();
    const pong = await redis.ping();
    return pong === "PONG";
  } catch (error) {
    logError("health_check_failed", error);
    return false;
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
