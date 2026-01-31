"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function getContracts() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.contract.findMany({
    where: {
      OR: [
        { clientId: session.user.id },
        { freelancerId: session.user.id },
      ],
    },
    include: {
      mission: { select: { title: true } },
      milestones: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getContract(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      mission: { select: { title: true, description: true } },
      proposal: { select: { message: true, price: true, estimatedDays: true } },
      milestones: { orderBy: { createdAt: "asc" } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!contract) return null
  if (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id) return null

  return contract
}

export async function createContractFromProposal(proposalId: string) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { mission: true },
  })

  if (!proposal) throw new Error("Proposition introuvable")

  // Check if contract already exists for this mission
  const existing = await prisma.contract.findUnique({
    where: { missionId: proposal.missionId },
  })
  if (existing) return existing

  return prisma.contract.create({
    data: {
      missionId: proposal.missionId,
      proposalId: proposal.id,
      clientId: proposal.mission.clientId,
      freelancerId: proposal.freelancerId,
      totalAmount: proposal.price,
      currency: proposal.mission.currency,
      status: "PENDING",
    },
  })
}

export async function signContract(contractId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const contract = await prisma.contract.findUnique({ where: { id: contractId } })
  if (!contract) throw new Error("Contrat introuvable")

  const isClient = contract.clientId === session.user.id
  const isFreelancer = contract.freelancerId === session.user.id
  if (!isClient && !isFreelancer) throw new Error("Non autorisé")

  const update: any = {}
  if (isClient) update.signedByClient = true
  if (isFreelancer) update.signedByFreelancer = true

  // Check if both will have signed
  const willBeFullySigned =
    (isClient ? true : contract.signedByClient) &&
    (isFreelancer ? true : contract.signedByFreelancer)

  if (willBeFullySigned) {
    update.status = "ACTIVE"
    update.startDate = new Date()
  }

  await prisma.contract.update({
    where: { id: contractId },
    data: update,
  })

  revalidatePath(`/contracts/${contractId}`)
}

export async function completeContract(contractId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const contract = await prisma.contract.findUnique({ where: { id: contractId } })
  if (!contract) throw new Error("Contrat introuvable")
  if (contract.clientId !== session.user.id) throw new Error("Non autorisé")

  await prisma.contract.update({
    where: { id: contractId },
    data: { status: "COMPLETED", endDate: new Date() },
  })

  // Also complete the mission
  await prisma.mission.update({
    where: { id: contract.missionId },
    data: { status: "COMPLETED" },
  })

  revalidatePath(`/contracts/${contractId}`)
  revalidatePath("/contracts")
}
