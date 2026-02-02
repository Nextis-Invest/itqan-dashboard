import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { getMyTickets } from "@/lib/actions/support"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Headphones, Plus, ArrowRight, Clock, MessageSquare } from "lucide-react"

export const metadata: Metadata = { title: "Support" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  OPEN: { label: "Ouvert", color: "bg-lime-400/10 text-lime-400 ring-1 ring-lime-400/20", dot: "bg-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20", dot: "bg-blue-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400 ring-1 ring-green-400/20", dot: "bg-green-400" },
  CLOSED: { label: "Fermé", color: "bg-muted/50 text-muted-foreground ring-1 ring-border", dot: "bg-muted-foreground" },
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

export default async function SupportPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const tickets = await getMyTickets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Mes tickets</h2>
          <p className="text-muted-foreground mt-1">Gérez vos demandes de support</p>
        </div>
        <Link href="/support/new">
          <Button className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold shadow-lg shadow-lime-400/20 rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau ticket
          </Button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-5 rounded-2xl bg-secondary/30 p-6 ring-1 ring-border">
            <Headphones className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">Aucun ticket</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Besoin d&apos;aide ? Créez un ticket et notre équipe vous répondra rapidement</p>
          <Link href="/support/new" className="mt-5">
            <Button className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold shadow-lg shadow-lime-400/20 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Créer un ticket
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {tickets.map((ticket) => {
            const st = statusMap[ticket.status] || statusMap.OPEN
            const pr = priorityMap[ticket.priority] || priorityMap.MEDIUM
            const cat = categoryMap[ticket.category] || categoryMap.GENERAL
            return (
              <Link key={ticket.id} href={`/support/${ticket.id}`}>
                <Card className="group bg-card/80 border-border/80 hover:border-border hover:bg-card transition-all duration-300 cursor-pointer">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${st.dot} ring-4 ring-background`} />
                        <div className="min-w-0">
                          <p className="text-foreground font-semibold group-hover:text-lime-400 transition-colors truncate">
                            {ticket.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge className={`${st.color} border-0 text-[11px]`}>{st.label}</Badge>
                            <Badge className={`${cat.color} border-0 text-[11px]`}>{cat.label}</Badge>
                            <Badge className={`${pr.color} border-0 text-[11px]`}>{pr.label}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(ticket.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {ticket._count.replies} réponse{ticket._count.replies !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-lime-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
