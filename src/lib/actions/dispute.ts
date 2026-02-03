"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"
import { notifyDisputeOpened, notifyDisputeMessage, notifyDisputeResolved } from "./notification"

// ============ HELPERS ============

async function getSession() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  return session
}

async function requireAdmin() {
  const session = await getSession()
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (user?.role !== "ADMIN") throw new Error("Accès admin requis")
  return session.user.id
}

async function requirePartyToDispute(disputeId: string, userId: string) {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { mission: { select: { clientId: true, freelancerId: true } } },
  })
  if (!dispute) throw new Error("Litige introuvable")
  const isParty =
    dispute.openedById === userId ||
    dispute.mission.clientId === userId ||
    dispute.mission.freelancerId === userId
  if (!isParty) throw new Error("Non autorisé")
  return dispute
}

// ============ USER ACTIONS ============

export async function getDisputesByUser() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.dispute.findMany({
    where: {
      OR: [
        { openedById: session.user.id },
        { mission: { clientId: session.user.id } },
        { mission: { freelancerId: session.user.id } },
      ],
    },
    include: {
      mission: { select: { id: true, title: true } },
      _count: { select: { messages: true } },
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
          contract: { select: { id: true, totalAmount: true, currency: true, status: true } },
        },
      },
      openedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      messages: {
        where: { isInternal: false },
        include: { sender: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!dispute) return null

  const userId = session.user.id
  const isAllowed =
    dispute.openedById === userId ||
    dispute.mission.clientId === userId ||
    dispute.mission.freelancerId === userId

  if (!isAllowed) return null
  return dispute
}

export async function openDispute(data: {
  contractId: string
  category: string
  priority: string
  reason: string
}) {
  const session = await getSession()

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
      openedById: session.user.id!,
      reason: data.reason,
      category: data.category,
      priority: data.priority,
      status: "OPEN",
      messages: {
        create: {
          senderId: session.user.id!,
          content: data.reason,
          isInternal: false,
        },
      },
    },
  })

  await prisma.contract.update({
    where: { id: data.contractId },
    data: { status: "DISPUTED" },
  })

  // Notify the other party
  try {
    const otherUserId = contract.clientId === session.user.id ? contract.freelancerId : contract.clientId
    await notifyDisputeOpened(otherUserId, dispute.id, data.reason)
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath("/disputes")
  revalidatePath("/contracts")
  return dispute
}

