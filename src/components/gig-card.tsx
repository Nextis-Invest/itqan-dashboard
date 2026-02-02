import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface GigCardProps {
  gig: {
    id: string
    title: string
    images: string[]
    basicPrice: number
    currency: string
    orderCount: number
    category: string
    subcategory?: string | null
    freelancer: {
      id: string
      name: string | null
      image: string | null
      freelancerProfile?: {
        title: string | null
        avgRating: number | null
        city: string | null
        verified: boolean
      } | null
    }
  }
}

export function GigCard({ gig }: GigCardProps) {
  const profile = gig.freelancer.freelancerProfile
  const initials = (gig.freelancer.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link href={`/gigs/${gig.id}`}>
      <div className="group relative rounded-xl border border-border bg-card/80 overflow-hidden transition-all duration-200 hover:border-lime-400/30 hover:shadow-lg hover:shadow-lime-400/5 hover:scale-[1.02]">
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden">
          {gig.images.length > 0 ? (
            <img
              src={gig.images[0]}
              alt={gig.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-lime-400/20 via-secondary to-card flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Pas d&apos;image</span>
            </div>
          )}
          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-card/20 to-transparent" />

          {/* Price badge - floating bottom right */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border shadow-lg">
            <span className="text-lime-400 font-bold text-sm">
              {gig.basicPrice.toLocaleString("fr-FR")} {gig.currency}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Freelancer mini info */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={gig.freelancer.image || undefined} />
              <AvatarFallback className="bg-secondary text-[10px] text-muted-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">
              {gig.freelancer.name || "Freelancer"}
            </span>
            {profile?.verified && (
              <span className="text-lime-400 text-xs">✓</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-lime-400 transition-colors">
            {gig.title}
          </h3>

          {/* Rating - more visible */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    profile?.avgRating && i < Math.round(profile.avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-yellow-400 font-semibold">
              {profile?.avgRating?.toFixed(1) || "—"}
            </span>
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
              <ShoppingCart className="h-3 w-3" />
              {gig.orderCount} vente(s)
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* Skeleton loading variant */
export function GigCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card/80 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video w-full bg-secondary" />

      <div className="p-4 space-y-3">
        {/* Avatar + name */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary" />
          <div className="h-3 w-24 rounded bg-secondary" />
        </div>

        {/* Title lines */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-secondary" />
          <div className="h-4 w-2/3 rounded bg-secondary" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded bg-secondary" />
            ))}
          </div>
          <div className="h-3 w-8 rounded bg-secondary" />
        </div>
      </div>
    </div>
  )
}
