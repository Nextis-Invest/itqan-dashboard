"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createProposal(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const missionId = formData.get("missionId") as string
  const message = formData.get("message") as string
  const price = parseFloat(formData.get("price") as string)
  const estimatedDays = formData.get("estimatedDays")
    ? parseInt(formData.get("estimatedDays") as string)
    : null

  if (!missionId || !price) throw new Error("Données manquantes")

  // Check if already proposed
  const existing = await prisma.proposal.findFirst({
    where: { missionId, freelancerId: session.user.id },
  })
  if (existing) throw new Error("Vous avez déjà soumis une proposition")

  await prisma.proposal.create({
    data: {
      missionId,
      freelancerId: session.user.id,
      message: message || null,
      price,
      estimatedDays,
    },
  })

  revalidatePath(`/missions/${missionId}`)
  redirect(`/missions/${missionId}`)
}

export async function acceptProposal(proposalId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { mission: true },
  })

  if (!proposal) throw new Error("Proposition introuvable")
  if (proposal.mission.clientId !== session.user.id) throw new Error("Non autorisé")

  // Accept this proposal and reject all others
  await prisma.$transaction([
    prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "ACCEPTED" },
    }),
    prisma.proposal.updateMany({
      where: { missionId: proposal.missionId, id: { not: proposalId } },
      data: { status: "REJECTED" },
    }),
    prisma.mission.update({
      where: { id: proposal.missionId },
      data: { status: "IN_PROGRESS", freelancerId: proposal.freelancerId },
    }),
  ])

  revalidatePath(`/missions/${proposal.missionId}`)
}

export async function rejectProposal(proposalId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { mission: true },
  })

  if (!proposal) throw new Error("Proposition introuvable")
  if (proposal.mission.clientId !== session.user.id) throw new Error("Non autorisé")

  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: "REJECTED" },
  })

  revalidatePath(`/missions/${proposal.missionId}`)
}
