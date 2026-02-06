import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { VerifyClient } from "./verify-client"

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

  // Determine redirect path
  const hasProfile = user.freelancerProfile || user.clientProfile
  let redirectPath: string

  if (hasProfile && missionId) {
    redirectPath = `/missions/${missionId}`
  } else if (hasProfile) {
    redirectPath = "/dashboard"
  } else {
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
    redirectPath = "/onboarding/account-type"
  }

  // Pass data to client component which will handle sign-in
  return (
    <VerifyClient 
      email={user.email} 
      redirectPath={redirectPath}
    />
  )
}
