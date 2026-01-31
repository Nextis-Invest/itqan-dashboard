"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createSupportTicket(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const subject = formData.get("subject") as string
  const message = formData.get("message") as string
  const priority = (formData.get("priority") as string) || "MEDIUM"

  if (!subject || !message) throw new Error("Données manquantes")

  await prisma.supportTicket.create({
    data: {
      userId: session.user.id,
      subject,
      message,
      priority: priority as any,
    },
  })

  redirect("/settings")
}

export async function replyToSupportTicket(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const ticketId = formData.get("ticketId") as string
  const message = formData.get("message") as string
  if (!ticketId || !message) throw new Error("Données manquantes")

  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } })
  if (!ticket) throw new Error("Ticket introuvable")
  if (ticket.userId !== session.user.id) {
    // Check if admin
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (user?.role !== "ADMIN") throw new Error("Non autorisé")
  }

  await prisma.ticketReply.create({
    data: { ticketId, userId: session.user.id, message },
  })

  revalidatePath(`/admin/support/${ticketId}`)
  revalidatePath("/settings")
}

export async function createDispute(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const missionId = formData.get("missionId") as string
  const reason = formData.get("reason") as string
  if (!missionId || !reason) throw new Error("Données manquantes")

  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission) throw new Error("Mission introuvable")
  if (mission.clientId !== session.user.id && mission.freelancerId !== session.user.id) {
    throw new Error("Non autorisé")
  }

  await prisma.dispute.create({
    data: { missionId, openedById: session.user.id, reason },
  })

  revalidatePath(`/missions/${missionId}`)
}
