"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Send, XCircle, CheckCircle, Loader2 } from "lucide-react"

export function MissionActions({
  missionId,
  status,
}: {
  missionId: string
  status: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "CANCELLED" && !confirm("Êtes-vous sûr de vouloir annuler cette mission ?")) return
    if (newStatus === "COMPLETED" && !confirm("Marquer cette mission comme terminée ?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/missions/${missionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const showEdit = status === "DRAFT" || status === "OPEN"
  const showPublish = status === "DRAFT"
  const showComplete = status === "IN_PROGRESS"
  const showCancel = status === "DRAFT" || status === "OPEN"

  if (!showEdit && !showPublish && !showComplete && !showCancel) return null

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          {showEdit && (
            <Link href={`/missions/${missionId}/edit`}>
              <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </Link>
          )}
          {showPublish && (
            <Button
              onClick={() => handleStatusChange("OPEN")}
              disabled={loading}
              className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Publier
            </Button>
          )}
          {showComplete && (
            <Button
              onClick={() => handleStatusChange("COMPLETED")}
              disabled={loading}
              className="bg-green-500 text-white hover:bg-green-400 font-semibold"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Marquer comme terminée
            </Button>
          )}
          {showCancel && (
            <Button
              onClick={() => handleStatusChange("CANCELLED")}
              disabled={loading}
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Annuler la mission
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
