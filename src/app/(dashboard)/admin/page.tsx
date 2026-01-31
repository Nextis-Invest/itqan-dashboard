import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, AlertTriangle, Headphones, DollarSign, TrendingUp } from "lucide-react"

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
    { title: "Utilisateurs", value: totalUsers, sub: `${totalFreelancers} freelancers · ${totalClients} clients`, icon: Users },
    { title: "Missions", value: totalMissions, sub: `${openMissions} ouvertes`, icon: Briefcase },
    { title: "Propositions", value: totalProposals, sub: "Total", icon: TrendingUp },
    { title: "Litiges ouverts", value: openDisputes, sub: "À traiter", icon: AlertTriangle },
    { title: "Tickets support", value: openTickets, sub: "Ouverts", icon: Headphones },
  ]

  // Recent activity
  const recentUsers = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } })
  const recentMissions = await prisma.mission.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true } })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Administration</h2>
        <p className="text-neutral-400 mt-1">Vue d&apos;ensemble de la plateforme</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.title} className="bg-neutral-900 border-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-400">{s.title}</CardTitle>
                <Icon className="h-4 w-4 text-lime-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <p className="text-xs text-neutral-500 mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader><CardTitle className="text-white">Derniers inscrits</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-white">{u.name || u.email}</p>
                    <p className="text-neutral-500 text-xs">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${u.role === "FREELANCER" ? "bg-lime-400/10 text-lime-400" : u.role === "CLIENT" ? "bg-blue-400/10 text-blue-400" : "bg-red-400/10 text-red-400"}`}>
                    {u.role}
                  </span>
                </div>
              ))}
              {recentUsers.length === 0 && <p className="text-neutral-500 text-sm text-center py-4">Aucun utilisateur</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader><CardTitle className="text-white">Dernières missions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMissions.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <p className="text-white truncate flex-1">{m.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ml-2 ${
                    m.status === "OPEN" ? "bg-lime-400/10 text-lime-400" :
                    m.status === "IN_PROGRESS" ? "bg-blue-400/10 text-blue-400" :
                    m.status === "COMPLETED" ? "bg-green-400/10 text-green-400" :
                    "bg-neutral-500/10 text-neutral-400"
                  }`}>{m.status}</span>
                </div>
              ))}
              {recentMissions.length === 0 && <p className="text-neutral-500 text-sm text-center py-4">Aucune mission</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
