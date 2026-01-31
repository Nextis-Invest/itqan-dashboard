import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Mes propositions" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

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
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Mes propositions
        </h2>
        <p className="text-neutral-400 mt-1">
          Suivez l&apos;état de vos candidatures
        </p>
      </div>

      {proposals.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Vous n&apos;avez pas encore soumis de proposition.</p>
              <Link
                href="/missions"
                className="text-lime-400 hover:underline mt-2 inline-block"
              >
                Parcourir les missions
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Link
                      href={`/missions/${proposal.mission.id}`}
                      className="text-white font-medium hover:text-lime-400 transition-colors"
                    >
                      {proposal.mission.title}
                    </Link>
                    <p className="text-neutral-500 text-sm">
                      Client:{" "}
                      {proposal.mission.client.name ||
                        proposal.mission.client.email}
                    </p>
                  </div>
                  <Badge
                    className={`${statusColors[proposal.status]} border-0`}
                  >
                    {statusLabels[proposal.status]}
                  </Badge>
                </div>

                <div className="flex gap-6 mt-3 text-sm">
                  <div>
                    <span className="text-neutral-500">Prix proposé: </span>
                    <span className="text-white font-medium">
                      {proposal.price} MAD
                    </span>
                  </div>
                  {proposal.estimatedDays && (
                    <div>
                      <span className="text-neutral-500">Durée: </span>
                      <span className="text-white">
                        {proposal.estimatedDays} jours
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-neutral-500">Envoyée le: </span>
                    <span className="text-white">
                      {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                {proposal.message && (
                  <p className="text-neutral-400 text-sm mt-2 line-clamp-2">
                    {proposal.message}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
