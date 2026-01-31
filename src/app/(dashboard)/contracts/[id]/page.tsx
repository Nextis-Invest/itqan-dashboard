import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { getContract, signContract, completeContract } from "@/lib/actions/contract"
import { submitMilestone, approveMilestone, requestRevision, startMilestone, createMilestone } from "@/lib/actions/milestone"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileCheck, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-400/10 text-yellow-400",
  ACTIVE: "bg-lime-400/10 text-lime-400",
  COMPLETED: "bg-green-400/10 text-green-400",
  CANCELLED: "bg-neutral-400/10 text-neutral-400",
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
  PENDING: "bg-neutral-400/10 text-neutral-400",
  IN_PROGRESS: "bg-blue-400/10 text-blue-400",
  SUBMITTED: "bg-yellow-400/10 text-yellow-400",
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

  // Get user names
  const [clientUser, freelancerUser] = await Promise.all([
    prisma.user.findUnique({ where: { id: contract.clientId }, select: { name: true, email: true } }),
    prisma.user.findUnique({ where: { id: contract.freelancerId }, select: { name: true, email: true } }),
  ])

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/contracts" className="text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {contract.mission?.title || "Contrat"}
          </h2>
          <p className="text-neutral-400 mt-1">Détails du contrat</p>
        </div>
      </div>

      {/* Contract Info */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base">Informations du contrat</CardTitle>
            <Badge className={`${statusColors[contract.status]} border-0`}>
              {statusLabels[contract.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Client</span>
              <span className="text-white">{clientUser?.name || clientUser?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Freelance</span>
              <span className="text-white">{freelancerUser?.name || freelancerUser?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Montant total</span>
              <span className="text-white font-medium">{contract.totalAmount} {contract.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Créé le</span>
              <span className="text-white">{new Date(contract.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
            {contract.startDate && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Début</span>
                <span className="text-white">{new Date(contract.startDate).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
            {contract.endDate && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Fin</span>
                <span className="text-white">{new Date(contract.endDate).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
          </div>
          {contract.mission?.description && (
            <div className="pt-3 border-t border-neutral-800">
              <p className="text-neutral-400 text-xs mb-1">Description de la mission</p>
              <p className="text-neutral-300">{contract.mission.description}</p>
            </div>
          )}
          {contract.terms && (
            <div className="pt-3 border-t border-neutral-800">
              <p className="text-neutral-400 text-xs mb-1">Termes du contrat</p>
              <p className="text-neutral-300">{contract.terms}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signing Section */}
      {contract.status === "PENDING" && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Signature du contrat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {contract.signedByClient ? (
                  <CheckCircle className="h-4 w-4 text-lime-400" />
                ) : (
                  <Clock className="h-4 w-4 text-neutral-500" />
                )}
                <span className="text-sm text-neutral-300">
                  Signature client : {contract.signedByClient ? "Signé" : "En attente"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {contract.signedByFreelancer ? (
                  <CheckCircle className="h-4 w-4 text-lime-400" />
                ) : (
                  <Clock className="h-4 w-4 text-neutral-500" />
                )}
                <span className="text-sm text-neutral-300">
                  Signature freelance : {contract.signedByFreelancer ? "Signé" : "En attente"}
                </span>
              </div>
            </div>
            {((isClient && !contract.signedByClient) || (isFreelancer && !contract.signedByFreelancer)) && (
              <form action={async () => {
                "use server"
                await signContract(id)
              }}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-lime-400 text-neutral-900 rounded-md text-sm font-medium hover:bg-lime-300 transition-colors"
                >
                  Signer le contrat
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Complete Contract (client only, active contract) */}
      {isClient && contract.status === "ACTIVE" && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6">
            <form action={async () => {
              "use server"
              await completeContract(id)
            }}>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-400 transition-colors"
              >
                Marquer le contrat comme terminé
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Milestones */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-base">
            Jalons ({contract.milestones.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contract.milestones.length === 0 ? (
            <p className="text-neutral-500 text-sm">Aucun jalon défini.</p>
          ) : (
            <div className="space-y-4">
              {contract.milestones.map((milestone, index) => {
                const Icon = milestoneStatusIcons[milestone.status] || Clock
                return (
                  <div key={milestone.id} className="flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.status === "APPROVED" || milestone.status === "PAID"
                          ? "bg-lime-400/20"
                          : "bg-neutral-800"
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          milestone.status === "APPROVED" || milestone.status === "PAID"
                            ? "text-lime-400"
                            : "text-neutral-400"
                        }`} />
                      </div>
                      {index < contract.milestones.length - 1 && (
                        <div className="w-px h-full bg-neutral-800 mt-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium text-sm">{milestone.title}</p>
                          {milestone.description && (
                            <p className="text-neutral-400 text-xs mt-1">{milestone.description}</p>
                          )}
                          <div className="flex gap-4 mt-1 text-xs text-neutral-500">
                            <span>{milestone.amount} {contract.currency}</span>
                            {milestone.dueDate && (
                              <span>Échéance : {new Date(milestone.dueDate).toLocaleDateString("fr-FR")}</span>
                            )}
                          </div>
                        </div>
                        <Badge className={`${milestoneStatusColors[milestone.status]} border-0 text-xs`}>
                          {milestoneStatusLabels[milestone.status]}
                        </Badge>
                      </div>

                      {/* Freelancer actions */}
                      {isFreelancer && contract.status === "ACTIVE" && (
                        <div className="flex gap-2 mt-3">
                          {milestone.status === "PENDING" && (
                            <form action={async () => {
                              "use server"
                              await startMilestone(milestone.id)
                            }}>
                              <button type="submit" className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-500/30 transition-colors">
                                Commencer
                              </button>
                            </form>
                          )}
                          {(milestone.status === "IN_PROGRESS" || milestone.status === "REVISION") && (
                            <form action={async () => {
                              "use server"
                              await submitMilestone(milestone.id)
                            }}>
                              <button type="submit" className="px-3 py-1.5 bg-lime-400/20 text-lime-400 rounded text-xs font-medium hover:bg-lime-400/30 transition-colors">
                                Marquer comme soumis
                              </button>
                            </form>
                          )}
                        </div>
                      )}

                      {/* Client actions */}
                      {isClient && milestone.status === "SUBMITTED" && (
                        <div className="flex gap-2 mt-3">
                          <form action={async () => {
                            "use server"
                            await approveMilestone(milestone.id)
                          }}>
                            <button type="submit" className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded text-xs font-medium hover:bg-green-500/30 transition-colors">
                              Approuver
                            </button>
                          </form>
                          <form action={async () => {
                            "use server"
                            await requestRevision(milestone.id)
                          }}>
                            <button type="submit" className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded text-xs font-medium hover:bg-orange-500/30 transition-colors">
                              Demander révision
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
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <p className="text-white text-sm font-medium mb-3">Ajouter un jalon</p>
              <form action={createMilestone} className="space-y-3">
                <input type="hidden" name="contractId" value={contract.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    name="title"
                    placeholder="Titre du jalon"
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
                  />
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="Montant"
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
                  />
                </div>
                <input
                  name="description"
                  placeholder="Description (optionnel)"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
                <div className="flex gap-3 items-center">
                  <input
                    name="dueDate"
                    type="date"
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-lime-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-lime-400 text-neutral-900 rounded-md text-sm font-medium hover:bg-lime-300 transition-colors"
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
