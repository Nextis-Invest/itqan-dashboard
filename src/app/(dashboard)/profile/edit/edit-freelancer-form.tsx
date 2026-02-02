"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, X, ArrowLeft, User, Code, DollarSign, Link2 } from "lucide-react"
import { updateFreelancerProfile } from "@/lib/actions/profile"
import Link from "next/link"
import type { FreelancerProfile } from "@prisma/client"

const categories = [
  { value: "development", label: "Développement" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "consulting", label: "Consulting" },
  { value: "writing", label: "Rédaction" },
  { value: "video", label: "Vidéo & Animation" },
  { value: "data", label: "Data & IA" },
  { value: "other", label: "Autre" },
]

export function EditFreelancerForm({ profile }: { profile: FreelancerProfile }) {
  const [skills, setSkills] = useState<string[]>(profile.skills)
  const [skillInput, setSkillInput] = useState("")
  const [isRemote, setIsRemote] = useState(profile.remote)
  const [isAvailable, setIsAvailable] = useState(profile.available)
  const [isPending, setIsPending] = useState(false)
  const [saved, setSaved] = useState(false)

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) {
      setSkills([...skills, s])
      setSkillInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <form
      action={async (formData) => {
        setIsPending(true)
        setSaved(false)
        formData.set("skills", skills.join(","))
        formData.set("remote", isRemote ? "true" : "false")
        formData.set("available", isAvailable ? "true" : "false")
        try {
          await updateFreelancerProfile(formData)
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        } catch {
          setIsPending(false)
        }
      }}
      className="space-y-6"
    >
      {/* Section: Identity */}
      <Card className="bg-card/80 border-border backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-lime-400/10">
              <User className="h-4 w-4 text-lime-400" />
            </div>
            Identité professionnelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-muted-foreground text-sm">← Retour au profil</span>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Titre professionnel</Label>
            <Input
              name="title"
              defaultValue={profile.title || ""}
              className="bg-secondary/60 border-border/50 text-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Bio</Label>
            <Textarea
              name="bio"
              rows={4}
              defaultValue={profile.bio || ""}
              className="bg-secondary/60 border-border/50 text-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 rounded-xl transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Catégorie</Label>
              <Select name="category" defaultValue={profile.category || undefined}>
                <SelectTrigger className="bg-secondary/60 border-border/50 text-foreground h-11 rounded-xl">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Ville</Label>
              <Input name="city" defaultValue={profile.city || ""} className="bg-secondary/60 border-border/50 text-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section: Skills */}
      <Card className="bg-card/80 border-border backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-400/10">
              <Code className="h-4 w-4 text-emerald-400" />
            </div>
            Compétences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tapez et appuyez Entrée"
              className="bg-secondary/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all"
            />
            <Button type="button" onClick={addSkill} variant="outline" className="border-border/50 text-foreground/80 hover:bg-accent hover:text-foreground h-11 rounded-xl px-5">
              Ajouter
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} className="bg-lime-400/10 text-lime-400 border border-lime-400/20 gap-1.5 cursor-pointer hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20 transition-colors px-3 py-1" onClick={() => setSkills(skills.filter((s) => s !== skill))}>
                  {skill}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section: Pricing */}
      <Card className="bg-card/80 border-border backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-yellow-400/10">
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </div>
            Tarification & Disponibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Tarif journalier</Label>
              <Input name="dailyRate" type="number" step="0.01" defaultValue={profile.dailyRate || ""} className="bg-secondary/60 border-border/50 text-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Devise</Label>
              <Select name="currency" defaultValue={profile.currency}>
                <SelectTrigger className="bg-secondary/60 border-border/50 text-foreground h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  <SelectItem value="MAD">MAD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsRemote(!isRemote)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isRemote ? "bg-lime-400" : "bg-secondary"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isRemote ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <Label className="text-foreground/80 text-sm">Remote</Label>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsAvailable(!isAvailable)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isAvailable ? "bg-lime-400" : "bg-secondary"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isAvailable ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <Label className="text-foreground/80 text-sm">Disponible</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section: Links */}
      <Card className="bg-card/80 border-border backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-400/10">
              <Link2 className="h-4 w-4 text-blue-400" />
            </div>
            Liens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input name="portfolioUrl" placeholder="URL Portfolio" defaultValue={profile.portfolioUrl || ""} className="bg-secondary/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all" />
          <Input name="linkedinUrl" placeholder="URL LinkedIn" defaultValue={profile.linkedinUrl || ""} className="bg-secondary/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all" />
          <Input name="githubUrl" placeholder="URL GitHub" defaultValue={profile.githubUrl || ""} className="bg-secondary/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all" />
          <Input name="websiteUrl" placeholder="URL Site web" defaultValue={profile.websiteUrl || ""} className="bg-secondary/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all" />
        </CardContent>
      </Card>

      {/* Submit area */}
      <div className="flex items-center gap-3 sticky bottom-4 z-10">
        <Button type="submit" disabled={isPending} className="bg-gradient-to-r from-lime-400 to-emerald-400 text-foreground hover:from-lime-300 hover:to-emerald-300 font-semibold h-11 rounded-xl shadow-lg shadow-lime-400/20 px-8 transition-all duration-200">
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : <><Save className="mr-2 h-4 w-4" />Enregistrer</>}
        </Button>
        <Link href="/profile">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent h-11 rounded-xl">Annuler</Button>
        </Link>
        {saved && (
          <span className="text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20 animate-in fade-in">
            ✓ Enregistré
          </span>
        )}
      </div>
    </form>
  )
}
