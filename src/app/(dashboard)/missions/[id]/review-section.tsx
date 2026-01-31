"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Star } from "lucide-react"
import { createReview } from "@/lib/actions/review"

export function ReviewSection({
  missionId,
  targetUserId,
}: {
  missionId: string
  targetUserId: string
}) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white text-base">Laisser un avis</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            if (rating === 0) {
              setError("Veuillez sélectionner une note")
              return
            }
            setIsPending(true)
            setError("")
            formData.set("rating", rating.toString())
            try {
              await createReview(formData)
            } catch (e: any) {
              setError(e.message || "Erreur")
              setIsPending(false)
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="missionId" value={missionId} />
          <input type="hidden" name="targetUserId" value={targetUserId} />

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-neutral-300">Note</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-neutral-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Commentaire</Label>
            <Textarea
              name="comment"
              rows={3}
              placeholder="Partagez votre expérience..."
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi...</>
            ) : (
              "Publier l'avis"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
