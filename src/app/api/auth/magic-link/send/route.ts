import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { rateLimit } from "@/lib/rate-limit"

const resend = new Resend(process.env.RESEND_API_KEY)

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  // Rate limit: 5 requests per minute per IP
  const rateLimitResult = await rateLimit(req, "auth")
  if (!rateLimitResult.success) {
    return rateLimitResult.response
  }

  try {
    const body = await req.json()
    const { email, name, role, source } = body

    // Input validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "L'email est requis" },
        { status: 400 }
      )
    }

    const sanitizedEmail = email.trim().toLowerCase()
    
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return NextResponse.json(
        { message: "Format d'email invalide" },
        { status: 400 }
      )
    }

    if (sanitizedEmail.length > 255) {
      return NextResponse.json(
        { message: "Email trop long" },
        { status: 400 }
      )
    }

    let user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    if (!user) {
      if (source === "onboarding") {
        // Signup: create user with name and role
        user = await prisma.user.create({
          data: {
            email: sanitizedEmail,
            name: typeof name === "string" ? name.trim().substring(0, 100) : null,
            role: role === "FREELANCER" ? "FREELANCER" : "CLIENT",
          },
        })
      } else {
        // Login: user not found
        // Return generic message to prevent email enumeration
        // But we need to tell the client to redirect to signup
        return NextResponse.json(
          { message: "Si cet email existe, un code vous sera envoyé.", noAccount: true },
          { status: 200 }  // Return 200 to prevent enumeration
        )
      }
    }

    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: code,
        verificationTokenExpiry: codeExpiry,
      },
    })

    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@itqan.com"
    const isNewUser = source === "onboarding"

    const { error } = await resend.emails.send({
      from: `Itqan <${fromEmail}>`,
      to: [sanitizedEmail],
      subject: `${code} - ${isNewUser ? "Bienvenue sur" : "Code de connexion"} Itqan`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background: #0a0a0a; padding: 40px; border-radius: 12px;">
          <h2 style="color: #a3e635; margin-bottom: 8px;">${isNewUser ? "Bienvenue sur Itqan ! 🎉" : "Connexion à Itqan"}</h2>
          <p style="color: #d4d4d4;">${isNewUser ? "Votre code de vérification :" : "Votre code de connexion :"}</p>
          <div style="font-size: 48px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; color: #a3e635;">
            ${code}
          </div>
          <p style="color: #737373; font-size: 14px;">Ce code expire dans 10 minutes.</p>
          <p style="color: #525252; font-size: 12px; margin-top: 30px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { message: "Erreur d'envoi d'email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Code envoyé",
      success: true,
    })
  } catch (err) {
    console.error("Error sending code:", err)
    return NextResponse.json({ message: "Erreur" }, { status: 500 })
  }
}
