"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { categories } from "@/lib/categories"
import { updateGig } from "@/lib/actions/gig"
import type { Gig } from "@prisma/client"

export function GigEditForm({ gig }: { gig: Gig }) {
  const [skills, setSkills] = useState<string[]>(gig.skills)
  const [skillInput, setSkillInput] = useState("")
  const [isPending, setIsPending] = useState(false)

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput("") }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link href="/gigs"><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <CardTitle className="text-foreground">Modifier le gig</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form action={async (formData) => {
          setIsPending(true)
          formData.set("gigId", gig.id)
          formData.set("skills", skills.join(","))
          try { await updateGig(formData) } catch { setIsPending(false) }
        }} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-foreground/80">Titre</Label>
            <Input name="title" defaultValue={gig.title} className="bg-secondary border-border text-foreground focus:border-lime-400/50" />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80">Description</Label>
            <Textarea name="description" rows={5} defaultValue={gig.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80">Catégorie</Label>
              <Select name="category" defaultValue={gig.category}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80">Délai (jours)</Label>
              <Input name="deliveryDays" type="number" defaultValue={gig.deliveryDays} className="bg-secondary border-border text-foreground focus:border-lime-400/50" />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-foreground/80 font-medium">Tarifs</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "basic", label: "Basic", price: gig.basicPrice, desc: gig.basicDesc },
                { name: "standard", label: "Standard", price: gig.standardPrice, desc: gig.standardDesc },
                { name: "premium", label: "Premium", price: gig.premiumPrice, desc: gig.premiumDesc },
              ].map((t) => (
                <div key={t.name} className="space-y-2 p-3 rounded-lg border border-border">
                  <p className="text-muted-foreground text-xs font-medium">{t.label}</p>
                  <Input name={`${t.name}Price`} type="number" step="0.01" defaultValue={t.price || ""} placeholder="Prix" className="bg-secondary border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-lime-400/50" />
                  <Input name={`${t.name}Desc`} defaultValue={t.desc || ""} placeholder="Description" className="bg-secondary border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-lime-400/50" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80">Compétences</Label>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill() } }}
                placeholder="Tapez et Entrée" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50" />
              <Button type="button" onClick={addSkill} variant="outline" className="border-border text-foreground/80 hover:bg-secondary">+</Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => <Badge key={s} className="bg-lime-400/10 text-lime-400 border-0 gap-1 cursor-pointer" onClick={() => setSkills(skills.filter((x) => x !== s))}>{s}<X className="h-3 w-3" /></Badge>)}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending} className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : <><Save className="mr-2 h-4 w-4" />Enregistrer</>}
            </Button>
            <Link href="/gigs"><Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary">Annuler</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
