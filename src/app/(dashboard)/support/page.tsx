import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { getMyTickets } from "@/lib/actions/support"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Headphones, Plus } from "lucide-react"

export const metadata: Metadata = { title: "Support" }
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

const categoryMap: Record<string, { label: string; color: string }> = {
  GENERAL: { label: "Général", color: "bg-neutral-500/10 text-neutral-400" },
  PAYMENT: { label: "Paiement", color: "bg-blue-400/10 text-blue-400" },
  TECHNICAL: { label: "Technique", color: "bg-purple-400/10 text-purple-400" },
  ACCOUNT: { label: "Compte", color: "bg-yellow-400/10 text-yellow-400" },
  MISSION: { label: "Mission", color: "bg-lime-400/10 text-lime-400" },
  OTHER: { label: "Autre", color: "bg-neutral-500/10 text-neutral-400" },
}

export default async function SupportPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const tickets = await getMyTickets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mes tickets</h2>
          <p className="text-neutral-400 mt-1">Gérez vos demandes de support</p>
        </div>
        <Link href="/support/new">
          <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau ticket
          </Button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-16">
            <div className="text-center">
              <Headphones className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p className="text-neutral-400 mb-4">Vous n&apos;avez aucun ticket de support</p>
              <Link href="/support/new">
                <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un ticket
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-neutral-900 border-neutral-800">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Sujet</TableHead>
                <TableHead className="text-neutral-400">Catégorie</TableHead>
                <TableHead className="text-neutral-400">Priorité</TableHead>
                <TableHead className="text-neutral-400">Statut</TableHead>
                <TableHead className="text-neutral-400">Dernière mise à jour</TableHead>
                <TableHead className="text-neutral-400 text-right">Réponses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => {
                const st = statusMap[ticket.status] || statusMap.OPEN
                const pr = priorityMap[ticket.priority] || priorityMap.MEDIUM
                const cat = categoryMap[ticket.category] || categoryMap.GENERAL
                return (
                  <TableRow
                    key={ticket.id}
                    className="border-neutral-800 hover:bg-neutral-800/50 cursor-pointer"
                  >
                    <TableCell>
                      <Link href={`/support/${ticket.id}`} className="text-white font-medium hover:text-lime-400 transition-colors">
                        {ticket.subject}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${cat.color} border-0`}>{cat.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${pr.color} border-0`}>{pr.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${st.color} border-0`}>{st.label}</Badge>
                    </TableCell>
                    <TableCell className="text-neutral-400 text-sm">
                      {new Date(ticket.updatedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-neutral-400 text-sm text-right">
                      {ticket._count.replies}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
