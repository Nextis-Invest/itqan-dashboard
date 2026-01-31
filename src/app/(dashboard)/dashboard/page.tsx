import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Tableau de bord" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, DollarSign, TrendingUp, FileText, Star } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { freelancerProfile: true, clientProfile: true },
  })

  if (!user) redirect("/login")

  // Check if user needs onboarding
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
    // CLIENT or ADMIN
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

  const statusLabels: Record<string, { label: string; color: string }> = {
    DRAFT: { label: "Brouillon", color: "bg-neutral-500/10 text-neutral-400" },
    OPEN: { label: "Ouverte", color: "bg-lime-400/10 text-lime-400" },
    IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400" },
    COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400" },
    CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400" },
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Tableau de bord
        </h2>
        <p className="text-neutral-400 mt-1">
          Bienvenue, {user.name || user.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-neutral-900 border-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-lime-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-neutral-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Missions + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Missions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMissions.length === 0 ? (
              <div className="text-neutral-500 text-sm text-center py-8">
                Aucune mission pour le moment.
                <br />
                {user.role !== "FREELANCER" && (
                  <Link
                    href="/missions/new"
                    className="text-lime-400 cursor-pointer hover:underline"
                  >
                    Créer votre première mission
                  </Link>
                )}
                {user.role === "FREELANCER" && (
                  <Link
                    href="/missions"
                    className="text-lime-400 cursor-pointer hover:underline"
                  >
                    Parcourir les missions
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recentMissions.map((mission) => {
                  const st = statusLabels[mission.status] || statusLabels.DRAFT
                  return (
                    <Link
                      key={mission.id}
                      href={`/missions/${mission.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">
                          {mission.title}
                        </p>
                        <p className="text-neutral-500 text-xs">
                          {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                          {mission._count.proposals > 0 &&
                            ` · ${mission._count.proposals} proposition(s)`}
                        </p>
                      </div>
                      <Badge className={`${st.color} border-0 text-xs`}>
                        {st.label}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.role !== "FREELANCER" && (
                <Link
                  href="/missions/new"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-lime-400/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-lime-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Nouvelle mission</p>
                    <p className="text-neutral-500 text-xs">Publier un nouveau projet</p>
                  </div>
                </Link>
              )}
              <Link
                href="/missions"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-lime-400/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-lime-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Voir les missions</p>
                  <p className="text-neutral-500 text-xs">Parcourir toutes les missions</p>
                </div>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-lime-400/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-lime-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Mon profil</p>
                  <p className="text-neutral-500 text-xs">Mettre à jour mes informations</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
