"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ShieldOff, Ban, CheckCircle, Loader2 } from "lucide-react"
import { verifyUser, suspendUser } from "@/lib/actions/admin"

export function AdminUserActions({
  userId,
  verified,
  suspended,
}: {
  userId: string
  verified: boolean
  suspended: boolean
}) {
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        disabled={loading}
        className="text-neutral-400 hover:text-lime-400 h-8 w-8 p-0"
        title={verified ? "Retirer la vérification" : "Vérifier"}
        onClick={async () => {
          setLoading(true)
          await verifyUser(userId, !verified)
          setLoading(false)
        }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : verified ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={loading}
        className={`h-8 w-8 p-0 ${suspended ? "text-green-400 hover:text-green-300" : "text-neutral-400 hover:text-red-400"}`}
        title={suspended ? "Réactiver" : "Suspendre"}
        onClick={async () => {
          setLoading(true)
          await suspendUser(userId, !suspended)
          setLoading(false)
        }}
      >
        {suspended ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
      </Button>
    </div>
  )
}
