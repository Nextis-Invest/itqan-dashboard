import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

/**
 * LinkedIn API v2 profile import.
 * 
 * This route fetches the user's LinkedIn profile data using the stored
 * access token from the OAuth flow and creates Experience records.
 * 
 * Note: LinkedIn's API v2 has limited access for most apps. The /v2/me
 * endpoint returns basic profile info. Position/experience data requires
 * specific API products (e.g., "Sign In with LinkedIn using OpenID Connect"
 * gives basic profile; full position history requires partner-level access).
 * 
 * For MVP, we use the basic profile data (name, headline, etc.) and
 * allow the user to manually refine imported experiences.
 */
export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const linkedinAccessToken = (session.user as any).linkedinAccessToken

    if (!linkedinAccessToken) {
      return NextResponse.json(
        { message: "Connectez-vous d'abord avec LinkedIn pour importer vos données" },
        { status: 400 }
      )
    }

    // Fetch LinkedIn profile
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${linkedinAccessToken}`,
      },
    })

    if (!profileRes.ok) {
      const errorText = await profileRes.text()
      console.error("LinkedIn API error:", errorText)
      return NextResponse.json(
        { message: "Impossible de récupérer les données LinkedIn. Reconnectez-vous avec LinkedIn." },
        { status: 400 }
      )
    }

    const profileData = await profileRes.json()

    // Get the freelancer profile
    const freelancerProfile = await prisma.freelancerProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!freelancerProfile) {
      return NextResponse.json(
        { message: "Profil freelance introuvable. Créez d'abord votre profil." },
        { status: 400 }
      )
    }

    // Update profile with LinkedIn data where available
    const updates: any = {}
    if (profileData.name && !freelancerProfile.title) {
      updates.title = profileData.name
    }
    if (profileData.picture && !freelancerProfile.avatar) {
      updates.avatar = profileData.picture
    }
    if (profileData.locale?.country) {
      updates.country = profileData.locale.country
    }

    // Set LinkedIn URL if not already set
    if (!freelancerProfile.linkedinUrl && profileData.sub) {
      updates.linkedinUrl = `https://linkedin.com/in/${profileData.sub}`
    }

    if (Object.keys(updates).length > 0) {
      await prisma.freelancerProfile.update({
        where: { id: freelancerProfile.id },
        data: updates,
      })
    }

    // Since LinkedIn API v2 userinfo doesn't return positions,
    // we create a placeholder experience entry that the user can edit.
    // Full position import would require LinkedIn Marketing API partner access.
    const existingLinkedinExp = await prisma.experience.findFirst({
      where: { profileId: freelancerProfile.id, source: "linkedin" },
    })

    if (!existingLinkedinExp && profileData.name) {
      await prisma.experience.create({
        data: {
          profileId: freelancerProfile.id,
          company: "Importé depuis LinkedIn",
          title: profileData.name || "Professionnel",
          description: "Expérience importée depuis LinkedIn. Modifiez les détails pour compléter votre profil.",
          current: true,
          source: "linkedin",
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Profil LinkedIn importé avec succès",
      profileData: {
        name: profileData.name,
        picture: profileData.picture,
      },
    })
  } catch (error) {
    console.error("LinkedIn import error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
