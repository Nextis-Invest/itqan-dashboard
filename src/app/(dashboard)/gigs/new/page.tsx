"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Loader2, Save, X, Package } from "lucide-react"
import Link from "next/link"
import { categories } from "@/lib/categories"
import { createGig } from "@/lib/actions/gig"

export default function NewGigPage() {
  const [step, setStep] = useState(1)
  const [isPending, setIsPending] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")

  // Step 1
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")

  // Step 2
  const [basicPrice, setBasicPrice] = useState("")
  const [basicDesc, setBasicDesc] = useState("")
  const [standardPrice, setStandardPrice] = useState("")
  const [standardDesc, setStandardDesc] = useState("")
  const [premiumPrice, setPremiumPrice] = useState("")
  const [premiumDesc, setPremiumDesc] = useState("")

  // Step 3
  const [description, setDescription] = useState("")
  const [deliveryDays, setDeliveryDays] = useState("7")

  const subcats = categories.find((c) => c.value === category)?.subcategories || []

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput("") }
  }

  const canNext = () => {
    if (step === 1) return title.trim() && category
    if (step === 2) return basicPrice && parseFloat(basicPrice) > 0
    if (step === 3) return description.trim()
    return true
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/gigs">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Créer un Gig</h2>
          <p className="text-muted-foreground mt-1">Étape {step} sur 4</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-lime-400" : "bg-secondary"}`} />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Titre & Catégorie</CardTitle>
            <CardDescription className="text-muted-foreground">Donnez un titre accrocheur à votre service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80">Titre du gig *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Je vais créer votre site web React" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Catégorie *</Label>
                <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory("") }}>
                  <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Sous-catégorie</Label>
                <Select value={subcategory} onValueChange={setSubcategory} disabled={!subcats.length}>
                  <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    {subcats.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Pricing */}
      {step === 2 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Tarification</CardTitle>
            <CardDescription className="text-muted-foreground">Définissez vos paliers de prix (style Fiverr)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Basic", price: basicPrice, setPrice: setBasicPrice, desc: basicDesc, setDesc: setBasicDesc, required: true },
              { label: "Standard", price: standardPrice, setPrice: setStandardPrice, desc: standardDesc, setDesc: setStandardDesc, required: false },
              { label: "Premium", price: premiumPrice, setPrice: setPremiumPrice, desc: premiumDesc, setDesc: setPremiumDesc, required: false },
            ].map((tier) => (
              <div key={tier.label} className="p-4 rounded-lg border border-border space-y-3">
                <h4 className="text-foreground font-medium">{tier.label} {tier.required && <span className="text-lime-400">*</span>}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Prix (MAD)</Label>
                    <Input type="number" step="0.01" value={tier.price} onChange={(e) => tier.setPrice(e.target.value)} placeholder="500" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Description</Label>
                    <Input value={tier.desc} onChange={(e) => tier.setDesc(e.target.value)} placeholder="Ce qui est inclus..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Description & Skills */}
      {step === 3 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Description & Compétences</CardTitle>
            <CardDescription className="text-muted-foreground">Décrivez votre service en détail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80">Description *</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Décrivez votre service, ce que le client recevra, votre processus..." />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80">Compétences</Label>
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill() } }}
                  placeholder="Tapez et appuyez Entrée" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50" />
                <Button type="button" onClick={addSkill} variant="outline" className="border-border text-foreground/80 hover:bg-secondary">+</Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((s) => (
                    <Badge key={s} className="bg-lime-400/10 text-lime-400 border-0 gap-1 cursor-pointer" onClick={() => setSkills(skills.filter((x) => x !== s))}>{s}<X className="h-3 w-3" /></Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80">Délai de livraison (jours)</Label>
              <Input type="number" value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} className="bg-secondary border-border text-foreground focus:border-lime-400/50" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Preview */}
      {step === 4 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2"><Package className="h-5 w-5 text-lime-400" />Aperçu du Gig</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-foreground text-lg font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm">{category}{subcategory ? ` > ${subcategory}` : ""}</p>
            </div>
            <p className="text-foreground/80 text-sm whitespace-pre-wrap">{description}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { t: "Basic", p: basicPrice, d: basicDesc },
                { t: "Standard", p: standardPrice, d: standardDesc },
                { t: "Premium", p: premiumPrice, d: premiumDesc },
              ].filter((x) => x.p).map((tier) => (
                <div key={tier.t} className="p-3 rounded-lg border border-border text-center">
                  <p className="text-muted-foreground text-xs">{tier.t}</p>
                  <p className="text-lime-400 font-bold text-lg">{tier.p} MAD</p>
                  {tier.d && <p className="text-muted-foreground text-xs mt-1">{tier.d}</p>}
                </div>
              ))}
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => <Badge key={s} className="bg-lime-400/10 text-lime-400 border-0">{s}</Badge>)}
              </div>
            )}
            <p className="text-muted-foreground text-sm">Livraison : {deliveryDays} jours</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="text-muted-foreground hover:text-foreground hover:bg-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" />Précédent
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
            Suivant<ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <form action={async (formData) => {
            setIsPending(true)
            formData.set("title", title)
            formData.set("category", category)
            formData.set("subcategory", subcategory)
            formData.set("basicPrice", basicPrice)
            formData.set("basicDesc", basicDesc)
            formData.set("standardPrice", standardPrice)
            formData.set("standardDesc", standardDesc)
            formData.set("premiumPrice", premiumPrice)
            formData.set("premiumDesc", premiumDesc)
            formData.set("description", description)
            formData.set("deliveryDays", deliveryDays)
            formData.set("skills", skills.join(","))
            formData.set("status", "ACTIVE")
            try { await createGig(formData) } catch { setIsPending(false) }
          }}>
            <Button type="submit" disabled={isPending} className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Publication...</> : <><Save className="mr-2 h-4 w-4" />Publier le gig</>}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
