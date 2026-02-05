import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { GigCard } from "@/components/gig-card"
import { ChevronRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { parseSubSlug, buildSubcategoryUrl, buildCategoriesUrl, buildCategoryUrl } from "@/lib/seo-suffixes"
import { generateSubcategoryMetadata, getSubcategoryH1 } from "@/lib/seo-metadata"
import { MissionForm } from "./mission-form"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; sub: string }>
}): Promise<Metadata> {
  const { locale, slug, sub } = await params
  const realSub = parseSubSlug(sub)
  
  const [parent, child] = await Promise.all([
    prisma.category.findUnique({ where: { slug }, select: { name: true, slug: true } }),
    prisma.category.findUnique({ where: { slug: realSub }, select: { name: true, slug: true } }),
  ])
  
  if (!parent || !child) {
    return { title: "Catégorie" }
  }
  
  const gigCount = await prisma.gig.count({ 
    where: { category: slug, subcategory: realSub, status: "ACTIVE" } 
  })
  
  return generateSubcategoryMetadata(
    { name: child.name, slug: child.slug, parentName: parent.name, parentSlug: parent.slug },
    locale,
    gigCount
  )
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string; sub: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const { locale, slug, sub } = await params
  const sp = await searchParams
  const realSub = parseSubSlug(sub)
  setRequestLocale(locale)

  const t = await getTranslations("common")

  const [parentCat, subCat] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        children: { orderBy: { order: "asc" } },
      },
    }),
    prisma.category.findUnique({ where: { slug: realSub } }),
  ])

  if (!parentCat || !subCat) notFound()

  const page = Math.max(1, parseInt(sp.page || "1"))
  const sort = sp.sort || "popular"
  const limit = 12

  const where = { status: "ACTIVE" as const, category: slug, subcategory: realSub }

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

  function buildPageUrl(overrides: Record<string, string>) {
    const p = new URLSearchParams()
    const current = { page: sp.page || "1", sort }
    const merged = { ...current, ...overrides }
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v)
    })
    return `${buildSubcategoryUrl(slug, realSub, locale)}?${p.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={buildCategoriesUrl()} className="hover:text-lime-400 transition-colors">
          {t("categories")}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={buildCategoryUrl(slug)}
          className="hover:text-lime-400 transition-colors"
        >
          {parentCat.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{subCat.name}</span>
      </nav>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{getSubcategoryH1(subCat.name, parentCat.name, locale)}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: sibling subcategories - hidden on mobile */}
        <aside className="hidden lg:block space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t("subcategories")}
          </h3>
          <div className="space-y-1">
            <Link
              href={buildCategoryUrl(slug)}
              className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {t("back_to_all")}
            </Link>
            {parentCat.children.map((sibling) => (
              <Link
                key={sibling.id}
                href={buildSubcategoryUrl(slug, sibling.slug, locale)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  sibling.slug === realSub
                    ? "bg-lime-400/10 text-lime-400 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {sibling.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="lg:col-span-3 space-y-8">
          {/* Mission Form */}
          <MissionForm
            category={slug}
            subcategory={realSub}
            categoryName={parentCat.name}
            subcategoryName={subCat.name}
            locale={locale}
          />

          {/* Gigs Section - Only show if there are gigs */}
          {gigs.length > 0 && (
            <>
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
                        href={buildPageUrl({ sort: opt.value, page: "1" })}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {gigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={buildPageUrl({ page: String(page - 1) })}
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
                      href={buildPageUrl({ page: String(page + 1) })}
                      className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground hover:border-lime-400/50 transition-colors"
                    >
                      {t("next")}
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
