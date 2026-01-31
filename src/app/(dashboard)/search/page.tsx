import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouverte", color: "bg-lime-400/10 text-lime-400" },
}

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
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Rechercher des missions</h2>
        <p className="text-neutral-400 mt-1">Trouvez des projets qui correspondent à vos compétences</p>
      </div>

      {/* Search bar */}
      <form method="GET" className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            name="q"
            defaultValue={sp.q || ""}
            placeholder="Rechercher par titre, description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50 focus:outline-none text-sm"
          />
        </div>
        <select name="category" defaultValue={sp.category || ""} className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm">
          <option value="">Toutes catégories</option>
          <option value="development">Développement</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
          <option value="writing">Rédaction</option>
          <option value="video">Vidéo</option>
          <option value="data">Data & IA</option>
          <option value="consulting">Consulting</option>
        </select>
        <Button type="submit" className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
          <Search className="h-4 w-4 mr-2" />Rechercher
        </Button>
      </form>

      {/* Results */}
      {missions.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucune mission trouvée{sp.q ? ` pour "${sp.q}"` : ""}.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {missions.map((mission) => (
            <Card key={mission.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/missions/${mission.id}`} className="text-white font-medium hover:text-lime-400 transition-colors text-lg">
                      {mission.title}
                    </Link>
                    <p className="text-neutral-500 text-sm mt-1">
                      {mission.client.name || mission.client.email} · {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    {mission.description && (
                      <p className="text-neutral-400 text-sm mt-2 line-clamp-2">{mission.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      {mission.budget && (
                        <span className="flex items-center gap-1 text-lime-400">
                          <DollarSign className="h-3.5 w-3.5" />
                          {mission.budget} {mission.currency}
                        </span>
                      )}
                      {mission.deadline && (
                        <span className="flex items-center gap-1 text-neutral-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(mission.deadline).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                      {mission.remote && (
                        <Badge className="bg-green-400/10 text-green-400 border-0 text-xs">Remote</Badge>
                      )}
                      {mission.category && (
                        <Badge className="bg-neutral-800 text-neutral-400 border-0 text-xs">{mission.category}</Badge>
                      )}
                    </div>
                    {mission.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {mission.skills.slice(0, 5).map((s) => (
                          <Badge key={s} className="bg-lime-400/10 text-lime-400 border-0 text-xs">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <Badge className="bg-lime-400/10 text-lime-400 border-0">Ouverte</Badge>
                    <p className="text-neutral-500 text-xs mt-2">{mission._count.proposals} proposition(s)</p>
                    <Link href={`/missions/${mission.id}`}>
                      <Button size="sm" className="mt-2 bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold text-xs">
                        Postuler
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
