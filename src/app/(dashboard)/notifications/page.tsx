"use client"

import { useEffect, useState, useTransition } from "react"
import { getNotifications, markAsRead, markAllAsRead } from "@/lib/actions/notification"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, ExternalLink, Inbox, FileText, ThumbsUp, ThumbsDown, Upload, Star, MessageSquare, CheckCircle, Award, AlertTriangle, Headphones, Clock, Briefcase } from "lucide-react"
import Link from "next/link"

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  entityType: string | null
  entityId: string | null
  actionUrl: string | null
  read: boolean
  readAt: Date | null
  createdAt: Date
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  NEW_PROPOSAL: { icon: <FileText className="h-4 w-4" />, color: "text-blue-400", bg: "bg-blue-400/10" },
  PROPOSAL_ACCEPTED: { icon: <ThumbsUp className="h-4 w-4" />, color: "text-lime-400", bg: "bg-lime-400/10" },
  PROPOSAL_REJECTED: { icon: <ThumbsDown className="h-4 w-4" />, color: "text-red-400", bg: "bg-red-400/10" },
  MILESTONE_SUBMITTED: { icon: <Upload className="h-4 w-4" />, color: "text-amber-400", bg: "bg-amber-400/10" },
  MILESTONE_APPROVED: { icon: <ThumbsUp className="h-4 w-4" />, color: "text-green-400", bg: "bg-green-400/10" },
  NEW_REVIEW: { icon: <Star className="h-4 w-4" />, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  NEW_MESSAGE: { icon: <MessageSquare className="h-4 w-4" />, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  CONTRACT_CREATED: { icon: <FileText className="h-4 w-4" />, color: "text-lime-400", bg: "bg-lime-400/10" },
  CONTRACT_SIGNED: { icon: <CheckCircle className="h-4 w-4" />, color: "text-green-400", bg: "bg-green-400/10" },
  CONTRACT_COMPLETED: { icon: <Award className="h-4 w-4" />, color: "text-green-400", bg: "bg-green-400/10" },
  DISPUTE_OPENED: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-400", bg: "bg-red-400/10" },
  DISPUTE_RESOLVED: { icon: <CheckCircle className="h-4 w-4" />, color: "text-green-400", bg: "bg-green-400/10" },
  DISPUTE_MESSAGE: { icon: <MessageSquare className="h-4 w-4" />, color: "text-orange-400", bg: "bg-orange-400/10" },
  SUPPORT_REPLY: { icon: <Headphones className="h-4 w-4" />, color: "text-blue-400", bg: "bg-blue-400/10" },
  TICKET_STATUS: { icon: <Clock className="h-4 w-4" />, color: "text-blue-400", bg: "bg-blue-400/10" },
  MISSION_STATUS: { icon: <Briefcase className="h-4 w-4" />, color: "text-lime-400", bg: "bg-lime-400/10" },
}

const defaultTypeConfig = { icon: <Bell className="h-4 w-4" />, color: "text-muted-foreground", bg: "bg-muted/50" }

function formatDateGroup(date: Date): string {
  const d = new Date(date)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = today.getTime() - msgDate.getTime()
  if (diff === 0) return "Aujourd'hui"
  if (diff === 86400000) return "Hier"
  if (diff < 604800000) return d.toLocaleDateString("fr-FR", { weekday: "long" })
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

function groupByDate(notifications: Notification[]): { date: string; items: Notification[] }[] {
  const groups: { date: string; items: Notification[] }[] = []
  let currentKey = ""
  for (const n of notifications) {
    const key = new Date(n.createdAt).toLocaleDateString("fr-FR")
    if (key !== currentKey) {
      currentKey = key
      groups.push({ date: formatDateGroup(n.createdAt), items: [] })
    }
    groups[groups.length - 1].items.push(n)
  }
  return groups
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getNotifications().then((data) => {
      setNotifications(data as Notification[])
      setLoading(false)
    })
  }, [])

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, readAt: new Date() } : n))
      )
    })
  }

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, readAt: new Date() })))
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const grouped = groupByDate(notifications)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Notifications</h2>
          <p className="text-muted-foreground mt-1">Chargement...</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Notifications</h2>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes les notifications sont lues"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary/80 text-foreground/80 rounded-xl text-sm font-medium hover:bg-accent/80 transition-all duration-200 disabled:opacity-50 border border-border hover:border-border"
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-5 rounded-2xl bg-secondary/30 p-6 ring-1 ring-ring">
            <Inbox className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">Aucune notification</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Les nouvelles notifications apparaîtront ici lorsque quelqu&apos;un interagit avec vos projets</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.date}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">{group.date}</h3>
              <div className="space-y-2">
                {group.items.map((notification) => {
                  const config = typeConfig[notification.type] || defaultTypeConfig
                  return (
                    <div
                      key={notification.id}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                      className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                        notification.read
                          ? "bg-card/30 border-border opacity-70 hover:opacity-90"
                          : "bg-card/80 border-border hover:border-border hover:bg-accent shadow-sm"
                      }`}
                    >
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-lime-400" />
                      )}
                      {/* Icon */}
                      <div className={`shrink-0 rounded-lg p-2.5 ${config.bg} ${config.color}`}>
                        {config.icon}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-lime-400 shrink-0" />
                          )}
                        </div>
                        {notification.body && (
                          <p className={`text-xs mt-1 leading-relaxed ${notification.read ? "text-muted-foreground" : "text-muted-foreground"}`}>
                            {notification.body}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-2">
                          {new Date(notification.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 rounded-lg p-2 text-muted-foreground hover:text-lime-400 hover:bg-lime-400/5 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
