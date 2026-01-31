"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { replyToTicket } from "@/lib/actions/support"
import { useRouter } from "next/navigation"

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const [message, setMessage] = useState("")
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setIsPending(true)
    try {
      await replyToTicket(ticketId, message)
      setMessage("")
      router.refresh()
    } catch {
      // ignore
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
            placeholder="Votre réponse..."
            className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-lime-400/50 resize-none"
          />
          <Button
            type="submit"
            disabled={isPending || !message.trim()}
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
