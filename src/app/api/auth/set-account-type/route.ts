import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { userId, accountType } = await request.json()

    // Verify the user is setting their own account type
    if (session.user.id !== userId) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Validate account type
    if (!["CLIENT", "FREELANCER"].includes(accountType)) {
      return NextResponse.json({ message: "Type de compte invalide" }, { status: 400 })
    }

    // Check if user already has a profile (shouldn't happen, but just in case)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { freelancerProfile: true, clientProfile: true },
    })

    if (!existingUser) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
    }

    if (existingUser.freelancerProfile || existingUser.clientProfile) {
      return NextResponse.json({ message: "Un profil existe déjà" }, { status: 400 })
    }

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: accountType },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting account type:", error)
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 })
  }
}
