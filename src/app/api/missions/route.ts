import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { sendEmail, newMissionForReviewEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const {
      title, description, budget, budgetMin, budgetMax, budgetType,
      currency, category, subcategory, deadline, duration,
      experienceLevel, remote, location, skills,
    } = body

    if (!title) {
      return NextResponse.json({ message: "Le titre est requis" }, { status: 400 })
    }

    const mission = await prisma.mission.create({
      data: {
        title,
        description: description || null,
        budget: budget ? parseFloat(budget) : null,
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
        budgetType: budgetType || null,
        currency: currency || "MAD",
        category: category || null,
        subcategory: subcategory || null,
        deadline: deadline ? new Date(deadline) : null,
        duration: duration || null,
        experienceLevel: experienceLevel || null,
        remote: remote !== undefined ? remote : true,
        location: location || null,
        skills: Array.isArray(skills) ? skills : [],
        status: "PENDING_REVIEW",
        clientId: session.user.id!,
      },
    })

    // Email all admins about new mission to review
    try {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { email: true },
      })
      const clientName = session.user.name || session.user.email || "Un client"
      for (const admin of admins) {
        await sendEmail({
          to: admin.email,
          subject: "Nouvelle mission à valider — Itqan",
          html: newMissionForReviewEmail(clientName, title, mission.id),
        })
      }
    } catch (e) {
      console.error("Admin email error:", e)
    }

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
