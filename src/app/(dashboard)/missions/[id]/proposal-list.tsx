"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, X, Loader2, Star } from "lucide-react"
import { acceptProposal, rejectProposal } from "@/lib/actions/proposal"
import Link from "next/link"

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
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white text-base">
          Propositions ({proposals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {proposals.map((proposal) => {
          const initials = (proposal.freelancer.name || proposal.freelancer.email)
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)

          return (
            <div
              key={proposal.id}
              className="border border-neutral-800 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-neutral-700">
                    <AvatarFallback className="bg-lime-400/10 text-lime-400 text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/profile/${proposal.freelancer.id}`}
                      className="text-white font-medium hover:text-lime-400 transition-colors"
                    >
                      {proposal.freelancer.name || proposal.freelancer.email}
                    </Link>
                    {proposal.freelancer.freelancerProfile?.title && (
                      <p className="text-neutral-500 text-xs">
                        {proposal.freelancer.freelancerProfile.title}
                      </p>
                    )}
                    {proposal.freelancer.freelancerProfile?.avgRating && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-neutral-400 text-xs">
                          {proposal.freelancer.freelancerProfile.avgRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={`${statusColors[proposal.status]} border-0`}>
                  {statusLabels[proposal.status]}
                </Badge>
              </div>

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-neutral-500">Prix: </span>
                  <span className="text-white font-medium">{proposal.price} MAD</span>
                </div>
                {proposal.estimatedDays && (
                  <div>
                    <span className="text-neutral-500">Durée: </span>
                    <span className="text-white">{proposal.estimatedDays} jours</span>
                  </div>
                )}
              </div>

              {proposal.message && (
                <p className="text-neutral-300 text-sm">{proposal.message}</p>
              )}

              {proposal.status === "PENDING" && missionStatus === "OPEN" && (
                <div className="flex gap-2 pt-2">
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
                    className="border-neutral-700 text-neutral-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
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
