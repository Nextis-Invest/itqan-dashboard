import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { getDisputesByUser } from "@/lib/actions/dispute"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, MessageSquare, ArrowRight, Clock, Shield } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = { title: "Litiges" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  OPEN: { label: "Ouvert", color: "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20", dot: "bg-amber-400" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-400/20", dot: "bg-yellow-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400 ring-1 ring-green-400/20", dot: "bg-green-400" },
  CLOSED: { label: "Fermé", color: "bg-muted/50 text-muted-foreground ring-1 ring-border", dot: "bg-muted-foreground" },
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

export default async function DisputesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const disputes = await getDisputesByUser()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Mes litiges</h2>
          <p className="text-muted-foreground mt-1">Suivez vos litiges en cours</p>
        </div>
        <Link href="/disputes/new">
          <Button className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold shadow-lg shadow-lime-400/20 rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Ouvrir un litige
          </Button>
        </Link>
      </div>

      {disputes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-5 rounded-2xl bg-secondary/30 p-6 ring-1 ring-border">
            <Shield className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">Aucun litige</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Vous n&apos;avez aucun litige en cours. C&apos;est une bonne nouvelle !</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {disputes.map((d) => {
            const st = statusMap[d.status] || statusMap.OPEN
            const cat = categoryMap[d.category] || categoryMap.OTHER
            const pri = priorityMap[d.priority] || priorityMap.MEDIUM
            return (
              <Link key={d.id} href={`/disputes/${d.id}`}>
                <Card className="group bg-card/80 border-border/80 hover:border-border hover:bg-card transition-all duration-300 cursor-pointer">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${st.dot} ring-4 ring-background`} />
                        <div className="min-w-0">
                          <p className="text-foreground font-semibold group-hover:text-lime-400 transition-colors truncate">
                            {d.mission.title}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge className={`${st.color} border-0 text-[11px]`}>{st.label}</Badge>
                            <Badge className={`${cat.color} border-0 text-[11px]`}>{cat.label}</Badge>
                            <Badge className={`${pri.color} border-0 text-[11px]`}>{pri.label}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {d._count.messages} message{d._count.messages !== 1 ? "s" : ""}
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
