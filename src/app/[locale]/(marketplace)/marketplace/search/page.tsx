import { Metadata } from "next"
import { Search, Users, Package, FolderOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Recherche: ${q}` : "Recherche",
    description: q
      ? `Résultats de recherche pour "${q}" sur Itqan`
      : "Recherchez des freelances et services sur Itqan",
  }
}

type SearchResult = {
  query: string
  freelancers: Array<{
    id: string
    name: string | null
    image: string | null
    title: string | null
    skills: string[]
    city: string | null
    dailyRate: number | null
    currency: string | null
    avgRating: number | null
    verified: boolean
    available: boolean
  }>
  gigs: Array<{
    id: string
    title: string
    category: string
    skills: string[]
    basicPrice: number
    currency: string
    deliveryDays: number
    freelancer: {
      id: string
      name: string | null
      image: string | null
      avgRating: number | null
      verified: boolean
    }
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
    icon: string | null
    parentSlug: string | null
  }>
  total: number
}

async function getSearchResults(query: string): Promise<SearchResult | null> {
  if (!query || query.length < 2) return null
  
  try {
    const res = await fetch(
      `${config.appUrl}/api/search?q=${encodeURIComponent(query)}&limit=20`,
      { cache: "no-store" }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() || ""
  const results = query ? await getSearchResults(query) : null

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-neutral-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-6 w-6 text-lime-400" />
            <h1 className="text-2xl font-bold text-white">
              {query ? `Résultats pour "${query}"` : "Recherche"}
            </h1>
          </div>
          {results && (
            <p className="text-neutral-400">
              {results.total} résultat{results.total > 1 ? "s" : ""} trouvé
              {results.total > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!query && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-12 w-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400">
              Entrez un terme de recherche pour trouver des freelances et services
            </p>
          </div>
        )}

        {query && !results && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-12 w-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400">Aucun résultat trouvé pour "{query}"</p>
            <p className="text-neutral-500 text-sm mt-2">
              Essayez avec d'autres termes de recherche
            </p>
          </div>
        )}

        {results && results.total === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-12 w-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400">Aucun résultat trouvé pour "{query}"</p>
            <p className="text-neutral-500 text-sm mt-2">
              Essayez avec d'autres termes de recherche
            </p>
          </div>
        )}

        {results && results.total > 0 && (
          <div className="space-y-10">
            {/* Categories */}
            {results.categories.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FolderOpen className="h-5 w-5 text-lime-400" />
                  <h2 className="text-lg font-semibold text-white">Catégories</h2>
                  <span className="text-sm text-neutral-500">
                    ({results.categories.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={
                        cat.parentSlug
                          ? `/marketplace/categories/${cat.parentSlug}/${cat.slug}`
                          : `/marketplace/categories/${cat.slug}`
                      }
                      className="px-4 py-2 rounded-full bg-neutral-900 border border-white/10 text-white text-sm hover:border-lime-400/50 hover:bg-neutral-800 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Freelancers */}
            {results.freelancers.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-lime-400" />
                  <h2 className="text-lg font-semibold text-white">Freelances</h2>
                  <span className="text-sm text-neutral-500">
                    ({results.freelancers.length})
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.freelancers.map((freelancer) => (
                    <Link
                      key={freelancer.id}
                      href={`/profile/${freelancer.id}`}
                      className="group p-4 rounded-xl bg-neutral-900 border border-white/10 hover:border-lime-400/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-neutral-800 shrink-0">
                          {freelancer.image ? (
                            <Image
                              src={freelancer.image}
                              alt={freelancer.name || ""}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-lime-400 font-semibold">
                              {freelancer.name?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white truncate">
                              {freelancer.name || "Anonyme"}
                            </p>
                            {freelancer.verified && (
                              <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-400">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-400 truncate">
                            {freelancer.title || "Freelance"}
                          </p>
                          {freelancer.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {freelancer.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(freelancer.dailyRate || freelancer.avgRating) && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-sm">
                          {freelancer.dailyRate && (
                            <span className="text-lime-400 font-medium">
                              {freelancer.dailyRate} {freelancer.currency}/jour
                            </span>
                          )}
                          {freelancer.avgRating && (
                            <span className="text-neutral-400">
                              ⭐ {freelancer.avgRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Gigs */}
            {results.gigs.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-lime-400" />
                  <h2 className="text-lg font-semibold text-white">Services</h2>
                  <span className="text-sm text-neutral-500">
                    ({results.gigs.length})
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.gigs.map((gig) => (
                    <Link
                      key={gig.id}
                      href={`/marketplace/gigs/${gig.id}`}
                      className="group p-4 rounded-xl bg-neutral-900 border border-white/10 hover:border-lime-400/50 transition-colors"
                    >
                      <h3 className="font-medium text-white line-clamp-2 group-hover:text-lime-400 transition-colors">
                        {gig.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">{gig.category}</p>
                      {gig.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {gig.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="relative h-6 w-6 rounded-full overflow-hidden bg-neutral-800">
                            {gig.freelancer.image ? (
                              <Image
                                src={gig.freelancer.image}
                                alt={gig.freelancer.name || ""}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-lime-400 text-xs font-semibold">
                                {gig.freelancer.name?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-neutral-400">
                            {gig.freelancer.name}
                          </span>
                        </div>
                        <span className="text-lime-400 font-medium text-sm">
                          {gig.basicPrice} {gig.currency}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
