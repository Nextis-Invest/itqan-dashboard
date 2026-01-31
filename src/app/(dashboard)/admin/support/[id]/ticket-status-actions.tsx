"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { updateTicketStatus } from "@/lib/actions/admin"

export function TicketStatusActions({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  if (currentStatus === "CLOSED") return null

  return (
    <div className="flex gap-2">
      {currentStatus !== "RESOLVED" && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          className="border-green-500/20 text-green-400 hover:bg-green-500/10"
          onClick={async () => {
            setLoading(true)
            await updateTicketStatus(ticketId, "RESOLVED")
            setLoading(false)
          }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
          Résolu
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        className="border-neutral-700 text-neutral-400 hover:bg-neutral-800"
        onClick={async () => {
          setLoading(true)
          await updateTicketStatus(ticketId, "CLOSED")
          setLoading(false)
        }}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Fermer
      </Button>
    </div>
  )
}
