import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { getDisputesByUser } from "@/lib/actions/dispute"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, MessageSquare } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = { title: "Litiges" }
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
        <div className="rounded-lg border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Mission</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Catégorie</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Priorité</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Statut</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Ouvert le</th>
                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">Messages</th>
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
                      <Link href={`/disputes/${d.id}`} className="text-white font-medium hover:text-lime-400 transition-colors">
                        {d.mission.title}
                      </Link>
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
