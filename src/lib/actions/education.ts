"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function getEducations(userId?: string) {
  const session = await auth()
  const targetId = userId || session?.user?.id
  if (!targetId) return []

  return prisma.education.findMany({
    where: { userId: targetId },
    orderBy: { startYear: "desc" },
  })
}

export async function createEducation(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const school = formData.get("school") as string
  const degree = formData.get("degree") as string | null
  const field = formData.get("field") as string | null
  const startYear = formData.get("startYear") as string | null
  const endYear = formData.get("endYear") as string | null

  if (!school) throw new Error("L'école est requise")

  await prisma.education.create({
    data: {
      userId: session.user.id,
      school,
      degree: degree || null,
      field: field || null,
      startYear: startYear ? parseInt(startYear) : null,
      endYear: endYear ? parseInt(endYear) : null,
    },
  })

  revalidatePath("/profile")
}

export async function updateEducation(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const edu = await prisma.education.findUnique({ where: { id } })
  if (!edu || edu.userId !== session.user.id) throw new Error("Non autorisé")

  const school = formData.get("school") as string
  const degree = formData.get("degree") as string | null
  const field = formData.get("field") as string | null
  const startYear = formData.get("startYear") as string | null
  const endYear = formData.get("endYear") as string | null

  await prisma.education.update({
    where: { id },
    data: {
      school,
      degree: degree || null,
      field: field || null,
      startYear: startYear ? parseInt(startYear) : null,
      endYear: endYear ? parseInt(endYear) : null,
    },
  })

  revalidatePath("/profile")
}

export async function deleteEducation(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const edu = await prisma.education.findUnique({ where: { id } })
  if (!edu || edu.userId !== session.user.id) throw new Error("Non autorisé")

  await prisma.education.delete({ where: { id } })
  revalidatePath("/profile")
}
