import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { getAdminDisputes, getDisputeStats } from "@/lib/actions/dispute"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MessageSquare, Clock, CheckCircle, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import { AdminDisputeFilters } from "./dispute-filters"

export const metadata: Metadata = { title: "Gestion des litiges" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  OPEN: { label: "Ouvert", color: "bg-red-400/10 text-red-400", dot: "bg-red-400" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400", dot: "bg-yellow-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400", dot: "bg-green-400" },
  CLOSED: { label: "Fermé", color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
}

const categoryMap: Record<string, { label: string; color: string }> = {
  QUALITY: { label: "Qualité", color: "bg-purple-400/10 text-purple-400" },
  DELAY: { label: "Retard", color: "bg-yellow-400/10 text-yellow-400" },
  PAYMENT: { label: "Paiement", color: "bg-blue-400/10 text-blue-400" },
  SCOPE: { label: "Périmètre", color: "bg-orange-400/10 text-orange-400" },
  COMMUNICATION: { label: "Communication", color: "bg-cyan-400/10 text-cyan-400" },
  OTHER: { label: "Autre", color: "bg-muted/50 text-muted-foreground" },
}

const priorityMap: Record<string, { label: string; color: string }> = {
  LOW: { label: "Faible", color: "bg-muted/50 text-muted-foreground" },
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

  const statCards = [
    { label: "Litiges ouverts", value: stats.openCount, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "En examen", value: stats.underReviewCount, icon: Eye, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Temps résolution", value: `${stats.avgResolutionDays}j`, icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Résolus ce mois", value: stats.resolvedThisMonth, icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Litiges</h2>
        <p className="text-muted-foreground mt-1">Gérer les litiges de la plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-xl bg-card/80 border border-border p-5">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl ${s.bg} p-2.5`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <AdminDisputeFilters
        currentStatus={sp.status || ""}
        currentCategory={sp.category || ""}
        currentPriority={sp.priority || ""}
      />

      {/* Disputes list */}
      {disputes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-5 rounded-2xl bg-muted p-6 ring-1 ring-border">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">Aucun litige trouvé</h3>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Mission</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Ouvert par</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Catégorie</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Priorité</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Statut</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Assigné</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Msgs</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => {
                const st = statusMap[d.status] || statusMap.OPEN
                const cat = categoryMap[d.category] || categoryMap.OTHER
                const pri = priorityMap[d.priority] || priorityMap.MEDIUM
                return (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full shrink-0 ${st.dot}`} />
                        <Link href={`/admin/disputes/${d.id}`} className="text-foreground font-medium hover:text-lime-400 transition-colors text-sm">
                          {d.mission.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground text-sm">
                      {d.openedBy.name || d.openedBy.email}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={`${cat.color} border-0 text-[10px]`}>{cat.label}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={`${pri.color} border-0 text-[10px]`}>{pri.label}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={`${st.color} border-0 text-[10px]`}>{st.label}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground text-sm">
                      {d.assignedTo?.name || d.assignedTo?.email || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs">
                      {new Date(d.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MessageSquare className="h-3 w-3" />
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
