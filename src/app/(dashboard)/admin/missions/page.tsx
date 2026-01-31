import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Gestion des missions" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Briefcase, Eye, Clock, CheckCircle, DollarSign } from "lucide-react"
import { AdminMissionActions } from "./mission-actions"
import { AdminMissionsSearch } from "./search-input"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-neutral-500/10 text-neutral-400" },
  OPEN: { label: "Ouverte", color: "bg-lime-400/10 text-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400" },
  COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400" },
  CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400" },
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

  // Stats
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Missions</h2>
        <p className="text-neutral-400 mt-1">Modérer et gérer les missions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <Briefcase className="h-4 w-4 text-lime-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalCount}</p>
                <p className="text-xs text-neutral-500">Total missions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <Eye className="h-4 w-4 text-lime-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{openCount}</p>
                <p className="text-xs text-neutral-500">Ouvertes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{inProgressCount}</p>
                <p className="text-xs text-neutral-500">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{completedCount}</p>
                <p className="text-xs text-neutral-500">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <DollarSign className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {budgetAgg._sum.budget ? `${Math.round(budgetAgg._sum.budget).toLocaleString()}` : "0"}
                </p>
                <p className="text-xs text-neutral-500">Budget total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <AdminMissionsSearch currentQ={sp.q || ""} currentStatus={sp.status || ""} />

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        <a href="/admin/missions" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!sp.status ? "bg-lime-400/10 text-lime-400" : "bg-neutral-800 text-neutral-400 hover:text-white"}`}>Toutes</a>
        {Object.entries(statusMap).map(([k, v]) => (
          <a key={k} href={`/admin/missions?status=${k}${sp.q ? `&q=${sp.q}` : ""}`} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sp.status === k ? "bg-lime-400/10 text-lime-400" : "bg-neutral-800 text-neutral-400 hover:text-white"}`}>{v.label}</a>
        ))}
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-lime-400" />
            {missions.length} mission(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Titre</TableHead>
                <TableHead className="text-neutral-400">Client</TableHead>
                <TableHead className="text-neutral-400">Budget</TableHead>
                <TableHead className="text-neutral-400">Statut</TableHead>
                <TableHead className="text-neutral-400">Propositions</TableHead>
                <TableHead className="text-neutral-400">Date</TableHead>
                <TableHead className="text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.map((m) => {
                const st = statusMap[m.status] || statusMap.DRAFT
                return (
                  <TableRow key={m.id} className="border-neutral-800">
                    <TableCell className="text-white font-medium">
                      <Link href={`/missions/${m.id}`} className="hover:text-lime-400">{m.title}</Link>
                      {m.featured && <Badge className="ml-2 bg-yellow-400/10 text-yellow-400 border-0 text-[10px]">⭐</Badge>}
                    </TableCell>
                    <TableCell className="text-neutral-400">{m.client.name || m.client.email}</TableCell>
                    <TableCell className="text-white">{m.budget ? `${m.budget} ${m.currency}` : "—"}</TableCell>
                    <TableCell><Badge className={`${st.color} border-0`}>{st.label}</Badge></TableCell>
                    <TableCell className="text-neutral-400">{m._count.proposals}</TableCell>
                    <TableCell className="text-neutral-500 text-sm">{new Date(m.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>
                      <AdminMissionActions missionId={m.id} status={m.status} featured={m.featured} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {missions.length === 0 && <p className="text-neutral-500 text-center py-8">Aucune mission</p>}
        </CardContent>
      </Card>
    </div>
  )
}
