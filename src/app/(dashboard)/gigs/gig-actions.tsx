"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Play, Trash2, Loader2, Pencil } from "lucide-react"
import { updateGigStatus } from "@/lib/actions/gig"
import Link from "next/link"

export function GigActions({ gigId, status }: { gigId: string; status: string }) {
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex gap-1">
      <Link href={`/gigs/${gigId}/edit`}>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </Link>
      {status === "ACTIVE" && (
        <Button size="sm" variant="ghost" disabled={loading} className="h-7 w-7 p-0 text-muted-foreground hover:text-yellow-400"
          onClick={async () => { setLoading(true); await updateGigStatus(gigId, "PAUSED"); setLoading(false) }}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pause className="h-3.5 w-3.5" />}
        </Button>
      )}
      {(status === "PAUSED" || status === "DRAFT") && (
        <Button size="sm" variant="ghost" disabled={loading} className="h-7 w-7 p-0 text-muted-foreground hover:text-lime-400"
          onClick={async () => { setLoading(true); await updateGigStatus(gigId, "ACTIVE"); setLoading(false) }}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
      )}
      {status !== "DELETED" && (
        <Button size="sm" variant="ghost" disabled={loading} className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
          onClick={async () => { setLoading(true); await updateGigStatus(gigId, "DELETED"); setLoading(false) }}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
