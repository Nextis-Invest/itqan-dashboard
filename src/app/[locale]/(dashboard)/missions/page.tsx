import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase, LayoutGrid, LayoutList, Users, Calendar, DollarSign, FileText } from "lucide-react"

export const metadata: Metadata = { title: "Mes demandes" }
export const dynamic = "force-dynamic"

const statusLabels: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  PENDING_REVIEW: { label: "En attente", color: "bg-yellow-400/10 text-yellow-400", dot: "bg-yellow-400" },
  OPEN: { label: "Ouverte", color: "bg-lime-400/10 text-lime-400", dot: "bg-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400", dot: "bg-blue-400" },
  COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400", dot: "bg-green-400" },
  CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400", dot: "bg-red-400" },
  REJECTED: { label: "Rejetée", color: "bg-red-400/10 text-red-400", dot: "bg-red-400" },
}

const statusTabs = [
  { key: "", label: "Toutes" },
  { key: "DRAFT", label: "Brouillon" },
  { key: "PENDING_REVIEW", label: "En attente" },
  { key: "OPEN", label: "Ouvertes" },
  { key: "IN_PROGRESS", label: "En cours" },
  { key: "COMPLETED", label: "Terminées" },
  { key: "CANCELLED", label: "Annulées" },
  { key: "REJECTED", label: "Rejetées" },
]

export default async function MissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user) redirect("/login")

  // ADMIN → redirect to admin missions
  if (user.role === "ADMIN") redirect("/admin/missions")

  const sp = await searchParams
  const statusFilter = sp.status && Object.keys(statusLabels).includes(sp.status) ? sp.status : undefined

  let where: any = {}

  if (user.role === "CLIENT") {
    where.clientId = session.user.id
    if (statusFilter) where.status = statusFilter
  } else if (user.role === "FREELANCER") {
    // Show missions where freelancer is assigned OR has a proposal
    const proposalMissionIds = await prisma.proposal.findMany({
      where: { freelancerId: session.user.id },
      select: { missionId: true },
    })
    const missionIds = proposalMissionIds.map((p) => p.missionId)

    where.OR = [
      { freelancerId: session.user.id },
      { id: { in: missionIds } },
    ]
    if (statusFilter) where.status = statusFilter
  }

  const missions = await prisma.mission.findMany({
    where,
    include: {
      client: { select: { name: true, email: true } },
      freelancer: { select: { name: true, email: true } },
      _count: { select: { proposals: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const isClient = user.role === "CLIENT"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Mes Demandes
          </h2>
          <p className="text-muted-foreground mt-1">
            {isClient
              ? "Gérez vos demandes et projets"
              : "Demandes auxquelles vous participez"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle (decorative for now) */}
          <div className="hidden sm:flex items-center gap-1 rounded-lg bg-secondary/50 p-1 border border-border/50">
            <button className="p-1.5 rounded-md bg-accent text-lime-400">
              <LayoutList className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground/80 transition-colors">
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          {isClient && (
            <Link href="/missions/new">
              <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold shadow-lg shadow-lime-400/10">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle demande
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {statusTabs.map((tab) => {
          const isActive = (sp.status || "") === tab.key
          return (
            <a
              key={tab.key}
              href={tab.key ? `/missions?status=${tab.key}` : "/missions"}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? "bg-lime-400 text-neutral-900 border-lime-400 shadow-lg shadow-lime-400/20"
                  : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground hover:border-border hover:bg-accent"
              }`}
            >
              {tab.label}
            </a>
          )
        })}
      </div>

      {/* Request Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Briefcase className="h-4 w-4 text-lime-400" />
        <span>{missions.length} demande(s)</span>
      </div>

      {/* Request Cards */}
      {missions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border/50 bg-muted/30">
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <p className="text-muted-foreground text-base font-medium">Aucune demande</p>
          <p className="text-muted-foreground text-sm mt-1 text-center max-w-sm">
            {isClient
              ? "Commencez par créer votre première demande pour trouver l'expert idéal."
              : "Explorez les demandes disponibles pour trouver votre prochain projet."}
          </p>
          {isClient ? (
            <Link href="/missions/new" className="mt-6">
              <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold shadow-lg shadow-lime-400/10">
                <Plus className="mr-2 h-4 w-4" />
                Créer une demande
              </Button>
            </Link>
          ) : (
            <Link href="/missions/explore" className="mt-6">
              <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold shadow-lg shadow-lime-400/10">
                Explorer les demandes
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map((mission) => {
            const status = statusLabels[mission.status] || statusLabels.DRAFT
            const budgetDisplay = mission.budget
              ? `${mission.budget} ${mission.currency}`
              : mission.budgetMin && mission.budgetMax
              ? `${mission.budgetMin} - ${mission.budgetMax} ${mission.currency}`
              : null

            return (
              <Link key={mission.id} href={`/missions/${mission.id}`} className="block group">
                <div className="relative rounded-xl border border-border bg-card/80 p-5 transition-all duration-200 hover:border-lime-400/30 hover:shadow-lg hover:shadow-lime-400/5 hover:-translate-y-0.5">
                  <div className="flex items-center gap-5">
                    {/* Status Dot */}
                    <div className="hidden sm:flex flex-col items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${status.dot} ring-4 ring-card`} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-foreground font-semibold text-base truncate group-hover:text-lime-400 transition-colors">
                          {mission.title}
                        </h3>
                        <Badge className={`${status.color} border-0 text-xs shrink-0`}>
                          {status.label}
                        </Badge>
                      </div>

                      {/* Meta info row */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        {/* Client/Freelancer */}
                        <span className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-foreground/80 font-medium">
                            {(isClient
                              ? mission.freelancer?.name?.[0] || mission.freelancer?.email?.[0] || "?"
                              : mission.client.name?.[0] || mission.client.email[0]
                            ).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[120px]">
                            {isClient
                              ? mission.freelancer?.name || mission.freelancer?.email || "Non assigné"
                              : mission.client.name || mission.client.email}
                          </span>
                        </span>

                        {/* Budget */}
                        {budgetDisplay && (
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            <DollarSign className="h-3.5 w-3.5 text-lime-400" />
                            {budgetDisplay}
                          </span>
                        )}

                        {/* Proposals */}
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          {mission._count.proposals} proposition(s)
                        </span>

                        {/* Date */}
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="hidden sm:block text-muted-foreground/60 group-hover:text-lime-400 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
