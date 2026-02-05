import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, FileText, Users, MapPin, Clock, Compass } from "lucide-react"
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Compass className="h-6 w-6 text-lime-400" />
          Explorer les missions
        </h2>
        <p className="text-muted-foreground mt-1">
          Trouvez des missions qui correspondent à vos compétences
        </p>
      </div>

      {/* Filters */}
      <ExploreFilters
        currentQ={sp.q || ""}
        currentCategory={sp.category || ""}
        currentBudgetMin={sp.budgetMin || ""}
        currentBudgetMax={sp.budgetMax || ""}
        currentRemote={sp.remote === "true"}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-semibold">{total}</span> mission(s) trouvée(s)
        </p>
        {totalPages > 1 && (
          <p className="text-muted-foreground text-sm">
            Page {page} / {totalPages}
          </p>
        )}
      </div>

      {/* Mission Cards Grid */}
      {missions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border/50 bg-muted/30">
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
            <Compass className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <p className="text-muted-foreground text-base font-medium">Aucune mission disponible</p>
          <p className="text-muted-foreground text-sm mt-1">Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {missions.map((mission) => {
            const budgetDisplay = mission.budget
              ? `${mission.budget} ${mission.currency}`
              : mission.budgetMin && mission.budgetMax
              ? `${mission.budgetMin} - ${mission.budgetMax} ${mission.currency}`
              : null

            return (
              <Link key={mission.id} href={`/missions/${mission.id}`} className="group block">
                <div className="h-full rounded-xl border border-border bg-card/80 p-5 transition-all duration-200 hover:border-lime-400/30 hover:shadow-lg hover:shadow-lime-400/5 hover:-translate-y-0.5 flex flex-col">
                  {/* Top: budget badge */}
                  <div className="flex items-start justify-between mb-3">
                    {budgetDisplay ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-lime-400/10 text-lime-400 text-sm font-bold">
                        <DollarSign className="h-3.5 w-3.5" />
                        {budgetDisplay}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Budget non défini</span>
                    )}
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {mission._count.proposals}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-foreground font-semibold text-base mb-2 line-clamp-2 group-hover:text-lime-400 transition-colors">
                    {mission.title}
                  </h3>

                  {/* Client info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-foreground/80 font-medium shrink-0">
                      {(mission.client.name?.[0] || mission.client.email[0]).toUpperCase()}
                    </div>
                    <span className="truncate">{mission.client.name || mission.client.email}</span>
                  </div>

                  {/* Skills */}
                  {mission.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {mission.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} className="bg-secondary text-foreground/80 border-0 text-[11px] px-2 py-0.5">
                          {skill}
                        </Badge>
                      ))}
                      {mission.skills.length > 3 && (
                        <span className="text-muted-foreground text-[11px] self-center">
                          +{mission.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Footer meta */}
                  <div className="flex items-center gap-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    {mission.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(mission.deadline).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {mission.remote && (
                      <span className="flex items-center gap-1 text-green-400">
                        <MapPin className="h-3 w-3" />
                        Remote
                      </span>
                    )}
                    <span className="ml-auto">
                      {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          {page > 1 && (
            <a
              href={`/missions/explore?${buildQueryString(sp, page - 1)}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-foreground/80 hover:text-foreground hover:bg-accent transition-colors border border-border"
            >
              ← Précédent
            </a>
          )}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2
              if (p < 1 || p > totalPages) return null
              return (
                <a
                  key={p}
                  href={`/missions/explore?${buildQueryString(sp, p)}`}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-lime-400 text-neutral-900"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {p}
                </a>
              )
            })}
          </div>
          {page < totalPages && (
            <a
              href={`/missions/explore?${buildQueryString(sp, page + 1)}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-foreground/80 hover:text-foreground hover:bg-accent transition-colors border border-border"
            >
              Suivant →
            </a>
          )}
        </div>
      )}
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
