"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Send, StickyNote } from "lucide-react"
import { replyToTicket, addInternalNote } from "@/lib/actions/support"

export function AdminReplyForm({ ticketId }: { ticketId: string }) {
  const [replyMessage, setReplyMessage] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyMessage.trim()) return
    setIsPending(true)
    try {
      await replyToTicket(ticketId, replyMessage)
      setReplyMessage("")
      router.refresh()
    } catch {
      // ignore
    } finally {
      setIsPending(false)
    }
  }

  async function handleNote(e: React.FormEvent) {
    e.preventDefault()
    if (!noteContent.trim()) return
    setIsPending(true)
    try {
      await addInternalNote(ticketId, noteContent)
      setNoteContent("")
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
        <Tabs defaultValue="reply">
          <TabsList className="bg-neutral-950 border border-neutral-800 mb-4">
            <TabsTrigger
              value="reply"
              className="data-[state=active]:bg-lime-400/10 data-[state=active]:text-lime-400 text-neutral-400"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Répondre
            </TabsTrigger>
            <TabsTrigger
              value="note"
              className="data-[state=active]:bg-yellow-400/10 data-[state=active]:text-yellow-400 text-neutral-400"
            >
              <StickyNote className="h-3.5 w-3.5 mr-1.5" />
              Note interne
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reply">
            <form onSubmit={handleReply} className="space-y-4">
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={3}
                required
                placeholder="Votre réponse (visible par l'utilisateur)..."
                className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-lime-400/50 resize-none"
              />
              <Button
                type="submit"
                disabled={isPending || !replyMessage.trim()}
                className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Répondre
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="note">
            <form onSubmit={handleNote} className="space-y-4">
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={3}
                required
                placeholder="Note interne (visible uniquement par les admins)..."
                className="bg-neutral-950 border-yellow-400/20 text-white placeholder:text-neutral-500 focus:border-yellow-400/50 resize-none"
              />
              <Button
                type="submit"
                disabled={isPending || !noteContent.trim()}
                variant="outline"
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 font-semibold"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <StickyNote className="h-4 w-4 mr-2" />}
                Ajouter la note
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
