import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Briefcase, Calendar, Eye, FileText } from "lucide-react"
import { ExploreFilters } from "./explore-filters"

export const metadata: Metadata = { title: "Explorer les missions" }
export const dynamic = "force-dynamic"

const ITEMS_PER_PAGE = 20

export default async function ExploreMissionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string
    budgetMin?: string
    budgetMax?: string
    remote?: string
    page?: string
  }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page || "1"))

  // Build where clause
  const where: any = { status: "OPEN" }

  if (sp.q) {
    where.OR = [
      { title: { contains: sp.q, mode: "insensitive" } },
      { description: { contains: sp.q, mode: "insensitive" } },
    ]
  }

  if (sp.category) {
    where.category = sp.category
  }

  if (sp.budgetMin) {
    where.budget = { ...(where.budget || {}), gte: parseFloat(sp.budgetMin) }
  }
  if (sp.budgetMax) {
    where.budget = { ...(where.budget || {}), lte: parseFloat(sp.budgetMax) }
  }

  if (sp.remote === "true") {
    where.remote = true
  }

  const [missions, total] = await Promise.all([
    prisma.mission.findMany({
      where,
      include: {
        client: { select: { name: true, email: true } },
        _count: { select: { proposals: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.mission.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Explorer les missions
        </h2>
        <p className="text-neutral-400 mt-1">
          Trouvez des missions qui correspondent à vos compétences
        </p>
      </div>

      <ExploreFilters
        currentQ={sp.q || ""}
        currentCategory={sp.category || ""}
        currentBudgetMin={sp.budgetMin || ""}
        currentBudgetMax={sp.budgetMax || ""}
        currentRemote={sp.remote === "true"}
      />

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="pt-6">
          {missions.length === 0 ? (
            <div className="text-neutral-500 text-sm text-center py-12">
              Aucune mission disponible avec ces critères.
            </div>
          ) : (
            <>
              <p className="text-neutral-400 text-sm mb-4">
                {total} mission(s) trouvée(s)
              </p>
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800 hover:bg-transparent">
                    <TableHead className="text-neutral-400">Mission</TableHead>
                    <TableHead className="text-neutral-400">Client</TableHead>
                    <TableHead className="text-neutral-400">Budget</TableHead>
                    <TableHead className="text-neutral-400">Catégorie</TableHead>
                    <TableHead className="text-neutral-400">Date limite</TableHead>
                    <TableHead className="text-neutral-400">Propositions</TableHead>
                    <TableHead className="text-neutral-400">Publiée</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missions.map((mission) => (
                    <TableRow
                      key={mission.id}
                      className="border-neutral-800 hover:bg-neutral-800/50"
                    >
                      <TableCell>
                        <Link
                          href={`/missions/${mission.id}`}
                          className="text-white font-medium hover:text-lime-400 transition-colors"
                        >
                          {mission.title}
                        </Link>
                        {mission.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mission.skills.slice(0, 3).map((skill) => (
                              <Badge
                                key={skill}
                                className="bg-lime-400/10 text-lime-400 border-0 text-[10px] px-1.5 py-0"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {mission.skills.length > 3 && (
                              <span className="text-neutral-500 text-[10px]">
                                +{mission.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        {mission.client.name || mission.client.email}
                      </TableCell>
                      <TableCell className="text-white">
                        {mission.budget
                          ? `${mission.budget} ${mission.currency}`
                          : mission.budgetMin && mission.budgetMax
                          ? `${mission.budgetMin} - ${mission.budgetMax} ${mission.currency}`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        {mission.category || "—"}
                      </TableCell>
                      <TableCell className="text-neutral-400 text-sm">
                        {mission.deadline
                          ? new Date(mission.deadline).toLocaleDateString("fr-FR")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        {mission._count.proposals}
                      </TableCell>
                      <TableCell className="text-neutral-500 text-sm">
                        {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  {page > 1 && (
                    <a
                      href={`/missions/explore?${buildQueryString(sp, page - 1)}`}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    >
                      ← Précédent
                    </a>
                  )}
                  <span className="text-neutral-500 text-sm">
                    Page {page} sur {totalPages}
                  </span>
                  {page < totalPages && (
                    <a
                      href={`/missions/explore?${buildQueryString(sp, page + 1)}`}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    >
                      Suivant →
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function buildQueryString(
  sp: Record<string, string | undefined>,
  page: number
) {
  const params = new URLSearchParams()
  if (sp.q) params.set("q", sp.q)
  if (sp.category) params.set("category", sp.category)
  if (sp.budgetMin) params.set("budgetMin", sp.budgetMin)
  if (sp.budgetMax) params.set("budgetMax", sp.budgetMax)
  if (sp.remote) params.set("remote", sp.remote)
  params.set("page", String(page))
  return params.toString()
}
