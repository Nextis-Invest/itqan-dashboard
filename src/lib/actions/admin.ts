"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"
import { notifySupportReply, notifyTicketStatus, notifyMissionStatus } from "./notification"

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

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    select: { userId: true },
  })

  await prisma.$transaction([
    prisma.ticketReply.create({
      data: { ticketId, userId: adminId, message },
    }),
    prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: "IN_PROGRESS" },
    }),
  ])

  // Notify the ticket owner
  try {
    if (ticket?.userId) {
      await notifySupportReply(ticket.userId, ticketId)
    }
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath(`/admin/support/${ticketId}`)
  revalidatePath("/admin/support")
}

export async function updateTicketStatus(ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
  await requireAdmin()
  
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    select: { userId: true },
  })

  await prisma.supportTicket.update({ where: { id: ticketId }, data: { status } })

  // Notify the ticket owner
  try {
    if (ticket?.userId) {
      await notifyTicketStatus(ticket.userId, ticketId, status)
    }
  } catch (e) {
    console.error("Notification error:", e)
  }

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
    await tx.chatMessage.deleteMany({ where: { senderId: userId } })
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

export async function updateMissionStatusAdmin(missionId: string, status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED") {
  await requireAdmin()
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    select: { status: true, title: true, clientId: true, freelancerId: true },
  })
  if (!mission) throw new Error("Mission introuvable")

  await prisma.mission.update({ where: { id: missionId }, data: { status } })

  // Notify the client and freelancer (if assigned)
  try {
    await notifyMissionStatus(mission.clientId, missionId, mission.title, status)
    if (mission.freelancerId) {
      await notifyMissionStatus(mission.freelancerId, missionId, mission.title, status)
    }
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath("/admin/missions")
}

export async function toggleMissionFeatured(missionId: string) {
  await requireAdmin()
  const mission = await prisma.mission.findUnique({ where: { id: missionId }, select: { featured: true } })
  if (!mission) throw new Error("Mission introuvable")

  await prisma.mission.update({
    where: { id: missionId },
    data: { featured: !mission.featured },
  })
  revalidatePath("/admin/missions")
}

export async function deleteMissionPermanent(missionId: string) {
  await requireAdmin()
  const mission = await prisma.mission.findUnique({ where: { id: missionId }, select: { status: true } })
  if (!mission) throw new Error("Mission introuvable")
  if (!["DRAFT", "CANCELLED"].includes(mission.status)) {
    throw new Error("Seules les missions en brouillon ou annulées peuvent être supprimées")
  }

  await prisma.$transaction(async (tx) => {
    await tx.proposal.deleteMany({ where: { missionId } })
    await tx.review.deleteMany({ where: { missionId } })
    await tx.invitation.deleteMany({ where: { missionId } })
    await tx.mission.delete({ where: { id: missionId } })
  })
  revalidatePath("/admin/missions")
}

export async function approveMission(missionId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") throw new Error("Non autorisé")
  
  const mission = await prisma.mission.update({
    where: { id: missionId },
    data: { status: "OPEN" },
    include: { client: { select: { id: true, name: true, email: true } } },
  })
  
  // Notify client
  try {
    const { notifyMissionStatus } = await import("./notification")
    await notifyMissionStatus(mission.clientId, missionId, mission.title, "OPEN")
  } catch (e) {
    console.error("Notification error:", e)
  }
  
  revalidatePath("/admin/missions")
}

export async function rejectMission(missionId: string, reason?: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") throw new Error("Non autorisé")
  
  const mission = await prisma.mission.update({
    where: { id: missionId },
    data: { status: "REJECTED" },
    include: { client: { select: { id: true } } },
  })
  
  // Notify client
  try {
    const { createNotification } = await import("./notification")
    await createNotification({
      userId: mission.clientId,
      type: "MISSION_REJECTED",
      title: "Mission rejetée",
      body: reason ? `Votre mission "${mission.title}" a été rejetée : ${reason}` : `Votre mission "${mission.title}" a été rejetée`,
      entityType: "mission",
      entityId: missionId,
      actionUrl: `/missions/${missionId}`,
    })
  } catch (e) {
    console.error("Notification error:", e)
  }
  
  revalidatePath("/admin/missions")
}

export async function assignFreelancerAdmin(missionId: string, freelancerId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") throw new Error("Non autorisé")
  
  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission) throw new Error("Mission introuvable")
  
  const freelancer = await prisma.user.findUnique({ 
    where: { id: freelancerId },
    select: { id: true, name: true, role: true }
  })
  if (!freelancer || freelancer.role !== "FREELANCER") throw new Error("Freelancer introuvable")
  
  // Update mission
  await prisma.mission.update({
    where: { id: missionId },
    data: { freelancerId, status: "IN_PROGRESS" },
  })
  
  // Note: Contract creation skipped for manual assignments since proposalId is required
  // Contracts should be created via the normal proposal flow
  
  // Notify both parties
  try {
    const { createNotification } = await import("./notification")
    await createNotification({
      userId: freelancerId,
      type: "MISSION_ASSIGNED",
      title: "Mission attribuée",
      body: `Vous avez été assigné à la mission "${mission.title}"`,
      entityType: "mission",
      entityId: missionId,
      actionUrl: `/missions/${missionId}`,
    })
    await createNotification({
      userId: mission.clientId,
      type: "MISSION_ASSIGNED",
      title: "Freelancer assigné",
      body: `${freelancer.name || "Un freelancer"} a été assigné à votre mission "${mission.title}"`,
      entityType: "mission",
      entityId: missionId,
      actionUrl: `/missions/${missionId}`,
    })
  } catch (e) {
    console.error("Notification error:", e)
  }
  
  revalidatePath("/admin/missions")
  revalidatePath(`/missions/${missionId}`)
}

export async function searchFreelancers(query: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  
  return prisma.user.findMany({
    where: {
      role: "FREELANCER",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, email: true, image: true },
    take: 10,
  })
}
