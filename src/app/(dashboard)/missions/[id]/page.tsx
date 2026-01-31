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
import { ArrowLeft, Calendar, DollarSign, Tag, User, Pencil, Send, XCircle, CheckCircle, Clock, Award, MapPin, Eye } from "lucide-react"
import Link from "next/link"
import { ProposalForm } from "./proposal-form"
import { ProposalList } from "./proposal-list"
import { ReviewSection } from "./review-section"
import { MissionActions } from "./mission-actions"

export const dynamic = "force-dynamic"

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-neutral-500/10 text-neutral-400" },
  OPEN: { label: "Ouverte", color: "bg-lime-400/10 text-lime-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-400/10 text-blue-400" },
  COMPLETED: { label: "Terminée", color: "bg-green-400/10 text-green-400" },
  CANCELLED: { label: "Annulée", color: "bg-red-400/10 text-red-400" },
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
      client: { select: { id: true, name: true, email: true } },
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

  const userRole = (session.user as any).role as string
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
      <div className="flex items-center gap-4">
        <Link href="/missions">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {mission.title}
            </h2>
            <Badge className={`${status.color} border-0`}>{status.label}</Badge>
            {mission.featured && (
              <Badge className="bg-yellow-400/10 text-yellow-400 border-0">⭐ En avant</Badge>
            )}
          </div>
          <p className="text-neutral-400 mt-1">
            Par{" "}
            <Link
              href={`/profile/${mission.client.id}`}
              className="text-lime-400 hover:underline"
            >
              {mission.client.name || mission.client.email}
            </Link>
            {" · "}
            {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
            {mission.viewCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Eye className="h-3 w-3" /> {mission.viewCount} vue(s)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Client Actions */}
      {isClient && (
        <MissionActions missionId={mission.id} status={mission.status} />
      )}

      {/* Mission Details */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="pt-6 space-y-4">
          {mission.description && (
            <p className="text-neutral-300 whitespace-pre-wrap">
              {mission.description}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-800">
            {budgetDisplay && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-lime-400" />
                <div>
                  <p className="text-xs text-neutral-500">Budget</p>
                  <p className="text-white font-medium">{budgetDisplay}</p>
                  {mission.budgetType && (
                    <p className="text-[10px] text-neutral-500">
                      {mission.budgetType === "HOURLY" ? "Taux horaire" : "Prix fixe"}
                    </p>
                  )}
                </div>
              </div>
            )}
            {mission.deadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-lime-400" />
                <div>
                  <p className="text-xs text-neutral-500">Date limite</p>
                  <p className="text-white font-medium">
                    {new Date(mission.deadline).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            )}
            {mission.category && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-lime-400" />
                <div>
                  <p className="text-xs text-neutral-500">Catégorie</p>
                  <p className="text-white font-medium">{mission.category}</p>
                </div>
              </div>
            )}
            {mission.freelancer && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-lime-400" />
                <div>
                  <p className="text-xs text-neutral-500">Freelance</p>
                  <Link
                    href={`/profile/${mission.freelancer.id}`}
                    className="text-white font-medium hover:text-lime-400"
                  >
                    {mission.freelancer.name || mission.freelancer.email}
                  </Link>
                </div>
              </div>
            )}
            {mission.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-lime-400" />
                <div>
                  <p className="text-xs text-neutral-500">Durée</p>
                  <p className="text-white font-medium">{mission.duration}</p>
                </div>
              </div>
            )}
            {mission.experienceLevel && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-lime-400" />
                <div>
                  <p className="text-xs text-neutral-500">Niveau</p>
                  <p className="text-white font-medium">
                    {experienceLevelLabels[mission.experienceLevel] || mission.experienceLevel}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-lime-400" />
              <div>
                <p className="text-xs text-neutral-500">Localisation</p>
                <p className="text-white font-medium">
                  {mission.remote ? "Remote" : mission.location || "Sur site"}
                </p>
              </div>
            </div>
          </div>

          {mission.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {mission.skills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-lime-400/10 text-lime-400 border-0 text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposal Form - for freelancers on open missions */}
      {userRole === "FREELANCER" &&
        mission.status === "OPEN" &&
        !hasProposed && (
          <ProposalForm missionId={mission.id} />
        )}

      {userRole === "FREELANCER" && hasProposed && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <p className="text-neutral-400">
                ✅ Vous avez déjà soumis une proposition pour cette mission.
                {userProposal && (
                  <span className="ml-2">
                    Statut : <Badge className={`${
                      userProposal.status === "PENDING" ? "bg-yellow-400/10 text-yellow-400" :
                      userProposal.status === "ACCEPTED" ? "bg-green-400/10 text-green-400" :
                      "bg-red-400/10 text-red-400"
                    } border-0 text-xs`}>{
                      userProposal.status === "PENDING" ? "En attente" :
                      userProposal.status === "ACCEPTED" ? "Acceptée" : "Refusée"
                    }</Badge>
                  </span>
                )}
              </p>
              {userProposal?.status === "PENDING" && (
                <WithdrawProposalButton proposalId={userProposal.id} missionId={mission.id} />
              )}
            </div>
          </CardContent>
        </Card>
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
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Avis sur cette mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mission.reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">
                    {review.author.name || review.author.email}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-neutral-600"}`}>★</span>
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-neutral-300 text-sm mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Client component for withdraw proposal
import { WithdrawProposalButton } from "./withdraw-proposal-button"
