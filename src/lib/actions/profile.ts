"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"

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

  await prisma.clientProfile.create({
    data: {
      userId: session.user.id,
      companyName: (formData.get("companyName") as string) || null,
      companySize: (formData.get("companySize") as string) || null,
      industry: (formData.get("industry") as string) || null,
      website: (formData.get("website") as string) || null,
      city: (formData.get("city") as string) || null,
    },
  })

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
      companyName: (formData.get("companyName") as string) || null,
      companySize: (formData.get("companySize") as string) || null,
      industry: (formData.get("industry") as string) || null,
      website: (formData.get("website") as string) || null,
      city: (formData.get("city") as string) || null,
    },
  })

  redirect("/profile")
}
