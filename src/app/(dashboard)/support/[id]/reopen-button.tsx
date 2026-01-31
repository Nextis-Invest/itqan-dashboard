"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RotateCcw } from "lucide-react"
import { reopenTicket } from "@/lib/actions/support"
import { useRouter } from "next/navigation"

export function ReopenButton({ ticketId }: { ticketId: string }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  return (
    <Button
      variant="outline"
      disabled={isPending}
      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
      onClick={async () => {
        setIsPending(true)
        try {
          await reopenTicket(ticketId)
          router.refresh()
        } catch {
          setIsPending(false)
        }
      }}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
      Rouvrir le ticket
    </Button>
  )
}
