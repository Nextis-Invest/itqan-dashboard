"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createTicket } from "@/lib/actions/support"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Send } from "lucide-react"

export default function NewTicketPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")

  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("GENERAL")
  const [priority, setPriority] = useState("MEDIUM")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!subject.trim()) {
      setError("Le sujet est requis")
      return
    }
    if (message.length < 20) {
      setError("Le message doit contenir au moins 20 caractères")
      return
    }

    setIsPending(true)
    try {
      await createTicket({ subject, category, priority, message })
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue")
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/support">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nouveau ticket</h2>
          <p className="text-neutral-400 mt-1">Décrivez votre problème</p>
        </div>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-neutral-300">Sujet</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Résumé de votre demande"
                className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-neutral-300">Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800">
                    <SelectItem value="GENERAL">Général</SelectItem>
                    <SelectItem value="PAYMENT">Paiement</SelectItem>
                    <SelectItem value="TECHNICAL">Technique</SelectItem>
                    <SelectItem value="ACCOUNT">Compte</SelectItem>
                    <SelectItem value="MISSION">Mission</SelectItem>
                    <SelectItem value="OTHER">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-300">Priorité</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800">
                    <SelectItem value="LOW">Faible</SelectItem>
                    <SelectItem value="MEDIUM">Moyen</SelectItem>
                    <SelectItem value="HIGH">Élevé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Décrivez votre problème en détail (min. 20 caractères)"
                className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-lime-400/50 resize-none"
                required
              />
              <p className="text-neutral-500 text-xs">{message.length}/20 caractères minimum</p>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Envoyer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
