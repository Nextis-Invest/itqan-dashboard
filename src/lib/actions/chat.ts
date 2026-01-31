"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"
import { sendEmail, newMessageEmail } from "@/lib/email"

export async function sendMessage(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const conversationId = formData.get("conversationId") as string
  const content = formData.get("content") as string
  if (!conversationId || !content?.trim()) throw new Error("Message vide")

  // Verify participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: session.user.id } },
  })
  if (!participant) throw new Error("Non autorisé")

  await prisma.$transaction([
    prisma.chatMessage.create({
      data: { conversationId, senderId: session.user.id, content: content.trim() },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
    // Increment unread for other participants
    prisma.conversationParticipant.updateMany({
      where: { conversationId, userId: { not: session.user.id } },
      data: { unreadCount: { increment: 1 } },
    }),
  ])

  // Send email notification to other participants
  try {
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId, userId: { not: session.user.id } },
      include: { user: { select: { email: true } } },
    })
    for (const p of otherParticipants) {
      if (p.user?.email) {
        await sendEmail({
          to: p.user.email,
          subject: "Nouveau message — Itqan",
          html: newMessageEmail(session.user.name || "Quelqu'un", conversationId),
        })
      }
    }
  } catch (e) {
    console.error("Email error:", e)
  }

  revalidatePath("/messages")
}

export async function startConversation(targetUserId: string, missionId?: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  if (targetUserId === session.user.id) throw new Error("Impossible")

  // Check existing conversation between these two users (without mission)
  const existing = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: { userId: { in: [session.user.id, targetUserId] } },
      },
      ...(missionId ? { missionId } : { missionId: null }),
    },
    include: { participants: true },
  })

  if (existing && existing.participants.length === 2) {
    return existing.id
  }

  const conversation = await prisma.conversation.create({
    data: {
      missionId: missionId || null,
      participants: {
        create: [
          { userId: session.user.id },
          { userId: targetUserId },
        ],
      },
    },
  })

  revalidatePath("/messages")
  return conversation.id
}

export async function markConversationRead(conversationId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  await prisma.conversationParticipant.updateMany({
    where: { conversationId, userId: session.user.id },
    data: { unreadCount: 0 },
  })
  revalidatePath("/messages")
}
