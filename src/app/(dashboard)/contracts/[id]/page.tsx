import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"

export const metadata: Metadata = { title: "Détail du contrat" }
import { getContract, signContract, completeContract } from "@/lib/actions/contract"
import { submitMilestone, approveMilestone, requestRevision, startMilestone, createMilestone } from "@/lib/actions/milestone"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileCheck, AlertCircle, ArrowLeft, Pen, Shield, Coins, CalendarDays } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-400/10 text-amber-400",
  ACTIVE: "bg-lime-400/10 text-lime-400",
  COMPLETED: "bg-green-400/10 text-green-400",
  CANCELLED: "bg-muted/50 text-muted-foreground",
  DISPUTED: "bg-red-400/10 text-red-400",
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  ACTIVE: "Actif",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  DISPUTED: "Litige",
}

const milestoneStatusColors: Record<string, string> = {
  PENDING: "bg-muted/50 text-muted-foreground",
  IN_PROGRESS: "bg-blue-400/10 text-blue-400",
  SUBMITTED: "bg-amber-400/10 text-amber-400",
  APPROVED: "bg-green-400/10 text-green-400",
  REVISION: "bg-orange-400/10 text-orange-400",
  PAID: "bg-lime-400/10 text-lime-400",
}

const milestoneStatusLabels: Record<string, string> = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  SUBMITTED: "Soumis",
  APPROVED: "Approuvé",
  REVISION: "Révision",
  PAID: "Payé",
}

const milestoneStatusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PENDING: Clock,
  IN_PROGRESS: Clock,
  SUBMITTED: AlertCircle,
  APPROVED: CheckCircle,
  REVISION: AlertCircle,
  PAID: CheckCircle,
}

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const contract = await getContract(id)
  if (!contract) notFound()

  const isClient = contract.clientId === session.user.id
  const isFreelancer = contract.freelancerId === session.user.id

  const [clientUser, freelancerUser] = await Promise.all([
    prisma.user.findUnique({ where: { id: contract.clientId }, select: { name: true, email: true } }),
    prisma.user.findUnique({ where: { id: contract.freelancerId }, select: { name: true, email: true } }),
  ])

  const completedMilestones = contract.milestones.filter(
    (m: any) => m.status === "APPROVED" || m.status === "PAID"
  ).length
  const totalMilestones = contract.milestones.length

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/contracts" className="rounded-xl p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {contract.mission?.title || "Contrat"}
            </h2>
            <Badge className={`${statusColors[contract.status]} border-0`}>
              {statusLabels[contract.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">Détails du contrat</p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-card/80 border border-border/80 p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
            <Coins className="h-3.5 w-3.5 text-lime-400" />
            Montant total
          </div>
          <p className="text-xl font-bold text-foreground">{contract.totalAmount} <span className="text-sm text-muted-foreground">{contract.currency}</span></p>
        </div>
        <div className="rounded-xl bg-card/80 border border-border/80 p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
            Progression
          </div>
          <p className="text-xl font-bold text-foreground">{completedMilestones}<span className="text-sm text-muted-foreground">/{totalMilestones}</span></p>
          {totalMilestones > 0 && (
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-lime-500" style={{ width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }} />
            </div>
          )}
        </div>
        <div className="rounded-xl bg-card/80 border border-border/80 p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
            Début
          </div>
          <p className="text-xl font-bold text-foreground">{contract.startDate ? new Date(contract.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}</p>
        </div>
        <div className="rounded-xl bg-card/80 border border-border/80 p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-amber-400" />
            Fin
          </div>
          <p className="text-xl font-bold text-foreground">{contract.endDate ? new Date(contract.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}</p>
        </div>
      </div>

      {/* Contract Info */}
      <Card className="bg-card/80 border-border/80">
        <CardHeader>
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-lime-400" />
            Informations du contrat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
              <span className="text-muted-foreground">Client</span>
              <span className="text-foreground font-medium">{clientUser?.name || clientUser?.email}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
              <span className="text-muted-foreground">Freelance</span>
              <span className="text-foreground font-medium">{freelancerUser?.name || freelancerUser?.email}</span>
            </div>
          </div>
          {contract.mission?.description && (
            <div className="pt-3 border-t border-border/60">
              <p className="text-muted-foreground text-xs mb-1.5 font-medium uppercase tracking-wider">Description</p>
              <p className="text-foreground/80 leading-relaxed">{contract.mission.description}</p>
            </div>
          )}
          {contract.terms && (
            <div className="pt-3 border-t border-border/60">
              <p className="text-muted-foreground text-xs mb-1.5 font-medium uppercase tracking-wider">Termes du contrat</p>
              <p className="text-foreground/80 leading-relaxed">{contract.terms}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signing Section */}
      {contract.status === "PENDING" && (
        <Card className="bg-card/80 border-border/80">
          <CardHeader>
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <Pen className="h-4 w-4 text-lime-400" />
              Signature du contrat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${contract.signedByClient ? "bg-lime-400/5 border-lime-400/20" : "bg-secondary/30 border-border"}`}>
                {contract.signedByClient ? (
                  <CheckCircle className="h-5 w-5 text-lime-400 shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">Client</p>
                  <p className="text-xs text-muted-foreground">{contract.signedByClient ? "Signé ✓" : "En attente de signature"}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${contract.signedByFreelancer ? "bg-lime-400/5 border-lime-400/20" : "bg-secondary/30 border-border"}`}>
                {contract.signedByFreelancer ? (
                  <CheckCircle className="h-5 w-5 text-lime-400 shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">Freelance</p>
                  <p className="text-xs text-muted-foreground">{contract.signedByFreelancer ? "Signé ✓" : "En attente de signature"}</p>
                </div>
              </div>
            </div>
            {((isClient && !contract.signedByClient) || (isFreelancer && !contract.signedByFreelancer)) && (
              <form action={async () => { "use server"; await signContract(id) }}>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 rounded-xl text-sm font-bold hover:from-lime-300 hover:to-lime-400 transition-all shadow-lg shadow-lime-400/20">
                  ✍️ Signer le contrat
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Complete Contract */}
      {isClient && contract.status === "ACTIVE" && (
        <Card className="bg-green-400/5 border-green-400/20">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Terminer le contrat</p>
              <p className="text-muted-foreground text-sm mt-0.5">Marquez ce contrat comme terminé une fois satisfait</p>
            </div>
            <form action={async () => { "use server"; await completeContract(id) }}>
              <button type="submit" className="px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-400 transition-all shadow-lg shadow-green-500/20">
                Marquer comme terminé
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Milestones */}
      <Card className="bg-card/80 border-border/80">
        <CardHeader>
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-lime-400" />
            Jalons ({contract.milestones.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contract.milestones.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Aucun jalon défini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contract.milestones.map((milestone, index) => {
                const Icon = milestoneStatusIcons[milestone.status] || Clock
                const isComplete = milestone.status === "APPROVED" || milestone.status === "PAID"
                return (
                  <div key={milestone.id} className="flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isComplete ? "bg-lime-400/15 ring-1 ring-lime-400/30" : "bg-secondary/80 ring-1 ring-ring/50"
                      }`}>
                        <Icon className={`h-4 w-4 ${isComplete ? "text-lime-400" : "text-muted-foreground"}`} />
                      </div>
                      {index < contract.milestones.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-1 rounded-full ${isComplete ? "bg-lime-400/30" : "bg-secondary"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-foreground font-medium text-sm">{milestone.title}</p>
                          {milestone.description && (
                            <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{milestone.description}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="font-medium text-lime-400/80">{milestone.amount} {contract.currency}</span>
                            {milestone.dueDate && (
                              <span>Échéance : {new Date(milestone.dueDate).toLocaleDateString("fr-FR")}</span>
                            )}
                          </div>
                        </div>
                        <Badge className={`${milestoneStatusColors[milestone.status]} border-0 text-xs shrink-0`}>
                          {milestoneStatusLabels[milestone.status]}
                        </Badge>
                      </div>

                      {/* Freelancer actions */}
                      {isFreelancer && contract.status === "ACTIVE" && (
                        <div className="flex gap-2 mt-3">
                          {milestone.status === "PENDING" && (
                            <form action={async () => { "use server"; await startMilestone(milestone.id) }}>
                              <button type="submit" className="px-3.5 py-1.5 bg-blue-500/15 text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-500/25 transition-all ring-1 ring-blue-500/20">
                                Commencer
                              </button>
                            </form>
                          )}
                          {(milestone.status === "IN_PROGRESS" || milestone.status === "REVISION") && (
                            <form action={async () => { "use server"; await submitMilestone(milestone.id) }}>
                              <button type="submit" className="px-3.5 py-1.5 bg-lime-400/15 text-lime-400 rounded-lg text-xs font-semibold hover:bg-lime-400/25 transition-all ring-1 ring-lime-400/20">
                                Soumettre
                              </button>
                            </form>
                          )}
                        </div>
                      )}

                      {/* Client actions */}
                      {isClient && milestone.status === "SUBMITTED" && (
                        <div className="flex gap-2 mt-3">
                          <form action={async () => { "use server"; await approveMilestone(milestone.id) }}>
                            <button type="submit" className="px-3.5 py-1.5 bg-green-500/15 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/25 transition-all ring-1 ring-green-500/20">
                              ✓ Approuver
                            </button>
                          </form>
                          <form action={async () => { "use server"; await requestRevision(milestone.id) }}>
                            <button type="submit" className="px-3.5 py-1.5 bg-orange-500/15 text-orange-400 rounded-lg text-xs font-semibold hover:bg-orange-500/25 transition-all ring-1 ring-orange-500/20">
                              Révision
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add Milestone Form */}
          {contract.status === "ACTIVE" && (
            <div className="mt-6 pt-5 border-t border-border/60">
              <p className="text-foreground text-sm font-semibold mb-4">Ajouter un jalon</p>
              <form action={createMilestone} className="space-y-3">
                <input type="hidden" name="contractId" value={contract.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    name="title"
                    placeholder="Titre du jalon"
                    required
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/30 transition-all"
                  />
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="Montant"
                    required
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/30 transition-all"
                  />
                </div>
                <input
                  name="description"
                  placeholder="Description (optionnel)"
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/30 transition-all"
                />
                <div className="flex gap-3 items-center">
                  <input
                    name="dueDate"
                    type="date"
                    className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/30 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 rounded-xl text-sm font-bold hover:from-lime-300 hover:to-lime-400 transition-all shadow-lg shadow-lime-400/20"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
