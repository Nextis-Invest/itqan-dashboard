import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Litiges" }
import { auth } from "@/lib/auth/config"
import { getDisputesByUser } from "@/lib/actions/dispute"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-red-400/10 text-red-400" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400" },
  CLOSED: { label: "Fermé", color: "bg-neutral-500/10 text-neutral-400" },
}

export default async function DisputesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const disputes = await getDisputesByUser()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mes litiges</h2>
          <p className="text-neutral-400 mt-1">Suivez vos litiges en cours</p>
        </div>
        <Link href="/disputes/new">
          <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Ouvrir un litige
          </Button>
        </Link>
      </div>

      {disputes.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucun litige pour le moment</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => {
            const st = statusMap[d.status] || statusMap.OPEN
            return (
              <Link key={d.id} href={`/disputes/${d.id}`}>
                <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium">{d.mission.title}</p>
                        <p className="text-neutral-500 text-sm mt-1">
                          Ouvert le {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                        <p className="text-neutral-400 text-sm mt-2 line-clamp-2">{d.reason}</p>
                      </div>
                      <Badge className={`${st.color} border-0`}>{st.label}</Badge>
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
