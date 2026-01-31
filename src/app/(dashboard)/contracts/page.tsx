import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Contrats" }
import { auth } from "@/lib/auth/config"
import { getContracts } from "@/lib/actions/contract"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

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

export default async function ContractsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const contracts = await getContracts()

  // Get user names for display
  const userIds = new Set<string>()
  for (const c of contracts) {
    userIds.add(c.clientId)
    userIds.add(c.freelancerId)
  }
  const users = userIds.size > 0
    ? await prisma.user.findMany({
        where: { id: { in: Array.from(userIds) } },
        select: { id: true, name: true, email: true },
      })
    : []
  const userMap = new Map(users.map((u) => [u.id, u.name || u.email]))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Mes contrats</h2>
        <p className="text-neutral-400 mt-1">Gérez vos contrats et suivez leur avancement</p>
      </div>

      {contracts.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucun contrat pour le moment.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => {
            const isClient = contract.clientId === session.user!.id
            const otherPartyName = isClient
              ? userMap.get(contract.freelancerId) || "Freelance"
              : userMap.get(contract.clientId) || "Client"

            return (
              <Link key={contract.id} href={`/contracts/${contract.id}`}>
                <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-white font-medium">
                          {contract.mission?.title || "Mission"}
                        </p>
                        <p className="text-neutral-500 text-sm">
                          {isClient ? "Freelance" : "Client"} : {otherPartyName}
                        </p>
                      </div>
                      <Badge className={`${statusColors[contract.status]} border-0`}>
                        {statusLabels[contract.status]}
                      </Badge>
                    </div>

                    <div className="flex gap-6 mt-3 text-sm">
                      <div>
                        <span className="text-neutral-500">Montant : </span>
                        <span className="text-white font-medium">
                          {contract.totalAmount} {contract.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Jalons : </span>
                        <span className="text-white">{contract.milestones.length}</span>
                      </div>
                      {contract.startDate && (
                        <div>
                          <span className="text-neutral-500">Début : </span>
                          <span className="text-white">
                            {new Date(contract.startDate).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-neutral-500">Créé le : </span>
                        <span className="text-white">
                          {new Date(contract.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
