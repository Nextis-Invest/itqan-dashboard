import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { GigCard } from "@/components/gig-card"
import { ChevronRight, SlidersHorizontal } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = await prisma.category.findUnique({ where: { slug }, select: { name: true } })
  return { title: cat?.name || "Catégorie" }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; sort?: string; sub?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        orderBy: { order: "asc" },
        include: { children: { orderBy: { order: "asc" } } },
      },
    },
  })

  if (!category) notFound()

  const page = Math.max(1, parseInt(sp.page || "1"))
  const sort = sp.sort || "popular"
  const subFilter = sp.sub || null
  const limit = 12

  const where: any = { status: "ACTIVE" as const, category: slug }
  if (subFilter) where.subcategory = subFilter

  const orderByMap: Record<string, any> = {
    popular: { orderCount: "desc" },
    newest: { createdAt: "desc" },
    price_asc: { basicPrice: "asc" },
    price_desc: { basicPrice: "desc" },
  }

  const [gigs, total] = await Promise.all([
    prisma.gig.findMany({
      where,
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
            freelancerProfile: {
              select: { title: true, avgRating: true, city: true, verified: true },
            },
          },
        },
      },
      orderBy: orderByMap[sort] || orderByMap.popular,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.gig.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  const sortOptions = [
    { value: "popular", label: "Populaire" },
    { value: "newest", label: "Récent" },
    { value: "price_asc", label: "Prix ↑" },
    { value: "price_desc", label: "Prix ↓" },
  ]

  function buildUrl(overrides: Record<string, string | null>) {
    const p = new URLSearchParams()
    const current = { page: sp.page || "1", sort: sort, sub: subFilter || "" }
    const merged = { ...current, ...overrides }
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v)
    })
    return `/categories/${slug}?${p.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/categories" className="hover:text-lime-400 transition-colors">
          Catégories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{category.name}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-white">{category.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Sous-catégories
          </h3>
          <div className="space-y-1">
            <Link
              href={buildUrl({ sub: null, page: "1" })}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                !subFilter
                  ? "bg-lime-400/10 text-lime-400 font-medium"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              Toutes
            </Link>
            {category.children.map((sub) => (
              <Link
                key={sub.id}
                href={buildUrl({ sub: sub.slug, page: "1" })}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  subFilter === sub.slug
                    ? "bg-lime-400/10 text-lime-400 font-medium"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sort bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">
              {total} service{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Trier par :</span>
              <div className="flex gap-1">
                {sortOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl({ sort: opt.value, page: "1" })}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      sort === opt.value
                        ? "bg-lime-400/10 text-lime-400"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {gigs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-500">Aucun service dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 hover:border-lime-400/50 transition-colors"
                >
                  Précédent
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-neutral-400">
                Page {page} sur {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 hover:border-lime-400/50 transition-colors"
                >
                  Suivant
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
