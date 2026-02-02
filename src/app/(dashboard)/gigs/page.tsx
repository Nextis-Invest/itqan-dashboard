import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Mes services" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Plus, Eye, ShoppingCart, Sparkles } from "lucide-react"
import Link from "next/link"
import { GigActions } from "./gig-actions"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-muted/50 text-muted-foreground border border-border", dot: "bg-muted-foreground" },
  ACTIVE: { label: "Actif", color: "bg-lime-400/10 text-lime-400 border border-lime-400/20", dot: "bg-lime-400" },
  PAUSED: { label: "Pausé", color: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20", dot: "bg-yellow-400" },
  DELETED: { label: "Supprimé", color: "bg-red-400/10 text-red-400 border border-red-400/20", dot: "bg-red-400" },
}

export default async function GigsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const gigs = await prisma.gig.findMany({
    where: { freelancerId: session.user.id, status: { not: "DELETED" } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-lime-400" />
            Mes Gigs
          </h2>
          <p className="text-muted-foreground mt-1">Proposez vos services aux clients</p>
        </div>
        <Link href="/gigs/new">
          <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold shadow-lg shadow-lime-400/10">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau service
          </Button>
        </Link>
      </div>

      {gigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-base font-medium">Aucun gig créé</p>
          <p className="text-muted-foreground text-sm mt-1 text-center max-w-sm">
            Créez votre premier service pour commencer à recevoir des commandes.
          </p>
          <Link href="/gigs/new" className="mt-6">
            <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold shadow-lg shadow-lime-400/10">
              <Plus className="mr-2 h-4 w-4" />
              Créer un gig
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => {
            const st = statusMap[gig.status] || statusMap.DRAFT
            return (
              <div
                key={gig.id}
                className="group relative rounded-xl border border-border bg-card/80 overflow-hidden transition-all duration-200 hover:border-lime-400/30 hover:shadow-lg hover:shadow-lime-400/5 hover:-translate-y-0.5"
              >
                {/* Image area */}
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  {gig.images && gig.images.length > 0 ? (
                    <img
                      src={gig.images[0]}
                      alt={gig.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-lime-400/10 via-secondary to-card flex items-center justify-center">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                  {/* Price badge floating */}
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border">
                    <span className="text-lime-400 font-bold text-sm">
                      {gig.basicPrice} {gig.currency}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${st.color} text-[11px]`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} mr-1 inline-block`} />
                      {st.label}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="text-foreground font-semibold text-sm line-clamp-2 group-hover:text-lime-400 transition-colors">
                    {gig.title}
                  </h3>

                  {gig.category && (
                    <p className="text-muted-foreground text-xs">{gig.category}</p>
                  )}

                  {gig.description && (
                    <p className="text-muted-foreground text-xs line-clamp-2">{gig.description}</p>
                  )}

                  {/* Stats + Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {gig.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {gig.orderCount}
                      </span>
                    </div>
                    <GigActions gigId={gig.id} status={gig.status} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
