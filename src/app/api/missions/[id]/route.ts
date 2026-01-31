import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        freelancer: { select: { id: true, name: true, email: true } },
        _count: { select: { proposals: true } },
      },
    })

    if (!mission) {
      return NextResponse.json({ message: "Mission introuvable" }, { status: 404 })
    }

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Error fetching mission:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const mission = await prisma.mission.findUnique({
      where: { id },
      select: { clientId: true, status: true },
    })

    if (!mission) {
      return NextResponse.json({ message: "Mission introuvable" }, { status: 404 })
    }

    // Check ownership (unless admin)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (mission.clientId !== session.user.id && user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const body = await req.json()

    // Handle status change
    if (body.status) {
      const validTransitions: Record<string, string[]> = {
        DRAFT: ["OPEN", "CANCELLED"],
        OPEN: ["CANCELLED", "IN_PROGRESS"],
        IN_PROGRESS: ["COMPLETED", "CANCELLED"],
      }

      const allowed = validTransitions[mission.status] || []
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          { message: `Transition de ${mission.status} vers ${body.status} non autorisée` },
          { status: 400 }
        )
      }

      await prisma.mission.update({
        where: { id },
        data: { status: body.status },
      })

      return NextResponse.json({ success: true })
    }

    // Handle field update
    const {
      title, description, budget, budgetMin, budgetMax, budgetType,
      currency, category, subcategory, deadline, duration,
      experienceLevel, remote, location, skills,
    } = body

    const data: any = {}
    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description || null
    if (budget !== undefined) data.budget = budget ? parseFloat(budget) : null
    if (budgetMin !== undefined) data.budgetMin = budgetMin ? parseFloat(budgetMin) : null
    if (budgetMax !== undefined) data.budgetMax = budgetMax ? parseFloat(budgetMax) : null
    if (budgetType !== undefined) data.budgetType = budgetType || null
    if (currency !== undefined) data.currency = currency || "MAD"
    if (category !== undefined) data.category = category || null
    if (subcategory !== undefined) data.subcategory = subcategory || null
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null
    if (duration !== undefined) data.duration = duration || null
    if (experienceLevel !== undefined) data.experienceLevel = experienceLevel || null
    if (remote !== undefined) data.remote = remote
    if (location !== undefined) data.location = location || null
    if (skills !== undefined) data.skills = Array.isArray(skills) ? skills : []

    const updated = await prisma.mission.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, mission: updated })
  } catch (error) {
    console.error("Error updating mission:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const mission = await prisma.mission.findUnique({
      where: { id },
      select: { clientId: true, status: true },
    })

    if (!mission) {
      return NextResponse.json({ message: "Mission introuvable" }, { status: 404 })
    }

    // Check ownership
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (mission.clientId !== session.user.id && user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    if (!["DRAFT", "OPEN"].includes(mission.status)) {
      return NextResponse.json(
        { message: "Seules les missions en brouillon ou ouvertes peuvent être annulées" },
        { status: 400 }
      )
    }

    await prisma.mission.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting mission:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
