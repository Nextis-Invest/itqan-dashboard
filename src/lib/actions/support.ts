"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"
// redirect removed — callers handle navigation

// ──────────────────────────────────────
// Helpers
// ──────────────────────────────────────

async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  return session.user
}

async function requireAdmin() {
  const user = await requireAuth()
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })
  if (dbUser?.role !== "ADMIN") throw new Error("Non autorisé")
  return user
}

// ──────────────────────────────────────
// User actions
// ──────────────────────────────────────

export async function getMyTickets() {
  const user = await requireAuth()
  return prisma.supportTicket.findMany({
    where: { userId: user.id },
    include: { _count: { select: { replies: true } } },
    orderBy: { updatedAt: "desc" },
  })
}

export async function getTicketById(id: string) {
  const user = await requireAuth()
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      replies: {
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!ticket) return null
  if (ticket.userId !== user.id && dbUser?.role !== "ADMIN") return null

  return ticket
}

export async function createTicket(data: {
  subject: string
  category: string
  priority: string
  message: string
}) {
  const user = await requireAuth()

  if (!data.subject || !data.message || data.message.length < 20) {
    throw new Error("Données manquantes ou message trop court")
  }

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: user.id,
      subject: data.subject,
      category: data.category || "GENERAL",
      priority: (data.priority as any) || "MEDIUM",
      message: data.message,
    },
  })

  revalidatePath("/support")
  return { success: true, id: ticket.id, subject: ticket.subject }
}

export async function replyToTicket(ticketId: string, message: string) {
  const user = await requireAuth()
  if (!ticketId || !message) throw new Error("Données manquantes")

  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } })
  if (!ticket) throw new Error("Ticket introuvable")

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })
  if (ticket.userId !== user.id && dbUser?.role !== "ADMIN") {
    throw new Error("Non autorisé")
  }

  const isAdmin = dbUser?.role === "ADMIN"

  // Build update data for the ticket
  const updateData: any = { updatedAt: new Date() }
  if (isAdmin && !ticket.firstReplyAt) {
    updateData.firstReplyAt = new Date()
  }

  await prisma.$transaction([
    prisma.ticketReply.create({
      data: { ticketId, userId: user.id, message },
    }),
    prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
    }),
  ])

  revalidatePath(`/support/${ticketId}`)
  revalidatePath(`/admin/support/${ticketId}`)
  revalidatePath("/support")
  revalidatePath("/admin/support")
}

// ──────────────────────────────────────
// Admin actions
// ──────────────────────────────────────

export async function getAdminTickets(filters?: {
  status?: string
  priority?: string
  category?: string
  assignedToId?: string
}) {
  await requireAdmin()

  const where: any = {}
  if (filters?.status && filters.status !== "ALL") where.status = filters.status
  if (filters?.priority && filters.priority !== "ALL") where.priority = filters.priority
  if (filters?.category && filters.category !== "ALL") where.category = filters.category
  if (filters?.assignedToId) where.assignedToId = filters.assignedToId

  return prisma.supportTicket.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true } },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAdminTicketById(id: string) {
  await requireAdmin()

  return prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      assignedTo: { select: { id: true, name: true } },
      replies: {
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      notes: {
        include: { admin: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export async function getTicketStats() {
  await requireAdmin()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [openCount, resolvedThisMonth, avgResponseTime] = await Promise.all([
    prisma.supportTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.supportTicket.count({
      where: {
        status: { in: ["RESOLVED", "CLOSED"] },
        closedAt: { gte: startOfMonth },
      },
    }),
    prisma.supportTicket.findMany({
      where: { firstReplyAt: { not: null } },
      select: { createdAt: true, firstReplyAt: true },
    }),
  ])

  let avgMinutes = 0
  if (avgResponseTime.length > 0) {
    const totalMs = avgResponseTime.reduce((sum, t) => {
      return sum + (t.firstReplyAt!.getTime() - t.createdAt.getTime())
    }, 0)
    avgMinutes = Math.round(totalMs / avgResponseTime.length / 60000)
  }

  return { openCount, resolvedThisMonth, avgResponseMinutes: avgMinutes }
}

export async function assignTicket(ticketId: string, adminId: string | null) {
  await requireAdmin()
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { assignedToId: adminId },
  })
  revalidatePath(`/admin/support/${ticketId}`)
  revalidatePath("/admin/support")
}

export async function addInternalNote(ticketId: string, content: string) {
  const user = await requireAdmin()
  if (!content) throw new Error("Contenu requis")

  await prisma.ticketNote.create({
    data: { ticketId, adminId: user.id, content },
  })

  revalidatePath(`/admin/support/${ticketId}`)
}

export async function updateTicketPriority(ticketId: string, priority: string) {
  await requireAdmin()
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { priority: priority as any },
  })
  revalidatePath(`/admin/support/${ticketId}`)
  revalidatePath("/admin/support")
}

export async function updateTicketStatus(ticketId: string, status: string) {
  await requireAdmin()
  const data: any = { status: status as any }
  if (status === "CLOSED") data.closedAt = new Date()
  if (status === "OPEN") data.closedAt = null

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data,
  })
  revalidatePath(`/admin/support/${ticketId}`)
  revalidatePath("/admin/support")
}

export async function closeTicket(ticketId: string) {
  return updateTicketStatus(ticketId, "CLOSED")
}

export async function reopenTicket(ticketId: string) {
  return updateTicketStatus(ticketId, "OPEN")
}

export async function getAdminList() {
  await requireAdmin()
  return prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true },
  })
}

// Keep legacy support for old admin actions that import from here
export async function createSupportTicket(formData: FormData) {
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string
  const priority = (formData.get("priority") as string) || "MEDIUM"
  await createTicket({ subject, category: "GENERAL", priority, message })
}

export async function replyToSupportTicket(formData: FormData) {
  const ticketId = formData.get("ticketId") as string
  const message = formData.get("message") as string
  await replyToTicket(ticketId, message)
}
