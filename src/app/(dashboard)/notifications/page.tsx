"use client"

import { useEffect, useState, useTransition } from "react"
import { getNotifications, markAsRead, markAllAsRead } from "@/lib/actions/notification"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, ExternalLink } from "lucide-react"
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

const typeIcons: Record<string, string> = {
  NEW_PROPOSAL: "📋",
  PROPOSAL_ACCEPTED: "✅",
  PROPOSAL_REJECTED: "❌",
  MILESTONE_SUBMITTED: "📤",
  MILESTONE_APPROVED: "✅",
  NEW_REVIEW: "⭐",
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Notifications</h2>
          <p className="text-neutral-400 mt-1">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Notifications</h2>
          <p className="text-neutral-400 mt-1">
            {unreadCount > 0
              ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes les notifications sont lues"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucune notification.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              className={`block rounded-lg border transition-colors cursor-pointer ${
                notification.read
                  ? "bg-neutral-900/50 border-neutral-800/50"
                  : "bg-neutral-900 border-neutral-700 hover:border-neutral-600"
              }`}
            >
              <div className="px-4 py-3 flex items-start gap-3">
                <span className="text-lg mt-0.5">
                  {typeIcons[notification.type] || "🔔"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${notification.read ? "text-neutral-400" : "text-white"}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <Badge className="bg-lime-400/20 text-lime-400 border-0 text-[10px] px-1.5">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  {notification.body && (
                    <p className={`text-xs mt-0.5 ${notification.read ? "text-neutral-500" : "text-neutral-400"}`}>
                      {notification.body}
                    </p>
                  )}
                  <p className="text-[11px] text-neutral-600 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {notification.actionUrl && (
                  <Link
                    href={notification.actionUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="text-neutral-500 hover:text-lime-400 transition-colors mt-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
