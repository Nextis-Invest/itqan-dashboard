"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"
import { notifyMilestoneSubmitted, notifyMilestoneApproved } from "./notification"

export async function createMilestone(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const contractId = formData.get("contractId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string | null
  const amount = parseFloat(formData.get("amount") as string)
  const dueDate = formData.get("dueDate") as string | null

  if (!contractId || !title || isNaN(amount)) throw new Error("Données manquantes")

  const contract = await prisma.contract.findUnique({ where: { id: contractId } })
  if (!contract) throw new Error("Contrat introuvable")
  if (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id) {
    throw new Error("Non autorisé")
  }

  await prisma.milestone.create({
    data: {
      contractId,
      title,
      description: description || null,
      amount,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  })

  revalidatePath(`/contracts/${contractId}`)
}

export async function submitMilestone(milestoneId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { contract: true },
  })
  if (!milestone) throw new Error("Jalon introuvable")
  if (milestone.contract.freelancerId !== session.user.id) throw new Error("Non autorisé")

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: "SUBMITTED", completedAt: new Date() },
  })

  // Notify client
  try {
    await notifyMilestoneSubmitted(milestone.contractId, milestone.title, milestone.contract.clientId)
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath(`/contracts/${milestone.contractId}`)
}

export async function approveMilestone(milestoneId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { contract: true },
  })
  if (!milestone) throw new Error("Jalon introuvable")
  if (milestone.contract.clientId !== session.user.id) throw new Error("Non autorisé")

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: "APPROVED", approvedAt: new Date() },
  })

  // Notify freelancer
  try {
    await notifyMilestoneApproved(milestone.contractId, milestone.title, milestone.contract.freelancerId)
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath(`/contracts/${milestone.contractId}`)
}

export async function requestRevision(milestoneId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { contract: true },
  })
  if (!milestone) throw new Error("Jalon introuvable")
  if (milestone.contract.clientId !== session.user.id) throw new Error("Non autorisé")

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: "REVISION" },
  })

  revalidatePath(`/contracts/${milestone.contractId}`)
}

export async function startMilestone(milestoneId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { contract: true },
  })
  if (!milestone) throw new Error("Jalon introuvable")
  if (milestone.contract.freelancerId !== session.user.id) throw new Error("Non autorisé")

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: "IN_PROGRESS" },
  })

  revalidatePath(`/contracts/${milestone.contractId}`)
}
