import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { getTicketById } from "@/lib/actions/support"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Tag, AlertTriangle } from "lucide-react"
import { TicketReplyForm } from "./reply-form"
import { ReopenButton } from "./reopen-button"

export const metadata: Metadata = { title: "Ticket support" }
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

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const ticket = await getTicketById(id)
  if (!ticket) notFound()

  const st = statusMap[ticket.status] || statusMap.OPEN
  const pr = priorityMap[ticket.priority] || priorityMap.MEDIUM
  const cat = categoryMap[ticket.category] || categoryMap.GENERAL

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/support">
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
      </div>

      {/* Info card */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-neutral-400">
              <Calendar className="h-4 w-4" />
              <span>Créé le {new Date(ticket.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Tag className="h-4 w-4" />
              <span>Catégorie: {cat.label}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Priorité: {pr.label}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Original message */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white font-medium text-sm">{ticket.user.name || ticket.user.email}</span>
          <span className="text-neutral-500 text-xs">
            {new Date(ticket.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <p className="text-neutral-300 text-sm whitespace-pre-wrap">{ticket.message}</p>
      </div>

      {/* Replies */}
      {ticket.replies.map((reply) => {
        const isAdmin = reply.user.role === "ADMIN"
        return (
          <div
            key={reply.id}
            className={`rounded-lg border p-6 ${
              isAdmin
                ? "bg-lime-400/5 border-lime-400/10"
                : "bg-neutral-900 border-neutral-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white font-medium text-sm">{reply.user.name || reply.user.email}</span>
              {isAdmin && (
                <Badge className="bg-lime-400/10 text-lime-400 border-0 text-xs">Admin</Badge>
              )}
              <span className="text-neutral-500 text-xs">
                {new Date(reply.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-neutral-300 text-sm whitespace-pre-wrap">{reply.message}</p>
          </div>
        )
      })}

      {/* Reply form or closed notice */}
      {ticket.status === "CLOSED" ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-8 text-center">
            <p className="text-neutral-400 mb-4">Ce ticket est fermé</p>
            <ReopenButton ticketId={ticket.id} />
          </CardContent>
        </Card>
      ) : (
        <TicketReplyForm ticketId={ticket.id} />
      )}
    </div>
  )
}
