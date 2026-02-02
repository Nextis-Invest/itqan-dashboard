import type { Metadata } from "next"
import { auth } from "@/lib/auth/config"

export const metadata: Metadata = { title: "Recherche" }
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, DollarSign, FileText, Compass } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; remote?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const sp = await searchParams
  const where: any = { status: "OPEN" }

  if (sp.q) {
    where.OR = [
      { title: { contains: sp.q, mode: "insensitive" } },
      { description: { contains: sp.q, mode: "insensitive" } },
    ]
  }
  if (sp.category) where.category = sp.category
  if (sp.remote === "true") where.remote = true

  const missions = await prisma.mission.findMany({
    where,
    include: {
      client: { select: { name: true, email: true } },
      _count: { select: { proposals: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Search className="h-6 w-6 text-lime-400" />
          Rechercher des missions
        </h2>
        <p className="text-muted-foreground mt-1">Trouvez des projets qui correspondent à vos compétences</p>
      </div>

      {/* Search bar - prominent */}
      <form method="GET" className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            name="q"
            defaultValue={sp.q || ""}
            placeholder="Rechercher par titre, description, compétence..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border text-foreground text-base placeholder:text-muted-foreground focus:border-lime-400/50 focus:outline-none focus:ring-1 focus:ring-lime-400/20 transition-all"
          />
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            name="category"
            defaultValue={sp.category || ""}
            className="px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-sm focus:border-lime-400/50 focus:outline-none"
          >
            <option value="">Toutes catégories</option>
            <option value="development">Développement</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="writing">Rédaction</option>
            <option value="video">Vidéo</option>
            <option value="data">Data & IA</option>
            <option value="consulting">Consulting</option>
          </select>

          <Button type="submit" className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold shadow-lg shadow-lime-400/10 px-6">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>

          {sp.q && (
            <span className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">{missions.length}</span> résultat(s) pour &ldquo;{sp.q}&rdquo;
            </span>
          )}
        </div>
      </form>

      {/* Results */}
      {missions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Compass className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-base font-medium">
            Aucune mission trouvée{sp.q ? ` pour "${sp.q}"` : ""}
          </p>
          <p className="text-muted-foreground text-sm mt-1">Essayez d&apos;autres mots-clés ou élargissez votre recherche.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map((mission) => {
            const budgetDisplay = mission.budget
              ? `${mission.budget} ${mission.currency}`
              : mission.budgetMin && mission.budgetMax
              ? `${mission.budgetMin} - ${mission.budgetMax} ${mission.currency}`
              : null

            return (
              <div
                key={mission.id}
                className="group rounded-xl border border-border bg-card/80 p-5 transition-all duration-200 hover:border-lime-400/30 hover:shadow-lg hover:shadow-lime-400/5 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/missions/${mission.id}`}
                      className="text-foreground font-semibold text-lg hover:text-lime-400 transition-colors"
                    >
                      {mission.title}
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1.5">
                      <span className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[9px] text-foreground/80 font-medium">
                          {(mission.client.name?.[0] || mission.client.email[0]).toUpperCase()}
                        </div>
                        {mission.client.name || mission.client.email}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span>{new Date(mission.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>

                    {mission.description && (
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2 leading-relaxed">{mission.description}</p>
                    )}

                    {/* Meta pills */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {budgetDisplay && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-400/10 text-lime-400 text-xs font-semibold">
                          <DollarSign className="h-3 w-3" />
                          {budgetDisplay}
                        </span>
                      )}
                      {mission.deadline && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary text-foreground/80 text-xs">
                          <Calendar className="h-3 w-3" />
                          {new Date(mission.deadline).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                      {mission.remote && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-400/10 text-green-400 text-xs">
                          <MapPin className="h-3 w-3" />
                          Remote
                        </span>
                      )}
                      {mission.category && (
                        <Badge className="bg-secondary text-muted-foreground border-0 text-xs">{mission.category}</Badge>
                      )}
                      {mission.skills.length > 0 && mission.skills.slice(0, 3).map((s) => (
                        <Badge key={s} className="bg-secondary text-foreground/80 border-0 text-[11px]">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-xs">Ouverte</Badge>
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {mission._count.proposals} proposition(s)
                    </span>
                    <Link href={`/missions/${mission.id}`}>
                      <Button size="sm" className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold text-xs shadow-lg shadow-lime-400/10 mt-1">
                        Postuler
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
