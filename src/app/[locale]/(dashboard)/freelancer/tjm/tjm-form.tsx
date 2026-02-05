"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { updateFreelancerProfile } from "@/lib/actions/profile"
import type { FreelancerProfile } from "@prisma/client"

export function TjmForm({ profile }: { profile: FreelancerProfile }) {
  const [isPending, setIsPending] = useState(false)
  const [isAvailable, setIsAvailable] = useState(profile.available)

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Tarifs</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              setIsPending(true)
              formData.set("skills", profile.skills.join(","))
              formData.set("title", profile.title || "")
              formData.set("bio", profile.bio || "")
              formData.set("category", profile.category || "")
              formData.set("city", profile.city || "")
              formData.set("remote", profile.remote ? "true" : "false")
              formData.set("available", isAvailable ? "true" : "false")
              formData.set("portfolioUrl", profile.portfolioUrl || "")
              formData.set("linkedinUrl", profile.linkedinUrl || "")
              formData.set("githubUrl", profile.githubUrl || "")
              formData.set("websiteUrl", profile.websiteUrl || "")
              try { await updateFreelancerProfile(formData) } catch { setIsPending(false) }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Tarif journalier (TJM)</Label>
                <Input name="dailyRate" type="number" step="0.01" defaultValue={profile.dailyRate || ""} className="bg-secondary border-border text-foreground focus:border-lime-400/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Tarif horaire</Label>
                <Input name="hourlyRate" type="number" step="0.01" defaultValue={profile.hourlyRate || ""} className="bg-secondary border-border text-foreground focus:border-lime-400/50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80">Devise</Label>
              <Select name="currency" defaultValue={profile.currency}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  <SelectItem value="MAD">MAD (د.م.)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
              <h4 className="text-foreground font-medium">Disponibilité</h4>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsAvailable(!isAvailable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAvailable ? "bg-lime-400" : "bg-secondary"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <Label className="text-foreground/80">{isAvailable ? "Disponible" : "Non disponible"}</Label>
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : <><Save className="mr-2 h-4 w-4" />Enregistrer</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Rate Preview */}
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-foreground text-sm">Aperçu tarifs</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-muted-foreground text-xs">Horaire</p>
              <p className="text-foreground font-bold">{profile.hourlyRate || "—"} {profile.currency}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-muted-foreground text-xs">Journalier</p>
              <p className="text-lime-400 font-bold">{profile.dailyRate || "—"} {profile.currency}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-muted-foreground text-xs">Mensuel (est.)</p>
              <p className="text-foreground font-bold">{profile.dailyRate ? `${(profile.dailyRate * 22).toLocaleString()} ${profile.currency}` : "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
