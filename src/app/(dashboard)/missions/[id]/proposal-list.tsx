"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FreelancerProfileCard, StatConfig, BadgeConfig } from "@/components/ui/freelancer-profile-card"
import { Check, X, Loader2, Star } from "lucide-react"
import { acceptProposal, rejectProposal } from "@/lib/actions/proposal"
import { useRouter } from "next/navigation"

interface Proposal {
  id: string
  message: string | null
  price: number
  estimatedDays: number | null
  status: string
  createdAt: Date
  freelancer: {
    id: string
    name: string | null
    email: string
    freelancerProfile: {
      title: string | null
      avatar: string | null
      avgRating: number | null
    } | null
  }
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-400/10 text-yellow-400",
  ACCEPTED: "bg-green-400/10 text-green-400",
  REJECTED: "bg-red-400/10 text-red-400",
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
}

export function ProposalList({
  proposals,
  missionStatus,
}: {
  proposals: Proposal[]
  missionStatus: string
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const handleAccept = async (id: string) => {
    setLoadingId(id)
    try {
      await acceptProposal(id)
    } catch {
      setLoadingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setLoadingId(id)
    try {
      await rejectProposal(id)
    } catch {
      setLoadingId(null)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">
          Propositions ({proposals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {proposals.map((proposal) => {
          const name = proposal.freelancer.name || proposal.freelancer.email
          const title = proposal.freelancer.freelancerProfile?.title || "Freelance"
          const avgRating = proposal.freelancer.freelancerProfile?.avgRating
          
          // Avatar fallback
          const avatarSrc = proposal.freelancer.freelancerProfile?.avatar || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=a3e635&color=1a1a1a`
          
          // Banner SVG
          const bannerSrc = "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23a3e635;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%23a3e635;stop-opacity:0.05'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23g)'/%3E%3C/svg%3E"
          
          // Stats
          const stats: StatConfig[] = [
            {
              icon: Star,
              value: avgRating?.toFixed(1) || "N/A",
              label: "note"
            },
            {
              value: proposal.price + " MAD",
              label: "offre"
            },
            {
              value: (proposal.estimatedDays || "—") + "j",
              label: "délai"
            }
          ]
          
          // Status badge
          const badges: BadgeConfig[] = [
            {
              label: statusLabels[proposal.status],
              className: statusColors[proposal.status]
            }
          ]

          return (
            <div key={proposal.id} className="space-y-3">
              <FreelancerProfileCard
                name={name}
                title={title}
                avatarSrc={avatarSrc}
                bannerSrc={bannerSrc}
                stats={stats}
                badges={badges}
                buttonLabel="Voir profil"
                hideBookmark={true}
                onGetInTouch={() => router.push(`/profile/${proposal.freelancer.id}`)}
                className="max-w-none"
              />

              {/* Proposal message */}
              {proposal.message && (
                <div className="px-4">
                  <p className="text-foreground/80 text-sm">{proposal.message}</p>
                </div>
              )}

              {/* Accept/Reject buttons */}
              {proposal.status === "PENDING" && missionStatus === "OPEN" && (
                <div className="flex gap-2 px-4">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(proposal.id)}
                    disabled={loadingId === proposal.id}
                    className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
                  >
                    {loadingId === proposal.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><Check className="mr-1 h-4 w-4" />Accepter</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(proposal.id)}
                    disabled={loadingId === proposal.id}
                    className="border-border text-foreground/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Refuser
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
