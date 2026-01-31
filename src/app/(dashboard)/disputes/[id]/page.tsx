import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"

export const metadata: Metadata = { title: "Détail du litige" }
import { getDisputeById } from "@/lib/actions/dispute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouvert", color: "bg-red-400/10 text-red-400" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-400/10 text-yellow-400" },
  RESOLVED: { label: "Résolu", color: "bg-green-400/10 text-green-400" },
  CLOSED: { label: "Fermé", color: "bg-neutral-500/10 text-neutral-400" },
}

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const dispute = await getDisputeById(id)
  if (!dispute) notFound()

  const st = statusMap[dispute.status] || statusMap.OPEN

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/disputes">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Détail du litige</h2>
          <Badge className={`${st.color} border-0 mt-1`}>{st.label}</Badge>
        </div>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader><CardTitle className="text-white">Mission</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Mission</span>
            <Link href={`/missions/${dispute.mission.id}`} className="text-lime-400 hover:underline">
              {dispute.mission.title}
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Client</span>
            <span className="text-white">{dispute.mission.client.name || dispute.mission.client.email}</span>
          </div>
          {dispute.mission.freelancer && (
            <div className="flex justify-between">
              <span className="text-neutral-400">Freelance</span>
              <span className="text-white">{dispute.mission.freelancer.name || dispute.mission.freelancer.email}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-400">Ouvert par</span>
            <span className="text-white">{dispute.openedBy.name || dispute.openedBy.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Date</span>
            <span className="text-white">{new Date(dispute.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader><CardTitle className="text-white">Raison</CardTitle></CardHeader>
        <CardContent>
          <p className="text-neutral-300 text-sm whitespace-pre-wrap">{dispute.reason}</p>
        </CardContent>
      </Card>

      {dispute.resolution && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader><CardTitle className="text-white">Résolution</CardTitle></CardHeader>
          <CardContent>
            <p className="text-neutral-300 text-sm whitespace-pre-wrap">{dispute.resolution}</p>
            {dispute.resolvedAt && (
              <p className="text-neutral-500 text-xs mt-3">
                Résolu le {new Date(dispute.resolvedAt).toLocaleDateString("fr-FR")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {(dispute.status === "OPEN" || dispute.status === "UNDER_REVIEW") && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-6">
            <p className="text-neutral-400 text-sm text-center">
              Ce litige est en cours de traitement par l&apos;équipe Itqan. Vous serez notifié de la résolution.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
