"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (user?.role !== "ADMIN") throw new Error("Accès admin requis")
  return session.user.id
}

export async function verifyUser(userId: string, verified: boolean) {
  await requireAdmin()
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (!user) throw new Error("Utilisateur introuvable")

  if (user.role === "FREELANCER") {
    await prisma.freelancerProfile.updateMany({ where: { userId }, data: { verified } })
  } else if (user.role === "CLIENT") {
    await prisma.clientProfile.updateMany({ where: { userId }, data: { verified } })
  }
  revalidatePath("/admin/users")
}

export async function suspendUser(userId: string, suspended: boolean) {
  await requireAdmin()
  await prisma.user.update({ where: { id: userId }, data: { suspended } })
  revalidatePath("/admin/users")
}

export async function resolveDispute(disputeId: string, resolution: string, adminNotes: string) {
  await requireAdmin()
  await prisma.dispute.update({
    where: { id: disputeId },
    data: { status: "RESOLVED", resolution, adminNotes, resolvedAt: new Date() },
  })
  revalidatePath("/admin/disputes")
}

export async function closeDispute(disputeId: string) {
  await requireAdmin()
  await prisma.dispute.update({
    where: { id: disputeId },
    data: { status: "CLOSED", resolvedAt: new Date() },
  })
  revalidatePath("/admin/disputes")
}

export async function replyToTicket(formData: FormData) {
  const adminId = await requireAdmin()
  const ticketId = formData.get("ticketId") as string
  const message = formData.get("message") as string
  if (!ticketId || !message) throw new Error("Données manquantes")

  await prisma.$transaction([
    prisma.ticketReply.create({
      data: { ticketId, userId: adminId, message },
    }),
    prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: "IN_PROGRESS" },
    }),
  ])
  revalidatePath(`/admin/support/${ticketId}`)
  revalidatePath("/admin/support")
}

export async function updateTicketStatus(ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
  await requireAdmin()
  await prisma.supportTicket.update({ where: { id: ticketId }, data: { status } })
  revalidatePath("/admin/support")
}

export async function createUser(data: {
  name: string
  email: string
  role: "CLIENT" | "FREELANCER" | "ADMIN"
  phone?: string
}) {
  await requireAdmin()
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error("Un utilisateur avec cet email existe déjà")

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone || null,
    },
  })

  // Create profile based on role
  if (data.role === "FREELANCER") {
    await prisma.freelancerProfile.create({ data: { userId: user.id } })
  } else if (data.role === "CLIENT") {
    await prisma.clientProfile.create({ data: { userId: user.id } })
  }

  revalidatePath("/admin/users")
  return user
}

export async function updateUser(
  userId: string,
  data: {
    name?: string
    email?: string
    phone?: string
    role?: "CLIENT" | "FREELANCER" | "ADMIN"
  }
) {
  await requireAdmin()
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (!user) throw new Error("Utilisateur introuvable")

  const updateData: any = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.email !== undefined) updateData.email = data.email
  if (data.phone !== undefined) updateData.phone = data.phone || null
  if (data.role !== undefined) updateData.role = data.role

  await prisma.user.update({ where: { id: userId }, data: updateData })

  // Handle role change: ensure profile exists for new role
  if (data.role && data.role !== user.role) {
    if (data.role === "FREELANCER") {
      await prisma.freelancerProfile.upsert({
        where: { userId },
        create: { userId },
        update: {},
      })
    } else if (data.role === "CLIENT") {
      await prisma.clientProfile.upsert({
        where: { userId },
        create: { userId },
        update: {},
      })
    }
  }

  revalidatePath("/admin/users")
}

export async function deleteUser(userId: string) {
  await requireAdmin()

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clientMissions: { select: { id: true }, take: 1 },
      freelanceMissions: { select: { id: true }, take: 1 },
      proposals: { select: { id: true }, take: 1 },
    },
  })
  if (!user) throw new Error("Utilisateur introuvable")

  if (user.clientMissions.length > 0 || user.freelanceMissions.length > 0 || user.proposals.length > 0) {
    throw new Error("Impossible de supprimer un utilisateur avec des missions/propositions actives")
  }

  await prisma.$transaction(async (tx) => {
    await tx.account.deleteMany({ where: { userId } })
    await tx.session.deleteMany({ where: { userId } })
    await tx.freelancerProfile.deleteMany({ where: { userId } })
    await tx.clientProfile.deleteMany({ where: { userId } })
    await tx.badge.deleteMany({ where: { userId } })
    await tx.notification.deleteMany({ where: { userId } })
    await tx.favorite.deleteMany({ where: { userId } })
    await tx.certification.deleteMany({ where: { userId } })
    await tx.education.deleteMany({ where: { userId } })
    await tx.ticketReply.deleteMany({ where: { userId } })
    await tx.supportTicket.deleteMany({ where: { userId } })
    await tx.creditTransaction.deleteMany({ where: { userId } })
    await tx.chatMessage.deleteMany({ where: { userId } })
    await tx.conversationParticipant.deleteMany({ where: { userId } })
    await tx.gig.deleteMany({ where: { userId } })
    await tx.invitation.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } })
    await tx.user.delete({ where: { id: userId } })
  })

  revalidatePath("/admin/users")
}

export async function deleteMissionAdmin(missionId: string) {
  await requireAdmin()
  await prisma.mission.update({ where: { id: missionId }, data: { status: "CANCELLED" } })
  revalidatePath("/admin/missions")
}
