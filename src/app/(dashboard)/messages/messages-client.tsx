"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useEffect, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendMessage, markConversationRead } from "@/lib/actions/chat"
import { Send, MessageSquare } from "lucide-react"

type Conversation = {
  id: string
  otherUser: { id: string; name: string | null; email: string | null; image: string | null } | null
  lastMessage: { content: string; createdAt: string; senderId: string } | null
  unreadCount: number
  mission: { id: string; title: string } | null
}

type Message = {
  id: string
  content: string
  createdAt: string
  sender: { id: string; name: string | null; email: string | null }
  type: string
}

export function MessagesClient({
  conversations,
  activeConversationId,
  activeMessages,
  currentUserId,
}: {
  conversations: Conversation[]
  activeConversationId: string | null
  activeMessages: Message[]
  currentUserId: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeMessages])

  function selectConversation(id: string) {
    router.push(`/messages?c=${id}`)
  }

  function getInitials(name: string | null | undefined, email: string | null | undefined) {
    if (name) return name.slice(0, 2).toUpperCase()
    if (email) return email.slice(0, 2).toUpperCase()
    return "??"
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return "À l'instant"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`
    if (diff < 86400000) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  async function handleSubmit(formData: FormData) {
    if (!activeConversationId) return
    formData.set("conversationId", activeConversationId)
    startTransition(async () => {
      await sendMessage(formData)
      formRef.current?.reset()
    })
  }

  const activeConv = conversations.find((c) => c.id === activeConversationId)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      {/* Left panel - conversations list */}
      <div className="flex w-80 shrink-0 flex-col border-r border-neutral-800">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-lg font-semibold text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="mb-3 h-10 w-10 text-neutral-600" />
              <p className="text-sm text-neutral-500">Aucune conversation</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`flex w-full items-start gap-3 border-b border-neutral-800/50 p-4 text-left transition-colors hover:bg-neutral-800/50 ${
                  conv.id === activeConversationId ? "bg-neutral-800" : ""
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={conv.otherUser?.image || undefined} />
                  <AvatarFallback className="bg-neutral-700 text-xs text-neutral-300">
                    {getInitials(conv.otherUser?.name, conv.otherUser?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-white">
                      {conv.otherUser?.name || conv.otherUser?.email || "Utilisateur"}
                    </span>
                    {conv.lastMessage && (
                      <span className="shrink-0 text-xs text-neutral-500">
                        {formatTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conv.mission && (
                    <p className="truncate text-xs text-lime-400/70">{conv.mission.title}</p>
                  )}
                  {conv.lastMessage && (
                    <p className="mt-0.5 truncate text-xs text-neutral-400">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="shrink-0 bg-lime-400 text-neutral-900 hover:bg-lime-400">
                    {conv.unreadCount}
                  </Badge>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel - messages */}
      <div className="flex flex-1 flex-col">
        {activeConversationId && activeConv ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-neutral-800 px-6 py-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeConv.otherUser?.image || undefined} />
                <AvatarFallback className="bg-neutral-700 text-xs text-neutral-300">
                  {getInitials(activeConv.otherUser?.name, activeConv.otherUser?.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">
                  {activeConv.otherUser?.name || activeConv.otherUser?.email || "Utilisateur"}
                </p>
                {activeConv.mission && (
                  <p className="text-xs text-neutral-400">{activeConv.mission.title}</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {activeMessages.length === 0 && (
                  <p className="text-center text-sm text-neutral-500">
                    Aucun message. Commencez la conversation !
                  </p>
                )}
                {activeMessages.map((msg) => {
                  const isMe = msg.sender.id === currentUserId
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? "bg-lime-400 text-neutral-900"
                            : "bg-neutral-800 text-neutral-100"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            isMe ? "text-neutral-700" : "text-neutral-500"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-neutral-800 p-4">
              <form ref={formRef} action={handleSubmit} className="flex gap-3">
                <Textarea
                  name="content"
                  placeholder="Écrivez votre message..."
                  className="min-h-[44px] max-h-32 flex-1 resize-none border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-lime-400"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      formRef.current?.requestSubmit()
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isPending}
                  className="h-11 w-11 shrink-0 bg-lime-400 text-neutral-900 hover:bg-lime-500"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <MessageSquare className="mb-4 h-16 w-16 text-neutral-700" />
            <h3 className="text-lg font-medium text-neutral-400">Vos messages</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Sélectionnez une conversation pour commencer
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
