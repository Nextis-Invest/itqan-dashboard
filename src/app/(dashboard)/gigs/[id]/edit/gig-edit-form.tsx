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
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link href="/gigs"><Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <CardTitle className="text-white">Modifier le gig</CardTitle>
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
            <Label className="text-neutral-300">Titre</Label>
            <Input name="title" defaultValue={gig.title} className="bg-neutral-800 border-neutral-700 text-white focus:border-lime-400/50" />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Description</Label>
            <Textarea name="description" rows={5} defaultValue={gig.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Catégorie</Label>
              <Select name="category" defaultValue={gig.category}>
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Délai (jours)</Label>
              <Input name="deliveryDays" type="number" defaultValue={gig.deliveryDays} className="bg-neutral-800 border-neutral-700 text-white focus:border-lime-400/50" />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-neutral-300 font-medium">Tarifs</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "basic", label: "Basic", price: gig.basicPrice, desc: gig.basicDesc },
                { name: "standard", label: "Standard", price: gig.standardPrice, desc: gig.standardDesc },
                { name: "premium", label: "Premium", price: gig.premiumPrice, desc: gig.premiumDesc },
              ].map((t) => (
                <div key={t.name} className="space-y-2 p-3 rounded-lg border border-neutral-800">
                  <p className="text-neutral-400 text-xs font-medium">{t.label}</p>
                  <Input name={`${t.name}Price`} type="number" step="0.01" defaultValue={t.price || ""} placeholder="Prix" className="bg-neutral-800 border-neutral-700 text-white text-sm placeholder:text-neutral-500 focus:border-lime-400/50" />
                  <Input name={`${t.name}Desc`} defaultValue={t.desc || ""} placeholder="Description" className="bg-neutral-800 border-neutral-700 text-white text-sm placeholder:text-neutral-500 focus:border-lime-400/50" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Compétences</Label>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill() } }}
                placeholder="Tapez et Entrée" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50" />
              <Button type="button" onClick={addSkill} variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">+</Button>
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
            <Link href="/gigs"><Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-neutral-800">Annuler</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
