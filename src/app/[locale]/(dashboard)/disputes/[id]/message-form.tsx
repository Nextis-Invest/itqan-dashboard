"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { addDisputeMessage } from "@/lib/actions/dispute"
import { useRouter } from "next/navigation"

export function DisputeMessageForm({ disputeId }: { disputeId: string }) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true)
    try {
      await addDisputeMessage(disputeId, content.trim())
      setContent("")
      router.refresh()
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="rounded-xl bg-card/80 border border-border/80 p-5">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Ajouter un message..."
        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground mb-3 rounded-xl focus-visible:ring-lime-400/30 focus-visible:border-lime-400/30 resize-none"
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold rounded-xl shadow-lg shadow-lime-400/20 disabled:shadow-none"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          Envoyer
        </Button>
      </div>
    </div>
  )
}
