import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Gestion des missions" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Briefcase, Eye, Clock, CheckCircle, DollarSign, MessageSquare } from "lucide-react"
import { AdminMissionActions } from "./mission-actions"
import { AdminMissionsSearch } from "./search-input"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
  OPEN: { label: "Ouverte", color: "bg-lime-400/10 text-lime-400", dot: "bg-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400", dot: "bg-blue-400" },
  COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400", dot: "bg-green-400" },
  CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400", dot: "bg-red-400" },
}

export default async function AdminMissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const sp = await searchParams

  const [totalCount, openCount, inProgressCount, completedCount, budgetAgg] = await Promise.all([
    prisma.mission.count(),
    prisma.mission.count({ where: { status: "OPEN" } }),
    prisma.mission.count({ where: { status: "IN_PROGRESS" } }),
    prisma.mission.count({ where: { status: "COMPLETED" } }),
    prisma.mission.aggregate({ _sum: { budget: true } }),
  ])

  const where: any = {}
  if (sp.status && Object.keys(statusMap).includes(sp.status)) {
    where.status = sp.status
  }
  if (sp.q) {
    where.title = { contains: sp.q, mode: "insensitive" }
  }

  const missions = await prisma.mission.findMany({
    where,
    include: {
      client: { select: { name: true, email: true } },
      _count: { select: { proposals: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  const statCards = [
    { label: "Total", value: totalCount, icon: Briefcase, color: "text-lime-400", bg: "bg-lime-400/10" },
    { label: "Ouvertes", value: openCount, icon: Eye, color: "text-lime-400", bg: "bg-lime-400/10" },
    { label: "En cours", value: inProgressCount, icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Terminées", value: completedCount, icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Budget total", value: budgetAgg._sum.budget ? `${Math.round(budgetAgg._sum.budget).toLocaleString()}` : "0", icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Missions</h2>
        <p className="text-muted-foreground mt-1">Modérer et gérer les missions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-xl bg-card/80 border border-border p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${s.bg} p-2`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search */}
      <AdminMissionsSearch currentQ={sp.q || ""} currentStatus={sp.status || ""} />

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        <a href="/admin/missions" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!sp.status ? "bg-lime-400/10 text-lime-400" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
          Toutes
        </a>
        {Object.entries(statusMap).map(([k, v]) => (
          <a key={k} href={`/admin/missions?status=${k}${sp.q ? `&q=${sp.q}` : ""}`} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${sp.status === k ? "bg-lime-400/10 text-lime-400" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
            {v.label}
          </a>
        ))}
      </div>

      <Card className="bg-card/80 border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-lime-400" />
            {missions.length} mission(s)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Mission</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Client</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Budget</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Propositions</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.map((m) => {
                const st = statusMap[m.status] || statusMap.DRAFT
                return (
                  <TableRow key={m.id} className="border-border hover:bg-accent/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full shrink-0 ${st.dot}`} />
                        <Link href={`/missions/${m.id}`} className="text-foreground font-medium hover:text-lime-400 transition-colors text-sm">
                          {m.title}
                        </Link>
                        {m.featured && <Badge className="bg-yellow-400/10 text-yellow-400 border-0 text-[10px]">⭐</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{m.client.name || m.client.email}</TableCell>
                    <TableCell>
                      <span className="text-foreground font-medium text-sm">{m.budget ? `${m.budget} ${m.currency}` : "—"}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${st.color} border-0 text-[10px]`}>{st.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MessageSquare className="h-3 w-3" />
                        {m._count.proposals}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </TableCell>
                    <TableCell>
                      <AdminMissionActions missionId={m.id} status={m.status} featured={m.featured} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {missions.length === 0 && <p className="text-muted-foreground text-center py-10">Aucune mission</p>}
        </CardContent>
      </Card>
    </div>
  )
}
