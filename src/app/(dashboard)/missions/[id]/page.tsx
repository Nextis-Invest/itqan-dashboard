import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const mission = await prisma.mission.findUnique({ where: { id }, select: { title: true } })
  return { title: mission?.title ?? "Mission" }
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, DollarSign, Tag, User, Pencil, Send, XCircle, CheckCircle, Clock, Award, MapPin, Eye, Building2, Star as StarIcon, Globe, Phone } from "lucide-react"
import Link from "next/link"
import { ProposalForm } from "./proposal-form"
import { ProposalList } from "./proposal-list"
import { ReviewSection } from "./review-section"
import { MissionActions } from "./mission-actions"

export const dynamic = "force-dynamic"

const statusLabels: Record<string, { label: string; color: string; dot: string; bg: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-muted text-muted-foreground border border-border", dot: "bg-muted-foreground", bg: "from-muted/20" },
  OPEN: { label: "Ouverte", color: "bg-lime-400/10 text-lime-400 border border-lime-400/20", dot: "bg-lime-400", bg: "from-lime-400/5" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400 border border-blue-400/20", dot: "bg-blue-400", bg: "from-blue-400/5" },
  COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400 border border-green-400/20", dot: "bg-green-400", bg: "from-green-400/5" },
  CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400 border border-red-400/20", dot: "bg-red-400", bg: "from-red-400/5" },
}

const experienceLevelLabels: Record<string, string> = {
  JUNIOR: "Junior",
  INTERMEDIATE: "Intermédiaire",
  SENIOR: "Senior",
  EXPERT: "Expert",
}

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          clientProfile: {
            select: {
              companyName: true,
              city: true,
              country: true,
              avgRating: true,
              totalMissions: true,
              totalSpent: true,
              verified: true,
              personType: true,
              industry: true,
              companySize: true,
              website: true,
              phone: true,
              contactEmail: true,
              ice: true,
              rc: true,
              formeJuridique: true,
              address: true,
              region: true,
              preferredPaymentMethod: true,
              bankName: true,
            },
          },
        },
      },
      freelancer: { select: { id: true, name: true, email: true } },
      proposals: {
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              email: true,
              freelancerProfile: {
                select: { title: true, avatar: true, avgRating: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      reviews: {
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })

  if (!mission) notFound()

  // Increment view count
  await prisma.mission.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  })

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const userRole = currentUser?.role || "CLIENT"
  const isAdmin = userRole === "ADMIN"
  const isClient = mission.clientId === session.user.id
  const isFreelancer = mission.freelancerId === session.user.id
  const status = statusLabels[mission.status] || statusLabels.DRAFT

  const userId = session.user.id!

  // Check if freelancer already proposed
  const userProposal = mission.proposals.find(
    (p) => p.freelancerId === userId
  )
  const hasProposed = !!userProposal

  // Check if user already reviewed
  const hasReviewed = mission.reviews.some(
    (r) => r.authorId === userId
  )

  // Determine review target
  let reviewTargetId: string | null = null
  if (mission.status === "COMPLETED" && !hasReviewed) {
    if (isClient && mission.freelancerId) {
      reviewTargetId = mission.freelancerId
    } else if (isFreelancer) {
      reviewTargetId = mission.clientId
    }
  }

  // Budget display
  const budgetDisplay = (() => {
    if (mission.budgetMin && mission.budgetMax) {
      return `${mission.budgetMin} - ${mission.budgetMax} ${mission.currency}`
    }
    if (mission.budget) {
      return `${mission.budget} ${mission.currency}`
    }
    return null
  })()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <Link href="/missions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour aux missions
      </Link>

      {/* Hero Section */}
      <div className={`relative rounded-2xl border border-border bg-gradient-to-br ${status.bg} to-background/0 overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={`${status.color} text-xs px-3 py-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5 inline-block`} />
                  {status.label}
                </Badge>
                {mission.featured && (
                  <Badge className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs">⭐ En avant</Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {mission.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span>
                  Par{" "}
                  <Link href={`/profile/${mission.client.id}`} className="text-lime-400 hover:underline font-medium">
                    {mission.client.name || mission.client.email}
                  </Link>
                </span>
                <span className="text-muted-foreground/60">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                </span>
                {mission.viewCount > 0 && (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {mission.viewCount} vue(s)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Budget Display - Big */}
            {budgetDisplay && (
              <div className="sm:text-right shrink-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Budget</p>
                <p className="text-2xl sm:text-3xl font-bold text-lime-400">{budgetDisplay}</p>
                {mission.budgetType && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mission.budgetType === "HOURLY" ? "Taux horaire" : "Prix fixe"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Client Actions */}
      {isClient && (
        <MissionActions missionId={mission.id} status={mission.status} />
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {mission.deadline && (
          <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Calendar className="h-3.5 w-3.5 text-lime-400" />
              Date limite
            </div>
            <p className="text-foreground font-semibold">
              {new Date(mission.deadline).toLocaleDateString("fr-FR")}
            </p>
          </div>
        )}
        {mission.category && (
          <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Tag className="h-3.5 w-3.5 text-lime-400" />
              Catégorie
            </div>
            <p className="text-foreground font-semibold">{mission.category}</p>
          </div>
        )}
        {mission.freelancer && (
          <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <User className="h-3.5 w-3.5 text-lime-400" />
              Freelance
            </div>
            <Link href={`/profile/${mission.freelancer.id}`} className="text-foreground font-semibold hover:text-lime-400 transition-colors block">
              {mission.freelancer.name || mission.freelancer.email}
            </Link>
          </div>
        )}
        {mission.duration && (
          <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="h-3.5 w-3.5 text-lime-400" />
              Durée
            </div>
            <p className="text-foreground font-semibold">{mission.duration}</p>
          </div>
        )}
        {mission.experienceLevel && (
          <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Award className="h-3.5 w-3.5 text-lime-400" />
              Niveau
            </div>
            <p className="text-foreground font-semibold">
              {experienceLevelLabels[mission.experienceLevel] || mission.experienceLevel}
            </p>
          </div>
        )}
        <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <MapPin className="h-3.5 w-3.5 text-lime-400" />
            Localisation
          </div>
          <p className="text-foreground font-semibold">
            {mission.remote ? "Remote" : mission.location || "Sur site"}
          </p>
        </div>
      </div>

      {/* Skills */}
      {mission.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mission.skills.map((skill) => (
            <Badge
              key={skill}
              className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-xs px-3 py-1"
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {/* Description Card */}
      {mission.description && (
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg shadow-black/20">
          <h3 className="text-foreground font-semibold text-base mb-3 flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-lime-400" />
            Description
          </h3>
          <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
            {mission.description}
          </p>
        </div>
      )}

      {/* Client Info Card */}
      {!isClient && mission.client.clientProfile && (
        <div className="rounded-2xl border border-border bg-card/80 overflow-hidden">
          <div className="p-6">
            <h3 className="text-foreground font-semibold text-base mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-lime-400" />
              À propos du client
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-lime-400 font-bold text-lg shrink-0">
                {(mission.client.clientProfile.companyName || mission.client.name || "C")[0].toUpperCase()}
              </div>
              <div className="flex-1 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold text-base">
                    {mission.client.clientProfile.companyName || mission.client.name || mission.client.email}
                  </span>
                  {mission.client.clientProfile.verified && (
                    <CheckCircle className="h-4 w-4 text-lime-400" />
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-muted-foreground">
                  {mission.client.clientProfile.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {mission.client.clientProfile.city}
                    </span>
                  )}
                  {mission.client.clientProfile.avgRating !== null && mission.client.clientProfile.avgRating !== undefined && (
                    <span className="flex items-center gap-1">
                      <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      {mission.client.clientProfile.avgRating.toFixed(1)}
                    </span>
                  )}
                  <span>{mission.client.clientProfile.totalMissions} mission(s) postée(s)</span>
                  {mission.client.clientProfile.industry && (
                    <span>{mission.client.clientProfile.industry}</span>
                  )}
                </div>

                {/* Admin sees everything */}
                {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-border space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Infos admin</p>
                    {mission.client.clientProfile.personType && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="text-foreground/80">{mission.client.clientProfile.personType === "MORAL" ? "Personne morale" : "Personne physique"}</span>
                      </div>
                    )}
                    {mission.client.clientProfile.formeJuridique && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Forme juridique</span>
                        <span className="text-foreground/80">{mission.client.clientProfile.formeJuridique}</span>
                      </div>
                    )}
                    {mission.client.clientProfile.companySize && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taille</span>
                        <span className="text-foreground/80">{mission.client.clientProfile.companySize} employés</span>
                      </div>
                    )}
                    {mission.client.clientProfile.ice && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ICE</span>
                        <span className="text-foreground/80 font-mono text-xs">{mission.client.clientProfile.ice}</span>
                      </div>
                    )}
                    {mission.client.clientProfile.rc && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RC</span>
                        <span className="text-foreground/80 font-mono text-xs">{mission.client.clientProfile.rc}</span>
                      </div>
                    )}
                    {mission.client.clientProfile.totalSpent > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total dépensé</span>
                        <span className="text-foreground/80">{mission.client.clientProfile.totalSpent.toLocaleString("fr-FR")} MAD</span>
                      </div>
                    )}
                    {mission.client.clientProfile.phone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Téléphone</span>
                        <span className="text-foreground/80">{mission.client.clientProfile.phone}</span>
                      </div>
                    )}
                    {mission.client.clientProfile.contactEmail && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email contact</span>
                        <span className="text-foreground/80">{mission.client.clientProfile.contactEmail}</span>
                      </div>
                    )}
                    {mission.client.clientProfile.website && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Site web</span>
                        <a href={mission.client.clientProfile.website} target="_blank" rel="noopener noreferrer" className="text-lime-400 text-xs hover:underline">
                          {mission.client.clientProfile.website}
                        </a>
                      </div>
                    )}
                    {mission.client.clientProfile.address && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Adresse</span>
                        <span className="text-foreground/80 text-right text-xs">
                          {[mission.client.clientProfile.address, mission.client.clientProfile.city, mission.client.clientProfile.region].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                    {mission.client.clientProfile.preferredPaymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paiement préféré</span>
                        <span className="text-foreground/80">{mission.client.clientProfile.preferredPaymentMethod}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <Link href={`/admin/users/${mission.client.id}`} className="text-lime-400 text-xs hover:underline">
                        Voir fiche complète →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Form - for freelancers on open missions */}
      {userRole === "FREELANCER" &&
        mission.status === "OPEN" &&
        !hasProposed && (
          <ProposalForm missionId={mission.id} />
        )}

      {userRole === "FREELANCER" && hasProposed && (
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-lime-400" />
              </div>
              <div>
                <p className="text-foreground font-medium">Proposition soumise</p>
                <p className="text-muted-foreground text-sm">
                  Statut :{" "}
                  <Badge className={`${
                    userProposal?.status === "PENDING" ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" :
                    userProposal?.status === "ACCEPTED" ? "bg-green-400/10 text-green-400 border-green-400/20" :
                    "bg-red-400/10 text-red-400 border-red-400/20"
                  } border text-xs`}>{
                    userProposal?.status === "PENDING" ? "En attente" :
                    userProposal?.status === "ACCEPTED" ? "Acceptée" : "Refusée"
                  }</Badge>
                </p>
              </div>
            </div>
            {userProposal?.status === "PENDING" && (
              <WithdrawProposalButton proposalId={userProposal.id} missionId={mission.id} />
            )}
          </div>
        </div>
      )}

      {/* Proposals - for mission owner */}
      {isClient && mission.proposals.length > 0 && (
        <ProposalList
          proposals={mission.proposals}
          missionStatus={mission.status}
        />
      )}

      {/* Review Section */}
      {mission.status === "COMPLETED" && reviewTargetId && (
        <ReviewSection missionId={mission.id} targetUserId={reviewTargetId} />
      )}

      {/* Existing reviews */}
      {mission.reviews.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/80 overflow-hidden">
          <div className="p-6">
            <h3 className="text-foreground font-semibold text-base mb-4 flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-yellow-400" />
              Avis sur cette mission
            </h3>
            <div className="space-y-4">
              {mission.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground text-sm font-medium">
                      {review.author.name || review.author.email}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-foreground/80 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Client component for withdraw proposal
import { WithdrawProposalButton } from "./withdraw-proposal-button"
