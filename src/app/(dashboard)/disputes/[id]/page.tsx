import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { getDisputeById } from "@/lib/actions/dispute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, Info, MessageSquare } from "lucide-react"
import Link from "next/link"
import { DisputeMessageForm } from "./message-form"

export const metadata: Metadata = { title: "Détail du litige" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-400/20" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400 ring-1 ring-green-400/20" },
  CLOSED: { label: "Fermé", color: "bg-muted/50 text-muted-foreground ring-1 ring-border" },
}

const categoryMap: Record<string, { label: string; color: string }> = {
  QUALITY: { label: "Qualité", color: "bg-purple-400/10 text-purple-400" },
  DELAY: { label: "Retard", color: "bg-yellow-400/10 text-yellow-400" },
  PAYMENT: { label: "Paiement", color: "bg-blue-400/10 text-blue-400" },
  SCOPE: { label: "Périmètre", color: "bg-orange-400/10 text-orange-400" },
  COMMUNICATION: { label: "Communication", color: "bg-cyan-400/10 text-cyan-400" },
  OTHER: { label: "Autre", color: "bg-muted/50 text-muted-foreground" },
}

const priorityMap: Record<string, { label: string; color: string }> = {
  LOW: { label: "Faible", color: "bg-muted/50 text-muted-foreground" },
  MEDIUM: { label: "Moyen", color: "bg-blue-400/10 text-blue-400" },
  HIGH: { label: "Élevé", color: "bg-yellow-400/10 text-yellow-400" },
  CRITICAL: { label: "Critique", color: "bg-red-400/10 text-red-400" },
}

const favoredPartyMap: Record<string, string> = {
  CLIENT: "Client",
  FREELANCER: "Freelance",
  NEUTRAL: "Neutre",
}

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const dispute = await getDisputeById(id)
  if (!dispute) notFound()

  const st = statusMap[dispute.status] || statusMap.OPEN
  const cat = categoryMap[dispute.category] || categoryMap.OTHER
  const pri = priorityMap[dispute.priority] || priorityMap.MEDIUM
  const canMessage = dispute.status === "OPEN" || dispute.status === "UNDER_REVIEW"

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/disputes" className="rounded-xl p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{dispute.mission.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={`${st.color} border-0`}>{st.label}</Badge>
            <Badge className={`${cat.color} border-0`}>{cat.label}</Badge>
            <Badge className={`${pri.color} border-0`}>{pri.label}</Badge>
          </div>
        </div>
      </div>

      {/* Info card */}
      <Card className="bg-card/80 border-border/80">
        <CardHeader>
          <CardTitle className="text-foreground text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-lime-400" />
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: "Mission", value: dispute.mission.title, isLink: true, href: `/missions/${dispute.mission.id}` },
              { label: "Client", value: dispute.mission.client.name || dispute.mission.client.email },
              ...(dispute.mission.freelancer ? [{ label: "Freelance", value: dispute.mission.freelancer.name || dispute.mission.freelancer.email }] : []),
              { label: "Ouvert par", value: dispute.openedBy.name || dispute.openedBy.email },
              { label: "Date d'ouverture", value: new Date(dispute.createdAt).toLocaleDateString("fr-FR") },
              ...(dispute.mission.contract ? [
                { label: "Montant contrat", value: `${dispute.mission.contract.totalAmount} ${dispute.mission.contract.currency}` },
              ] : []),
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                <span className="text-muted-foreground text-xs">{item.label}</span>
                {item.isLink && item.href ? (
                  <Link href={item.href} className="text-lime-400 hover:underline text-xs font-medium">{item.value}</Link>
                ) : (
                  <span className="text-foreground text-xs font-medium">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversation */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4 text-lime-400" />
          <h3 className="text-foreground font-semibold">Conversation</h3>
          <span className="text-muted-foreground text-xs">({dispute.messages.length})</span>
        </div>
        <div className="space-y-3">
          {dispute.messages.length === 0 && (
            <div className="text-center py-10">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Aucun message pour le moment</p>
            </div>
          )}
          {dispute.messages.map((msg) => {
            const isAdmin = msg.sender.role === "ADMIN"
            const isMe = msg.sender.id === session.user!.id
            return (
              <div
                key={msg.id}
                className={`rounded-xl p-5 border transition-all ${
                  isAdmin
                    ? "bg-lime-400/5 border-lime-400/15"
                    : "bg-card/80 border-border/80"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isAdmin ? "bg-lime-400/15 text-lime-400" : "bg-secondary/80 text-foreground"
                  }`}>
                    {(msg.sender.name || msg.sender.email)?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">
                      {msg.sender.name || msg.sender.email}
                    </span>
                    {isAdmin && (
                      <Badge className="bg-lime-400/10 text-lime-400 border-0 text-[10px]">Admin</Badge>
                    )}
                    {isMe && !isAdmin && (
                      <Badge className="bg-secondary/50 text-muted-foreground border-0 text-[10px]">Vous</Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs ml-auto">
                    {new Date(msg.createdAt).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-foreground/80 text-sm whitespace-pre-wrap leading-relaxed pl-10">{msg.content}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resolution */}
      {dispute.resolution && (
        <Card className="bg-green-400/5 border-green-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-bold">Résolution</span>
            </div>
            <p className="text-foreground/80 text-sm whitespace-pre-wrap leading-relaxed">{dispute.resolution}</p>
            {dispute.favoredParty && (
              <p className="text-muted-foreground text-sm mt-3">
                Partie favorisée : <span className="text-foreground font-medium">{favoredPartyMap[dispute.favoredParty] || dispute.favoredParty}</span>
              </p>
            )}
            {dispute.resolvedAt && (
              <p className="text-muted-foreground text-xs mt-2">
                Résolu le {new Date(dispute.resolvedAt).toLocaleDateString("fr-FR")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Message input or closed */}
      {canMessage ? (
        <DisputeMessageForm disputeId={dispute.id} />
      ) : (
        <div className="rounded-xl bg-card/80 border border-border/80 py-6 px-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <XCircle className="h-4 w-4" />
            <span>Ce litige a été {dispute.status === "RESOLVED" ? "résolu" : "fermé"}</span>
          </div>
        </div>
      )}
    </div>
  )
}
