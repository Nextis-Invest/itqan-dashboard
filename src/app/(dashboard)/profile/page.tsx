import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Mon profil" }
import { auth } from "@/lib/auth/config"
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
  Award,
  GraduationCap,
  Briefcase,
  Quote,
  Clock,
  DollarSign,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { EditProfileButton } from "./edit-profile-button"
import { ExperienceManager } from "@/components/experience-form"
import { LinkedInImportButton } from "@/components/linkedin-import-button"
import { getCertifications } from "@/lib/actions/certification"
import { getEducations } from "@/lib/actions/education"
import { getUserBadges } from "@/lib/actions/badge"
import { BadgeDisplay } from "@/components/badge-display"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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

  if (!user) redirect("/login")

  const hasProfile =
    (user.role === "FREELANCER" && user.freelancerProfile) ||
    (user.role === "CLIENT" && user.clientProfile)

  if (!hasProfile) redirect("/onboarding")

  const fp = user.freelancerProfile
  const cp = user.clientProfile
  const initials = (user.name || user.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const [certifications, educations, badges] = await Promise.all([
    getCertifications(session.user.id),
    getEducations(session.user.id),
    getUserBadges(session.user.id),
  ])

  const hasLinkedInToken = !!(session.user as any).linkedinAccessToken
  const isVerified = fp?.verified || cp?.verified

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gradient banner */}
        <div className="h-36 bg-gradient-to-r from-lime-400/20 via-emerald-400/15 to-lime-400/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(163,230,53,0.15)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(52,211,153,0.1)_0%,_transparent_60%)]" />
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")" }} />
          {/* Edit button in banner */}
          <div className="absolute top-4 right-4">
            <EditProfileButton role={user.role} />
          </div>
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
              </div>
              {fp && (
                <p className="text-lime-400 font-medium mt-1">{fp.title}</p>
              )}
              {cp?.companyName && (
                <p className="text-lime-400 font-medium mt-1">{cp.companyName}</p>
              )}

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
        {/* Bio & Details */}
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
                {cp.personType && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-foreground">{cp.personType === "MORAL" ? "Personne morale" : "Personne physique"}</span>
                  </div>
                )}
                {cp.formeJuridique && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Forme juridique</span>
                    <span className="text-foreground">{cp.formeJuridique}</span>
                  </div>
                )}
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
                {cp.ice && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground">ICE</span>
                    <span className="text-foreground font-mono text-xs">{cp.ice}</span>
                  </div>
                )}
                {cp.rc && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground">RC</span>
                    <span className="text-foreground font-mono text-xs">{cp.rc}</span>
                  </div>
                )}
                {cp.phone && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Téléphone</span>
                    <span className="text-foreground">{cp.phone}</span>
                  </div>
                )}
                {cp.address && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Adresse</span>
                    <span className="text-foreground text-right text-xs">{[cp.address, cp.city, cp.region].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Total dépensé</span>
                  <span className="text-foreground font-semibold">{cp.totalSpent} MAD</span>
                </div>
                {cp.website && (
                  <a href={cp.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors pt-2">
                    <Globe className="h-3.5 w-3.5" />{cp.website}
                  </a>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Skills & Links */}
        {fp && (
          <Card className="bg-card/80 border-border backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-base flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Compétences & Liens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {fp.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fp.skills.map((skill) => (
                    <Badge key={skill} className="bg-lime-400/10 text-lime-400 border border-lime-400/20 hover:bg-lime-400/15 transition-colors px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
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

      {/* Experience section — freelancers only */}
      {fp && (
        <div className="space-y-3">
          <LinkedInImportButton hasLinkedInToken={hasLinkedInToken} />
          <ExperienceManager experiences={fp.experiences} />
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-400/10">
                <Award className="h-4 w-4 text-amber-400" />
              </div>
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Timeline layout */}
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/40 via-amber-400/20 to-transparent" />
              <div className="space-y-5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="relative">
                    <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-amber-400/60 bg-card" />
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground text-sm font-medium">{cert.name}</p>
                        {cert.issuer && <p className="text-muted-foreground text-xs mt-0.5">{cert.issuer}</p>}
                        <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                          {cert.issueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(cert.issueDate).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                          {cert.expiryDate && (
                            <span>→ {new Date(cert.expiryDate).toLocaleDateString("fr-FR")}</span>
                          )}
                        </div>
                      </div>
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-amber-400/10 transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-400/10">
                <GraduationCap className="h-4 w-4 text-blue-400" />
              </div>
              Formation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/40 via-blue-400/20 to-transparent" />
              <div className="space-y-5">
                {educations.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-blue-400/60 bg-card" />
                    <p className="text-foreground text-sm font-medium">{edu.school}</p>
                    {(edu.degree || edu.field) && (
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {[edu.degree, edu.field].filter(Boolean).join(" — ")}
                      </p>
                    )}
                    {(edu.startYear || edu.endYear) && (
                      <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {edu.startYear || "?"} — {edu.endYear || "En cours"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      {user.reviewsReceived.length > 0 && (
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-yellow-400/10">
                <Star className="h-4 w-4 text-yellow-400" />
              </div>
              Avis reçus
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
                      <span className="text-foreground text-sm font-medium block truncate">
                        {review.author.name || review.author.email}
                      </span>
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
