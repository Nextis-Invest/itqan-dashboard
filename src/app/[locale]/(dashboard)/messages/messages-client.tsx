"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useEffect, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendMessage, markConversationRead } from "@/lib/actions/chat"
import { Send, MessageSquare, Search, MoreVertical } from "lucide-react"

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

  function formatMessageTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  function formatDateSeparator(dateStr: string) {
    const d = new Date(dateStr)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const diff = today.getTime() - msgDate.getTime()
    if (diff === 0) return "Aujourd'hui"
    if (diff === 86400000) return "Hier"
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
  }

  function getDateKey(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR")
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

  // Group messages by date
  const groupedMessages: { date: string; dateLabel: string; messages: Message[] }[] = []
  let currentDateKey = ""
  for (const msg of activeMessages) {
    const dk = getDateKey(msg.createdAt)
    if (dk !== currentDateKey) {
      currentDateKey = dk
      groupedMessages.push({ date: dk, dateLabel: formatDateSeparator(msg.createdAt), messages: [] })
    }
    groupedMessages[groupedMessages.length - 1].messages.push(msg)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-border/80 bg-background/50 shadow-2xl shadow-black/20">
      {/* Left panel - conversations list */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border/80 bg-card/50">
        <div className="border-b border-border/80 p-5">
          <h2 className="text-lg font-bold text-foreground">Messages</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="mb-4 rounded-2xl bg-muted/50 p-5">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Aucune conversation</p>
              <p className="text-xs text-muted-foreground mt-1">Les messages de vos projets apparaîtront ici</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConversationId
              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`flex w-full items-start gap-3 border-l-2 px-4 py-4 text-left transition-all duration-200 hover:bg-secondary/40 ${
                    isActive
                      ? "border-l-lime-400 bg-lime-400/5"
                      : "border-l-transparent"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-11 w-11 shrink-0 ring-2 ring-border">
                      <AvatarImage src={conv.otherUser?.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-muted to-secondary text-xs font-semibold text-foreground/80">
                        {getInitials(conv.otherUser?.name, conv.otherUser?.email)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.unreadCount > 0 && (
                      <div className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-lime-400 ring-2 ring-background" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm font-semibold ${isActive ? "text-lime-400" : "text-foreground"}`}>
                        {conv.otherUser?.name || conv.otherUser?.email || "Utilisateur"}
                      </span>
                      {conv.lastMessage && (
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {conv.mission && (
                      <p className="truncate text-[11px] text-lime-400/60 font-medium">{conv.mission.title}</p>
                    )}
                    {conv.lastMessage && (
                      <p className={`mt-0.5 truncate text-xs ${conv.unreadCount > 0 ? "text-foreground/80 font-medium" : "text-muted-foreground"}`}>
                        {conv.lastMessage.senderId === currentUserId ? "Vous : " : ""}
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge className="shrink-0 bg-lime-400 text-neutral-900 hover:bg-lime-400 text-[10px] h-5 min-w-[20px] flex items-center justify-center font-bold">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Right panel - messages */}
      <div className="flex flex-1 flex-col bg-background/30">
        {activeConversationId && activeConv ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 bg-card/30 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-border">
                  <AvatarImage src={activeConv.otherUser?.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-muted to-secondary text-xs font-semibold text-foreground/80">
                    {getInitials(activeConv.otherUser?.name, activeConv.otherUser?.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {activeConv.otherUser?.name || activeConv.otherUser?.email || "Utilisateur"}
                  </p>
                  {activeConv.mission && (
                    <p className="text-xs text-muted-foreground">{activeConv.mission.title}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {activeMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4 rounded-2xl bg-secondary/30 p-5">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Aucun message</p>
                  <p className="text-xs text-muted-foreground mt-1">Commencez la conversation !</p>
                </div>
              )}
              {groupedMessages.map((group) => (
                <div key={group.date}>
                  {/* Date separator */}
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-secondary/60" />
                    <span className="text-[11px] font-medium text-muted-foreground bg-card/50 px-3 py-1 rounded-full">
                      {group.dateLabel}
                    </span>
                    <div className="flex-1 h-px bg-secondary/60" />
                  </div>
                  {/* Messages */}
                  <div className="space-y-3">
                    {group.messages.map((msg) => {
                      const isMe = msg.sender.id === currentUserId
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          {!isMe && (
                            <Avatar className="h-7 w-7 shrink-0 mb-5">
                              <AvatarImage src={activeConv.otherUser?.image || undefined} />
                              <AvatarFallback className="bg-secondary text-[10px] text-muted-foreground">
                                {getInitials(msg.sender.name, msg.sender.email)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                            <div
                              className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                                isMe
                                  ? "bg-lime-400/10 border border-lime-400/10 rounded-br-md"
                                  : "bg-secondary/80 border border-border rounded-bl-md"
                              }`}
                            >
                              <p className={`text-sm whitespace-pre-wrap break-words ${isMe ? "text-lime-50" : "text-foreground"}`}>
                                {msg.content}
                              </p>
                            </div>
                            <p className={`mt-1 text-[10px] px-1 ${isMe ? "text-right text-muted-foreground" : "text-muted-foreground"}`}>
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/80 bg-card/30 p-4 backdrop-blur-sm">
              <form ref={formRef} action={handleSubmit} className="flex items-end gap-3">
                <Textarea
                  name="content"
                  placeholder="Écrivez votre message..."
                  className="min-h-[44px] max-h-32 flex-1 resize-none rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-lime-400/50 focus-visible:border-lime-400/30"
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
                  className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 shadow-lg shadow-lime-400/20 transition-all duration-200 hover:shadow-lime-400/30"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
            <div className="mb-6 rounded-3xl bg-gradient-to-br from-secondary/50 to-card/50 p-8 ring-1 ring-border">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground/80">Vos messages</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Sélectionnez une conversation dans le panneau de gauche pour commencer à échanger
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
