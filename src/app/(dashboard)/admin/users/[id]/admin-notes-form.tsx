"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Shield } from "lucide-react"

export function AdminNotesForm({
  userId,
  currentNotes,
}: {
  userId: string
  currentNotes: string | null
}) {
  const [isPending, setIsPending] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base flex items-center gap-2">
          <Shield className="h-4 w-4 text-lime-400" />
          Notes admin (privées)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            setIsPending(true)
            setSaved(false)
            try {
              const res = await fetch("/api/admin/client-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId,
                  notes: formData.get("adminNotes") as string,
                }),
              })
              if (res.ok) setSaved(true)
            } finally {
              setIsPending(false)
            }
          }}
          className="space-y-3"
        >
          <Textarea
            name="adminNotes"
            defaultValue={currentNotes || ""}
            placeholder="Notes internes sur ce client..."
            rows={4}
            className="bg-secondary border-border text-foreground focus:border-lime-400/50 resize-y"
          />
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isPending}
              size="sm"
              className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Sauvegarder
                </>
              )}
            </Button>
            {saved && (
              <span className="text-green-400 text-sm">✓ Sauvegardé</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
