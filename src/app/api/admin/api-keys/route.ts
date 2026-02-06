import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"

// Helper to mask API key (show only last 4 characters)
function maskKey(key: string): string {
  if (key.length <= 4) return "****"
  return "****..." + key.slice(-4)
}

// Helper to verify admin role
async function verifyAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non autorisé", status: 401 }
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (admin?.role !== "ADMIN") {
    return { error: "Accès refusé", status: 403 }
  }

  return { userId: session.user.id }
}

// GET - List all API keys (masked)
export async function GET() {
  try {
    const adminCheck = await verifyAdmin()
    if ("error" in adminCheck) {
      return NextResponse.json({ message: adminCheck.error }, { status: adminCheck.status })
    }

    const apiKeys = await prisma.apiKey.findMany({
      orderBy: [{ provider: "asc" }, { createdAt: "desc" }],
    })

    // Mask the keys for security
    const maskedKeys = apiKeys.map((k) => ({
      ...k,
      key: maskKey(k.key),
    }))

    return NextResponse.json(maskedKeys)
  } catch (error) {
    console.error("GET /api/admin/api-keys error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Add a new API key
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin()
    if ("error" in adminCheck) {
      return NextResponse.json({ message: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await req.json()
    const { provider, name, key } = body

    if (!provider || !key) {
      return NextResponse.json(
        { message: "Provider et clé API sont requis" },
        { status: 400 }
      )
    }

    // Check if key already exists
    const existingKey = await prisma.apiKey.findFirst({
      where: { key },
    })

    if (existingKey) {
      return NextResponse.json(
        { message: "Cette clé API existe déjà" },
        { status: 409 }
      )
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        provider: provider.toLowerCase(),
        name: name || `${provider} Key`,
        key,
      },
    })

    return NextResponse.json({
      ...apiKey,
      key: maskKey(apiKey.key),
    })
  } catch (error) {
    console.error("POST /api/admin/api-keys error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH - Update API key (toggle active or update name)
export async function PATCH(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin()
    if ("error" in adminCheck) {
      return NextResponse.json({ message: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await req.json()
    const { id, isActive, name } = body

    if (!id) {
      return NextResponse.json({ message: "ID requis" }, { status: 400 })
    }

    const updateData: { isActive?: boolean; name?: string } = {}
    if (typeof isActive === "boolean") updateData.isActive = isActive
    if (typeof name === "string") updateData.name = name

    const apiKey = await prisma.apiKey.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      ...apiKey,
      key: maskKey(apiKey.key),
    })
  } catch (error) {
    console.error("PATCH /api/admin/api-keys error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Remove an API key
export async function DELETE(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin()
    if ("error" in adminCheck) {
      return NextResponse.json({ message: adminCheck.error }, { status: adminCheck.status })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "ID requis" }, { status: 400 })
    }

    await prisma.apiKey.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/api-keys error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
