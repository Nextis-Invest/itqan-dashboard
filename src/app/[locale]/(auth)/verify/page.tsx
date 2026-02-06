import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { signIn } from "@/lib/auth/config"

interface VerifyPageProps {
  searchParams: Promise<{
    token?: string
    mission?: string
  }>
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams
  const { token, mission: missionId } = params

  if (!token) {
    redirect("/login?error=invalid_token")
  }

  // Find user with this verification token
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpiry: {
        gt: new Date(),
      },
    },
    include: {
      freelancerProfile: { select: { id: true } },
      clientProfile: { select: { id: true } },
    },
  })

  if (!user) {
    redirect("/login?error=expired_token")
  }

  // Mark email as verified and clear token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  })

  // Sign in the user using credentials provider
  try {
    await signIn("credentials", {
      email: user.email,
      magicLinkVerified: "true",
      redirect: false,
    })
  } catch (error) {
    console.error("Sign in error:", error)
    // Continue anyway - we'll redirect to login if needed
  }

  // Determine where to redirect
  const hasProfile = user.freelancerProfile || user.clientProfile

  if (hasProfile && missionId) {
    // User already onboarded, show their mission
    redirect(`/missions/${missionId}`)
  } else if (hasProfile) {
    // User onboarded but no mission specified
    redirect("/dashboard")
  } else {
    // User needs to complete onboarding
    // Store mission ID in cookie for post-onboarding redirect
    if (missionId) {
      const cookieStore = await cookies()
      cookieStore.set("pending_mission_id", missionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
      })
    }
    redirect("/onboarding/account-type")
  }
}
