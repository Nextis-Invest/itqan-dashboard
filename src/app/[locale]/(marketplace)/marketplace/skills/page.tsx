import type { Metadata } from "next"
import { prismaCatalog } from "@/lib/prisma-catalog"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildSkillUrl, buildCategoriesUrl } from "@/lib/seo-suffixes"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    fr: "Toutes les Compétences Freelance au Maroc | Itqan",
    en: "All Freelance Skills in Morocco | Itqan",
    es: "Todas las Habilidades Freelance en Marruecos | Itqan",
    de: "Alle Freelancer-Fähigkeiten in Marokko | Itqan",
    ar: "جميع مهارات المستقلين في المغرب | إتقان",
  }

  const descriptions: Record<string, string> = {
    fr: "Explorez plus de 600 compétences freelance au Maroc. Trouvez des experts en développement, design, marketing, rédaction et plus. Recrutez le bon talent sur Itqan.",
    en: "Explore 600+ freelance skills in Morocco. Find experts in development, design, marketing, writing and more. Hire the right talent on Itqan.",
    es: "Explora más de 600 habilidades freelance en Marruecos. Encuentra expertos en desarrollo, diseño, marketing, redacción y más.",
    de: "Entdecken Sie 600+ Freelancer-Fähigkeiten in Marokko. Finden Sie Experten in Entwicklung, Design, Marketing, Schreiben und mehr.",
    ar: "اكتشف أكثر من 600 مهارة للمستقلين في المغرب. ابحث عن خبراء في التطوير والتصميم والتسويق والكتابة والمزيد.",
  }

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      type: "website",
      locale,
    },
  }
}

export default async function SkillsIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations("common")

  const searchQuery = sp.q?.trim().toLowerCase() || ""

  // Get all skills grouped by category
  const categories = await prismaCatalog.category.findMany({
    where: { level: 1, isActive: true },
    include: {
      translations: { where: { locale } },
      parent: {
        include: {
          translations: { where: { locale } },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  })

  // Get skills for each category
  const skillsByCategory = await Promise.all(
    categories.map(async (cat) => {
      const skills = await prismaCatalog.skill.findMany({
        where: {
          categoryId: cat.id,
          isActive: true,
          ...(searchQuery && {
            translations: {
              some: {
                locale,
                name: { contains: searchQuery, mode: "insensitive" as const },
              },
            },
          }),
        },
        include: {
          translations: { where: { locale } },
        },
        orderBy: { sortOrder: "asc" },
      })

      return {
        category: {
          id: cat.id,
          name: cat.translations[0]?.name || "",
          slug: cat.translations[0]?.slug || "",
          parentName: cat.parent?.translations[0]?.name || "",
        },
        skills: skills.map((s) => ({
          id: s.id,
          name: s.translations[0]?.name || "",
          slug: s.translations[0]?.slug || "",
        })),
      }
    })
  )

  // Filter out empty categories
  const filteredCategories = skillsByCategory.filter((c) => c.skills.length > 0)

  const totalSkills = filteredCategories.reduce((acc, c) => acc + c.skills.length, 0)

  const pageTitle: Record<string, string> = {
    fr: "Toutes les compétences",
    en: "All Skills",
    es: "Todas las habilidades",
    de: "Alle Fähigkeiten",
    ar: "جميع المهارات",
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={buildCategoriesUrl()} className="hover:text-lime-400 transition-colors">
          {t("categories")}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{t("skills") || "Compétences"}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {pageTitle[locale] || pageTitle.fr}
        </h1>
        <p className="text-muted-foreground">
          {totalSkills} {t("skills_available") || "compétences disponibles"}
        </p>

        {/* Search */}
        <form method="get" className="max-w-md">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder={t("search_skills") || "Rechercher une compétence..."}
            className="w-full bg-secondary/60 border border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl px-4 transition-all"
          />
        </form>
      </div>

      {/* Skills by Category */}
      <div className="space-y-10">
        {filteredCategories.map(({ category, skills }) => (
          <section key={category.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
              {category.parentName && (
                <span className="text-muted-foreground font-normal">{category.parentName} → </span>
              )}
              {category.name}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({skills.length})
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Link
                  key={skill.id}
                  href={buildSkillUrl(skill.slug, locale)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground hover:border-lime-400/50 hover:text-lime-400 transition-colors"
                >
                  {skill.name}
                </Link>
              ))}
            </div>
          </section>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("no_skills_found") || "Aucune compétence trouvée"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
