import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-red-400/10 text-red-400" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400" },
  CLOSED: { label: "Fermé", color: "bg-neutral-500/10 text-neutral-400" },
}

export default async function AdminDisputesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const disputes = await prisma.dispute.findMany({
    include: {
      mission: { select: { id: true, title: true } },
      openedBy: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Litiges</h2>
        <p className="text-neutral-400 mt-1">Gérer les litiges de la plateforme</p>
      </div>

      {disputes.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucun litige en cours</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => {
            const st = statusMap[d.status] || statusMap.OPEN
            return (
              <Link key={d.id} href={`/admin/disputes/${d.id}`}>
                <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium">{d.mission.title}</p>
                        <p className="text-neutral-500 text-sm mt-1">
                          Ouvert par {d.openedBy.name || d.openedBy.email} · {new Date(d.createdAt).toLocaleDateString("fr-FR")}
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
