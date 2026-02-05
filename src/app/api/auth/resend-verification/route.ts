import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    // Check if already verified
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        emailVerified: true,
        verificationTokenExpiry: true
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email déjà vérifié" },
        { status: 400 }
      )
    }

    // Rate limiting: don't allow resending within 1 minute
    if (user.verificationTokenExpiry) {
      const lastSent = new Date(user.verificationTokenExpiry).getTime() - (24 * 60 * 60 * 1000)
      const now = Date.now()
      const oneMinute = 60 * 1000

      if (now - lastSent < oneMinute) {
        return NextResponse.json(
          { error: "Veuillez attendre avant de renvoyer l'email" },
          { status: 429 }
        )
      }
    }

    // Generate new verification token
    const token = randomBytes(32).toString("hex")
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        verificationToken: token,
        verificationTokenExpiry: expiry,
      },
    })

    // TODO: Send verification email
    // For now, we'll just log the verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`
    console.log("Verification URL:", verificationUrl)

    // In production, you would send an email here using a service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // Example:
    // await sendEmail({
    //   to: user.email,
    //   subject: "Vérifiez votre adresse email",
    //   html: `<a href="${verificationUrl}">Cliquez ici pour vérifier votre email</a>`
    // })

    return NextResponse.json({
      success: true,
      message: "Email de vérification envoyé",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
