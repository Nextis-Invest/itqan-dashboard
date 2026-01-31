import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Messages" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { MessagesClient } from "./messages-client"

export const dynamic = "force-dynamic"

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const sp = await searchParams

  // Get all conversations for this user
  const participations = await prisma.conversationParticipant.findMany({
    where: { userId: session.user.id },
    include: {
      conversation: {
        include: {
          participants: {
            include: {
              user: { select: { id: true, name: true, email: true, image: true } },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true, createdAt: true, senderId: true },
          },
          mission: { select: { id: true, title: true } },
        },
      },
    },
    orderBy: { conversation: { lastMessageAt: { sort: "desc", nulls: "last" } } },
  })

  const conversations = participations.map((p) => {
    const otherParticipants = p.conversation.participants.filter(
      (pp) => pp.userId !== session.user.id
    )
    const lastMessage = p.conversation.messages[0] || null
    return {
      id: p.conversation.id,
      otherUser: otherParticipants[0]?.user || null,
      lastMessage: lastMessage ? { content: lastMessage.content, createdAt: lastMessage.createdAt.toISOString(), senderId: lastMessage.senderId } : null,
      unreadCount: p.unreadCount,
      mission: p.conversation.mission,
    }
  })

  // Load messages for selected conversation
  let activeMessages: any[] = []
  if (sp.c) {
    const msgs = await prisma.chatMessage.findMany({
      where: { conversationId: sp.c },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    })
    activeMessages = msgs.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      sender: m.sender,
      type: m.type,
    }))

    // Mark as read
    await prisma.conversationParticipant.updateMany({
      where: { conversationId: sp.c, userId: session.user.id },
      data: { unreadCount: 0 },
    })
  }

  return (
    <MessagesClient
      conversations={conversations}
      activeConversationId={sp.c || null}
      activeMessages={activeMessages}
      currentUserId={session.user.id}
    />
  )
}
