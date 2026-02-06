import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Secret partagé entre les apps (env variable)
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET

// Verify internal API secret
function verifySecret(req: NextRequest): boolean {
  if (!INTERNAL_API_SECRET) {
    console.error("INTERNAL_API_SECRET not configured")
    return false
  }
  
  const authHeader = req.headers.get("authorization")
  return authHeader === `Bearer ${INTERNAL_API_SECRET}`
}

// GET - Fetch active API keys for a provider
export async function GET(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const provider = req.nextUrl.searchParams.get("provider")

    const keys = await prisma.apiKey.findMany({
      where: {
        isActive: true,
        ...(provider ? { provider: provider.toLowerCase() } : {}),
      },
      select: {
        id: true,
        provider: true,
        name: true,
        key: true, // Full key for internal use
        usageCount: true,
        errorCount: true,
        lastUsedAt: true,
      },
      orderBy: [
        { errorCount: "asc" }, // Least errors first
        { usageCount: "asc" }, // Least used first (load balancing)
      ],
    })

    return NextResponse.json(keys)
  } catch (error) {
    console.error("GET /api/internal/api-keys error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Report key usage and errors
export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { keyId, success, error } = body

    if (!keyId) {
      return NextResponse.json({ error: "keyId is required" }, { status: 400 })
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
        ...(error
          ? {
              errorCount: { increment: 1 },
              lastError: typeof error === "string" ? error.slice(0, 255) : String(error).slice(0, 255),
            }
          : {}),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/internal/api-keys error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Reset error count for a key (optional, for admin recovery)
export async function PATCH(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { keyId } = body

    if (!keyId) {
      return NextResponse.json({ error: "keyId is required" }, { status: 400 })
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: {
        errorCount: 0,
        lastError: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH /api/internal/api-keys error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
