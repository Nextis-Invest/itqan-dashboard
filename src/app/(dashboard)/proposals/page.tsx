import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Mes propositions" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { FileText, DollarSign, Calendar, Clock, Send } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

const statusConfig: Record<string, { label: string; color: string; border: string }> = {
  PENDING: {
    label: "En attente",
    color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    border: "border-l-yellow-400",
  },
  ACCEPTED: {
    label: "Acceptée",
    color: "bg-green-400/10 text-green-400 border-green-400/20",
    border: "border-l-green-400",
  },
  REJECTED: {
    label: "Refusée",
    color: "bg-red-400/10 text-red-400 border-red-400/20",
    border: "border-l-red-400",
  },
}

export default async function ProposalsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const proposals = await prisma.proposal.findMany({
    where: { freelancerId: session.user.id },
    include: {
      mission: {
        select: {
          id: true,
          title: true,
          budget: true,
          currency: true,
          status: true,
          client: { select: { name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Send className="h-6 w-6 text-lime-400" />
          Mes propositions
        </h2>
        <p className="text-muted-foreground mt-1">
          Suivez l&apos;état de vos candidatures
        </p>
      </div>

      {/* Stats summary */}
      {proposals.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap">
          {(["PENDING", "ACCEPTED", "REJECTED"] as const).map((status) => {
            const count = proposals.filter((p) => p.status === status).length
            const cfg = statusConfig[status]
            return (
              <div key={status} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                <div className={`w-2 h-2 rounded-full ${status === "PENDING" ? "bg-yellow-400" : status === "ACCEPTED" ? "bg-green-400" : "bg-red-400"}`} />
                <span className="text-foreground/80 text-sm font-medium">{count}</span>
                <span className="text-muted-foreground text-sm">{cfg.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-base font-medium">Aucune proposition soumise</p>
          <p className="text-muted-foreground text-sm mt-1 text-center max-w-sm">
            Parcourez les missions disponibles et soumettez votre première proposition.
          </p>
          <Link href="/missions/explore" className="mt-6">
            <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold shadow-lg shadow-lime-400/10">
              Explorer les missions
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => {
            const cfg = statusConfig[proposal.status] || statusConfig.PENDING
            return (
              <div
                key={proposal.id}
                className={`group rounded-xl border border-border border-l-[3px] ${cfg.border} bg-card/80 p-5 transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Mission title */}
                    <Link
                      href={`/missions/${proposal.mission.id}`}
                      className="text-foreground font-semibold hover:text-lime-400 transition-colors text-base"
                    >
                      {proposal.mission.title}
                    </Link>

                    {/* Client */}
                    <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[9px] text-foreground/80 font-medium shrink-0">
                        {(proposal.mission.client.name?.[0] || proposal.mission.client.email[0]).toUpperCase()}
                      </div>
                      {proposal.mission.client.name || proposal.mission.client.email}
                    </p>

                    {/* Message preview */}
                    {proposal.message && (
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2 leading-relaxed">
                        {proposal.message}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      {/* Price - prominent */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-400/10 text-lime-400 text-sm font-bold">
                        <DollarSign className="h-3.5 w-3.5" />
                        {proposal.price} MAD
                      </span>

                      {proposal.estimatedDays && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock className="h-3.5 w-3.5" />
                          {proposal.estimatedDays} jours
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <Badge className={`${cfg.color} border text-xs shrink-0`}>
                    {cfg.label}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
