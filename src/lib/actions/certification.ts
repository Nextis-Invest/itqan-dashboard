"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function getCertifications(userId?: string) {
  const session = await auth()
  const targetId = userId || session?.user?.id
  if (!targetId) return []

  return prisma.certification.findMany({
    where: { userId: targetId },
    orderBy: { issueDate: "desc" },
  })
}

export async function createCertification(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string | null
  const issueDate = formData.get("issueDate") as string | null
  const expiryDate = formData.get("expiryDate") as string | null
  const url = formData.get("url") as string | null

  if (!name) throw new Error("Le nom est requis")

  await prisma.certification.create({
    data: {
      userId: session.user.id,
      name,
      issuer: issuer || null,
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      url: url || null,
    },
  })

  revalidatePath("/profile")
}

export async function updateCertification(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const cert = await prisma.certification.findUnique({ where: { id } })
  if (!cert || cert.userId !== session.user.id) throw new Error("Non autorisé")

  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string | null
  const issueDate = formData.get("issueDate") as string | null
  const expiryDate = formData.get("expiryDate") as string | null
  const url = formData.get("url") as string | null

  await prisma.certification.update({
    where: { id },
    data: {
      name,
      issuer: issuer || null,
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      url: url || null,
    },
  })

  revalidatePath("/profile")
}

export async function deleteCertification(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const cert = await prisma.certification.findUnique({ where: { id } })
  if (!cert || cert.userId !== session.user.id) throw new Error("Non autorisé")

  await prisma.certification.delete({ where: { id } })
  revalidatePath("/profile")
}
