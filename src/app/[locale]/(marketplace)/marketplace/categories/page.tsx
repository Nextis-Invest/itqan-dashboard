import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildSubcategoryUrl, buildCategoryUrl } from "@/lib/seo-suffixes"

const META_TEMPLATES: Record<string, { title: string; description: string }> = {
  fr: {
    title: "Freelances Maroc | Toutes les Catégories de Services | Itqan",
    description: "Explorez toutes les catégories de freelances au Maroc. Design, développement, marketing, rédaction et plus. Trouvez l'expert qu'il vous faut sur Itqan.",
  },
  en: {
    title: "Freelancers Morocco | All Service Categories | Itqan",
    description: "Browse all freelancer categories in Morocco. Design, development, marketing, writing and more. Find the expert you need on Itqan.",
  },
  es: {
    title: "Freelancers Marruecos | Todas las Categorías | Itqan",
    description: "Explora todas las categorías de freelancers en Marruecos. Diseño, desarrollo, marketing, redacción y más. Encuentra el experto que necesitas.",
  },
  de: {
    title: "Freelancer Marokko | Alle Service-Kategorien | Itqan",
    description: "Durchsuchen Sie alle Freelancer-Kategorien in Marokko. Design, Entwicklung, Marketing, Schreiben und mehr. Finden Sie den Experten, den Sie brauchen.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const meta = META_TEMPLATES[locale] || META_TEMPLATES.fr
  
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
    },
    alternates: {
      canonical: "/marketplace/categories",
      languages: {
        fr: "/marketplace/categories",
        en: "/en/marketplace/categories",
        es: "/es/marketplace/categories",
        de: "/de/marketplace/categories",
      },
    },
  }
}

export const dynamic = "force-dynamic"

// Map common icon names to emoji (fallback)
const iconMap: Record<string, string> = {
  code: "💻",
  palette: "🎨",
  megaphone: "📣",
  pen_tool: "✏️",
  bar_chart: "📊",
  video: "🎬",
  music: "🎵",
  globe: "🌐",
  smartphone: "📱",
  camera: "📷",
  book: "📚",
  briefcase: "💼",
  heart: "❤️",
  shield: "🛡️",
  cpu: "🔧",
  trending_up: "📈",
  headphones: "🎧",
  edit: "📝",
  layers: "📐",
  database: "🗄️",
}

function getIcon(icon: string | null): string {
  if (!icon) return "📂"
  return iconMap[icon] || icon
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  
  const t = await getTranslations("categories")

  const categories = await prisma.category.findMany({
    where: { level: 0 },
    orderBy: { order: "asc" },
    include: {
      children: {
        orderBy: { order: "asc" },
        include: {
          children: { orderBy: { order: "asc" } },
        },
      },
    },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("description")}
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-4">
            {/* Root category header */}
            <Link
              href={buildCategoryUrl(cat.slug)}
              className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <span className="text-3xl">{getIcon(cat.icon)}</span>
              <h2 className="text-xl font-bold text-foreground group-hover:text-lime-400 transition-colors">
                {cat.name}
              </h2>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-lime-400 transition-colors" />
            </Link>

            {/* Subcategories grid */}
            {cat.children.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pl-12">
                {cat.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={buildSubcategoryUrl(cat.slug, sub.slug, locale)}
                    className="group flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border hover:border-lime-400/50 hover:bg-accent/50 transition-all"
                  >
                    <span className="text-sm text-foreground group-hover:text-lime-400 transition-colors">
                      {sub.name}
                    </span>
                    {sub.children.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {sub.children.length}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}

            <div className="border-b border-border/50" />
          </div>
        ))}
      </div>
    </div>
  )
}
