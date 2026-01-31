import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPin,
  Globe,
  Star,
  ExternalLink,
  CheckCircle,
} from "lucide-react"
import { ExperienceList } from "@/components/experience-list"

export const dynamic = "force-dynamic"

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      freelancerProfile: {
        include: {
          experiences: { orderBy: { startDate: "desc" } },
        },
      },
      clientProfile: true,
      reviewsReceived: {
        include: {
          author: { select: { name: true, email: true } },
          mission: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!user) notFound()

  const fp = user.freelancerProfile
  const cp = user.clientProfile
  const initials = (user.name || user.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20 border-2 border-neutral-700">
              <AvatarFallback className="bg-lime-400/10 text-lime-400 text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{user.name || user.email}</h3>
                {(fp?.verified || cp?.verified) && (
                  <CheckCircle className="h-5 w-5 text-lime-400" />
                )}
                <Badge className="bg-neutral-800 text-neutral-400 border-0 text-xs">{user.role}</Badge>
              </div>
              {fp?.title && <p className="text-lime-400 font-medium mt-1">{fp.title}</p>}
              {cp?.companyName && <p className="text-lime-400 font-medium mt-1">{cp.companyName}</p>}
              <div className="flex items-center gap-4 mt-2 text-neutral-400 text-sm">
                {(fp?.city || cp?.city) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />{fp?.city || cp?.city}
                  </span>
                )}
                {fp?.remote && <Badge className="bg-green-400/10 text-green-400 border-0 text-xs">Remote</Badge>}
                {(fp?.avgRating || cp?.avgRating) && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    {(fp?.avgRating || cp?.avgRating)?.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader><CardTitle className="text-white text-base">Informations</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {fp && (
              <>
                {fp.bio && <p className="text-neutral-300">{fp.bio}</p>}
                {fp.dailyRate && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Tarif journalier</span>
                    <span className="text-white font-medium">{fp.dailyRate} {fp.currency}</span>
                  </div>
                )}
                {fp.category && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Catégorie</span>
                    <span className="text-white">{fp.category}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Missions terminées</span>
                  <span className="text-white">{fp.completedMissions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Disponible</span>
                  <Badge className={`border-0 text-xs ${fp.available ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                    {fp.available ? "Oui" : "Non"}
                  </Badge>
                </div>
              </>
            )}
            {cp && (
              <>
                {cp.companySize && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Taille</span>
                    <span className="text-white">{cp.companySize} employés</span>
                  </div>
                )}
                {cp.industry && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Secteur</span>
                    <span className="text-white">{cp.industry}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Missions postées</span>
                  <span className="text-white">{cp.totalMissions}</span>
                </div>
                {cp.website && (
                  <a href={cp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-lime-400 hover:underline">
                    <Globe className="h-3.5 w-3.5" />{cp.website}
                  </a>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {fp && fp.skills.length > 0 && (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader><CardTitle className="text-white text-base">Compétences & Liens</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {fp.skills.map((skill) => (
                  <Badge key={skill} className="bg-lime-400/10 text-lime-400 border-0">{skill}</Badge>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                {fp.portfolioUrl && <a href={fp.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-300 hover:text-lime-400"><ExternalLink className="h-3.5 w-3.5" />Portfolio</a>}
                {fp.linkedinUrl && <a href={fp.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-300 hover:text-lime-400"><ExternalLink className="h-3.5 w-3.5" />LinkedIn</a>}
                {fp.githubUrl && <a href={fp.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-300 hover:text-lime-400"><ExternalLink className="h-3.5 w-3.5" />GitHub</a>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Experiences */}
      {fp && fp.experiences.length > 0 && (
        <ExperienceList experiences={fp.experiences} />
      )}

      {/* Reviews */}
      {user.reviewsReceived.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader><CardTitle className="text-white text-base">Avis</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {user.reviewsReceived.map((review) => (
              <div key={review.id} className="border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{review.author.name || review.author.email}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-600"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-500 text-xs mt-1">Mission: {review.mission.title}</p>
                {review.comment && <p className="text-neutral-300 text-sm mt-2">{review.comment}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
