"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { createProposal } from "@/lib/actions/proposal"
import { ConfirmationCard } from "@/components/ui/order-confirmation-card"

export function ProposalForm({ missionId }: { missionId: string }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ price: string; estimatedDays: string } | null>(null)

  if (success) {
    return (
      <ConfirmationCard
        variant="success"
        title="Proposition envoyée !"
        subtitle="Le client a été notifié. Vous recevrez une réponse prochainement."
        details={[
          { label: "Prix proposé", value: success.price, isBold: true },
          { label: "Durée estimée", value: success.estimatedDays },
        ]}
        buttonText="Voir la demande"
        onAction={() => {
          router.refresh()
          setSuccess(null)
        }}
      />
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">Postuler à cette demande</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            setIsPending(true)
            setError("")
            try {
              const result = await createProposal(formData)
              if (result?.success) {
                const price = formData.get("price") as string
                const days = formData.get("estimatedDays") as string
                setSuccess({
                  price: `${price} MAD`,
                  estimatedDays: days ? `${days} jours` : "Non spécifié",
                })
              }
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
              placeholder="Expliquez pourquoi vous êtes l'expert idéal pour ce projet..."
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
