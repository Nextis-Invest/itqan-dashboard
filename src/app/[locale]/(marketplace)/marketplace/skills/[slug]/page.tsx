import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { prismaCatalog } from "@/lib/prisma-catalog"
import Link from "next/link"
import { GigCard } from "@/components/gig-card"
import { ChevronRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { parseSubSlug, buildSkillUrl, buildCategoriesUrl, buildSubcategoryUrl } from "@/lib/seo-suffixes"
import { generateSkillMetadata, getSkillH1 } from "@/lib/seo-metadata"
import { SkillMissionForm } from "./mission-form"

export const dynamic = "force-dynamic"

async function getSkillBySlug(slug: string, locale: string) {
  const translation = await prismaCatalog.skillTranslation.findFirst({
    where: { slug, locale },
    include: {
      skill: {
        include: {
          translations: { where: { locale } },
        },
      },
    },
  })

  if (!translation) return null

  // Get category info if available
  let category = null
  if (translation.skill.categoryId) {
    category = await prismaCatalog.category.findUnique({
      where: { id: translation.skill.categoryId },
      include: {
        translations: { where: { locale } },
        parent: {
          include: {
            translations: { where: { locale } },
          },
        },
      },
    })
  }

  return {
    id: translation.skill.id,
    name: translation.name,
    slug: translation.slug,
    category: category
      ? {
          id: category.id,
          name: category.translations[0]?.name || "",
          slug: category.translations[0]?.slug || "",
          parent: category.parent
            ? {
                id: category.parent.id,
                name: category.parent.translations[0]?.name || "",
                slug: category.parent.translations[0]?.slug || "",
              }
            : null,
        }
      : null,
  }
}

async function getRelatedSkills(categoryId: string | null, currentSkillId: string, locale: string, limit = 10) {
  if (!categoryId) return []

  const skills = await prismaCatalog.skill.findMany({
    where: {
      categoryId,
      id: { not: currentSkillId },
      isActive: true,
    },
    include: {
      translations: { where: { locale } },
    },
    take: limit,
  })

  return skills.map((s) => ({
    id: s.id,
    name: s.translations[0]?.name || "",
    slug: s.translations[0]?.slug || "",
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const realSlug = parseSubSlug(slug)

  const skill = await getSkillBySlug(realSlug, locale)

  if (!skill) {
    return { title: "Skill" }
  }

  // Count gigs that have this skill
  const gigCount = await prisma.gig.count({
    where: {
      status: "ACTIVE",
      skills: { has: skill.name },
    },
  })

  return generateSkillMetadata(
    {
      name: skill.name,
      slug: skill.slug,
      categoryName: skill.category?.name,
      categorySlug: skill.category?.slug,
    },
    locale,
    gigCount
  )
}

export default async function SkillPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const { locale, slug } = await params
  const sp = await searchParams
  const realSlug = parseSubSlug(slug)
  setRequestLocale(locale)

  const t = await getTranslations("common")

  const skill = await getSkillBySlug(realSlug, locale)

  if (!skill) notFound()

  const relatedSkills = await getRelatedSkills(
    skill.category?.id || null,
    skill.id,
    locale
  )

  const page = Math.max(1, parseInt(sp.page || "1"))
  const sort = sp.sort || "popular"
  const limit = 12

  // Find gigs that have this skill in their skills array
  const where = {
    status: "ACTIVE" as const,
    skills: { has: skill.name },
  }

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
    return `${buildSkillUrl(realSlug, locale)}?${p.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href={buildCategoriesUrl()} className="hover:text-lime-400 transition-colors">
          {t("categories")}
        </Link>
        {skill.category?.parent && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/marketplace/categories/${skill.category.parent.slug}`}
              className="hover:text-lime-400 transition-colors"
            >
              {skill.category.parent.name}
            </Link>
          </>
        )}
        {skill.category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={buildSubcategoryUrl(
                skill.category.parent?.slug || skill.category.slug,
                skill.category.slug,
                locale
              )}
              className="hover:text-lime-400 transition-colors"
            >
              {skill.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{skill.name}</span>
      </nav>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {getSkillH1(skill.name, locale)}
        </h1>
        {skill.category && (
          <p className="text-muted-foreground mt-2">
            {skill.category.parent?.name && `${skill.category.parent.name} → `}
            {skill.category.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: related skills */}
        <aside className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t("related_skills") || "Compétences similaires"}
          </h3>
          <div className="space-y-1">
            {skill.category && (
              <Link
                href={buildSubcategoryUrl(
                  skill.category.parent?.slug || skill.category.slug,
                  skill.category.slug,
                  locale
                )}
                className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                ← {t("back_to_category") || "Retour à la catégorie"}
              </Link>
            )}
            {relatedSkills.map((related) => (
              <Link
                key={related.id}
                href={buildSkillUrl(related.slug, locale)}
                className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {related.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="lg:col-span-3 space-y-8">
          {/* Mission Form */}
          <SkillMissionForm
            skillName={skill.name}
            skillSlug={skill.slug}
            categorySlug={skill.category?.parent?.slug || skill.category?.slug}
            subcategorySlug={skill.category?.slug}
            categoryName={skill.category?.parent?.name || skill.category?.name}
            subcategoryName={skill.category?.name}
            locale={locale}
          />

          {/* Gigs Section - Only show if there are gigs */}
          {gigs.length > 0 && (
            <>
              {/* Sort bar */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {total} service{total !== 1 ? "s" : ""} {skill.name}
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
