"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function getDisputesByUser() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.dispute.findMany({
    where: { openedById: session.user.id },
    include: {
      mission: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getDisputeById(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: {
      mission: {
        include: {
          client: { select: { id: true, name: true, email: true } },
          freelancer: { select: { id: true, name: true, email: true } },
        },
      },
      openedBy: { select: { id: true, name: true, email: true } },
    },
  })

  if (!dispute) return null

  // User must be the opener, the client, or the freelancer on the mission
  const userId = session.user.id
  const isAllowed =
    dispute.openedById === userId ||
    dispute.mission.clientId === userId ||
    dispute.mission.freelancerId === userId

  if (!isAllowed) return null

  return dispute
}

export async function openDispute(data: { contractId: string; reason: string }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  // Find contract and verify user is party to it
  const contract = await prisma.contract.findUnique({
    where: { id: data.contractId },
    include: { mission: true },
  })

  if (!contract) throw new Error("Contrat introuvable")
  if (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id) {
    throw new Error("Non autorisé")
  }

  const dispute = await prisma.dispute.create({
    data: {
      missionId: contract.missionId,
      openedById: session.user.id,
      reason: data.reason,
      status: "OPEN",
    },
  })

  // Update contract status to DISPUTED
  await prisma.contract.update({
    where: { id: data.contractId },
    data: { status: "DISPUTED" },
  })

  revalidatePath("/disputes")
  revalidatePath("/contracts")
  return dispute
}

export async function getUserContracts() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.contract.findMany({
    where: {
      OR: [
        { clientId: session.user.id },
        { freelancerId: session.user.id },
      ],
      status: { in: ["ACTIVE", "COMPLETED"] },
    },
    include: {
      mission: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}
