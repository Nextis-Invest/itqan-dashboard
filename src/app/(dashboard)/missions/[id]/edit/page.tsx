"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Save, X, Send, XCircle, CheckCircle } from "lucide-react"
import { categories } from "@/lib/categories"

interface MissionData {
  id: string
  title: string
  description: string | null
  budget: number | null
  budgetMin: number | null
  budgetMax: number | null
  budgetType: string | null
  currency: string
  category: string | null
  subcategory: string | null
  deadline: string | null
  duration: string | null
  experienceLevel: string | null
  remote: boolean
  location: string | null
  skills: string[]
  status: string
  clientId: string
}

export default function EditMissionPage() {
  const router = useRouter()
  const params = useParams()
  const missionId = params.id as string

  const [mission, setMission] = useState<MissionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [isRemote, setIsRemote] = useState(true)
  const [budgetType, setBudgetType] = useState("FIXED")

  useEffect(() => {
    fetch(`/api/missions/${missionId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Mission introuvable")
        return res.json()
      })
      .then((data) => {
        setMission(data)
        setSelectedCategory(data.category || "")
        setSkills(data.skills || [])
        setIsRemote(data.remote)
        setBudgetType(data.budgetType || "FIXED")
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [missionId])

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) {
      setSkills([...skills, s])
      setSkillInput("")
    }
  }

  const subcategories =
    categories.find((c) => c.value === selectedCategory)?.subcategories || []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      budget: formData.get("budget")
        ? parseFloat(formData.get("budget") as string)
        : null,
      budgetMin: formData.get("budgetMin")
        ? parseFloat(formData.get("budgetMin") as string)
        : null,
      budgetMax: formData.get("budgetMax")
        ? parseFloat(formData.get("budgetMax") as string)
        : null,
      budgetType,
      currency: (formData.get("currency") as string) || "MAD",
      category: formData.get("category") as string,
      subcategory: formData.get("subcategory") as string,
      deadline: (formData.get("deadline") as string) || null,
      duration: (formData.get("duration") as string) || null,
      experienceLevel: (formData.get("experienceLevel") as string) || null,
      remote: isRemote,
      location: (formData.get("location") as string) || null,
      skills,
    }

    try {
      const response = await fetch(`/api/missions/${missionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.message || "Erreur lors de la mise à jour")
        return
      }

      router.push(`/missions/${missionId}`)
      router.refresh()
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (
      newStatus === "CANCELLED" &&
      !confirm("Êtes-vous sûr de vouloir annuler cette mission ?")
    )
      return
    if (
      newStatus === "COMPLETED" &&
      !confirm("Marquer cette mission comme terminée ?")
    )
      return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/missions/${missionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.message || "Erreur lors du changement de statut")
        return
      }

      router.push(`/missions/${missionId}`)
      router.refresh()
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
      </div>
    )
  }

  if (error && !mission) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
        <Link href="/missions" className="text-lime-400 hover:underline mt-4 inline-block">
          Retour aux missions
        </Link>
      </div>
    )
  }

  if (!mission) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href={`/missions/${missionId}`}>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Modifier la mission
          </h2>
          <p className="text-muted-foreground mt-1">
            Modifiez les détails de votre mission
          </p>
        </div>
      </div>

      {/* Status Actions */}
      {(mission.status === "DRAFT" ||
        mission.status === "OPEN" ||
        mission.status === "IN_PROGRESS") && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {mission.status === "DRAFT" && (
                <Button
                  onClick={() => handleStatusChange("OPEN")}
                  disabled={isSaving}
                  className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Publier la mission
                </Button>
              )}
              {mission.status === "IN_PROGRESS" && (
                <Button
                  onClick={() => handleStatusChange("COMPLETED")}
                  disabled={isSaving}
                  className="bg-green-500 text-white hover:bg-green-400 font-semibold"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marquer comme terminée
                </Button>
              )}
              {(mission.status === "DRAFT" || mission.status === "OPEN") && (
                <Button
                  onClick={() => handleStatusChange("CANCELLED")}
                  disabled={isSaving}
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Annuler la mission
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Détails de la mission</CardTitle>
          <CardDescription className="text-muted-foreground">
            Modifiez les informations ci-dessous
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-foreground/80">Titre *</Label>
              <Input
                name="title"
                required
                defaultValue={mission.title}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80">Description</Label>
              <Textarea
                name="description"
                rows={6}
                defaultValue={mission.description || ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Catégorie</Label>
                <Select
                  name="category"
                  defaultValue={mission.category || undefined}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Sous-catégorie</Label>
                <Select
                  name="subcategory"
                  defaultValue={mission.subcategory || undefined}
                  disabled={subcategories.length === 0}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <Label className="text-foreground/80">Type de budget</Label>
              <div className="flex gap-2">
                {[
                  { v: "FIXED", l: "Prix fixe" },
                  { v: "HOURLY", l: "Taux horaire" },
                ].map((bt) => (
                  <button
                    key={bt.v}
                    type="button"
                    onClick={() => setBudgetType(bt.v)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      budgetType === bt.v
                        ? "bg-lime-400/10 text-lime-400 border border-lime-400/20"
                        : "bg-secondary text-muted-foreground border border-border"
                    }`}
                  >
                    {bt.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">
                  {budgetType === "FIXED" ? "Budget" : "Taux/heure"}
                </Label>
                <Input
                  name="budget"
                  type="number"
                  step="0.01"
                  defaultValue={mission.budget || ""}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Budget min</Label>
                <Input
                  name="budgetMin"
                  type="number"
                  step="0.01"
                  defaultValue={mission.budgetMin || ""}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Budget max</Label>
                <Input
                  name="budgetMax"
                  type="number"
                  step="0.01"
                  defaultValue={mission.budgetMax || ""}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Devise</Label>
                <Select name="currency" defaultValue={mission.currency}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
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
                <Label className="text-foreground/80">Date limite</Label>
                <Input
                  name="deadline"
                  type="date"
                  defaultValue={
                    mission.deadline
                      ? new Date(mission.deadline).toISOString().split("T")[0]
                      : ""
                  }
                  className="bg-secondary border-border text-foreground focus:border-lime-400/50"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label className="text-foreground/80">Compétences requises</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                  placeholder="Tapez et appuyez Entrée"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  variant="outline"
                  className="border-border text-foreground/80 hover:bg-accent"
                >
                  Ajouter
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-lime-400/10 text-lime-400 border-0 gap-1 cursor-pointer"
                      onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    >
                      {skill}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Durée estimée</Label>
                <Select name="duration" defaultValue={mission.duration || undefined}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
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
                <Label className="text-foreground/80">
                  Niveau d&apos;expérience
                </Label>
                <Select
                  name="experienceLevel"
                  defaultValue={mission.experienceLevel || undefined}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
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

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRemote(!isRemote)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isRemote ? "bg-lime-400" : "bg-secondary"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isRemote ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <Label className="text-foreground/80">Remote</Label>
              </div>
              {!isRemote && (
                <div className="flex-1">
                  <Input
                    name="location"
                    defaultValue={mission.location || ""}
                    placeholder="Ville / lieu"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
              <Link href={`/missions/${missionId}`}>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
