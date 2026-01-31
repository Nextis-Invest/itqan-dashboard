import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Plus, Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { GigActions } from "./gig-actions"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-neutral-500/10 text-neutral-400" },
  ACTIVE: { label: "Actif", color: "bg-lime-400/10 text-lime-400" },
  PAUSED: { label: "Pausé", color: "bg-yellow-400/10 text-yellow-400" },
  DELETED: { label: "Supprimé", color: "bg-red-400/10 text-red-400" },
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mes Gigs</h2>
          <p className="text-neutral-400 mt-1">Proposez vos services aux clients</p>
        </div>
        <Link href="/gigs/new">
          <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
            <Plus className="mr-2 h-4 w-4" />Créer un gig
          </Button>
        </Link>
      </div>

      {gigs.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Vous n&apos;avez pas encore créé de gig.</p>
              <Link href="/gigs/new" className="text-lime-400 hover:underline mt-2 inline-block">
                Créer votre premier gig
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => {
            const st = statusMap[gig.status] || statusMap.DRAFT
            return (
              <Card key={gig.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-base line-clamp-2">{gig.title}</CardTitle>
                    <Badge className={`${st.color} border-0 text-xs shrink-0 ml-2`}>{st.label}</Badge>
                  </div>
                  <p className="text-neutral-500 text-xs">{gig.category}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-neutral-400 text-sm line-clamp-2">{gig.description}</p>

                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{gig.viewCount}</span>
                    <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" />{gig.orderCount}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                    <span className="text-lime-400 font-semibold">
                      À partir de {gig.basicPrice} {gig.currency}
                    </span>
                    <GigActions gigId={gig.id} status={gig.status} />
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
