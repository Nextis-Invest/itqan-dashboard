import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { GigCard } from "@/components/gig-card"
import { ChevronRight, SlidersHorizontal } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildSubcategoryUrl, buildCategoriesUrl, buildCategoryUrl } from "@/lib/seo-suffixes"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = await prisma.category.findUnique({ where: { slug }, select: { name: true } })
  return { title: cat?.name || "Catégorie" }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string; sort?: string; sub?: string }>
}) {
  const { locale, slug } = await params
  const sp = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations("common")

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
    { value: "popular", label: t("popular") },
    { value: "newest", label: t("newest") },
    { value: "price_asc", label: t("price_asc") },
    { value: "price_desc", label: t("price_desc") },
  ]

  function buildUrl(overrides: Record<string, string | null>) {
    const p = new URLSearchParams()
    const current = { page: sp.page || "1", sort: sort, sub: subFilter || "" }
    const merged = { ...current, ...overrides }
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v)
    })
    return `${buildCategoryUrl(slug)}?${p.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={buildCategoriesUrl()} className="hover:text-lime-400 transition-colors">
          {t("categories")}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground">{category.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {t("subcategories")}
          </h3>
          <div className="space-y-1">
            <Link
              href={buildUrl({ sub: null, page: "1" })}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                !subFilter
                  ? "bg-lime-400/10 text-lime-400 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {t("all")}
            </Link>
            {category.children.map((sub) => (
              <Link
                key={sub.id}
                href={buildSubcategoryUrl(slug, sub.slug, locale)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  subFilter === sub.slug
                    ? "bg-lime-400/10 text-lime-400 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
            <p className="text-sm text-muted-foreground">
              {total} service{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("sort_by")} :</span>
              <div className="flex gap-1">
                {sortOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl({ sort: opt.value, page: "1" })}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      sort === opt.value
                        ? "bg-lime-400/10 text-lime-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
              <p className="text-muted-foreground">{t("no_services")}</p>
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
                  className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground hover:border-lime-400/50 transition-colors"
                >
                  {t("previous")}
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground hover:border-lime-400/50 transition-colors"
                >
                  {t("next")}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
