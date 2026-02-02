"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { createProposal } from "@/lib/actions/proposal"

export function ProposalForm({ missionId }: { missionId: string }) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">Postuler à cette mission</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            setIsPending(true)
            setError("")
            try {
              await createProposal(formData)
            } catch (e: any) {
              setError(e.message || "Erreur lors de l'envoi")
              setIsPending(false)
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="missionId" value={missionId} />

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-foreground/80">Message</Label>
            <Textarea
              name="message"
              rows={4}
              placeholder="Expliquez pourquoi vous êtes le bon freelance pour cette mission..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80">Prix proposé (MAD) *</Label>
              <Input
                name="price"
                type="number"
                step="0.01"
                required
                placeholder="5000"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80">Durée estimée (jours)</Label>
              <Input
                name="estimatedDays"
                type="number"
                placeholder="15"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" />Envoyer ma proposition</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
