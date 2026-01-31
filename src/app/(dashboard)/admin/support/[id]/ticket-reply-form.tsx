"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { replyToTicket } from "@/lib/actions/admin"

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const [isPending, setIsPending] = useState(false)

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="pt-6">
        <form
          action={async (formData) => {
            setIsPending(true)
            try {
              await replyToTicket(formData)
            } catch {
              setIsPending(false)
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="ticketId" value={ticketId} />
          <Textarea name="message" rows={3} required placeholder="Votre réponse..." />
          <Button
            type="submit"
            disabled={isPending}
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Répondre
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
