import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      <Card className="group bg-neutral-900 border-neutral-800 hover:border-lime-400/50 transition-all duration-200 overflow-hidden hover:shadow-lg hover:shadow-lime-400/5">
        {/* Image */}
        <div className="aspect-video w-full overflow-hidden">
          {gig.images.length > 0 ? (
            <img
              src={gig.images[0]}
              alt={gig.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-lime-400/20 via-neutral-800 to-neutral-900 flex items-center justify-center">
              <span className="text-neutral-600 text-sm">Pas d&apos;image</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Freelancer mini info */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={gig.freelancer.image || undefined} />
              <AvatarFallback className="bg-neutral-800 text-xs text-neutral-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-neutral-400 truncate">
              {gig.freelancer.name || "Freelancer"}
            </span>
            {profile?.verified && (
              <span className="text-lime-400 text-xs font-medium">✓</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug group-hover:text-lime-400 transition-colors">
            {gig.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">
              {profile?.avgRating?.toFixed(1) || "—"}
            </span>
            <span className="text-xs text-neutral-500 ml-1 flex items-center gap-1">
              <ShoppingCart className="h-3 w-3" />
              {gig.orderCount}
            </span>
          </div>

          {/* Price */}
          <div className="pt-2 border-t border-neutral-800">
            <span className="text-xs text-neutral-500">À partir de</span>
            <span className="text-base font-bold text-white ml-1">
              {gig.basicPrice.toLocaleString("fr-FR")} {gig.currency}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
