"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification"

export async function sendInvitation(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const missionId = formData.get("missionId") as string
  const freelancerId = formData.get("freelancerId") as string
  const message = formData.get("message") as string | null

  if (!missionId || !freelancerId) throw new Error("Données manquantes")

  // Check mission belongs to sender
  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission || mission.clientId !== session.user.id) throw new Error("Non autorisé")

  // Check not already invited
  const existing = await prisma.invitation.findFirst({
    where: { missionId, freelancerId, senderId: session.user.id },
  })
  if (existing) throw new Error("Déjà invité")

  await prisma.invitation.create({
    data: {
      missionId,
      freelancerId,
      senderId: session.user.id,
      message: message || null,
    },
  })

  // Notify freelancer
  try {
    await createNotification({
      userId: freelancerId,
      type: "INVITATION",
      title: "Nouvelle invitation",
      body: `Vous avez été invité à la mission "${mission.title}"`,
      entityType: "mission",
      entityId: missionId,
      actionUrl: `/missions/${missionId}`,
    })
  } catch (e) {
    console.error("Notification error:", e)
  }

  revalidatePath(`/profile/${freelancerId}`)
}

export async function respondToInvitation(invitationId: string, accept: boolean) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { mission: true },
  })
  if (!invitation || invitation.freelancerId !== session.user.id) throw new Error("Non autorisé")

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: accept ? "ACCEPTED" : "DECLINED" },
  })

  revalidatePath("/notifications")
}

export async function getMyInvitations() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.invitation.findMany({
    where: { freelancerId: session.user.id },
    include: {
      mission: { select: { title: true, budget: true, currency: true } },
      sender: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getClientMissionsForInvite() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.mission.findMany({
    where: { clientId: session.user.id, status: "OPEN" },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  })
}
