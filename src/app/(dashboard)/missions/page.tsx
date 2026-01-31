import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Briefcase } from "lucide-react"

export const metadata: Metadata = { title: "Mes missions" }
export const dynamic = "force-dynamic"

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-neutral-500/10 text-neutral-400" },
  OPEN: { label: "Ouverte", color: "bg-lime-400/10 text-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400" },
  COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400" },
  CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400" },
}

const statusTabs = [
  { key: "", label: "Toutes" },
  { key: "DRAFT", label: "Brouillon" },
  { key: "OPEN", label: "Ouvertes" },
  { key: "IN_PROGRESS", label: "En cours" },
  { key: "COMPLETED", label: "Terminées" },
  { key: "CANCELLED", label: "Annulées" },
]

export default async function MissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user) redirect("/login")

  // ADMIN → redirect to admin missions
  if (user.role === "ADMIN") redirect("/admin/missions")

  const sp = await searchParams
  const statusFilter = sp.status && Object.keys(statusLabels).includes(sp.status) ? sp.status : undefined

  let where: any = {}

  if (user.role === "CLIENT") {
    where.clientId = session.user.id
    if (statusFilter) where.status = statusFilter
  } else if (user.role === "FREELANCER") {
    // Show missions where freelancer is assigned OR has a proposal
    const proposalMissionIds = await prisma.proposal.findMany({
      where: { freelancerId: session.user.id },
      select: { missionId: true },
    })
    const missionIds = proposalMissionIds.map((p) => p.missionId)

    where.OR = [
      { freelancerId: session.user.id },
      { id: { in: missionIds } },
    ]
    if (statusFilter) where.status = statusFilter
  }

  const missions = await prisma.mission.findMany({
    where,
    include: {
      client: { select: { name: true, email: true } },
      freelancer: { select: { name: true, email: true } },
      _count: { select: { proposals: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const isClient = user.role === "CLIENT"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isClient ? "Mes Missions" : "Mes Missions"}
          </h2>
          <p className="text-neutral-400 mt-1">
            {isClient
              ? "Gérez vos missions et projets"
              : "Missions auxquelles vous participez"}
          </p>
        </div>
        {isClient && (
          <Link href="/missions/new">
            <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle mission
            </Button>
          </Link>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statusTabs.map((tab) => (
          <a
            key={tab.key}
            href={tab.key ? `/missions?status=${tab.key}` : "/missions"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (sp.status || "") === tab.key
                ? "bg-lime-400/10 text-lime-400"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-lime-400" />
            {missions.length} mission(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {missions.length === 0 ? (
            <div className="text-neutral-500 text-sm text-center py-12">
              Aucune mission pour le moment.
              {isClient && (
                <>
                  <br />
                  <Link
                    href="/missions/new"
                    className="text-lime-400 hover:underline mt-2 inline-block"
                  >
                    Créer votre première mission
                  </Link>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Titre</TableHead>
                  <TableHead className="text-neutral-400">
                    {isClient ? "Freelance" : "Client"}
                  </TableHead>
                  <TableHead className="text-neutral-400">Budget</TableHead>
                  <TableHead className="text-neutral-400">Statut</TableHead>
                  <TableHead className="text-neutral-400">Propositions</TableHead>
                  <TableHead className="text-neutral-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missions.map((mission) => {
                  const status = statusLabels[mission.status] || statusLabels.DRAFT
                  return (
                    <TableRow
                      key={mission.id}
                      className="border-neutral-800 hover:bg-neutral-800/50 cursor-pointer"
                    >
                      <TableCell className="font-medium text-white">
                        <Link
                          href={`/missions/${mission.id}`}
                          className="hover:text-lime-400 transition-colors"
                        >
                          {mission.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        {isClient
                          ? mission.freelancer?.name || mission.freelancer?.email || "—"
                          : mission.client.name || mission.client.email}
                      </TableCell>
                      <TableCell className="text-white">
                        {mission.budget
                          ? `${mission.budget} ${mission.currency}`
                          : mission.budgetMin && mission.budgetMax
                          ? `${mission.budgetMin} - ${mission.budgetMax} ${mission.currency}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} border-0`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        {mission._count.proposals}
                      </TableCell>
                      <TableCell className="text-neutral-500 text-sm">
                        {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
