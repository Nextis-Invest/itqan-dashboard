import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BadgeDisplay } from "@/components/badge-display"
import {
  MapPin,
  Star,
  ExternalLink,
  CheckCircle,
  Award,
  GraduationCap,
  Briefcase,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>
}): Promise<Metadata> {
  const { userId } = await params
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { freelancerProfile: { select: { title: true, skills: true } } },
  })

  if (!user || !user.freelancerProfile) {
    return { title: "Portfolio — Itqan" }
  }

  const fp = user.freelancerProfile
  return {
    title: `${user.name || "Freelancer"} — ${fp.title || "Portfolio"} | Itqan`,
    description: `${fp.title || "Freelancer"} spécialisé en ${fp.skills.slice(0, 5).join(", ")}. Découvrez son portfolio sur Itqan.`,
    openGraph: {
      title: `${user.name || "Freelancer"} — ${fp.title || "Portfolio"}`,
      description: `${fp.title || "Freelancer"} sur Itqan`,
    },
  }
}

export default async function PortfolioPage({
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
      badges: true,
      reviewsReceived: {
        include: {
          author: { select: { name: true, email: true } },
          mission: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      certifications: { orderBy: { issueDate: "desc" } },
      educations: { orderBy: { startYear: "desc" } },
      gigs: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  })

  if (!user || !user.freelancerProfile) notFound()

  const fp = user.freelancerProfile
  const initials = (user.name || user.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-lime-400">Itqan</Link>
          <Link href="/login">
            <Button variant="outline" size="sm" className="border-border text-foreground/80 hover:bg-secondary">
              Se connecter
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card className="bg-card border-border">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarFallback className="bg-lime-400/10 text-lime-400 text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground">{user.name || "Freelancer"}</h1>
                  {fp.verified && <CheckCircle className="h-5 w-5 text-lime-400" />}
                  <BadgeDisplay badges={user.badges} />
                </div>
                {fp.title && <p className="text-lime-400 font-medium text-lg mt-1">{fp.title}</p>}
                <div className="flex items-center gap-4 mt-3 text-muted-foreground text-sm flex-wrap">
                  {fp.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />{fp.city}, {fp.country}
                    </span>
                  )}
                  {fp.remote && (
                    <Badge className="bg-green-400/10 text-green-400 border-0 text-xs">Remote</Badge>
                  )}
                  {fp.avgRating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      {fp.avgRating.toFixed(1)} ({user.reviewsReceived.length} avis)
                    </span>
                  )}
                  {fp.completedMissions > 0 && (
                    <span className="text-muted-foreground">{fp.completedMissions} mission(s) terminée(s)</span>
                  )}
                </div>
                {fp.bio && <p className="text-foreground/80 mt-4 max-w-2xl">{fp.bio}</p>}
                <div className="mt-4 flex gap-3">
                  <Link href={`/login?callbackUrl=/messages`}>
                    <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
                      <Mail className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                  </Link>
                  {fp.dailyRate && (
                    <Badge className="bg-secondary text-foreground border-border text-sm px-4 py-2">
                      {fp.dailyRate} {fp.currency}/jour
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        {fp.skills.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-foreground text-base">Compétences</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {fp.skills.map((skill) => (
                  <Badge key={skill} className="bg-lime-400/10 text-lime-400 border-0">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gigs */}
        {user.gigs.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Services proposés</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {user.gigs.map((gig) => (
                <Card key={gig.id} className="bg-card border-border hover:border-border transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="text-foreground font-medium line-clamp-2">{gig.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{gig.description}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{gig.basicTitle}</span>
                        <span className="text-lime-400 font-medium">{gig.basicPrice} {gig.currency}</span>
                      </div>
                      {gig.standardPrice && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{gig.standardTitle}</span>
                          <span className="text-lime-400 font-medium">{gig.standardPrice} {gig.currency}</span>
                        </div>
                      )}
                      {gig.premiumPrice && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{gig.premiumTitle}</span>
                          <span className="text-lime-400 font-medium">{gig.premiumPrice} {gig.currency}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {gig.skills.slice(0, 3).map((s) => (
                        <Badge key={s} className="bg-secondary text-muted-foreground border-0 text-xs">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Experience */}
          {fp.experiences.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-lime-400" />
                  Expérience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fp.experiences.map((exp) => (
                  <div key={exp.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="text-foreground text-sm font-medium">{exp.title}</p>
                    <p className="text-lime-400 text-xs">{exp.company}</p>
                    {exp.location && <p className="text-muted-foreground text-xs">{exp.location}</p>}
                    <p className="text-muted-foreground text-xs mt-1">
                      {exp.startDate ? new Date(exp.startDate).getFullYear() : "?"} — {exp.current ? "Présent" : exp.endDate ? new Date(exp.endDate).getFullYear() : "?"}
                    </p>
                    {exp.description && <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{exp.description}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {user.educations.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-lime-400" />
                  Formation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.educations.map((edu) => (
                  <div key={edu.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="text-foreground text-sm font-medium">{edu.school}</p>
                    {(edu.degree || edu.field) && (
                      <p className="text-muted-foreground text-xs">{[edu.degree, edu.field].filter(Boolean).join(" — ")}</p>
                    )}
                    {(edu.startYear || edu.endYear) && (
                      <p className="text-muted-foreground text-xs mt-1">{edu.startYear || "?"} — {edu.endYear || "En cours"}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Certifications */}
          {user.certifications.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-lime-400" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.certifications.map((cert) => (
                  <div key={cert.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground text-sm font-medium">{cert.name}</p>
                        {cert.issuer && <p className="text-muted-foreground text-xs">{cert.issuer}</p>}
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

          {/* Links */}
          {(fp.portfolioUrl || fp.linkedinUrl || fp.githubUrl || fp.websiteUrl) && (
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-foreground text-base">Liens</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {fp.portfolioUrl && (
                  <a href={fp.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/80 hover:text-lime-400 transition-colors text-sm">
                    <ExternalLink className="h-3.5 w-3.5" />Portfolio
                  </a>
                )}
                {fp.linkedinUrl && (
                  <a href={fp.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/80 hover:text-lime-400 transition-colors text-sm">
                    <ExternalLink className="h-3.5 w-3.5" />LinkedIn
                  </a>
                )}
                {fp.githubUrl && (
                  <a href={fp.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/80 hover:text-lime-400 transition-colors text-sm">
                    <ExternalLink className="h-3.5 w-3.5" />GitHub
                  </a>
                )}
                {fp.websiteUrl && (
                  <a href={fp.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/80 hover:text-lime-400 transition-colors text-sm">
                    <ExternalLink className="h-3.5 w-3.5" />Site web
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reviews */}
        {user.reviewsReceived.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-foreground text-base">Avis clients</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {user.reviewsReceived.map((review) => (
                <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-sm font-medium">{review.author.name || review.author.email}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">Mission: {review.mission.title}</p>
                  {review.comment && <p className="text-foreground/80 text-sm mt-2">{review.comment}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Itqan. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
