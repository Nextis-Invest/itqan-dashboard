import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Headphones } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-lime-400/10 text-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400" },
  CLOSED: { label: "Fermé", color: "bg-neutral-500/10 text-neutral-400" },
}

const priorityMap: Record<string, { label: string; color: string }> = {
  LOW: { label: "Faible", color: "bg-neutral-500/10 text-neutral-400" },
  MEDIUM: { label: "Moyen", color: "bg-blue-400/10 text-blue-400" },
  HIGH: { label: "Élevé", color: "bg-yellow-400/10 text-yellow-400" },
  URGENT: { label: "Urgent", color: "bg-red-400/10 text-red-400" },
}

export default async function AdminSupportPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Support</h2>
        <p className="text-neutral-400 mt-1">Tickets de support des utilisateurs</p>
      </div>

      {tickets.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <Headphones className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucun ticket de support</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => {
            const st = statusMap[t.status] || statusMap.OPEN
            const pr = priorityMap[t.priority] || priorityMap.MEDIUM
            return (
              <Link key={t.id} href={`/admin/support/${t.id}`}>
                <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">{t.subject}</p>
                        <p className="text-neutral-500 text-sm mt-1">
                          {t.user.name || t.user.email} · {new Date(t.createdAt).toLocaleDateString("fr-FR")}
                          {t._count.replies > 0 && ` · ${t._count.replies} réponse(s)`}
                        </p>
                        <p className="text-neutral-400 text-sm mt-2 line-clamp-1">{t.message}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Badge className={`${pr.color} border-0`}>{pr.label}</Badge>
                        <Badge className={`${st.color} border-0`}>{st.label}</Badge>
                      </div>
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
