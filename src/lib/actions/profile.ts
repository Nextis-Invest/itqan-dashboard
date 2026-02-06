"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function createFreelancerProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const skillsRaw = formData.get("skills") as string
  const skills = skillsRaw
    ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  await prisma.freelancerProfile.create({
    data: {
      userId: session.user.id,
      title: (formData.get("title") as string) || null,
      bio: (formData.get("bio") as string) || null,
      skills,
      category: (formData.get("category") as string) || null,
      city: (formData.get("city") as string) || null,
      dailyRate: formData.get("dailyRate")
        ? parseFloat(formData.get("dailyRate") as string)
        : null,
      currency: (formData.get("currency") as string) || "MAD",
      remote: formData.get("remote") === "on" || formData.get("remote") === "true",
      portfolioUrl: (formData.get("portfolioUrl") as string) || null,
      linkedinUrl: (formData.get("linkedinUrl") as string) || null,
      githubUrl: (formData.get("githubUrl") as string) || null,
    },
  })

  redirect("/dashboard")
}

export async function createClientProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const phone = (formData.get("phone") as string) || null
  if (!phone) throw new Error("Le numéro de téléphone est obligatoire")

  await prisma.clientProfile.create({
    data: {
      userId: session.user.id,
      personType: (formData.get("personType") as string) || null,
      companyName: (formData.get("companyName") as string) || null,
      companySize: (formData.get("companySize") as string) || null,
      industry: (formData.get("industry") as string) || null,
      website: (formData.get("website") as string) || null,
      rc: (formData.get("rc") as string) || null,
      ice: (formData.get("ice") as string) || null,
      patente: (formData.get("patente") as string) || null,
      cnss: (formData.get("cnss") as string) || null,
      capitalSocial: formData.get("capitalSocial") ? parseFloat(formData.get("capitalSocial") as string) : null,
      formeJuridique: (formData.get("formeJuridique") as string) || null,
      cin: (formData.get("cin") as string) || null,
      dateOfBirth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth") as string) : null,
      phone,
      phoneSecondary: (formData.get("phoneSecondary") as string) || null,
      contactEmail: (formData.get("contactEmail") as string) || null,
      address: (formData.get("address") as string) || null,
      city: (formData.get("city") as string) || null,
      postalCode: (formData.get("postalCode") as string) || null,
      region: (formData.get("region") as string) || null,
      country: (formData.get("country") as string) || "MA",
      preferredPaymentMethod: (formData.get("preferredPaymentMethod") as string) || null,
      bankName: (formData.get("bankName") as string) || null,
      bankIban: (formData.get("bankIban") as string) || null,
      bankRib: (formData.get("bankRib") as string) || null,
    },
  })

  // Check for pending mission from itqan.ma flow
  const cookieStore = await cookies()
  const pendingMissionId = cookieStore.get("pending_mission_id")?.value
  
  if (pendingMissionId) {
    // Clear the cookie
    cookieStore.delete("pending_mission_id")
    redirect(`/missions/${pendingMissionId}`)
  }

  redirect("/dashboard")
}

export async function updateFreelancerProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const skillsRaw = formData.get("skills") as string
  const skills = skillsRaw
    ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  await prisma.freelancerProfile.update({
    where: { userId: session.user.id },
    data: {
      title: (formData.get("title") as string) || null,
      bio: (formData.get("bio") as string) || null,
      skills,
      category: (formData.get("category") as string) || null,
      city: (formData.get("city") as string) || null,
      dailyRate: formData.get("dailyRate")
        ? parseFloat(formData.get("dailyRate") as string)
        : null,
      currency: (formData.get("currency") as string) || "MAD",
      remote: formData.get("remote") === "on" || formData.get("remote") === "true",
      available: formData.get("available") === "on" || formData.get("available") === "true",
      portfolioUrl: (formData.get("portfolioUrl") as string) || null,
      linkedinUrl: (formData.get("linkedinUrl") as string) || null,
      githubUrl: (formData.get("githubUrl") as string) || null,
      websiteUrl: (formData.get("websiteUrl") as string) || null,
    },
  })

  redirect("/profile")
}

export async function updateClientProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  await prisma.clientProfile.update({
    where: { userId: session.user.id },
    data: {
      personType: (formData.get("personType") as string) || null,
      companyName: (formData.get("companyName") as string) || null,
      companySize: (formData.get("companySize") as string) || null,
      industry: (formData.get("industry") as string) || null,
      website: (formData.get("website") as string) || null,
      rc: (formData.get("rc") as string) || null,
      ice: (formData.get("ice") as string) || null,
      patente: (formData.get("patente") as string) || null,
      cnss: (formData.get("cnss") as string) || null,
      capitalSocial: formData.get("capitalSocial") ? parseFloat(formData.get("capitalSocial") as string) : null,
      formeJuridique: (formData.get("formeJuridique") as string) || null,
      cin: (formData.get("cin") as string) || null,
      dateOfBirth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth") as string) : null,
      phone: (formData.get("phone") as string) || null,
      phoneSecondary: (formData.get("phoneSecondary") as string) || null,
      contactEmail: (formData.get("contactEmail") as string) || null,
      address: (formData.get("address") as string) || null,
      city: (formData.get("city") as string) || null,
      postalCode: (formData.get("postalCode") as string) || null,
      region: (formData.get("region") as string) || null,
      country: (formData.get("country") as string) || "MA",
      preferredPaymentMethod: (formData.get("preferredPaymentMethod") as string) || null,
      bankName: (formData.get("bankName") as string) || null,
      bankIban: (formData.get("bankIban") as string) || null,
      bankRib: (formData.get("bankRib") as string) || null,
    },
  })

  redirect("/profile")
}
