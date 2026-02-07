import { getRedisClient } from "./redis"
import { NextRequest, NextResponse } from "next/server"

// In-memory fallback for rate limiting when Redis is not available
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

interface RateLimitConfig {
  requests: number  // Number of requests allowed
  window: number    // Time window in seconds
}

// Default rate limits for different route types
export const RATE_LIMITS = {
  auth: { requests: 5, window: 60 },        // 5 requests per minute (login, magic link)
  api: { requests: 100, window: 60 },       // 100 requests per minute (general API)
  search: { requests: 30, window: 60 },     // 30 requests per minute (search endpoints)
  submit: { requests: 10, window: 60 },     // 10 requests per minute (form submissions)
} as const

// Redis-based rate limiting using ioredis
async function checkRedisRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ success: boolean; remaining: number; reset: number } | null> {
  const redis = getRedisClient()
  if (!redis) return null

  try {
    const key = `ratelimit:${identifier}`
    const now = Date.now()
    const windowMs = config.window * 1000
    const windowStart = now - windowMs

    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline()
    
    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart)
    
    // Count current requests in window
    pipeline.zcard(key)
    
    // Add current request
    pipeline.zadd(key, now, `${now}:${Math.random()}`)
    
    // Set expiry on the key
    pipeline.expire(key, config.window)

    const results = await pipeline.exec()
    
    if (!results) return null

    // Get the count (second command result)
    const countResult = results[1]
    const count = (countResult && countResult[1] as number) || 0

    const remaining = Math.max(0, config.requests - count - 1)
    const reset = now + windowMs

    return {
      success: count < config.requests,
      remaining,
      reset,
    }
  } catch (error) {
    console.error("Redis rate limit error:", error)
    return null
  }
}

// In-memory rate limiting fallback
function checkInMemoryRateLimit(
  identifier: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const key = identifier
  const entry = inMemoryStore.get(key)
  
  if (!entry || entry.resetAt < now) {
    // Reset or create new entry
    inMemoryStore.set(key, { count: 1, resetAt: now + config.window * 1000 })
    return { success: true, remaining: config.requests - 1, reset: now + config.window * 1000 }
  }
  
  if (entry.count >= config.requests) {
    return { success: false, remaining: 0, reset: entry.resetAt }
  }
  
  entry.count++
  return { success: true, remaining: config.requests - entry.count, reset: entry.resetAt }
}

// Get client identifier (IP address)
export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || 
             request.headers.get("x-real-ip") || 
             "anonymous"
  return ip
}

// Rate limit middleware
export async function rateLimit(
  request: NextRequest,
  configKey: keyof typeof RATE_LIMITS = "api"
): Promise<{ success: boolean; response?: NextResponse }> {
  const config = RATE_LIMITS[configKey]
  const identifier = `${configKey}:${getClientIdentifier(request)}`
  
  // Try Redis first, fall back to in-memory
  let result: { success: boolean; remaining: number; reset: number }
  
  const redisResult = await checkRedisRateLimit(identifier, config)
  if (redisResult) {
    result = redisResult
  } else {
    result = checkInMemoryRateLimit(identifier, config)
  }
  
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Too many requests",
          message: "Trop de requêtes. Veuillez réessayer dans quelques instants.",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(config.requests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.reset),
          }
        }
      ),
    }
  }
  
  return { success: true }
}

// Clean up old in-memory entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of inMemoryStore.entries()) {
    if (entry.resetAt < now) {
      inMemoryStore.delete(key)
    }
  }
}, 60000) // Clean every minute
