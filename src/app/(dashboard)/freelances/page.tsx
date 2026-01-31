import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = { title: "Freelances" }
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Star, MapPin } from "lucide-react"
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
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Freelances</h2>
        <p className="text-neutral-400 mt-1">Parcourez les freelances disponibles</p>
      </div>

      {freelancers.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucun freelance inscrit pour le moment.</p>
            </div>
          </CardContent>
        </Card>
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
              <Link key={freelancer.id} href={`/profile/${freelancer.id}`}>
                <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12 border border-neutral-700">
                      <AvatarFallback className="bg-lime-400/10 text-lime-400 font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-white text-base truncate">
                        {freelancer.name || freelancer.email}
                      </CardTitle>
                      {fp?.title && (
                        <p className="text-neutral-400 text-sm truncate">{fp.title}</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-neutral-400">
                        {fp?.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {fp.city}
                          </span>
                        )}
                        {fp?.avgRating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            {fp.avgRating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {fp?.dailyRate && (
                        <p className="text-white text-sm font-medium">
                          {fp.dailyRate} {fp.currency}/jour
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {fp?.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} className="bg-lime-400/10 text-lime-400 border-0 text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {fp && fp.skills.length > 3 && (
                          <Badge className="bg-neutral-800 text-neutral-400 border-0 text-xs">
                            +{fp.skills.length - 3}
                          </Badge>
                        )}
                        {!fp && (
                          <>
                            <Badge className="bg-lime-400/10 text-lime-400 border-0 text-xs">
                              {freelancer._count.freelanceMissions} missions
                            </Badge>
                            <Badge className="bg-blue-400/10 text-blue-400 border-0 text-xs">
                              {freelancer._count.proposals} propositions
                            </Badge>
                          </>
                        )}
                      </div>

                      {fp?.available && (
                        <Badge className="bg-green-400/10 text-green-400 border-0 text-xs">
                          Disponible
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
