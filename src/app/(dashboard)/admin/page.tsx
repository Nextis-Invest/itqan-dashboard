import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Administration" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, AlertTriangle, Headphones, TrendingUp, ArrowUpRight, Clock } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (user?.role !== "ADMIN") redirect("/dashboard")

  const [totalUsers, totalFreelancers, totalClients, totalMissions, openMissions, openDisputes, openTickets, totalProposals] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "FREELANCER" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.mission.count(),
      prisma.mission.count({ where: { status: "OPEN" } }),
      prisma.dispute.count({ where: { status: { in: ["OPEN", "UNDER_REVIEW"] } } }),
      prisma.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.proposal.count(),
    ])

  const stats = [
    { title: "Utilisateurs", value: totalUsers, sub: `${totalFreelancers} freelancers · ${totalClients} clients`, icon: Users, color: "from-blue-400/20 to-blue-400/5", iconColor: "text-blue-400", bgIcon: "bg-blue-400/10", href: "/admin/users" },
    { title: "Missions", value: totalMissions, sub: `${openMissions} ouvertes`, icon: Briefcase, color: "from-lime-400/20 to-lime-400/5", iconColor: "text-lime-400", bgIcon: "bg-lime-400/10", href: "/admin/missions" },
    { title: "Propositions", value: totalProposals, sub: "Total", icon: TrendingUp, color: "from-cyan-400/20 to-cyan-400/5", iconColor: "text-cyan-400", bgIcon: "bg-cyan-400/10", href: "/admin/missions" },
    { title: "Litiges ouverts", value: openDisputes, sub: "À traiter", icon: AlertTriangle, color: "from-amber-400/20 to-amber-400/5", iconColor: "text-amber-400", bgIcon: "bg-amber-400/10", href: "/admin/disputes" },
    { title: "Tickets support", value: openTickets, sub: "Ouverts", icon: Headphones, color: "from-purple-400/20 to-purple-400/5", iconColor: "text-purple-400", bgIcon: "bg-purple-400/10", href: "/admin/support" },
  ]

  const recentUsers = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } })
  const recentMissions = await prisma.mission.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true } })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Administration</h2>
        <p className="text-muted-foreground mt-1">Vue d&apos;ensemble de la plateforme</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.title} href={s.href}>
              <Card className={`group relative overflow-hidden bg-gradient-to-br ${s.color} border-border hover:border-border transition-all duration-300 cursor-pointer`}>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.title}</p>
                      <p className="text-3xl font-black text-foreground mt-1">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                    </div>
                    <div className={`rounded-xl ${s.bgIcon} p-2.5`}>
                      <Icon className={`h-5 w-5 ${s.iconColor}`} />
                    </div>
                  </div>
                  <ArrowUpRight className="absolute bottom-2 right-2 h-4 w-4 text-muted-foreground group-hover:text-muted-foreground transition-colors" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Users */}
        <Card className="bg-card/80 border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Derniers inscrits
            </CardTitle>
            <Link href="/admin/users" className="text-xs text-muted-foreground hover:text-lime-400 transition-colors">Voir tout →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-muted hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold ${
                      u.role === "FREELANCER" ? "bg-lime-400/10 text-lime-400" :
                      u.role === "CLIENT" ? "bg-blue-400/10 text-blue-400" :
                      "bg-red-400/10 text-red-400"
                    }`}>
                      {(u.name || u.email)?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">{u.name || u.email}</p>
                      <p className="text-muted-foreground text-xs">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`border-0 text-[10px] ${
                      u.role === "FREELANCER" ? "bg-lime-400/10 text-lime-400" :
                      u.role === "CLIENT" ? "bg-blue-400/10 text-blue-400" :
                      "bg-red-400/10 text-red-400"
                    }`}>{u.role}</Badge>
                    <p className="text-muted-foreground text-[10px] mt-1 flex items-center gap-1 justify-end">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && <p className="text-muted-foreground text-sm text-center py-6">Aucun utilisateur</p>}
            </div>
          </CardContent>
        </Card>

        {/* Recent Missions */}
        <Card className="bg-card/80 border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-lime-400" />
              Dernières missions
            </CardTitle>
            <Link href="/admin/missions" className="text-xs text-muted-foreground hover:text-lime-400 transition-colors">Voir tout →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMissions.map((m) => {
                const statusConfig: Record<string, { color: string; dot: string }> = {
                  OPEN: { color: "bg-lime-400/10 text-lime-400", dot: "bg-lime-400" },
                  IN_PROGRESS: { color: "bg-blue-400/10 text-blue-400", dot: "bg-blue-400" },
                  COMPLETED: { color: "bg-green-400/10 text-green-400", dot: "bg-green-400" },
                  CANCELLED: { color: "bg-red-400/10 text-red-400", dot: "bg-red-400" },
                }
                const sc = statusConfig[m.status] || { color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" }
                return (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-muted hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${sc.dot}`} />
                      <p className="text-foreground text-sm truncate">{m.title}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`${sc.color} border-0 text-[10px]`}>{m.status}</Badge>
                    </div>
                  </div>
                )
              })}
              {recentMissions.length === 0 && <p className="text-muted-foreground text-sm text-center py-6">Aucune mission</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
