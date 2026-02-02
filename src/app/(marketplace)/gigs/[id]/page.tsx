import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  Clock,
  ShoppingCart,
  Eye,
  MapPin,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { GigCard } from "@/components/gig-card"

export const dynamic = "force-dynamic"

async function incrementView(id: string) {
  "use server"
  const { prisma: p } = await import("@/lib/prisma")
  await p.gig.update({ where: { id }, data: { viewCount: { increment: 1 } } })
}

async function getGig(id: string) {
  return prisma.gig.findUnique({
    where: { id, status: "ACTIVE" },
    include: {
      freelancer: {
        include: {
          freelancerProfile: true,
          reviewsReceived: {
            include: {
              author: { select: { id: true, name: true, image: true } },
              mission: { select: { title: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      },
    },
  })
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const gig = await prisma.gig.findUnique({ where: { id }, select: { title: true, description: true } })
  return {
    title: gig?.title || "Service",
    description: gig?.description?.slice(0, 160),
  }
}

export default async function GigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gig = await getGig(id)
  if (!gig) notFound()

  // Increment view count
  incrementView(id)

  const profile = gig.freelancer.freelancerProfile
  const reviews = gig.freelancer.reviewsReceived
  const avgRating = profile?.avgRating?.toFixed(1) || "—"
  const initials = (gig.freelancer.name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  // Related gigs
  const relatedGigs = await prisma.gig.findMany({
    where: { category: gig.category, status: "ACTIVE", id: { not: gig.id } },
    include: {
      freelancer: {
        select: {
          id: true,
          name: true,
          image: true,
          freelancerProfile: { select: { title: true, avgRating: true, city: true, verified: true } },
        },
      },
    },
    orderBy: { orderCount: "desc" },
    take: 4,
  })

  const packages = [
    { key: "basic", title: gig.basicTitle, desc: gig.basicDesc, price: gig.basicPrice },
    { key: "standard", title: gig.standardTitle, desc: gig.standardDesc, price: gig.standardPrice },
    { key: "premium", title: gig.premiumTitle, desc: gig.premiumDesc, price: gig.premiumPrice },
  ].filter((p) => p.price != null)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/categories" className="hover:text-lime-400 transition-colors">
          Catégories
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${gig.category}`}
          className="hover:text-lime-400 transition-colors"
        >
          {gig.category}
        </Link>
        {gig.subcategory && (
          <>
            <span>/</span>
            <Link
              href={`/categories/${gig.category}/${gig.subcategory}`}
              className="hover:text-lime-400 transition-colors"
            >
              {gig.subcategory}
            </Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{gig.title}</h1>

          {/* Freelancer info bar */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={gig.freelancer.image || undefined} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">
                    {gig.freelancer.name || "Freelancer"}
                  </span>
                  {profile?.verified && (
                    <CheckCircle2 className="h-4 w-4 text-lime-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {profile?.title || "Freelancer"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-400 font-medium">{avgRating}</span>
                <span>({reviews.length} avis)</span>
              </div>
              {profile?.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.city}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                <span>{gig.orderCount} commandes</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{gig.viewCount} vues</span>
              </div>
            </div>
          </div>

          {/* Images */}
          {gig.images.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={gig.images[0]}
                  alt={gig.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {gig.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {gig.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-gradient-to-br from-lime-400/10 via-muted to-card flex items-center justify-center">
              <span className="text-muted-foreground">Pas d&apos;images disponibles</span>
            </div>
          )}

          {/* Description */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                {gig.description}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {gig.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {gig.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-border text-foreground hover:border-lime-400/50"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-lime-400" />
                Avis ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucun avis pour le moment.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.author.image || undefined} />
                        <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                          {(review.author.name || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {review.author.name || "Utilisateur"}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-foreground">{review.comment}</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Pricing sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-border sticky top-24">
            <CardContent className="p-0">
              {packages.length > 1 ? (
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full bg-muted rounded-t-lg rounded-b-none">
                    {packages.map((pkg) => (
                      <TabsTrigger
                        key={pkg.key}
                        value={pkg.key}
                        className="flex-1 data-[state=active]:bg-card data-[state=active]:text-lime-400"
                      >
                        {pkg.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {packages.map((pkg) => (
                    <TabsContent key={pkg.key} value={pkg.key} className="p-6 space-y-4 mt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{pkg.title}</h3>
                        <span className="text-2xl font-bold text-lime-400">
                          {pkg.price!.toLocaleString("fr-FR")} {gig.currency}
                        </span>
                      </div>
                      {pkg.desc && (
                        <p className="text-sm text-muted-foreground">{pkg.desc}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Livraison en {gig.deliveryDays} jours</span>
                      </div>
                      <Button className="w-full bg-lime-400 text-black hover:bg-lime-300 font-semibold">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Commander
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-accent hover:text-foreground"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{packages[0]?.title}</h3>
                    <span className="text-2xl font-bold text-lime-400">
                      {packages[0]?.price?.toLocaleString("fr-FR")} {gig.currency}
                    </span>
                  </div>
                  {packages[0]?.desc && (
                    <p className="text-sm text-muted-foreground">{packages[0].desc}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Livraison en {gig.deliveryDays} jours</span>
                  </div>
                  <Button className="w-full bg-lime-400 text-black hover:bg-lime-300 font-semibold">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Commander
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-accent hover:text-foreground"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related gigs */}
      {relatedGigs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Services similaires</h2>
            <Link
              href={`/categories/${gig.category}`}
              className="text-sm text-lime-400 hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedGigs.map((g) => (
              <GigCard key={g.id} gig={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
