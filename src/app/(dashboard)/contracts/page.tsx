import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Contrats" }
import { auth } from "@/lib/auth/config"
import { getContracts } from "@/lib/actions/contract"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck, ArrowRight, Calendar, Users, Coins } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20",
  ACTIVE: "bg-lime-400/10 text-lime-400 ring-1 ring-lime-400/20",
  COMPLETED: "bg-green-400/10 text-green-400 ring-1 ring-green-400/20",
  CANCELLED: "bg-muted/50 text-muted-foreground ring-1 ring-border",
  DISPUTED: "bg-red-400/10 text-red-400 ring-1 ring-red-400/20",
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  ACTIVE: "Actif",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  DISPUTED: "Litige",
}

const statusDot: Record<string, string> = {
  PENDING: "bg-amber-400",
  ACTIVE: "bg-lime-400",
  COMPLETED: "bg-green-400",
  CANCELLED: "bg-muted-foreground",
  DISPUTED: "bg-red-400",
}

export default async function ContractsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const contracts = await getContracts()

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
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Mes contrats</h2>
        <p className="text-muted-foreground mt-1">Gérez vos contrats et suivez leur avancement</p>
      </div>

      {contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-5 rounded-2xl bg-secondary/30 p-6 ring-1 ring-border">
            <FileCheck className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">Aucun contrat</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Vos contrats apparaîtront ici une fois qu&apos;une proposition sera acceptée</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => {
            const isClient = contract.clientId === session.user!.id
            const otherPartyName = isClient
              ? userMap.get(contract.freelancerId) || "Freelance"
              : userMap.get(contract.clientId) || "Client"
            const completedMilestones = contract.milestones.filter(
              (m: any) => m.status === "APPROVED" || m.status === "PAID"
            ).length
            const totalMilestones = contract.milestones.length
            const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

            return (
              <Link key={contract.id} href={`/contracts/${contract.id}`}>
                <Card className="group bg-card/80 border-border/80 hover:border-border hover:bg-card transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:shadow-black/10">
                  <CardContent className="pt-6">
                    {/* Status dot + title row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${statusDot[contract.status]} ring-4 ring-background`} />
                        <div className="min-w-0">
                          <p className="text-foreground font-semibold group-hover:text-lime-400 transition-colors truncate">
                            {contract.mission?.title || "Mission"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-xs">
                            <Users className="h-3 w-3" />
                            <span>{isClient ? "Freelance" : "Client"} : {otherPartyName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge className={`${statusColors[contract.status]} border-0 text-xs`}>
                          {statusLabels[contract.status]}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-lime-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>

                    {/* Info row */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/60">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Coins className="h-3.5 w-3.5 text-lime-400/70" />
                        <span className="text-foreground font-semibold">{contract.totalAmount} {contract.currency}</span>
                      </div>
                      {totalMilestones > 0 && (
                        <div className="flex items-center gap-2 text-sm flex-1">
                          <span className="text-muted-foreground text-xs">{completedMilestones}/{totalMilestones} jalons</span>
                          <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-lime-400 to-lime-500 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {contract.startDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(contract.startDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                      )}
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
