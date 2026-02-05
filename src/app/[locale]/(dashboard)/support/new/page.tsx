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
import { ConfirmationCard } from "@/components/ui/order-confirmation-card"

const categoryLabels: Record<string, string> = {
  GENERAL: "Général",
  PAYMENT: "Paiement",
  TECHNICAL: "Technique",
  ACCOUNT: "Compte",
  MISSION: "Mission",
  OTHER: "Autre",
}

const priorityLabels: Record<string, string> = {
  LOW: "Faible",
  MEDIUM: "Moyen",
  HIGH: "Élevé",
}

export default function NewTicketPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ subject: string; category: string; priority: string } | null>(null)

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
      const result = await createTicket({ subject, category, priority, message })
      if (result?.success) {
        setSuccess({
          subject,
          category: categoryLabels[category] || category,
          priority: priorityLabels[priority] || priority,
        })
      }
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue")
      setIsPending(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ConfirmationCard
          variant="success"
          title="Ticket envoyé !"
          subtitle="Notre équipe de support va traiter votre demande dans les meilleurs délais."
          details={[
            { label: "Sujet", value: success.subject },
            { label: "Catégorie", value: success.category },
            { label: "Priorité", value: success.priority },
            { label: "Statut", value: "Ouvert" },
          ]}
          buttonText="Voir mes tickets"
          onAction={() => router.push("/support")}
          secondaryButtonText="Retour au tableau de bord"
          onSecondaryAction={() => router.push("/dashboard")}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/support">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Nouveau ticket</h2>
          <p className="text-muted-foreground mt-1">Décrivez votre problème</p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground/80">Sujet</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Résumé de votre demande"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
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
                <Label className="text-foreground/80">Priorité</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="LOW">Faible</SelectItem>
                    <SelectItem value="MEDIUM">Moyen</SelectItem>
                    <SelectItem value="HIGH">Élevé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80">Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Décrivez votre problème en détail (min. 20 caractères)"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50 resize-none"
                required
              />
              <p className="text-muted-foreground text-xs">{message.length}/20 caractères minimum</p>
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
