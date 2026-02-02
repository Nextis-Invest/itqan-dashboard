import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { getAdminTickets, getTicketStats } from "@/lib/actions/support"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Headphones, Clock, CheckCircle, MessageSquare } from "lucide-react"
import { AdminSupportFilters } from "./filters"

export const metadata: Metadata = { title: "Support - Admin" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  OPEN: { label: "Ouvert", color: "bg-lime-400/10 text-lime-400", dot: "bg-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400", dot: "bg-blue-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400", dot: "bg-green-400" },
  CLOSED: { label: "Fermé", color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
}

const priorityMap: Record<string, { label: string; color: string }> = {
  LOW: { label: "Faible", color: "bg-muted/50 text-muted-foreground" },
  MEDIUM: { label: "Moyen", color: "bg-blue-400/10 text-blue-400" },
  HIGH: { label: "Élevé", color: "bg-yellow-400/10 text-yellow-400" },
  URGENT: { label: "Urgent", color: "bg-red-400/10 text-red-400" },
}

const categoryMap: Record<string, { label: string; color: string }> = {
  GENERAL: { label: "Général", color: "bg-muted/50 text-muted-foreground" },
  PAYMENT: { label: "Paiement", color: "bg-blue-400/10 text-blue-400" },
  TECHNICAL: { label: "Technique", color: "bg-purple-400/10 text-purple-400" },
  ACCOUNT: { label: "Compte", color: "bg-yellow-400/10 text-yellow-400" },
  MISSION: { label: "Mission", color: "bg-lime-400/10 text-lime-400" },
  OTHER: { label: "Autre", color: "bg-muted/50 text-muted-foreground" },
}

function formatAvgTime(minutes: number): string {
  if (minutes === 0) return "—"
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours < 24) return `${hours}h${mins > 0 ? `${mins}min` : ""}`
  const days = Math.floor(hours / 24)
  return `${days}j`
}

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; category?: string }>
}) {
  const sp = await searchParams
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [stats, tickets] = await Promise.all([
    getTicketStats(),
    getAdminTickets({
      status: sp.status,
      priority: sp.priority,
      category: sp.category,
    }),
  ])

  const statCards = [
    { label: "Tickets ouverts", value: stats.openCount, icon: Headphones, color: "text-lime-400", bg: "bg-lime-400/10" },
    { label: "Temps réponse moy.", value: formatAvgTime(stats.avgResponseMinutes), icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Résolu ce mois", value: stats.resolvedThisMonth, icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Support</h2>
        <p className="text-muted-foreground mt-1">Gestion des tickets de support</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-xl bg-card/80 border border-border p-5">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl ${s.bg} p-2.5`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <AdminSupportFilters
        currentStatus={sp.status}
        currentPriority={sp.priority}
        currentCategory={sp.category}
      />

      {/* Table */}
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-5 rounded-2xl bg-muted p-6 ring-1 ring-border">
            <Headphones className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">Aucun ticket trouvé</h3>
        </div>
      ) : (
        <Card className="bg-card/80 border-border overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-[11px] uppercase tracking-wider">Sujet</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] uppercase tracking-wider">Utilisateur</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] uppercase tracking-wider">Catégorie</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] uppercase tracking-wider">Priorité</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] uppercase tracking-wider">Statut</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] uppercase tracking-wider">Assigné</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] uppercase tracking-wider">Créé</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] uppercase tracking-wider text-right">Réponses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => {
                  const st = statusMap[ticket.status] || statusMap.OPEN
                  const pr = priorityMap[ticket.priority] || priorityMap.MEDIUM
                  const cat = categoryMap[ticket.category] || categoryMap.GENERAL
                  return (
                    <TableRow
                      key={ticket.id}
                      className="border-border hover:bg-accent/20 transition-colors group relative"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full shrink-0 ${st.dot}`} />
                          <Link href={`/admin/support/${ticket.id}`} className="text-foreground font-medium group-hover:text-lime-400 transition-colors text-sm after:absolute after:inset-0 after:content-['']">
                            {ticket.subject}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            {(ticket.user.name || ticket.user.email)?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="text-muted-foreground text-sm">{ticket.user.name || ticket.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${cat.color} border-0 text-[10px]`}>{cat.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${pr.color} border-0 text-[10px]`}>{pr.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${st.color} border-0 text-[10px]`}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {ticket.assignedTo?.name || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(ticket.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center gap-1 text-muted-foreground text-sm justify-end">
                          <MessageSquare className="h-3 w-3" />
                          {ticket._count.replies}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
