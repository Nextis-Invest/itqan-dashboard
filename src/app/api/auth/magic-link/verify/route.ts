import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  // CRITICAL: Rate limit to prevent brute force on 4-digit code
  // Only 5 attempts per minute per IP
  const rateLimitResult = await rateLimit(req, "auth")
  if (!rateLimitResult.success) {
    return rateLimitResult.response
  }

  try {
    const body = await req.json()
    const { email, code } = body

    // Input validation
    if (!email || typeof email !== "string" || !code || typeof code !== "string") {
      return NextResponse.json(
        { message: "Email et code requis" },
        { status: 400 }
      )
    }

    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedCode = code.trim()

    // Code must be exactly 4 digits
    if (!/^\d{4}$/.test(sanitizedCode)) {
      return NextResponse.json(
        { message: "Code invalide" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        email: sanitizedEmail,
        verificationToken: sanitizedCode,
        verificationTokenExpiry: { gte: new Date() },
      },
    })

    if (!user) {
      // Add small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 500))
      return NextResponse.json(
        { message: "Code invalide ou expiré" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: null,
        verificationTokenExpiry: null,
        emailVerified: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      email: user.email,
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { message: "Erreur de vérification" },
      { status: 500 }
    )
  }
}
