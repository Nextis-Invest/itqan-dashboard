import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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
const cookieDomain = getCookieDomain()

export async function POST() {
  const cookieStore = await cookies()
  
  // Cookie names used by NextAuth
  const cookieNames = [
    isProduction ? "__Secure-authjs.session-token" : "authjs.session-token",
    isProduction ? "__Secure-authjs.callback-url" : "authjs.callback-url",
    isProduction ? "__Host-authjs.csrf-token" : "authjs.csrf-token",
  ]

  // Delete all auth cookies with proper domain
  for (const name of cookieNames) {
    // Delete without domain (for __Host- cookies)
    cookieStore.delete(name)
    
    // Also try to delete with domain set
    if (cookieDomain && !name.startsWith("__Host-")) {
      cookieStore.set(name, "", {
        expires: new Date(0),
        path: "/",
        domain: cookieDomain,
        secure: isProduction,
        httpOnly: true,
        sameSite: "lax",
      })
    }
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  // Also support GET for easy redirects
  const response = await POST()
  return response
}
