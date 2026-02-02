import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const { userId } = await params
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
  return { title: user?.name ?? "Profil" }
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPin,
  Globe,
  Star,
  ExternalLink,
  CheckCircle,
  Briefcase,
  Quote,
  DollarSign,
  Zap,
} from "lucide-react"
import { ExperienceList } from "@/components/experience-list"
import { getUserBadges } from "@/lib/actions/badge"
import { BadgeDisplay } from "@/components/badge-display"

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

  const badges = await getUserBadges(userId)

  const fp = user.freelancerProfile
  const cp = user.clientProfile
  const initials = (user.name || user.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const isVerified = fp?.verified || cp?.verified

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gradient banner */}
        <div className="h-36 bg-gradient-to-r from-lime-400/20 via-emerald-400/15 to-lime-400/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(163,230,53,0.15)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(52,211,153,0.1)_0%,_transparent_60%)]" />
        </div>

        {/* Profile info overlapping banner */}
        <div className="bg-card border border-border rounded-b-2xl px-6 pb-6 pt-0 -mt-px">
          <div className="flex flex-col sm:flex-row items-start gap-5 -mt-10">
            {/* Avatar */}
            <div className={`relative shrink-0 ${isVerified ? "ring-[3px] ring-lime-400/60 shadow-[0_0_20px_rgba(163,230,53,0.2)]" : "ring-[3px] ring-border"} rounded-full`}>
              <Avatar className="h-24 w-24 border-4 border-card">
                <AvatarFallback className="bg-gradient-to-br from-lime-400/20 to-emerald-400/20 text-lime-400 text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-lime-400 rounded-full p-1 shadow-lg shadow-lime-400/30">
                  <CheckCircle className="h-4 w-4 text-card" />
                </div>
              )}
            </div>

            {/* Name + Title */}
            <div className="flex-1 pt-12 sm:pt-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {user.name || user.email}
                </h2>
                <BadgeDisplay badges={badges} />
                <Badge className="bg-secondary/80 text-muted-foreground border border-border/50 text-xs">{user.role}</Badge>
              </div>
              {fp?.title && <p className="text-lime-400 font-medium mt-1">{fp.title}</p>}
              {cp?.companyName && <p className="text-lime-400 font-medium mt-1">{cp.companyName}</p>}

              {/* Stats row */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {(fp?.city || cp?.city) && (
                  <span className="flex items-center gap-1.5 text-muted-foreground text-sm bg-secondary/60 px-3 py-1.5 rounded-lg">
                    <MapPin className="h-3.5 w-3.5" />
                    {fp?.city || cp?.city}
                  </span>
                )}
                {fp?.remote && (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-sm bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                    <Globe className="h-3.5 w-3.5" />
                    Remote
                  </span>
                )}
                {(fp?.avgRating || cp?.avgRating) && (
                  <span className="flex items-center gap-1.5 text-yellow-400 text-sm bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20">
                    <Star className="h-3.5 w-3.5 fill-yellow-400" />
                    {(fp?.avgRating || cp?.avgRating)?.toFixed(1)}
                    {user.reviewsReceived.length > 0 && (
                      <span className="text-muted-foreground text-xs">({user.reviewsReceived.length})</span>
                    )}
                  </span>
                )}
                {fp && (
                  <span className="flex items-center gap-1.5 text-muted-foreground text-sm bg-secondary/60 px-3 py-1.5 rounded-lg">
                    <Briefcase className="h-3.5 w-3.5" />
                    {fp.completedMissions} mission{fp.completedMissions !== 1 ? "s" : ""}
                  </span>
                )}
                {cp && (
                  <span className="flex items-center gap-1.5 text-muted-foreground text-sm bg-secondary/60 px-3 py-1.5 rounded-lg">
                    <Briefcase className="h-3.5 w-3.5" />
                    {cp.totalMissions} mission{cp.totalMissions !== 1 ? "s" : ""} postée{cp.totalMissions !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {fp && (
              <>
                {fp.bio && (
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border/30">
                    <p className="text-foreground/80 leading-relaxed">{fp.bio}</p>
                  </div>
                )}
                {fp.dailyRate && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="h-3.5 w-3.5" />Tarif journalier</span>
                    <span className="text-foreground font-semibold">{fp.dailyRate} {fp.currency}</span>
                  </div>
                )}
                {fp.category && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="h-3.5 w-3.5" />Catégorie</span>
                    <span className="text-foreground">{fp.category}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2"><Zap className="h-3.5 w-3.5" />Disponible</span>
                  <Badge className={`border-0 text-xs font-medium ${fp.available ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                    {fp.available ? "✓ Oui" : "✗ Non"}
                  </Badge>
                </div>
              </>
            )}
            {cp && (
              <>
                {cp.companySize && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Taille</span>
                    <span className="text-foreground">{cp.companySize} employés</span>
                  </div>
                )}
                {cp.industry && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Secteur</span>
                    <span className="text-foreground">{cp.industry}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Missions postées</span>
                  <span className="text-foreground font-semibold">{cp.totalMissions}</span>
                </div>
                {cp.website && (
                  <a href={cp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors pt-2">
                    <Globe className="h-3.5 w-3.5" />{cp.website}
                  </a>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {fp && fp.skills.length > 0 && (
          <Card className="bg-card/80 border-border backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-base flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Compétences & Liens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {fp.skills.map((skill) => (
                  <Badge key={skill} className="bg-lime-400/10 text-lime-400 border border-lime-400/20 hover:bg-lime-400/15 transition-colors px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 text-sm pt-2">
                {fp.portfolioUrl && (
                  <a href={fp.portfolioUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-foreground/80 hover:text-lime-400 transition-colors p-2.5 rounded-lg hover:bg-secondary/50">
                    <ExternalLink className="h-4 w-4" />Portfolio
                  </a>
                )}
                {fp.linkedinUrl && (
                  <a href={fp.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-foreground/80 hover:text-[#0A66C2] transition-colors p-2.5 rounded-lg hover:bg-[#0A66C2]/5">
                    <ExternalLink className="h-4 w-4" />LinkedIn
                  </a>
                )}
                {fp.githubUrl && (
                  <a href={fp.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-foreground/80 hover:text-foreground transition-colors p-2.5 rounded-lg hover:bg-secondary/50">
                    <ExternalLink className="h-4 w-4" />GitHub
                  </a>
                )}
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
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-yellow-400/10">
                <Star className="h-4 w-4 text-yellow-400" />
              </div>
              Avis
              <span className="text-xs text-muted-foreground font-normal ml-auto">{user.reviewsReceived.length} avis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {user.reviewsReceived.map((review) => (
                <div key={review.id} className="bg-secondary/40 rounded-xl p-4 border border-border/30 relative">
                  <Quote className="absolute top-3 right-3 h-5 w-5 text-border/50" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lime-400/20 to-emerald-400/20 flex items-center justify-center text-lime-400 text-xs font-bold shrink-0">
                      {(review.author.name || review.author.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-foreground text-sm font-medium block truncate">{review.author.name || review.author.email}</span>
                      <p className="text-muted-foreground text-xs truncate">Mission: {review.mission.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-border"}`} />
                    ))}
                  </div>
                  {review.comment && <p className="text-foreground/80 text-sm leading-relaxed">{review.comment}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
