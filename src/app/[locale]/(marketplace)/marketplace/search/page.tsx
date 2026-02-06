import { Metadata } from "next"
import { Search, Users, Package, FolderOpen, Tag, ArrowRight, MapPin, Star, CheckCircle2, Clock, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Recherche: ${q}` : "Recherche",
    description: q
      ? `Résultats de recherche pour "${q}" sur Itqan`
      : "Recherchez des freelances et services sur Itqan",
  }
}

type SearchResult = {
  query: string
  freelancers: Array<{
    id: string
    name: string | null
    image: string | null
    title: string | null
    skills: string[]
    city: string | null
    dailyRate: number | null
    currency: string | null
    avgRating: number | null
    verified: boolean
    available: boolean
  }>
  gigs: Array<{
    id: string
    title: string
    category: string
    skills: string[]
    basicPrice: number
    currency: string
    deliveryDays: number
    images?: string[]
    freelancer: {
      id: string
      name: string | null
      image: string | null
      avgRating: number | null
      verified: boolean
    }
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
    icon: string | null
    parentSlug: string | null
  }>
  skills: Array<{
    id: string
    name: string
    slug: string
    categorySlug: string | null
  }>
  total: number
}

async function getSearchResults(query: string): Promise<SearchResult | null> {
  if (!query || query.length < 2) return null
  
  try {
    const res = await fetch(
      `${config.appUrl}/api/search?q=${encodeURIComponent(query)}&limit=20`,
      { cache: "no-store" }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Tab type for filtering results
type TabType = "all" | "freelancers" | "gigs" | "categories" | "skills"

function ResultTabs({ 
  results, 
  activeTab 
}: { 
  results: SearchResult
  activeTab: TabType 
}) {
  const tabs = [
    { id: "all" as const, label: "Tout", count: results.total, icon: Search },
    { id: "freelancers" as const, label: "Freelances", count: results.freelancers.length, icon: Users },
    { id: "gigs" as const, label: "Services", count: results.gigs.length, icon: Package },
    { id: "categories" as const, label: "Catégories", count: results.categories.length, icon: FolderOpen },
    { id: "skills" as const, label: "Compétences", count: results.skills.length, icon: Tag },
  ].filter(tab => tab.id === "all" || tab.count > 0)

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <Link
            key={tab.id}
            href={`?q=${results.query}${tab.id !== "all" ? `&tab=${tab.id}` : ""}`}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              isActive
                ? "bg-lime-400 text-black"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-white/10"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-xs",
              isActive ? "bg-black/20" : "bg-white/10"
            )}>
              {tab.count}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

function FreelancerCard({ freelancer }: { freelancer: SearchResult["freelancers"][0] }) {
  const initials = (freelancer.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link
      href={`/profile/${freelancer.id}`}
      className="group relative flex flex-col rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10 overflow-hidden transition-all duration-300 hover:border-lime-400/50 hover:shadow-xl hover:shadow-lime-400/5 hover:-translate-y-1"
    >
      {/* Header gradient */}
      <div className="h-20 bg-gradient-to-br from-lime-400/20 via-lime-400/5 to-transparent" />
      
      {/* Avatar - overlapping */}
      <div className="px-5 -mt-10">
        <div className="relative">
          <Avatar className="h-20 w-20 border-4 border-neutral-950 shadow-xl">
            <AvatarImage src={freelancer.image || undefined} alt={freelancer.name || ""} />
            <AvatarFallback className="bg-lime-400/20 text-lime-400 text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {freelancer.verified && (
            <div className="absolute -bottom-1 -right-1 bg-lime-400 rounded-full p-1">
              <CheckCircle2 className="h-4 w-4 text-black" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 pt-3 space-y-3">
        {/* Name & Title */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-lg group-hover:text-lime-400 transition-colors truncate">
              {freelancer.name || "Anonyme"}
            </h3>
            {freelancer.available && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Dispo
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400 truncate">
            {freelancer.title || "Freelance"}
          </p>
        </div>

        {/* Location */}
        {freelancer.city && (
          <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
            <MapPin className="h-3.5 w-3.5" />
            {freelancer.city}
          </div>
        )}

        {/* Skills */}
        {freelancer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {freelancer.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-neutral-300 border border-white/5"
              >
                {skill}
              </span>
            ))}
            {freelancer.skills.length > 3 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-neutral-500">
                +{freelancer.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/5">
          {freelancer.avgRating ? (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-white">{freelancer.avgRating.toFixed(1)}</span>
            </div>
          ) : (
            <span className="text-xs text-neutral-500">Nouveau</span>
          )}
          {freelancer.dailyRate && (
            <span className="text-lime-400 font-semibold">
              {freelancer.dailyRate.toLocaleString("fr-FR")} {freelancer.currency}/j
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function GigCard({ gig }: { gig: SearchResult["gigs"][0] }) {
  const initials = (gig.freelancer.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link
      href={`/marketplace/gigs/${gig.id}`}
      className="group relative flex flex-col rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden transition-all duration-300 hover:border-lime-400/50 hover:shadow-xl hover:shadow-lime-400/5 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-800">
        {gig.images && gig.images.length > 0 ? (
          <Image
            src={gig.images[0]}
            alt={gig.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-lime-400/10 via-neutral-800 to-neutral-900 flex items-center justify-center">
            <Package className="h-10 w-10 text-neutral-600" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
        
        {/* Price badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10">
          <span className="text-lime-400 font-bold text-sm">
            {gig.basicPrice.toLocaleString("fr-FR")} {gig.currency}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        {/* Category */}
        <span className="text-xs text-lime-400/70 font-medium uppercase tracking-wide">
          {gig.category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-lime-400 transition-colors leading-snug">
          {gig.title}
        </h3>

        {/* Skills */}
        {gig.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {gig.skills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-neutral-400"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/5">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-white/10">
              <AvatarImage src={gig.freelancer.image || undefined} />
              <AvatarFallback className="bg-neutral-800 text-[10px] text-neutral-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-neutral-400 truncate max-w-[100px]">
              {gig.freelancer.name}
            </span>
            {gig.freelancer.verified && (
              <CheckCircle2 className="h-3.5 w-3.5 text-lime-400" />
            )}
          </div>
          <div className="flex items-center gap-1 text-neutral-500 text-xs">
            <Clock className="h-3.5 w-3.5" />
            {gig.deliveryDays}j
          </div>
        </div>
      </div>
    </Link>
  )
}

function CategoryPill({ category }: { category: SearchResult["categories"][0] }) {
  const iconMap: Record<string, string> = {
    code: "💻", palette: "🎨", megaphone: "📣", pen_tool: "✏️",
    bar_chart: "📊", video: "🎬", music: "🎵", globe: "🌐",
    smartphone: "📱", camera: "📷", book: "📚", briefcase: "💼",
    heart: "❤️", shield: "🛡️", cpu: "🔧", trending_up: "📈",
  }

  return (
    <Link
      href={
        category.parentSlug
          ? `/marketplace/categories/${category.parentSlug}/${category.slug}`
          : `/marketplace/categories/${category.slug}`
      }
      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 hover:border-lime-400/50 hover:bg-neutral-800 transition-all"
    >
      <span className="text-2xl">
        {iconMap[category.icon || ""] || "📂"}
      </span>
      <span className="font-medium text-white group-hover:text-lime-400 transition-colors">
        {category.name}
      </span>
      <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-lime-400 ml-auto transition-colors" />
    </Link>
  )
}

function SkillChip({ skill }: { skill: SearchResult["skills"][0] }) {
  return (
    <Link
      href={`/marketplace/skills/${skill.slug}`}
      className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 hover:bg-lime-400/20 hover:border-lime-400/50 transition-all"
    >
      <Tag className="h-4 w-4" />
      <span className="font-medium">{skill.name}</span>
    </Link>
  )
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mb-6">
        <Search className="h-8 w-8 text-neutral-600" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">
        Aucun résultat pour "{query}"
      </h2>
      <p className="text-neutral-400 text-center max-w-md mb-8">
        Nous n'avons pas trouvé ce que vous cherchez. Essayez avec d'autres mots-clés ou explorez nos catégories.
      </p>
      <Link
        href="/marketplace/categories"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime-400 text-black font-semibold hover:bg-lime-300 transition-colors"
      >
        <FolderOpen className="h-4 w-4" />
        Explorer les catégories
      </Link>
    </div>
  )
}

function InitialState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400/20 to-transparent border border-lime-400/20 flex items-center justify-center mb-6 animate-pulse">
        <Sparkles className="h-10 w-10 text-lime-400" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">
        Que recherchez-vous ?
      </h2>
      <p className="text-neutral-400 text-center max-w-md">
        Entrez un terme de recherche pour trouver des freelances, services, ou compétences.
      </p>
    </div>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: TabType }>
}) {
  const { q, tab = "all" } = await searchParams
  const query = q?.trim() || ""
  const results = query ? await getSearchResults(query) : null
  const activeTab = tab as TabType

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-neutral-950 to-black sticky top-0 z-10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-lime-400/10 border border-lime-400/20">
              <Search className="h-5 w-5 text-lime-400" />
            </div>
            <h1 className="text-xl font-bold text-white">
              {query ? `Résultats pour "${query}"` : "Recherche"}
            </h1>
          </div>
          {results && results.total > 0 && (
            <p className="text-neutral-400 text-sm ml-12">
              {results.total} résultat{results.total > 1 ? "s" : ""} trouvé{results.total > 1 ? "s" : ""}
            </p>
          )}
          
          {/* Tabs */}
          {results && results.total > 0 && (
            <div className="mt-4 -mb-6 pb-6">
              <ResultTabs results={results} activeTab={activeTab} />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Initial state - no query */}
        {!query && <InitialState />}

        {/* Empty state - query but no results */}
        {query && (!results || results.total === 0) && <EmptyState query={query} />}

        {/* Results */}
        {results && results.total > 0 && (
          <div className="space-y-12">
            {/* Skills */}
            {results.skills.length > 0 && (activeTab === "all" || activeTab === "skills") && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Tag className="h-5 w-5 text-lime-400" />
                  <h2 className="text-lg font-semibold text-white">Compétences & Technologies</h2>
                  <Badge variant="secondary" className="bg-white/10 text-neutral-300 ml-2">
                    {results.skills.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3">
                  {results.skills.map((skill) => (
                    <SkillChip key={skill.id} skill={skill} />
                  ))}
                </div>
              </section>
            )}

            {/* Categories */}
            {results.categories.length > 0 && (activeTab === "all" || activeTab === "categories") && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <FolderOpen className="h-5 w-5 text-lime-400" />
                  <h2 className="text-lg font-semibold text-white">Catégories</h2>
                  <Badge variant="secondary" className="bg-white/10 text-neutral-300 ml-2">
                    {results.categories.length}
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.categories.map((cat) => (
                    <CategoryPill key={cat.id} category={cat} />
                  ))}
                </div>
              </section>
            )}

            {/* Freelancers */}
            {results.freelancers.length > 0 && (activeTab === "all" || activeTab === "freelancers") && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Users className="h-5 w-5 text-lime-400" />
                  <h2 className="text-lg font-semibold text-white">Freelances</h2>
                  <Badge variant="secondary" className="bg-white/10 text-neutral-300 ml-2">
                    {results.freelancers.length}
                  </Badge>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.freelancers.map((freelancer) => (
                    <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                  ))}
                </div>
              </section>
            )}

            {/* Gigs */}
            {results.gigs.length > 0 && (activeTab === "all" || activeTab === "gigs") && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Package className="h-5 w-5 text-lime-400" />
                  <h2 className="text-lg font-semibold text-white">Services</h2>
                  <Badge variant="secondary" className="bg-white/10 text-neutral-300 ml-2">
                    {results.gigs.length}
                  </Badge>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.gigs.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
