import Redis from "ioredis"

let redis: Redis | null = null

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn("REDIS_URL not configured, caching disabled")
    return null
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
      })

      redis.on("error", (error) => {
        console.error("Redis connection error:", error)
      })

      redis.on("connect", () => {
        console.log("Redis connected successfully")
      })
    } catch (error) {
      console.error("Failed to create Redis client:", error)
      return null
    }
  }

  return redis
}

// Helper function to safely use Redis with fallback
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  const client = getRedisClient()

  // If Redis is not available, just fetch the data
  if (!client) {
    return fetcher()
  }

  try {
    // Try to connect if not already connected
    if (client.status !== "ready") {
      await client.connect()
    }

    // Try to get from cache
    const cached = await client.get(key)
    if (cached) {
      return JSON.parse(cached) as T
    }

    // Fetch fresh data
    const data = await fetcher()

    // Store in cache (fire and forget)
    client.setex(key, ttl, JSON.stringify(data)).catch((error) => {
      console.error("Failed to cache data:", error)
    })

    return data
  } catch (error) {
    console.error("Redis error, falling back to direct fetch:", error)
    return fetcher()
  }
}

// Helper to invalidate cache
export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedisClient()
  if (!client) return

  try {
    if (client.status !== "ready") {
      await client.connect()
    }

    const keys = await client.keys(pattern)
    if (keys.length > 0) {
      await client.del(...keys)
    }
  } catch (error) {
    console.error("Failed to invalidate cache:", error)
  }
}
