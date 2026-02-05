import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json(
        { error: "Code invalide" },
        { status: 400 }
      )
    }

    // Find user with this verification code
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        verificationToken: code,
        verificationTokenExpiry: {
          gt: new Date(), // Code not expired
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Code invalide ou expiré" },
        { status: 400 }
      )
    }

    // Verify the email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    })

    console.log('[Verify Code] SUCCESS - Email verified for user:', user.id)

    return NextResponse.json({
      success: true,
      message: "Email vérifié avec succès",
    })
  } catch (error) {
    console.error("[Verify Code] Error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    )
  }
}