export async function addDisputeMessage(disputeId: string, content: string) {
  const session = await getSession()
  const dispute = await requirePartyToDispute(disputeId, session.user.id!)

  if (dispute.status !== "OPEN" && dispute.status !== "UNDER_REVIEW") {
    throw new Error("Ce litige est fermé")
  }

  await prisma.disputeMessage.create({
    data: {
      disputeId,
      senderId: session.user.id!,
      content,
      isInternal: false,
    },
  })

  // Notify the other party
  try {
    const otherUserId = dispute.mission.clientId === session.user.id ? dispute.mission.freelancerId : dispute.mission.clientId
    if (otherUserId && otherUserId !== session.user.id) {
      await notifyDisputeMessage(otherUserId, disputeId, session.user.name || "Quelqu'un")
    }
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath(`/disputes/${disputeId}`)
  revalidatePath(`/admin/disputes/${disputeId}`)
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

// ============ ADMIN ACTIONS ============

export async function getAdminDisputes(filters?: {
  status?: string
  category?: string
  priority?: string
  assignedToId?: string
}) {
  await requireAdmin()

  const where: any = {}
  if (filters?.status) where.status = filters.status
  if (filters?.category) where.category = filters.category
  if (filters?.priority) where.priority = filters.priority
  if (filters?.assignedToId) where.assignedToId = filters.assignedToId

  return prisma.dispute.findMany({
    where,
    include: {
      mission: { select: { id: true, title: true } },
      openedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAdminDisputeById(id: string) {
  await requireAdmin()

  return prisma.dispute.findUnique({
    where: { id },
    include: {
      mission: {
        include: {
          client: { select: { id: true, name: true, email: true } },
          freelancer: { select: { id: true, name: true, email: true } },
          contract: {
            select: { id: true, totalAmount: true, currency: true, status: true, milestones: true },
          },
        },
      },
      openedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      messages: {
        include: { sender: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export async function assignDispute(disputeId: string, adminId: string | null) {
  await requireAdmin()
  await prisma.dispute.update({
    where: { id: disputeId },
    data: { assignedToId: adminId },
  })
  revalidatePath(`/admin/disputes/${disputeId}`)
  revalidatePath("/admin/disputes")
}

export async function updateDisputeCategory(disputeId: string, category: string) {
  await requireAdmin()
  await prisma.dispute.update({
    where: { id: disputeId },
    data: { category },
  })
  revalidatePath(`/admin/disputes/${disputeId}`)
  revalidatePath("/admin/disputes")
}

export async function updateDisputePriority(disputeId: string, priority: string) {
  await requireAdmin()
  await prisma.dispute.update({
    where: { id: disputeId },
    data: { priority },
  })
  revalidatePath(`/admin/disputes/${disputeId}`)
  revalidatePath("/admin/disputes")
}

export async function updateDisputeStatus(disputeId: string, status: string) {
  await requireAdmin()
  await prisma.dispute.update({
    where: { id: disputeId },
    data: { status },
  })
  revalidatePath(`/admin/disputes/${disputeId}`)
  revalidatePath("/admin/disputes")
  revalidatePath(`/disputes/${disputeId}`)
}

export async function addAdminDisputeMessage(disputeId: string, content: string, isInternal: boolean) {
  const adminId = await requireAdmin()
  await prisma.disputeMessage.create({
    data: {
      disputeId,
      senderId: adminId,
      content,
      isInternal,
    },
  })
  revalidatePath(`/admin/disputes/${disputeId}`)
  revalidatePath(`/disputes/${disputeId}`)
}

export async function resolveDispute(
  disputeId: string,
  resolution: string,
  adminNotes?: string,
  favoredParty?: string
) {
  await requireAdmin()
  
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { mission: { select: { clientId: true, freelancerId: true } } },
  })
  
  await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status: "RESOLVED",
      resolution,
      adminNotes: adminNotes || null,
      favoredParty: favoredParty || null,
      resolvedAt: new Date(),
    },
  })

  // Notify both parties
  try {
    if (dispute?.mission.clientId) {
      await notifyDisputeResolved(dispute.mission.clientId, disputeId, resolution)
    }
    if (dispute?.mission.freelancerId) {
      await notifyDisputeResolved(dispute.mission.freelancerId, disputeId, resolution)
    }
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath(`/admin/disputes/${disputeId}`)
  revalidatePath("/admin/disputes")
  revalidatePath(`/disputes/${disputeId}`)
  revalidatePath("/disputes")
}

export async function getAdminUsers() {
  await requireAdmin()
  return prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true },
  })
}

export async function getDisputeStats() {
  await requireAdmin()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [openCount, underReviewCount, resolvedThisMonth, resolvedAll] = await Promise.all([
    prisma.dispute.count({ where: { status: "OPEN" } }),
    prisma.dispute.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.dispute.count({
      where: { status: "RESOLVED", resolvedAt: { gte: startOfMonth } },
    }),
    prisma.dispute.findMany({
      where: { status: "RESOLVED", resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    }),
  ])

  let avgResolutionDays = 0
  if (resolvedAll.length > 0) {
    const totalDays = resolvedAll.reduce((sum, d) => {
      const diff = (d.resolvedAt!.getTime() - d.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      return sum + diff
    }, 0)
    avgResolutionDays = Math.round(totalDays / resolvedAll.length)
  }

  return { openCount, underReviewCount, resolvedThisMonth, avgResolutionDays }
}
