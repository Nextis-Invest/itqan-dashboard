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
