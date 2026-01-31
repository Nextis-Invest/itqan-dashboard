import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { getAdminDisputes, getDisputeStats } from "@/lib/actions/dispute"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MessageSquare, Clock, CheckCircle, Eye } from "lucide-react"
import Link from "next/link"
import { AdminDisputeFilters } from "./dispute-filters"

export const metadata: Metadata = { title: "Gestion des litiges" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-red-400/10 text-red-400" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400" },
  CLOSED: { label: "Fermé", color: "bg-neutral-500/10 text-neutral-400" },
}

const categoryMap: Record<string, { label: string; color: string }> = {
  QUALITY: { label: "Qualité", color: "bg-purple-400/10 text-purple-400" },
  DELAY: { label: "Retard", color: "bg-yellow-400/10 text-yellow-400" },
  PAYMENT: { label: "Paiement", color: "bg-blue-400/10 text-blue-400" },
  SCOPE: { label: "Périmètre", color: "bg-orange-400/10 text-orange-400" },
  COMMUNICATION: { label: "Communication", color: "bg-cyan-400/10 text-cyan-400" },
  OTHER: { label: "Autre", color: "bg-neutral-500/10 text-neutral-400" },
}

const priorityMap: Record<string, { label: string; color: string }> = {
  LOW: { label: "Faible", color: "bg-neutral-500/10 text-neutral-400" },
  MEDIUM: { label: "Moyen", color: "bg-blue-400/10 text-blue-400" },
  HIGH: { label: "Élevé", color: "bg-yellow-400/10 text-yellow-400" },
  CRITICAL: { label: "Critique", color: "bg-red-400/10 text-red-400" },
}

export default async function AdminDisputesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; priority?: string }>
}) {
  const sp = await searchParams
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const filters: any = {}
  if (sp.status) filters.status = sp.status
  if (sp.category) filters.category = sp.category
  if (sp.priority) filters.priority = sp.priority

  const [disputes, stats] = await Promise.all([
    getAdminDisputes(filters),
    getDisputeStats(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Litiges</h2>
        <p className="text-neutral-400 mt-1">Gérer les litiges de la plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-400/10">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.openCount}</p>
                <p className="text-neutral-400 text-xs">Litiges ouverts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-400/10">
                <Eye className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.underReviewCount}</p>
                <p className="text-neutral-400 text-xs">En examen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-400/10">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.avgResolutionDays}j</p>
                <p className="text-neutral-400 text-xs">Temps résolution moy.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-400/10">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.resolvedThisMonth}</p>
                <p className="text-neutral-400 text-xs">Résolus ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <AdminDisputeFilters
        currentStatus={sp.status || ""}
        currentCategory={sp.category || ""}
        currentPriority={sp.priority || ""}
      />

      {/* Table */}
      {disputes.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucun litige trouvé</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Mission</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Ouvert par</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Catégorie</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Priorité</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Statut</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Assigné</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Msgs</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => {
                const st = statusMap[d.status] || statusMap.OPEN
                const cat = categoryMap[d.category] || categoryMap.OTHER
                const pri = priorityMap[d.priority] || priorityMap.MEDIUM
                return (
                  <tr key={d.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/disputes/${d.id}`} className="text-white font-medium hover:text-lime-400 transition-colors">
                        {d.mission.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-300 text-sm">
                      {d.openedBy.name || d.openedBy.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${cat.color} border-0 text-xs`}>{cat.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${pri.color} border-0 text-xs`}>{pri.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${st.color} border-0 text-xs`}>{st.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-sm">
                      {d.assignedTo?.name || d.assignedTo?.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-sm">
                      {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-neutral-400 text-sm">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {d._count.messages}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
