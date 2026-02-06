import { Ratelimit } from "@upstash/ratelimit"
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

// Create rate limiter with Redis or fallback to in-memory
function createRateLimiter(config: RateLimitConfig) {
  const redis = getRedisClient()
  
  if (redis) {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, `${config.window} s`),
      analytics: false,
    })
  }
  
  return null
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
  
  const limiter = createRateLimiter(config)
  
  let result: { success: boolean; remaining: number; reset: number }
  
  if (limiter) {
    const upstashResult = await limiter.limit(identifier)
    result = {
      success: upstashResult.success,
      remaining: upstashResult.remaining,
      reset: upstashResult.reset,
    }
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
