import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Catégories",
  description: "Parcourir toutes les catégories de services",
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

export default async function CategoriesPage() {
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
        <h1 className="text-3xl font-bold text-white">Catégories</h1>
        <p className="text-neutral-400 mt-2">
          Explorez nos catégories de services pour trouver le freelancer idéal
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-4">
            {/* Root category header */}
            <Link
              href={`/marketplace/categories/${cat.slug}`}
              className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <span className="text-3xl">{getIcon(cat.icon)}</span>
              <h2 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors">
                {cat.name}
              </h2>
              <ChevronRight className="h-5 w-5 text-neutral-600 group-hover:text-lime-400 transition-colors" />
            </Link>

            {/* Subcategories grid */}
            {cat.children.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pl-12">
                {cat.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/marketplace/categories/${cat.slug}/${sub.slug}`}
                    className="group flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-lime-400/50 hover:bg-neutral-800/50 transition-all"
                  >
                    <span className="text-sm text-neutral-300 group-hover:text-lime-400 transition-colors">
                      {sub.name}
                    </span>
                    {sub.children.length > 0 && (
                      <span className="text-xs text-neutral-600 ml-auto">
                        {sub.children.length}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}

            <div className="border-b border-neutral-800/50" />
          </div>
        ))}
      </div>
    </div>
  )
}
