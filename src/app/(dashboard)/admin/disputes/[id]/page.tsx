import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = { title: "Gestion du litige" }
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DisputeActions } from "./dispute-actions"

export const dynamic = "force-dynamic"

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: {
      mission: {
        include: {
          client: { select: { id: true, name: true, email: true } },
          freelancer: { select: { id: true, name: true, email: true } },
        },
      },
      openedBy: { select: { name: true, email: true } },
    },
  })

  if (!dispute) notFound()

  const statusColors: Record<string, string> = {
    OPEN: "bg-red-400/10 text-red-400",
    UNDER_REVIEW: "bg-yellow-400/10 text-yellow-400",
    RESOLVED: "bg-green-400/10 text-green-400",
    CLOSED: "bg-neutral-500/10 text-neutral-400",
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/disputes">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Détail du litige</h2>
          <Badge className={`${statusColors[dispute.status]} border-0 mt-1`}>{dispute.status}</Badge>
        </div>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader><CardTitle className="text-white">Mission</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Mission</span>
            <Link href={`/missions/${dispute.mission.id}`} className="text-lime-400 hover:underline">{dispute.mission.title}</Link>
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
            {dispute.adminNotes && (
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <p className="text-neutral-500 text-xs mb-1">Notes admin</p>
                <p className="text-neutral-400 text-sm">{dispute.adminNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(dispute.status === "OPEN" || dispute.status === "UNDER_REVIEW") && (
        <DisputeActions disputeId={dispute.id} />
      )}
    </div>
  )
}
