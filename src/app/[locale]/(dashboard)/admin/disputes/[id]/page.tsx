import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { getAdminDisputeById, getAdminUsers } from "@/lib/actions/dispute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { DisputeActions } from "./dispute-actions"

export const metadata: Metadata = { title: "Gestion du litige" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-red-400/10 text-red-400" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400" },
  CLOSED: { label: "Fermé", color: "bg-muted/50 text-muted-foreground" },
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

export default async function AdminDisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const [dispute, adminUsers] = await Promise.all([
    getAdminDisputeById(id),
    getAdminUsers(),
  ])
  if (!dispute) notFound()

  const st = statusMap[dispute.status] || statusMap.OPEN
  const cat = categoryMap[dispute.category] || categoryMap.OTHER
  const pri = priorityMap[dispute.priority] || priorityMap.MEDIUM

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/disputes">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{dispute.mission.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${st.color} border-0`}>{st.label}</Badge>
            <Badge className={`${cat.color} border-0`}>{cat.label}</Badge>
            <Badge className={`${pri.color} border-0`}>{pri.label}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Messages timeline */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Conversation</h3>
            <div className="space-y-3">
              {dispute.messages.map((msg) => {
                const isAdmin = msg.sender.role === "ADMIN"
                const isInternal = msg.isInternal
                return (
                  <div
                    key={msg.id}
                    className={`rounded-lg p-4 ${
                      isInternal
                        ? "bg-yellow-400/5 border border-dashed border-yellow-400/30"
                        : isAdmin
                          ? "bg-lime-400/5 border border-lime-400/20"
                          : "bg-card border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                        {(msg.sender.name || msg.sender.email)?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="text-foreground text-sm font-medium">
                        {msg.sender.name || msg.sender.email}
                      </span>
                      {isAdmin && (
                        <Badge className="bg-lime-400/10 text-lime-400 border-0 text-[10px]">Admin</Badge>
                      )}
                      {isInternal && (
                        <Badge className="bg-yellow-400/10 text-yellow-400 border-0 text-[10px]">Note interne</Badge>
                      )}
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
                    <p className="text-foreground/80 text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                )
              })}
              {dispute.messages.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">Aucun message</p>
              )}
            </div>
          </div>

          {/* Resolution card */}
          {dispute.resolution && (
            <Card className="bg-card border-green-400/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Résolution</span>
                </div>
                <p className="text-foreground/80 text-sm whitespace-pre-wrap">{dispute.resolution}</p>
                {dispute.favoredParty && (
                  <p className="text-muted-foreground text-sm mt-3">
                    Partie favorisée : <span className="text-foreground">{favoredPartyMap[dispute.favoredParty] || dispute.favoredParty}</span>
                  </p>
                )}
                {dispute.adminNotes && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-muted-foreground text-xs mb-1">Notes admin</p>
                    <p className="text-muted-foreground text-sm">{dispute.adminNotes}</p>
                  </div>
                )}
                {dispute.resolvedAt && (
                  <p className="text-muted-foreground text-xs mt-2">
                    Résolu le {new Date(dispute.resolvedAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Admin message input */}
          <DisputeActions
            disputeId={dispute.id}
            currentStatus={dispute.status}
            currentCategory={dispute.category}
            currentPriority={dispute.priority}
            assignedToId={dispute.assignedToId}
            adminUsers={adminUsers}
          />
        </div>

        {/* Right: Info panel */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-foreground text-sm">Mission</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Titre</span>
                <Link href={`/missions/${dispute.mission.id}`} className="text-lime-400 hover:underline text-right max-w-[60%] truncate">
                  {dispute.mission.title}
                </Link>
              </div>
              {dispute.mission.budget && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="text-foreground">{dispute.mission.budget} {dispute.mission.currency}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client</span>
                <span className="text-foreground">{dispute.mission.client.name || dispute.mission.client.email}</span>
              </div>
              {dispute.mission.freelancer && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Freelance</span>
                  <span className="text-foreground">{dispute.mission.freelancer.name || dispute.mission.freelancer.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {dispute.mission.contract && (
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-foreground text-sm">Contrat</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="text-foreground">{dispute.mission.contract.totalAmount} {dispute.mission.contract.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <span className="text-foreground">{dispute.mission.contract.status}</span>
                </div>
                {dispute.mission.contract.milestones && dispute.mission.contract.milestones.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground text-xs">Jalons : {dispute.mission.contract.milestones.length}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-foreground text-sm">Litige</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ouvert par</span>
                <span className="text-foreground">{dispute.openedBy.name || dispute.openedBy.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{new Date(dispute.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigné à</span>
                <span className="text-foreground">{dispute.assignedTo?.name || dispute.assignedTo?.email || "Non assigné"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
