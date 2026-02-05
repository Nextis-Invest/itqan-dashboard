import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowRight, Sparkles, Users, Briefcase, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientBackground } from "@/components/gradient-background"
import { MarketplaceSearchBar } from "@/components/marketplace/search-bar"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Marketplace — Itqan",
  description: "Trouvez les meilleurs freelances et services au Maroc",
}

const iconMap: Record<string, string> = {
  code: "💻", palette: "🎨", megaphone: "📣", pen_tool: "✏️",
  bar_chart: "📊", video: "🎬", music: "🎵", globe: "🌐",
  smartphone: "📱", camera: "📷", book: "📚", briefcase: "💼",
  heart: "❤️", shield: "🛡️", cpu: "🔧", trending_up: "📈",
  headphones: "🎧", edit: "📝", layers: "📐", database: "🗄️",
}

export default async function MarketplacePage() {
  const allCategories = await prisma.category.findMany({
    where: { level: 0 },
    orderBy: { order: "asc" },
    select: { slug: true, name: true, icon: true },
  })

  const stats = {
    freelancers: "2 500+",
    categories: allCategories.length.toString(),
    satisfaction: "98%",
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="relative isolate overflow-hidden -mx-4 md:-mx-6 px-4 md:px-6">
        <GradientBackground />
        <div className="relative max-w-5xl mx-auto text-center px-4 pt-12 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-sm text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            La marketplace freelance #1 au Maroc
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Trouvez le service{" "}
            <span className="text-lime-300 drop-shadow-[0_0_20px_rgba(163,230,53,0.35)]">parfait</span>
            <br />pour votre projet
          </h1>
          <p className="text-lg text-neutral-200 mb-8 max-w-2xl mx-auto">
            Des milliers de freelances qualifiés prêts à transformer vos idées en réalité.
          </p>
          
          {/* Search */}
          <div className="flex justify-center mb-10">
            <MarketplaceSearchBar variant="hero" placeholder="Rechercher un service..." />
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <div className="text-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-4">
              <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-white">
                <Users className="h-5 w-5 text-lime-300" />
                {stats.freelancers}
              </div>
              <p className="text-neutral-300 text-sm mt-1">Freelances vérifiés</p>
            </div>
            <div className="text-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-4">
              <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-white">
                <Briefcase className="h-5 w-5 text-lime-300" />
                {stats.categories}
              </div>
              <p className="text-neutral-300 text-sm mt-1">Catégories</p>
            </div>
            <div className="text-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-4">
              <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-white">
                <Star className="h-5 w-5 text-lime-300" />
                {stats.satisfaction}
              </div>
              <p className="text-neutral-300 text-sm mt-1">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Services populaires</h2>
            <p className="text-muted-foreground mt-1">Ce que les entreprises recherchent le plus</p>
          </div>
          <Link
            href="/marketplace/categories"
            className="hidden md:flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              href={`/marketplace/categories/${cat.slug}`}
              className="group p-5 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
                {iconMap[cat.icon || ""] || cat.icon || "📂"}
              </span>
              <h3 className="font-medium group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6 md:hidden">
          <Link
            href="/marketplace/categories"
            className="inline-flex items-center gap-2 text-sm text-primary"
          >
            Voir toutes les catégories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Comment ça marche</h2>
          <p className="text-muted-foreground">Recrutez un freelance en 3 étapes simples</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Décrivez votre projet",
              desc: "Publiez votre mission ou parcourez les services proposés par nos freelances.",
            },
            {
              step: "02", 
              title: "Recevez des propositions",
              desc: "Comparez les profils, portfolios et avis. Échangez directement avec les freelances.",
            },
            {
              step: "03",
              title: "Collaborez en confiance",
              desc: "Paiement sécurisé, suivi de projet et support dédié tout au long de la mission.",
            },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-xl border bg-card">
              <div className="text-4xl font-bold text-primary/20 mb-3">{item.step}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="rounded-2xl bg-primary p-8 md:p-10 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">
            Prêt à lancer votre projet ?
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            Rejoignez des milliers d'entreprises qui font confiance à Itqan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/missions/new">Publier une mission</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/marketplace/categories">Explorer les services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
