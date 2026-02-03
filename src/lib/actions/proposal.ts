"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { sendEmail, newProposalEmail, proposalAcceptedEmail, proposalRejectedEmail } from "@/lib/email"
import { notifyNewProposal, notifyProposalAccepted, notifyProposalRejected, notifyContractCreated } from "./notification"

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

  // Send email to mission owner
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { client: { select: { email: true, id: true } } },
    })
    if (mission?.client?.email) {
      await sendEmail({
        to: mission.client.email,
        subject: "Nouvelle proposition reçue — Itqan",
        html: newProposalEmail(session.user.name || "Un freelance", mission.title, missionId),
      })
    }
    // Send in-app notification
    if (mission?.client?.id) {
      await notifyNewProposal(missionId, session.user.name || "Un freelance", mission.client.id)
    }
  } catch (e) {
    console.error("Email error:", e)
  }

  revalidatePath(`/missions/${missionId}`)
  return { success: true, missionId }
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

  // Auto-create contract if one doesn't exist
  try {
    const existingContract = await prisma.contract.findUnique({
      where: { missionId: proposal.missionId },
    })

    if (!existingContract) {
      const contract = await prisma.contract.create({
        data: {
          missionId: proposal.missionId,
          proposalId: proposal.id,
          clientId: proposal.mission.clientId,
          freelancerId: proposal.freelancerId,
          totalAmount: proposal.price,
          currency: proposal.mission.currency,
          status: "PENDING",
          startDate: new Date(),
        },
      })
      // Notify both parties about contract creation
      try {
        await notifyContractCreated(proposal.freelancerId, proposal.mission.title, contract.id)
        await notifyContractCreated(proposal.mission.clientId, proposal.mission.title, contract.id)
      } catch (e) {
        console.error("Notification error:", e)
      }
    }
  } catch (e) {
    console.error("Contract creation error:", e)
  }

  // Send acceptance email to freelancer
  try {
    const freelancer = await prisma.user.findUnique({
      where: { id: proposal.freelancerId },
      select: { email: true },
    })
    if (freelancer?.email) {
      await sendEmail({
        to: freelancer.email,
        subject: "Votre proposition a été acceptée ! — Itqan",
        html: proposalAcceptedEmail(proposal.mission.title, proposal.missionId),
      })
    }
    // Send rejection emails to other proposers
    const rejectedProposals = await prisma.proposal.findMany({
      where: { missionId: proposal.missionId, id: { not: proposalId }, status: "REJECTED" },
      include: { freelancer: { select: { email: true } } },
    })
    for (const rp of rejectedProposals) {
      if (rp.freelancer?.email) {
        await sendEmail({
          to: rp.freelancer.email,
          subject: "Proposition non retenue — Itqan",
          html: proposalRejectedEmail(proposal.mission.title),
        })
      }
    }
  } catch (e) {
    console.error("Email error:", e)
  }

  // Send in-app notifications
  try {
    await notifyProposalAccepted(proposalId, proposal.mission.title, proposal.freelancerId)
    // Notify rejected freelancers
    const rejectedProposals = await prisma.proposal.findMany({
      where: { missionId: proposal.missionId, id: { not: proposalId }, status: "REJECTED" },
      select: { id: true, freelancerId: true },
    })
    for (const rp of rejectedProposals) {
      await notifyProposalRejected(rp.id, proposal.mission.title, rp.freelancerId)
    }
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath(`/missions/${proposal.missionId}`)
  return { success: true, missionId: proposal.missionId, missionTitle: proposal.mission.title }
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

  // Send rejection email
  try {
    const freelancer = await prisma.user.findUnique({
      where: { id: proposal.freelancerId },
      select: { email: true },
    })
    if (freelancer?.email) {
      await sendEmail({
        to: freelancer.email,
        subject: "Proposition non retenue — Itqan",
        html: proposalRejectedEmail(proposal.mission.title),
      })
    }
  } catch (e) {
    console.error("Email error:", e)
  }

  // Send in-app notification
  try {
    await notifyProposalRejected(proposalId, proposal.mission.title, proposal.freelancerId)
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath(`/missions/${proposal.missionId}`)
}

export async function withdrawProposal(proposalId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { mission: true },
  })

  if (!proposal) throw new Error("Proposition introuvable")
  if (proposal.freelancerId !== session.user.id) throw new Error("Non autorisé")
  if (proposal.status !== "PENDING") throw new Error("Seules les propositions en attente peuvent être retirées")

  await prisma.proposal.delete({
    where: { id: proposalId },
  })

  revalidatePath(`/missions/${proposal.missionId}`)
}
