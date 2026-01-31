import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, budget, currency, category, deadline } = body

    if (!title) {
      return NextResponse.json({ message: "Le titre est requis" }, { status: 400 })
    }

    const mission = await prisma.mission.create({
      data: {
        title,
        description: description || null,
        budget: budget ? parseFloat(budget) : null,
        currency: currency || "EUR",
        category: category || null,
        deadline: deadline ? new Date(deadline) : null,
        status: "DRAFT",
        clientId: session.user.id!,
      },
    })

    return NextResponse.json({ success: true, mission })
  } catch (error) {
    console.error("Error creating mission:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const missions = await prisma.mission.findMany({
      include: {
        client: { select: { name: true, email: true } },
        freelancer: { select: { name: true, email: true } },
        _count: { select: { proposals: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(missions)
  } catch (error) {
    console.error("Error fetching missions:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
