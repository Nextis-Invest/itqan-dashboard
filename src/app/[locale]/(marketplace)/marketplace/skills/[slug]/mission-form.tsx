"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, X, ChevronRight, DollarSign, Code, Calendar, CheckCircle, Briefcase } from "lucide-react"

interface SkillMissionFormProps {
  skillName: string
  skillSlug: string
  categorySlug?: string
  subcategorySlug?: string
  categoryName?: string
  subcategoryName?: string
  locale: string
}

const inputCls = "bg-secondary/60 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all"

export function SkillMissionForm({
  skillName,
  skillSlug,
  categorySlug,
  subcategorySlug,
  categoryName,
  subcategoryName,
  locale,
}: SkillMissionFormProps) {
  // Pre-populate with the skill
  const [skills, setSkills] = useState<string[]>([skillName])
  const [skillInput, setSkillInput] = useState("")
  const [isRemote, setIsRemote] = useState(true)
  const [budgetType, setBudgetType] = useState("FIXED")
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const [missionId, setMissionId] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) {
      setSkills([...skills, s])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    // Don't allow removing the main skill
    if (skill === skillName) return
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : null,
      budgetMin: formData.get("budgetMin") ? parseFloat(formData.get("budgetMin") as string) : null,
      budgetMax: formData.get("budgetMax") ? parseFloat(formData.get("budgetMax") as string) : null,
      budgetType,
      currency: (formData.get("currency") as string) || "MAD",
      category: categorySlug || null,
      subcategory: subcategorySlug || null,
      deadline: (formData.get("deadline") as string) || null,
      duration: (formData.get("duration") as string) || null,
      experienceLevel: (formData.get("experienceLevel") as string) || null,
      remote: isRemote,
      location: (formData.get("location") as string) || null,
      skills,
    }

    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
          return
        }
        const result = await response.json()
        setError(result.message || "Erreur lors de la création")
        setIsPending(false)
        return
      }

      const result = await response.json()
      setMissionId(result.mission.id)
      setShowSuccess(true)
    } catch {
      setError("Une erreur est survenue")
      setIsPending(false)
    }
  }

  if (showSuccess) {
    return (
      <Card className="bg-gradient-to-br from-lime-400/5 to-emerald-400/5 border-lime-400/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-lime-400/10">
                <CheckCircle className="h-10 w-10 text-lime-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Mission créée avec succès !</h3>
              <p className="text-sm text-muted-foreground">
                Votre mission {skillName} est en cours de validation et sera bientôt visible sur la plateforme.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href={`/missions/${missionId}`}>
                <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold h-11 rounded-xl">
                  Voir la mission
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/missions">
                <Button variant="outline" className="border-border text-foreground/80 hover:bg-accent h-11 rounded-xl">
                  Mes missions
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/80 border-border backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-foreground text-xl flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-lime-400/10">
                <Briefcase className="h-5 w-5 text-lime-400" />
              </div>
              Trouver un freelance {skillName}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-1">
              Décrivez votre projet et recevez des propositions d&apos;experts
            </CardDescription>
          </div>
          <Badge className="bg-lime-400/10 text-lime-400 border-0 text-xs font-medium px-3 py-1">
            {skillName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          {/* Titre */}
          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Titre de la mission *</Label>
            <Input
              name="title"
              required
              placeholder={`Ex: Développement ${skillName} pour mon projet`}
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Description</Label>
            <Textarea
              name="description"
              rows={4}
              placeholder={`Décrivez votre projet ${skillName} en détail : objectifs, livrables attendus, contexte...`}
              className="bg-secondary/60 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 rounded-xl transition-all resize-none"
            />
          </div>

          {/* Budget Type */}
          <div className="space-y-3">
            <Label className="text-foreground/80 text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              Type de budget
            </Label>
            <div className="flex gap-2">
              {[
                { v: "FIXED", l: "Prix fixe" },
                { v: "HOURLY", l: "Taux horaire" },
              ].map((bt) => (
                <button
                  key={bt.v}
                  type="button"
                  onClick={() => setBudgetType(bt.v)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    budgetType === bt.v
                      ? "bg-lime-400/10 text-lime-400 border-2 border-lime-400/20"
                      : "bg-secondary/60 text-muted-foreground border-2 border-border hover:border-lime-400/30"
                  }`}
                >
                  {bt.l}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">
                {budgetType === "FIXED" ? "Budget" : "Taux/heure"}
              </Label>
              <Input name="budget" type="number" step="0.01" placeholder="5000" className={inputCls} />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Budget min</Label>
              <Input name="budgetMin" type="number" step="0.01" placeholder="3000" className={inputCls} />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Budget max</Label>
              <Input name="budgetMax" type="number" step="0.01" placeholder="8000" className={inputCls} />
            </div>
          </div>

          {/* Devise et Date limite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Devise</Label>
              <Select name="currency" defaultValue="MAD">
                <SelectTrigger className={inputCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  <SelectItem value="MAD">MAD (د.م.)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="SAR">SAR (﷼)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                Date limite
              </Label>
              <Input name="deadline" type="date" className={inputCls} />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium flex items-center gap-2">
              <Code className="h-4 w-4 text-emerald-400" />
              Compétences requises
            </Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ajouter d'autres compétences..."
                className={inputCls}
              />
              <Button
                type="button"
                onClick={addSkill}
                variant="outline"
                className="border-border text-foreground/80 hover:bg-accent hover:text-foreground h-11 rounded-xl px-5"
              >
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  className={`gap-1.5 px-3 py-1.5 ${
                    skill === skillName
                      ? "bg-lime-400/20 text-lime-400 border border-lime-400/30 cursor-default"
                      : "bg-lime-400/10 text-lime-400 border border-lime-400/20 cursor-pointer hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20 transition-colors"
                  }`}
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  {skill !== skillName && <X className="h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Durée et Niveau */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Durée estimée</Label>
              <Select name="duration">
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  <SelectItem value="< 1 semaine">{"< 1 semaine"}</SelectItem>
                  <SelectItem value="1-2 semaines">1-2 semaines</SelectItem>
                  <SelectItem value="1 mois">1 mois</SelectItem>
                  <SelectItem value="1-3 mois">1-3 mois</SelectItem>
                  <SelectItem value="3-6 mois">3-6 mois</SelectItem>
                  <SelectItem value="6+ mois">6+ mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Niveau d&apos;expérience</Label>
              <Select name="experienceLevel">
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  <SelectItem value="JUNIOR">Junior</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermédiaire</SelectItem>
                  <SelectItem value="SENIOR">Senior</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Remote Toggle & Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRemote(!isRemote)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  isRemote ? "bg-lime-400" : "bg-secondary"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    isRemote ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <Label className="text-foreground/80 text-sm">Mission en remote</Label>
            </div>
            {!isRemote && (
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Localisation</Label>
                <Input name="location" placeholder="Ex: Casablanca, Maroc" className={inputCls} />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-lime-400 to-emerald-400 text-neutral-900 hover:from-lime-300 hover:to-emerald-300 font-semibold h-12 rounded-xl shadow-lg shadow-lime-400/20 text-base transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Trouver un freelance {skillName}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
