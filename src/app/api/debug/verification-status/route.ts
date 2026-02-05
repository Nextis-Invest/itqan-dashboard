import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        verificationToken: true,
        verificationTokenExpiry: true,
      },
    })

    return NextResponse.json({
      session: {
        userId: session.user.id,
        email: session.user.email,
        emailVerifiedInSession: (session.user as any).emailVerified,
      },
      database: user,
      analysis: {
        isVerifiedInDb: !!user?.emailVerified,
        hasActiveToken: !!user?.verificationToken,
        tokenExpired: user?.verificationTokenExpiry
          ? new Date(user.verificationTokenExpiry) < new Date()
          : null,
      }
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    )
  }
}
