"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { XCircle, Loader2 } from "lucide-react"
import { deleteMissionAdmin } from "@/lib/actions/admin"

export function AdminMissionActions({ missionId, status }: { missionId: string; status: string }) {
  const [loading, setLoading] = useState(false)

  if (status === "CANCELLED") return null

  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={loading}
      className="text-neutral-400 hover:text-red-400 h-8 w-8 p-0"
      title="Annuler la mission"
      onClick={async () => {
        setLoading(true)
        await deleteMissionAdmin(missionId)
        setLoading(false)
      }}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
    </Button>
  )
}
