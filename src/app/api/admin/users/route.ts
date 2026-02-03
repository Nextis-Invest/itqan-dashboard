import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")

    const where: any = {}
    if (role) where.role = role

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clientProfile: {
          select: {
            companyName: true,
            ice: true,
            rc: true,
            address: true,
            city: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("GET /api/admin/users error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
