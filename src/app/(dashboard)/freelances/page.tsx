import type { Metadata } from "next"

export const metadata: Metadata = { title: "Freelances" }
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Star, MapPin, DollarSign, Briefcase } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function FreelancesPage() {
  const freelancers = await prisma.user.findMany({
    where: { role: "FREELANCER" },
    include: {
      freelancerProfile: true,
      _count: {
        select: {
          freelanceMissions: true,
          proposals: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Users className="h-6 w-6 text-lime-400" />
          Freelances
        </h2>
        <p className="text-muted-foreground mt-1">Parcourez les freelances disponibles</p>
      </div>

      {freelancers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-base font-medium">Aucun freelance inscrit</p>
          <p className="text-muted-foreground text-sm mt-1">Revenez plus tard pour découvrir les talents.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {freelancers.map((freelancer) => {
            const fp = freelancer.freelancerProfile
            const initials = (freelancer.name || freelancer.email)
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <Link key={freelancer.id} href={`/profile/${freelancer.id}`} className="group block">
                <div className="h-full rounded-xl border border-border bg-card/80 p-5 transition-all duration-200 hover:border-lime-400/30 hover:shadow-lg hover:shadow-lime-400/5 hover:-translate-y-0.5">
                  {/* Top: Avatar + Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-14 w-14 border-2 border-border group-hover:border-lime-400/30 transition-colors shrink-0">
                      <AvatarFallback className="bg-lime-400/10 text-lime-400 font-bold text-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-foreground font-semibold truncate group-hover:text-lime-400 transition-colors">
                          {freelancer.name || freelancer.email}
                        </h3>
                        {fp?.verified && (
                          <span className="text-lime-400 text-xs shrink-0">✓</span>
                        )}
                      </div>
                      {fp?.title && (
                        <p className="text-muted-foreground text-sm truncate mt-0.5">{fp.title}</p>
                      )}
                      {fp?.available && (
                        <Badge className="bg-green-400/10 text-green-400 border border-green-400/20 text-[10px] mt-1.5">
                          Disponible
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3 flex-wrap">
                    {fp?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {fp.city}
                      </span>
                    )}
                    {fp?.avgRating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-medium">{fp.avgRating.toFixed(1)}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      {freelancer._count.freelanceMissions} mission(s)
                    </span>
                  </div>

                  {/* TJM */}
                  {fp?.dailyRate && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <DollarSign className="h-3.5 w-3.5 text-lime-400" />
                      <span className="text-foreground font-semibold text-sm">
                        {fp.dailyRate} {fp.currency}/jour
                      </span>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                    {fp?.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} className="bg-secondary text-foreground/80 border-0 text-[11px] px-2 py-0.5">
                        {skill}
                      </Badge>
                    ))}
                    {fp && fp.skills.length > 4 && (
                      <Badge className="bg-muted/50 text-muted-foreground border-0 text-[11px] px-2 py-0.5">
                        +{fp.skills.length - 4}
                      </Badge>
                    )}
                    {!fp && (
                      <span className="text-muted-foreground text-xs">{freelancer._count.proposals} proposition(s)</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
