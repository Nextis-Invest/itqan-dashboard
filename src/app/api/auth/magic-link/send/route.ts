import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { message: "L'email est requis" },
        { status: 400 }
      )
    }

    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Auto-create user for Itqan
      user = await prisma.user.create({
        data: {
          email,
          role: "CLIENT",
        },
      })
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

    const { error } = await resend.emails.send({
      from: `Itqan <${fromEmail}>`,
      to: [email],
      subject: `${code} - Code de connexion Itqan`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background: #0a0a0a; padding: 40px; border-radius: 12px;">
          <h2 style="color: #a3e635; margin-bottom: 8px;">Connexion à Itqan</h2>
          <p style="color: #d4d4d4;">Votre code de connexion est :</p>
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
