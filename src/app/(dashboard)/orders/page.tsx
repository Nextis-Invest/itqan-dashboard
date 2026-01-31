import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusLabels: Record<string, { label: string; color: string }> = {
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400" },
  COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400" },
  CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400" },
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  // Orders are missions with IN_PROGRESS or COMPLETED status where user is client
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
        <h2 className="text-2xl font-bold text-white tracking-tight">Historique des commandes</h2>
        <p className="text-neutral-400 mt-1">Vos missions en cours et terminées</p>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucune commande pour le moment.</p>
              <Link href="/missions/new" className="text-lime-400 hover:underline mt-2 inline-block">
                Publier une mission
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const st = statusLabels[order.status] || { label: order.status, color: "bg-neutral-500/10 text-neutral-400" }
            const price = order.proposals[0]?.price
            return (
              <Card key={order.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/missions/${order.id}`} className="text-white font-medium hover:text-lime-400 transition-colors">
                        {order.title}
                      </Link>
                      <p className="text-neutral-500 text-sm mt-1">
                        Freelance:{" "}
                        <Link href={`/profile/${order.freelancer!.id}`} className="text-lime-400 hover:underline">
                          {order.freelancer!.name || order.freelancer!.email}
                        </Link>
                      </p>
                      <div className="flex gap-4 mt-2 text-sm">
                        {price && <span className="text-white font-medium">{price} {order.currency}</span>}
                        <span className="text-neutral-500">{new Date(order.updatedAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${st.color} border-0`}>{st.label}</Badge>
                      {order.status === "COMPLETED" && (
                        <p className="text-neutral-500 text-xs mt-2 hover:text-lime-400 cursor-pointer">
                          📥 Télécharger facture
                        </p>
                      )}
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
