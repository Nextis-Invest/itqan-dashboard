import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Tableau de bord" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Users,
  TrendingUp,
  FileText,
  Star,
  Plus,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const cardThemes = [
  {
    gradient: "from-blue-500/10 to-blue-500/5",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    decorColor: "bg-blue-500/[0.07]",
  },
  {
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    decorColor: "bg-emerald-500/[0.07]",
  },
  {
    gradient: "from-purple-500/10 to-purple-500/5",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
    decorColor: "bg-purple-500/[0.07]",
  },
  {
    gradient: "from-amber-500/10 to-amber-500/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    decorColor: "bg-amber-500/[0.07]",
  },
]

const statusConfig: Record<string, { label: string; dotColor: string; badgeClass: string }> = {
  DRAFT: { label: "Brouillon", dotColor: "bg-muted-foreground", badgeClass: "bg-muted/50 text-muted-foreground" },
  OPEN: { label: "Ouverte", dotColor: "bg-lime-400", badgeClass: "bg-lime-400/10 text-lime-400" },
  IN_PROGRESS: { label: "En cours", dotColor: "bg-blue-400", badgeClass: "bg-blue-400/10 text-blue-400" },
  COMPLETED: { label: "Terminée", dotColor: "bg-green-400", badgeClass: "bg-green-400/10 text-green-400" },
  CANCELLED: { label: "Annulée", dotColor: "bg-red-400", badgeClass: "bg-red-400/10 text-red-400" },
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { freelancerProfile: true, clientProfile: true },
  })

  if (!user) redirect("/login")

  const needsOnboarding =
    (user.role === "FREELANCER" && !user.freelancerProfile) ||
    (user.role === "CLIENT" && !user.clientProfile)

  if (needsOnboarding) redirect("/onboarding")

  // Fetch stats based on role
  let stats: { title: string; value: string; description: string; icon: any }[]

  if (user.role === "FREELANCER") {
    const [totalProposals, pendingProposals, activeMissions, completedMissions] =
      await Promise.all([
        prisma.proposal.count({ where: { freelancerId: user.id } }),
        prisma.proposal.count({
          where: { freelancerId: user.id, status: "PENDING" },
        }),
        prisma.mission.count({
          where: { freelancerId: user.id, status: "IN_PROGRESS" },
        }),
        prisma.mission.count({
          where: { freelancerId: user.id, status: "COMPLETED" },
        }),
      ])

    stats = [
      {
        title: "Propositions envoyées",
        value: totalProposals.toString(),
        description: "Total",
        icon: FileText,
      },
      {
        title: "En attente",
        value: pendingProposals.toString(),
        description: "Propositions",
        icon: TrendingUp,
      },
      {
        title: "Missions actives",
        value: activeMissions.toString(),
        description: "En cours",
        icon: Briefcase,
      },
      {
        title: "Missions terminées",
        value: completedMissions.toString(),
        description: "Complétées",
        icon: Star,
      },
    ]
  } else {
    const [totalMissions, openMissions, pendingProposals, activeMissions] =
      await Promise.all([
        prisma.mission.count({ where: { clientId: user.id } }),
        prisma.mission.count({
          where: { clientId: user.id, status: "OPEN" },
        }),
        prisma.proposal.count({
          where: {
            mission: { clientId: user.id },
            status: "PENDING",
          },
        }),
        prisma.mission.count({
          where: { clientId: user.id, status: "IN_PROGRESS" },
        }),
      ])

    stats = [
      {
        title: "Total Missions",
        value: totalMissions.toString(),
        description: "Missions créées",
        icon: Briefcase,
      },
      {
        title: "Missions ouvertes",
        value: openMissions.toString(),
        description: "En attente de freelance",
        icon: Users,
      },
      {
        title: "Propositions reçues",
        value: pendingProposals.toString(),
        description: "En attente",
        icon: FileText,
      },
      {
        title: "Missions actives",
        value: activeMissions.toString(),
        description: "En cours",
        icon: TrendingUp,
      },
    ]
  }

  // Recent missions
  const recentMissions = await prisma.mission.findMany({
    where:
      user.role === "FREELANCER"
        ? { freelancerId: user.id }
        : { clientId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      _count: { select: { proposals: true } },
    },
  })

  const now = new Date()
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const displayName = user.name || user.email?.split("@")[0] || "Utilisateur"

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background via-background to-card p-6 sm:p-8">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-lime-400/[0.04]" />
        <div className="pointer-events-none absolute -right-4 top-4 h-24 w-24 rounded-full bg-emerald-400/[0.06]" />
        <div className="pointer-events-none absolute right-20 -top-6 h-32 w-32 rounded-full bg-lime-400/[0.03]" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-lime-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {dateStr}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="text-foreground">Bonjour, </span>
              <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                {displayName}
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Voici un résumé de votre activité.
            </p>
          </div>
          <div className="flex gap-3">
            {user.role !== "FREELANCER" && (
              <Link
                href="/missions/new"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:shadow-lg hover:shadow-lime-400/20 hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                Nouvelle mission
              </Link>
            )}
            <Link
              href={user.role === "FREELANCER" ? "/missions/explore" : "/missions"}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2.5 text-sm font-medium text-foreground/80 transition-all hover:border-border hover:bg-accent hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              Explorer
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          const theme = cardThemes[i % cardThemes.length]
          return (
            <div
              key={stat.title}
              className={`group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${theme.gradient} p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/20`}
            >
              {/* Decorative circles */}
              <div className={`pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full ${theme.decorColor}`} />
              <div className={`pointer-events-none absolute right-5 -top-1 h-8 w-8 rounded-full ${theme.decorColor}`} />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${theme.iconBg}`}>
                    <Icon className={`h-5 w-5 ${theme.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="tabular-nums text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground/80">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Missions */}
      <div className="rounded-xl border border-border bg-card/50">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Missions récentes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Vos dernières missions</p>
          </div>
          {recentMissions.length > 0 && (
            <Link
              href="/missions"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-lime-400 transition-colors hover:text-lime-300"
            >
              Voir tout
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="p-2">
          {recentMissions.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary mb-4">
                <Briefcase className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Aucune mission pour le moment</p>
              <p className="text-xs text-muted-foreground mb-5 text-center max-w-xs">
                {user.role === "FREELANCER"
                  ? "Explorez les missions disponibles et envoyez vos propositions."
                  : "Créez votre première mission et trouvez le freelance idéal."}
              </p>
              <Link
                href={user.role === "FREELANCER" ? "/missions/explore" : "/missions/new"}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-900 transition-all hover:shadow-lg hover:shadow-lime-400/20 hover:brightness-110"
              >
                {user.role === "FREELANCER" ? (
                  <>
                    <Search className="h-4 w-4" />
                    Explorer les missions
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Créer une mission
                  </>
                )}
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentMissions.map((mission) => {
                const st = statusConfig[mission.status] || statusConfig.DRAFT
                return (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.id}`}
                    className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3.5 transition-all duration-200 hover:border-border hover:bg-accent/40 hover:border-l-2 hover:border-l-lime-400/60"
                  >
                    {/* Status dot */}
                    <div className="flex-shrink-0">
                      <div className={`h-2.5 w-2.5 rounded-full ${st.dotColor}`} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground group-hover:text-lime-400/90 transition-colors">
                        {mission.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(mission.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Proposal count badge */}
                    {mission._count.proposals > 0 && (
                      <span className="flex-shrink-0 inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground/80">
                        {mission._count.proposals} prop.
                      </span>
                    )}

                    {/* Status badge */}
                    <Badge className={`flex-shrink-0 border-0 text-xs ${st.badgeClass}`}>
                      {st.label}
                    </Badge>

                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-muted-foreground" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
