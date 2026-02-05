import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", request.url)
      )
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    })

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_or_expired_token", request.url)
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

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL("/dashboard?verified=true", request.url)
    )
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.redirect(
      new URL("/login?error=verification_failed", request.url)
    )
  }
}
