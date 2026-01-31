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

export async function deleteMissionAdmin(missionId: string) {
  await requireAdmin()
  await prisma.mission.update({ where: { id: missionId }, data: { status: "CANCELLED" } })
  revalidatePath("/admin/missions")
}
