"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function addExperience(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) throw new Error("Profil freelance introuvable")

  const current = formData.get("current") === "on" || formData.get("current") === "true"
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string

  await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: formData.get("company") as string,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      location: (formData.get("location") as string) || null,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: current ? null : (endDateStr ? new Date(endDateStr) : null),
      current,
      source: "manual",
    },
  })

  revalidatePath("/profile")
}

export async function updateExperience(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const experienceId = formData.get("experienceId") as string

  const experience = await prisma.experience.findUnique({
    where: { id: experienceId },
    include: { profile: { select: { userId: true } } },
  })
  if (!experience || experience.profile.userId !== session.user.id) {
    throw new Error("Non autorisé")
  }

  const current = formData.get("current") === "on" || formData.get("current") === "true"
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string

  await prisma.experience.update({
    where: { id: experienceId },
    data: {
      company: formData.get("company") as string,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      location: (formData.get("location") as string) || null,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: current ? null : (endDateStr ? new Date(endDateStr) : null),
      current,
    },
  })

  revalidatePath("/profile")
}

export async function deleteExperience(experienceId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const experience = await prisma.experience.findUnique({
    where: { id: experienceId },
    include: { profile: { select: { userId: true } } },
  })
  if (!experience || experience.profile.userId !== session.user.id) {
    throw new Error("Non autorisé")
  }

  await prisma.experience.delete({ where: { id: experienceId } })
  revalidatePath("/profile")
}
