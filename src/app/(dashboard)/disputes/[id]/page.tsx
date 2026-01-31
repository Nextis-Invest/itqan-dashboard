import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { getDisputeById } from "@/lib/actions/dispute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { DisputeMessageForm } from "./message-form"

export const metadata: Metadata = { title: "Détail du litige" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-red-400/10 text-red-400" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400" },
  CLOSED: { label: "Fermé", color: "bg-neutral-500/10 text-neutral-400" },
}

const categoryMap: Record<string, { label: string; color: string }> = {
  QUALITY: { label: "Qualité", color: "bg-purple-400/10 text-purple-400" },
  DELAY: { label: "Retard", color: "bg-yellow-400/10 text-yellow-400" },
  PAYMENT: { label: "Paiement", color: "bg-blue-400/10 text-blue-400" },
  SCOPE: { label: "Périmètre", color: "bg-orange-400/10 text-orange-400" },
  COMMUNICATION: { label: "Communication", color: "bg-cyan-400/10 text-cyan-400" },
  OTHER: { label: "Autre", color: "bg-neutral-500/10 text-neutral-400" },
}

const priorityMap: Record<string, { label: string; color: string }> = {
  LOW: { label: "Faible", color: "bg-neutral-500/10 text-neutral-400" },
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
        <Link href="/disputes">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">{dispute.mission.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${st.color} border-0`}>{st.label}</Badge>
            <Badge className={`${cat.color} border-0`}>{cat.label}</Badge>
            <Badge className={`${pri.color} border-0`}>{pri.label}</Badge>
          </div>
        </div>
      </div>

      {/* Info card */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader><CardTitle className="text-white text-sm">Informations</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Mission</span>
            <Link href={`/missions/${dispute.mission.id}`} className="text-lime-400 hover:underline">
              {dispute.mission.title}
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Client</span>
            <span className="text-white">{dispute.mission.client.name || dispute.mission.client.email}</span>
          </div>
          {dispute.mission.freelancer && (
            <div className="flex justify-between">
              <span className="text-neutral-400">Freelance</span>
              <span className="text-white">{dispute.mission.freelancer.name || dispute.mission.freelancer.email}</span>
            </div>
          )}
          {dispute.mission.contract && (
            <>
              <div className="flex justify-between">
                <span className="text-neutral-400">Montant contrat</span>
                <span className="text-white">{dispute.mission.contract.totalAmount} {dispute.mission.contract.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Statut contrat</span>
                <span className="text-white">{dispute.mission.contract.status}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-400">Ouvert par</span>
            <span className="text-white">{dispute.openedBy.name || dispute.openedBy.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Date d&apos;ouverture</span>
            <span className="text-white">{new Date(dispute.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div>
        <h3 className="text-white font-semibold mb-4">Conversation</h3>
        <div className="space-y-3">
          {dispute.messages.map((msg) => {
            const isAdmin = msg.sender.role === "ADMIN"
            return (
              <div
                key={msg.id}
                className={`rounded-lg p-4 ${isAdmin ? "bg-lime-400/5 border border-lime-400/20" : "bg-neutral-900 border border-neutral-800"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-white">
                    {(msg.sender.name || msg.sender.email)?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span className="text-white text-sm font-medium">
                    {msg.sender.name || msg.sender.email}
                  </span>
                  {isAdmin && (
                    <Badge className="bg-lime-400/10 text-lime-400 border-0 text-[10px]">Admin</Badge>
                  )}
                  <span className="text-neutral-500 text-xs ml-auto">
                    {new Date(msg.createdAt).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-neutral-300 text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            )
          })}
          {dispute.messages.length === 0 && (
            <p className="text-neutral-500 text-sm text-center py-8">Aucun message pour le moment</p>
          )}
        </div>
      </div>

      {/* Resolution card */}
      {dispute.resolution && (
        <Card className="bg-neutral-900 border-green-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold">Résolution</span>
            </div>
            <p className="text-neutral-300 text-sm whitespace-pre-wrap">{dispute.resolution}</p>
            {dispute.favoredParty && (
              <p className="text-neutral-400 text-sm mt-3">
                Partie favorisée : <span className="text-white">{favoredPartyMap[dispute.favoredParty] || dispute.favoredParty}</span>
              </p>
            )}
            {dispute.resolvedAt && (
              <p className="text-neutral-500 text-xs mt-2">
                Résolu le {new Date(dispute.resolvedAt).toLocaleDateString("fr-FR")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Message input or closed notice */}
      {canMessage ? (
        <DisputeMessageForm disputeId={dispute.id} />
      ) : (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-2 text-neutral-400 text-sm">
              <XCircle className="h-4 w-4" />
              <span>Ce litige a été {dispute.status === "RESOLVED" ? "résolu" : "fermé"}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
