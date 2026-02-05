import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ChevronRight, ArrowRight, Users, Briefcase } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildSubcategoryUrl, buildCategoriesUrl } from "@/lib/seo-suffixes"
import { generateCategoryMetadata, getCategoryH1 } from "@/lib/seo-metadata"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

// Images par sous-catégorie
const subcategoryImages: Record<string, string> = {
  // Design
  "logo-identite": "/mockups/cat-design.png",
  "web-design": "/mockups/cat-dev-web.png",
  "ui-ux-design": "/mockups/cat-design.png",
  "illustration": "/mockups/cat-design.png",
  // Dev
  "developpement-web": "/mockups/cat-dev-web.png",
  "developpement-mobile": "/mockups/cat-dev-mobile.png",
  "e-commerce": "/mockups/cat-dev-web.png",
  "devops-cloud": "/mockups/cat-data-it.png",
  "ia-machine-learning": "/mockups/cat-data-it.png",
  // Marketing
  "seo": "/mockups/cat-marketing.png",
  "social-media": "/mockups/cat-marketing.png",
  "email-marketing": "/mockups/cat-marketing.png",
  "publicite-en-ligne": "/mockups/cat-marketing.png",
  // Rédaction
  "redaction-web": "/mockups/cat-traduction.png",
  "copywriting": "/mockups/cat-traduction.png",
  "traduction": "/mockups/cat-traduction.png",
  // Vidéo
  "montage-video": "/mockups/cat-marketing.png",
  "motion-design": "/mockups/cat-marketing.png",
  "animation-2d-3d": "/mockups/cat-marketing.png",
  // Business
  "conseil-strategique": "/mockups/cat-finance.png",
  "comptabilite-finance": "/mockups/cat-finance.png",
  "juridique": "/mockups/cat-finance.png",
}

// Icônes par sous-catégorie
const subcategoryIcons: Record<string, string> = {
  "logo-identite": "🎨",
  "web-design": "🖥️",
  "ui-ux-design": "📱",
  "illustration": "✏️",
  "developpement-web": "💻",
  "developpement-mobile": "📲",
  "e-commerce": "🛒",
  "devops-cloud": "☁️",
  "ia-machine-learning": "🤖",
  "seo": "🔍",
  "social-media": "📣",
  "email-marketing": "📧",
  "publicite-en-ligne": "🎯",
  "redaction-web": "📝",
  "copywriting": "✍️",
  "traduction": "🌍",
  "montage-video": "🎬",
  "motion-design": "🎞️",
  "animation-2d-3d": "🎭",
  "conseil-strategique": "💼",
  "comptabilite-finance": "💰",
  "juridique": "⚖️",
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const cat = await prisma.category.findUnique({ where: { slug }, select: { name: true, slug: true } })
  if (!cat) return { title: "Catégorie" }
  
  const gigCount = await prisma.gig.count({ where: { category: slug, status: "ACTIVE" } })
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

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!category) notFound()

  // Compter les gigs et freelances par sous-catégorie
  const subcategoryStats = await Promise.all(
    category.children.map(async (sub) => {
      const [gigCount, freelancerCount] = await Promise.all([
        prisma.gig.count({ where: { subcategory: sub.slug, status: "ACTIVE" } }),
        prisma.freelancerProfile.count({ where: { category: sub.slug } }),
      ])
      return { slug: sub.slug, gigCount, freelancerCount }
    })
  )

  const statsMap = new Map(subcategoryStats.map(s => [s.slug, s]))

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

      {/* Subcategory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.children.map((sub) => {
          const stats = statsMap.get(sub.slug)
          const image = subcategoryImages[sub.slug] || "/mockups/cat-design.png"
          const icon = subcategoryIcons[sub.slug] || "📁"
          
          return (
            <Card 
              key={sub.id} 
              className="group overflow-hidden border-border bg-card hover:border-lime-400/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={image}
                  alt={sub.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{stats?.freelancerCount || 0} freelances</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{stats?.gigCount || 0} services</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href={buildSubcategoryUrl(slug, sub.slug, locale)} className="block">
                  <Button 
                    className="w-full bg-lime-400 hover:bg-lime-300 text-neutral-900 font-semibold group/btn"
                  >
                    Explorer {sub.name}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
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
