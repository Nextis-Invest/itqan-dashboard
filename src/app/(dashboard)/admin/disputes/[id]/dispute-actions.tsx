"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { resolveDispute, closeDispute } from "@/lib/actions/admin"

export function DisputeActions({ disputeId }: { disputeId: string }) {
  const [resolution, setResolution] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [loading, setLoading] = useState(false)

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader><CardTitle className="text-white">Actions</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-neutral-300">Résolution</Label>
          <Textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            rows={3}
            placeholder="Décision prise..."
          />
        </div>
        <div className="space-y-2">
          <Label className="text-neutral-300">Notes admin (internes)</Label>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={2}
            placeholder="Notes internes..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            disabled={loading || !resolution}
            onClick={async () => {
              setLoading(true)
              await resolveDispute(disputeId, resolution, adminNotes)
              setLoading(false)
            }}
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Résoudre
          </Button>
          <Button
            disabled={loading}
            variant="outline"
            onClick={async () => {
              setLoading(true)
              await closeDispute(disputeId)
              setLoading(false)
            }}
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          >
            Fermer sans résolution
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
