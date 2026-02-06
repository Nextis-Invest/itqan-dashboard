import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildCategoriesUrl } from "@/lib/seo-suffixes"
import { generateCategoryMetadata, getCategoryH1 } from "@/lib/seo-metadata"
import { Button } from "@/components/ui/button"
import { getCategoryWithChildren } from "@/lib/categories"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const cat = await getCategoryWithChildren(slug, locale)
  if (!cat) return { title: "Catégorie" }
  
  const gigCount = await prisma.gig.count({ where: { category: cat.frSlug, status: "ACTIVE" } })
  return generateCategoryMetadata({ name: cat.name, slug: cat.slug }, locale, gigCount)
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations("common")

  const category = await getCategoryWithChildren(slug, locale)

  if (!category) notFound()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={buildCategoriesUrl()} className="hover:text-lime-400 transition-colors">
          {t("categories")}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {getCategoryH1(category.name, locale)}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("explore_subcategories") || `Explorez nos ${category.children.length} spécialités en ${category.name}`}
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8">
        <p className="text-muted-foreground mb-4">
          {t("not_finding") || "Vous ne trouvez pas ce que vous cherchez ?"}
        </p>
        <Link href="/missions/new">
          <Button variant="outline" size="lg" className="border-lime-400/50 text-lime-400 hover:bg-lime-400/10">
            Publier une mission personnalisée
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
