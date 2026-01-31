import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { GigCard } from "@/components/gig-card"
import { ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>
}): Promise<Metadata> {
  const { slug, sub } = await params
  const [parent, child] = await Promise.all([
    prisma.category.findUnique({ where: { slug }, select: { name: true } }),
    prisma.category.findUnique({ where: { slug: sub }, select: { name: true } }),
  ])
  return {
    title: `${child?.name || sub} — ${parent?.name || slug}`,
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; sub: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const { slug, sub } = await params
  const sp = await searchParams

  const [parentCat, subCat] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        children: { orderBy: { order: "asc" } },
      },
    }),
    prisma.category.findUnique({ where: { slug: sub } }),
  ])

  if (!parentCat || !subCat) notFound()

  const page = Math.max(1, parseInt(sp.page || "1"))
  const sort = sp.sort || "popular"
  const limit = 12

  const where = { status: "ACTIVE" as const, category: slug, subcategory: sub }

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

  function buildUrl(overrides: Record<string, string>) {
    const p = new URLSearchParams()
    const current = { page: sp.page || "1", sort }
    const merged = { ...current, ...overrides }
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v)
    })
    return `/categories/${slug}/${sub}?${p.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/categories" className="hover:text-lime-400 transition-colors">
          Catégories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/categories/${slug}`}
          className="hover:text-lime-400 transition-colors"
        >
          {parentCat.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{subCat.name}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-white">{subCat.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: sibling subcategories */}
        <aside className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
            Sous-catégories
          </h3>
          <div className="space-y-1">
            <Link
              href={`/categories/${slug}`}
              className="block px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              ← Toutes
            </Link>
            {parentCat.children.map((sibling) => (
              <Link
                key={sibling.id}
                href={`/categories/${slug}/${sibling.slug}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  sibling.slug === sub
                    ? "bg-lime-400/10 text-lime-400 font-medium"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {sibling.name}
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
              <p className="text-neutral-500">
                Aucun service dans cette sous-catégorie pour le moment.
              </p>
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
