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

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mon profil</h2>
          <p className="text-neutral-400 mt-1">Gérez vos informations</p>
        </div>
        <EditProfileButton role={user.role} />
      </div>

      {/* Profile Header */}
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
                <h3 className="text-xl font-bold text-white">
                  {user.name || user.email}
                </h3>
                {(fp?.verified || cp?.verified) && (
                  <CheckCircle className="h-5 w-5 text-lime-400" />
                )}
                <BadgeDisplay badges={badges} />
              </div>
              {fp && (
                <p className="text-lime-400 font-medium mt-1">{fp.title}</p>
              )}
              {cp?.companyName && (
                <p className="text-lime-400 font-medium mt-1">{cp.companyName}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-neutral-400 text-sm">
                {(fp?.city || cp?.city) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {fp?.city || cp?.city}
                  </span>
                )}
                {fp?.remote && (
                  <Badge className="bg-green-400/10 text-green-400 border-0 text-xs">
                    Remote
                  </Badge>
                )}
                {fp?.avgRating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    {fp.avgRating.toFixed(1)}
                  </span>
                )}
                {cp?.avgRating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    {cp.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Details */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Informations</CardTitle>
          </CardHeader>
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
                {cp.personType && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Type</span>
                    <span className="text-white">{cp.personType === "MORAL" ? "Personne morale" : "Personne physique"}</span>
                  </div>
                )}
                {cp.formeJuridique && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Forme juridique</span>
                    <span className="text-white">{cp.formeJuridique}</span>
                  </div>
                )}
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
                {cp.ice && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">ICE</span>
                    <span className="text-white font-mono text-xs">{cp.ice}</span>
                  </div>
                )}
                {cp.rc && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">RC</span>
                    <span className="text-white font-mono text-xs">{cp.rc}</span>
                  </div>
                )}
                {cp.phone && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Téléphone</span>
                    <span className="text-white">{cp.phone}</span>
                  </div>
                )}
                {cp.address && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Adresse</span>
                    <span className="text-white text-right text-xs">{[cp.address, cp.city, cp.region].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Missions postées</span>
                  <span className="text-white">{cp.totalMissions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total dépensé</span>
                  <span className="text-white">{cp.totalSpent} MAD</span>
                </div>
                {cp.website && (
                  <a href={cp.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-lime-400 hover:underline">
                    <Globe className="h-3.5 w-3.5" />{cp.website}
                  </a>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Skills & Links */}
        {fp && (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white text-base">Compétences & Liens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fp.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fp.skills.map((skill) => (
                    <Badge key={skill} className="bg-lime-400/10 text-lime-400 border-0">{skill}</Badge>
                  ))}
                </div>
              )}
              <div className="space-y-2 text-sm">
                {fp.portfolioUrl && (
                  <a href={fp.portfolioUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-300 hover:text-lime-400 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />Portfolio
                  </a>
                )}
                {fp.linkedinUrl && (
                  <a href={fp.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-300 hover:text-lime-400 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />LinkedIn
                  </a>
                )}
                {fp.githubUrl && (
                  <a href={fp.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-300 hover:text-lime-400 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />GitHub
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
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-lime-400" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="border-b border-neutral-800 pb-3 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{cert.name}</p>
                    {cert.issuer && <p className="text-neutral-400 text-xs">{cert.issuer}</p>}
                    <div className="flex gap-3 mt-1 text-xs text-neutral-500">
                      {cert.issueDate && (
                        <span>Obtenue le {new Date(cert.issueDate).toLocaleDateString("fr-FR")}</span>
                      )}
                      {cert.expiryDate && (
                        <span>Expire le {new Date(cert.expiryDate).toLocaleDateString("fr-FR")}</span>
                      )}
                    </div>
                  </div>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:text-lime-300">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-lime-400" />
              Formation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {educations.map((edu) => (
              <div key={edu.id} className="border-b border-neutral-800 pb-3 last:border-0 last:pb-0">
                <p className="text-white text-sm font-medium">{edu.school}</p>
                {(edu.degree || edu.field) && (
                  <p className="text-neutral-400 text-xs">
                    {[edu.degree, edu.field].filter(Boolean).join(" — ")}
                  </p>
                )}
                {(edu.startYear || edu.endYear) && (
                  <p className="text-neutral-500 text-xs mt-1">
                    {edu.startYear || "?"} — {edu.endYear || "En cours"}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      {user.reviewsReceived.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Avis reçus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.reviewsReceived.map((review) => (
              <div key={review.id} className="border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">
                    {review.author.name || review.author.email}
                  </span>
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
