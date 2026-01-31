import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { getAdminTicketById, getAdminList } from "@/lib/actions/support"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { AdminTicketActions } from "./admin-ticket-actions"
import { AdminReplyForm } from "./admin-reply-form"

export const metadata: Metadata = { title: "Ticket support - Admin" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-lime-400/10 text-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400" },
  CLOSED: { label: "Fermé", color: "bg-neutral-500/10 text-neutral-400" },
}

const priorityMap: Record<string, { label: string; color: string }> = {
  LOW: { label: "Faible", color: "bg-neutral-500/10 text-neutral-400" },
  MEDIUM: { label: "Moyen", color: "bg-blue-400/10 text-blue-400" },
  HIGH: { label: "Élevé", color: "bg-yellow-400/10 text-yellow-400" },
  URGENT: { label: "Urgent", color: "bg-red-400/10 text-red-400" },
}

const categoryMap: Record<string, { label: string; color: string }> = {
  GENERAL: { label: "Général", color: "bg-neutral-500/10 text-neutral-400" },
  PAYMENT: { label: "Paiement", color: "bg-blue-400/10 text-blue-400" },
  TECHNICAL: { label: "Technique", color: "bg-purple-400/10 text-purple-400" },
  ACCOUNT: { label: "Compte", color: "bg-yellow-400/10 text-yellow-400" },
  MISSION: { label: "Mission", color: "bg-lime-400/10 text-lime-400" },
  OTHER: { label: "Autre", color: "bg-neutral-500/10 text-neutral-400" },
}

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [ticket, admins] = await Promise.all([
    getAdminTicketById(id),
    getAdminList(),
  ])

  if (!ticket) notFound()

  const st = statusMap[ticket.status] || statusMap.OPEN
  const pr = priorityMap[ticket.priority] || priorityMap.MEDIUM
  const cat = categoryMap[ticket.category] || categoryMap.GENERAL

  // Merge replies and notes into a timeline, sorted by date
  type TimelineItem =
    | { type: "message"; id: string; user: { name: string | null; email: string; role: string }; content: string; createdAt: Date; isOriginal?: boolean }
    | { type: "note"; id: string; admin: { name: string | null }; content: string; createdAt: Date }

  const timeline: TimelineItem[] = []

  // Original message
  timeline.push({
    type: "message",
    id: "original",
    user: { name: ticket.user.name, email: ticket.user.email, role: ticket.user.role ?? "CLIENT" },
    content: ticket.message,
    createdAt: ticket.createdAt,
    isOriginal: true,
  })

  // Replies
  for (const reply of ticket.replies) {
    timeline.push({
      type: "message",
      id: reply.id,
      user: { name: reply.user.name, email: reply.user.email, role: reply.user.role ?? "CLIENT" },
      content: reply.message,
      createdAt: reply.createdAt,
    })
  }

  // Notes
  for (const note of ticket.notes) {
    timeline.push({
      type: "note",
      id: note.id,
      admin: { name: note.admin.name },
      content: note.content,
      createdAt: note.createdAt,
    })
  }

  timeline.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/support">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">{ticket.subject}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${st.color} border-0`}>{st.label}</Badge>
            <Badge className={`${cat.color} border-0`}>{cat.label}</Badge>
          </div>
        </div>
        <AdminTicketActions
          ticketId={ticket.id}
          currentStatus={ticket.status}
          currentPriority={ticket.priority}
          currentAssignedToId={ticket.assignedToId}
          admins={admins}
        />
      </div>

      {/* Info section */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-neutral-500 text-xs mb-1">Utilisateur</p>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-white">{ticket.user.name || ticket.user.email}</span>
              </div>
            </div>
            <div>
              <p className="text-neutral-500 text-xs mb-1">Priorité</p>
              <Badge className={`${pr.color} border-0`}>{pr.label}</Badge>
            </div>
            <div>
              <p className="text-neutral-500 text-xs mb-1">Assigné à</p>
              <span className="text-white">{ticket.assignedTo?.name || "Non assigné"}</span>
            </div>
            <div>
              <p className="text-neutral-500 text-xs mb-1">Créé le</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-white">
                  {new Date(ticket.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
            {ticket.firstReplyAt && (
              <div>
                <p className="text-neutral-500 text-xs mb-1">Première réponse</p>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-white">
                    {new Date(ticket.firstReplyAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            )}
            {ticket.closedAt && (
              <div>
                <p className="text-neutral-500 text-xs mb-1">Fermé le</p>
                <span className="text-white">
                  {new Date(ticket.closedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {timeline.map((item) => {
          if (item.type === "note") {
            return (
              <div
                key={item.id}
                className="rounded-lg border-2 border-dashed border-yellow-400/20 bg-yellow-400/5 p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-yellow-400/10 text-yellow-400 border-0 text-xs">Note interne</Badge>
                  <span className="text-white font-medium text-sm">{item.admin.name || "Admin"}</span>
                  <span className="text-neutral-500 text-xs">
                    {new Date(item.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-yellow-200/80 text-sm whitespace-pre-wrap">{item.content}</p>
              </div>
            )
          }

          const isAdmin = item.user.role === "ADMIN"
          return (
            <div
              key={item.id}
              className={`rounded-lg border p-6 ${
                isAdmin
                  ? "bg-lime-400/5 border-lime-400/10"
                  : "bg-neutral-900 border-neutral-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-medium text-sm">{item.user.name || item.user.email}</span>
                {isAdmin && (
                  <Badge className="bg-lime-400/10 text-lime-400 border-0 text-xs">Admin</Badge>
                )}
                <span className="text-neutral-500 text-xs">
                  {new Date(item.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-neutral-300 text-sm whitespace-pre-wrap">{item.content}</p>
            </div>
          )
        })}
      </div>

      {/* Reply / Note forms */}
      <AdminReplyForm ticketId={ticket.id} />
    </div>
  )
}
