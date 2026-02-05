import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Historique" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, ArrowRight, Calendar, Coins, User, ShoppingBag } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusLabels: Record<string, { label: string; color: string; dot: string }> = {
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20", dot: "bg-blue-400" },
  COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400 ring-1 ring-green-400/20", dot: "bg-green-400" },
  CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400 ring-1 ring-red-400/20", dot: "bg-red-400" },
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const orders = await prisma.mission.findMany({
    where: {
      clientId: session.user.id,
      status: { in: ["IN_PROGRESS", "COMPLETED", "CANCELLED"] },
      freelancerId: { not: null },
    },
    include: {
      freelancer: { select: { id: true, name: true, email: true } },
      proposals: {
        where: { status: "ACCEPTED" },
        select: { price: true },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Historique des commandes</h2>
        <p className="text-muted-foreground mt-1">Vos missions en cours et terminées</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-5 rounded-2xl bg-secondary/30 p-6 ring-1 ring-ring">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">Aucune commande</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Vos commandes apparaîtront ici après qu&apos;un freelance a été sélectionné</p>
          <Link href="/missions/new" className="mt-4 text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors">
            Publier une mission →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => {
            const st = statusLabels[order.status] || { label: order.status, color: "bg-muted/50 text-muted-foreground ring-1 ring-border", dot: "bg-muted-foreground" }
            const price = order.proposals[0]?.price
            return (
              <Card key={order.id} className="group bg-card/80 border-border hover:border-border hover:bg-accent transition-all duration-300 cursor-pointer">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${st.dot} ring-4 ring-background`} />
                      <div className="min-w-0">
                        <Link href={`/missions/${order.id}`} className="text-foreground font-semibold group-hover:text-lime-400 transition-colors truncate block">
                          {order.title}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <Link href={`/profile/${order.freelancer!.id}`} className="text-lime-400/80 hover:text-lime-400 transition-colors">
                            {order.freelancer!.name || order.freelancer!.email}
                          </Link>
                        </div>
                        <div className="flex items-center gap-4 mt-2.5">
                          <Badge className={`${st.color} border-0 text-[11px]`}>{st.label}</Badge>
                          {price && (
                            <span className="flex items-center gap-1 text-xs">
                              <Coins className="h-3 w-3 text-lime-400/70" />
                              <span className="text-foreground font-semibold">{price} {order.currency}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.updatedAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {order.status === "COMPLETED" && (
                        <span className="text-[11px] text-muted-foreground hover:text-lime-400 cursor-pointer transition-colors">
                          📥 Facture
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-lime-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
