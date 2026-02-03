"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}

export async function getUnreadCount() {
  const session = await auth()
  if (!session?.user?.id) return 0

  return prisma.notification.count({
    where: { userId: session.user.id, read: false },
  })
}

export async function markAsRead(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  await prisma.notification.update({
    where: { id },
    data: { read: true, readAt: new Date() },
  })

  revalidatePath("/notifications")
}

export async function markAllAsRead() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true, readAt: new Date() },
  })

  revalidatePath("/notifications")
}

export async function createNotification(data: {
  userId: string
  type: string
  title: string
  body?: string
  entityType?: string
  entityId?: string
  actionUrl?: string
}) {
  return prisma.notification.create({ data })
}

// Helper to create notifications for common events
export async function notifyNewProposal(missionId: string, freelancerName: string, clientId: string) {
  await createNotification({
    userId: clientId,
    type: "NEW_PROPOSAL",
    title: "Nouvelle proposition",
    body: `${freelancerName} a soumis une proposition`,
    entityType: "mission",
    entityId: missionId,
    actionUrl: `/missions/${missionId}`,
  })
}

export async function notifyProposalAccepted(proposalId: string, missionTitle: string, freelancerId: string) {
  await createNotification({
    userId: freelancerId,
    type: "PROPOSAL_ACCEPTED",
    title: "Proposition acceptée",
    body: `Votre proposition pour "${missionTitle}" a été acceptée`,
    entityType: "proposal",
    entityId: proposalId,
    actionUrl: "/contracts",
  })
}

export async function notifyProposalRejected(proposalId: string, missionTitle: string, freelancerId: string) {
  await createNotification({
    userId: freelancerId,
    type: "PROPOSAL_REJECTED",
    title: "Proposition refusée",
    body: `Votre proposition pour "${missionTitle}" n'a pas été retenue`,
    entityType: "proposal",
    entityId: proposalId,
    actionUrl: "/proposals",
  })
}

export async function notifyMilestoneSubmitted(contractId: string, milestoneTitle: string, clientId: string) {
  await createNotification({
    userId: clientId,
    type: "MILESTONE_SUBMITTED",
    title: "Jalon soumis",
    body: `Le jalon "${milestoneTitle}" a été soumis pour validation`,
    entityType: "contract",
    entityId: contractId,
    actionUrl: `/contracts/${contractId}`,
  })
}

export async function notifyMilestoneApproved(contractId: string, milestoneTitle: string, freelancerId: string) {
  await createNotification({
    userId: freelancerId,
    type: "MILESTONE_APPROVED",
    title: "Jalon approuvé",
    body: `Le jalon "${milestoneTitle}" a été approuvé`,
    entityType: "contract",
    entityId: contractId,
    actionUrl: `/contracts/${contractId}`,
  })
}

export async function notifyNewReview(targetUserId: string, authorName: string, missionTitle: string) {
  await createNotification({
    userId: targetUserId,
    type: "NEW_REVIEW",
    title: "Nouvel avis",
    body: `${authorName} vous a laissé un avis pour "${missionTitle}"`,
    entityType: "review",
    actionUrl: "/profile",
  })
}

export async function notifyNewMessage(userId: string, senderName: string, conversationId: string) {
  await createNotification({
    userId,
    type: "NEW_MESSAGE",
    title: "Nouveau message",
    body: `${senderName} vous a envoyé un message`,
    entityType: "conversation",
    entityId: conversationId,
    actionUrl: `/messages?c=${conversationId}`,
  })
}

export async function notifyContractCreated(userId: string, missionTitle: string, contractId: string) {
  await createNotification({
    userId,
    type: "CONTRACT_CREATED",
    title: "Nouveau contrat",
    body: `Un contrat a été créé pour "${missionTitle}"`,
    entityType: "contract",
    entityId: contractId,
    actionUrl: `/contracts/${contractId}`,
  })
}

export async function notifyContractSigned(userId: string, missionTitle: string, contractId: string, signerName: string) {
  await createNotification({
    userId,
    type: "CONTRACT_SIGNED",
    title: "Contrat signé",
    body: `${signerName} a signé le contrat pour "${missionTitle}"`,
    entityType: "contract",
    entityId: contractId,
    actionUrl: `/contracts/${contractId}`,
  })
}

export async function notifyContractCompleted(freelancerId: string, missionTitle: string, contractId: string) {
  await createNotification({
    userId: freelancerId,
    type: "CONTRACT_COMPLETED",
    title: "Contrat terminé",
    body: `Le contrat pour "${missionTitle}" est terminé`,
    entityType: "contract",
    entityId: contractId,
    actionUrl: `/contracts/${contractId}`,
  })
}

export async function notifyDisputeOpened(userId: string, disputeId: string, reason: string) {
  await createNotification({
    userId,
    type: "DISPUTE_OPENED",
    title: "Litige ouvert",
    body: `Un litige a été ouvert : ${reason}`,
    entityType: "dispute",
    entityId: disputeId,
    actionUrl: `/disputes/${disputeId}`,
  })
}

export async function notifyDisputeResolved(userId: string, disputeId: string, resolution: string) {
  await createNotification({
    userId,
    type: "DISPUTE_RESOLVED",
    title: "Litige résolu",
    body: `Le litige a été résolu : ${resolution}`,
    entityType: "dispute",
    entityId: disputeId,
    actionUrl: `/disputes/${disputeId}`,
  })
}

export async function notifyDisputeMessage(userId: string, disputeId: string, senderName: string) {
  await createNotification({
    userId,
    type: "DISPUTE_MESSAGE",
    title: "Message sur le litige",
    body: `${senderName} a envoyé un message sur le litige`,
    entityType: "dispute",
    entityId: disputeId,
    actionUrl: `/disputes/${disputeId}`,
  })
}

export async function notifySupportReply(userId: string, ticketId: string) {
  await createNotification({
    userId,
    type: "SUPPORT_REPLY",
    title: "Réponse du support",
    body: "L'équipe support a répondu à votre ticket",
    entityType: "ticket",
    entityId: ticketId,
    actionUrl: `/support/${ticketId}`,
  })
}

export async function notifyTicketStatus(userId: string, ticketId: string, status: string) {
  const statusLabels: Record<string, string> = {
    OPEN: "ouvert",
    IN_PROGRESS: "en cours de traitement",
    RESOLVED: "résolu",
    CLOSED: "fermé",
  }
  await createNotification({
    userId,
    type: "TICKET_STATUS",
    title: "Mise à jour du ticket",
    body: `Votre ticket est maintenant ${statusLabels[status] || status}`,
    entityType: "ticket",
    entityId: ticketId,
    actionUrl: `/support/${ticketId}`,
  })
}

export async function notifyMissionStatus(userId: string, missionId: string, missionTitle: string, status: string) {
  const statusLabels: Record<string, string> = {
    OPEN: "ouverte",
    IN_PROGRESS: "en cours",
    COMPLETED: "terminée",
    CANCELLED: "annulée",
  }
  await createNotification({
    userId,
    type: "MISSION_STATUS",
    title: "Statut de mission mis à jour",
    body: `La mission "${missionTitle}" est maintenant ${statusLabels[status] || status}`,
    entityType: "mission",
    entityId: missionId,
    actionUrl: `/missions/${missionId}`,
  })
}
