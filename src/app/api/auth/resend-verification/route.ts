import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { resend, FROM_EMAIL } from "@/lib/email/resend"
import { VerificationEmail, verificationEmailText } from "@/lib/email/templates/verification-email"
import { render } from "@react-email/render"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    console.log('[Resend Verification] Session:', {
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email
    })

    if (!session?.user?.id) {
      console.log('[Resend Verification] No session - returning 401')
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

    console.log('[Resend Verification] User found:', {
      email: user?.email,
      emailVerified: user?.emailVerified,
      hasToken: !!user?.verificationTokenExpiry
    })

    if (!user) {
      console.log('[Resend Verification] User not found - returning 404')
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      console.log('[Resend Verification] Email already verified - returning 400')
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

    // Generate verification URL using the request origin (works in all environments)
    const origin = request.headers.get("origin") ||
                   request.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
                   process.env.NEXTAUTH_URL ||
                   "https://app.itqan.ma"

    const verificationUrl = `${origin}/api/auth/verify-email?token=${token}`
    console.log('[Resend Verification] SUCCESS - Token generated')
    console.log('[Resend Verification] Origin:', origin)
    console.log('[Resend Verification] Verification URL:', verificationUrl)

    try {
      // Render email templates
      const emailHtml = await render(
        VerificationEmail({
          verificationUrl,
          userName: session.user.name || undefined,
        })
      )

      const emailText = verificationEmailText({
        verificationUrl,
        userName: session.user.name || undefined,
      })

      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Vérifiez votre adresse email - Itqan",
        html: emailHtml,
        text: emailText,
      })

      if (error) {
        console.error('[Resend Verification] Email send error:', error)
        return NextResponse.json(
          { error: "Erreur lors de l'envoi de l'email" },
          { status: 500 }
        )
      }

      console.log('[Resend Verification] Email sent successfully:', data)
    } catch (emailError) {
      console.error('[Resend Verification] Email send exception:', emailError)
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      )
    }

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
