import { NextResponse } from "next/server"

const isProduction = process.env.NODE_ENV === "production"

// Derive cookie domain from NEXTAUTH_URL (e.g., https://app.itqan.ma -> .itqan.ma)
function getCookieDomain(): string | undefined {
  if (!isProduction) return undefined
  try {
    const url = new URL(process.env.NEXTAUTH_URL || "")
    const parts = url.hostname.split(".")
    if (parts.length >= 2) {
      return "." + parts.slice(-2).join(".")
    }
  } catch {}
  return undefined
}

export async function POST() {
  const cookieDomain = getCookieDomain()
  
  // Cookie names used by NextAuth
  const cookieConfigs = [
    { 
      name: isProduction ? "__Secure-authjs.session-token" : "authjs.session-token",
      hasDomain: true 
    },
    { 
      name: isProduction ? "__Secure-authjs.callback-url" : "authjs.callback-url",
      hasDomain: true 
    },
    { 
      name: isProduction ? "__Host-authjs.csrf-token" : "authjs.csrf-token",
      hasDomain: false // __Host- cookies cannot have domain
    },
  ]

  // Build Set-Cookie headers to properly clear cookies
  const cookieHeaders: string[] = []
  
  for (const { name, hasDomain } of cookieConfigs) {
    // Clear cookie without domain (local)
    const baseAttrs = [
      `${name}=`,
      "Path=/",
      "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "HttpOnly",
      "SameSite=Lax",
    ]
    if (isProduction) baseAttrs.push("Secure")
    cookieHeaders.push(baseAttrs.join("; "))
    
    // Also clear with domain for SSO cookies
    if (hasDomain && cookieDomain) {
      const domainAttrs = [
        `${name}=`,
        "Path=/",
        "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        `Domain=${cookieDomain}`,
        "HttpOnly",
        "SameSite=Lax",
      ]
      if (isProduction) domainAttrs.push("Secure")
      cookieHeaders.push(domainAttrs.join("; "))
    }
  }

  // Return response with all Set-Cookie headers
  const response = NextResponse.json({ success: true })
  cookieHeaders.forEach(cookie => {
    response.headers.append("Set-Cookie", cookie)
  })
  
  return response
}

export async function GET() {
  return POST()
}
