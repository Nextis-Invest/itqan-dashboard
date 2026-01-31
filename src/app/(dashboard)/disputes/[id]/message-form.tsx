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
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="pt-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Ajouter un message..."
          className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 mb-3"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Envoyer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
