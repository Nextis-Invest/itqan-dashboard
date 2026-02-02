"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Loader2, Save, X, Download, User, Code, DollarSign, Link2, Rocket } from "lucide-react"
import { createFreelancerProfile } from "@/lib/actions/profile"
import { signIn } from "next-auth/react"

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

/* Shared input class */
const inputCls = "bg-secondary/60 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all"

export function FreelancerOnboardingForm() {
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [isRemote, setIsRemote] = useState(true)
  const [isPending, setIsPending] = useState(false)

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) {
      setSkills([...skills, s])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
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
        formData.set("skills", skills.join(","))
        formData.set("remote", isRemote ? "true" : "false")
        try {
          await createFreelancerProfile(formData)
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
          <CardDescription className="text-muted-foreground text-sm">
            Ces informations seront visibles par les clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Titre professionnel *</Label>
            <Input
              name="title"
              required
              placeholder="Ex: Développeur React Senior"
              className={inputCls}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Bio</Label>
            <Textarea
              name="bio"
              rows={4}
              placeholder="Décrivez votre expérience et vos compétences..."
              className="bg-secondary/60 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 rounded-xl transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Catégorie</Label>
              <Select name="category">
                <SelectTrigger className={inputCls}>
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
              <Label className="text-foreground/80 text-sm font-medium">Ville</Label>
              <Input name="city" placeholder="Casablanca" className={inputCls} />
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
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-lime-400/10 text-lime-400 border border-lime-400/20 gap-1.5 cursor-pointer hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20 transition-colors px-3 py-1"
                  onClick={() => removeSkill(skill)}
                >
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
            Tarification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Tarif journalier</Label>
              <Input name="dailyRate" type="number" step="0.01" placeholder="1500" className={inputCls} />
            </div>
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
                </SelectContent>
              </Select>
            </div>
          </div>

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
            <Label className="text-foreground/80 text-sm">Disponible en remote</Label>
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
            Liens (optionnel)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input name="portfolioUrl" placeholder="URL Portfolio" className={inputCls} />
          <Input name="linkedinUrl" placeholder="URL LinkedIn" className={inputCls} />
          <Input name="githubUrl" placeholder="URL GitHub" className={inputCls} />
        </CardContent>
      </Card>

      {/* LinkedIn Import */}
      <Card className="bg-card/80 border-border backdrop-blur-sm">
        <CardContent className="pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => signIn("linkedin", { callbackUrl: "/onboarding?linkedin_import=1" })}
            className="w-full border-[#0A66C2]/30 bg-[#0A66C2]/5 text-[#0A66C2] hover:bg-[#0A66C2]/15 hover:border-[#0A66C2]/50 h-11 rounded-xl font-medium transition-all duration-200"
          >
            <Download className="mr-2 h-4 w-4" />
            Importer depuis LinkedIn
          </Button>
          <p className="text-muted-foreground text-xs text-center mt-2">
            Connectez LinkedIn pour pré-remplir votre expérience
          </p>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-lime-400 to-emerald-400 text-neutral-900 hover:from-lime-300 hover:to-emerald-300 font-semibold h-12 rounded-xl shadow-lg shadow-lime-400/20 text-base transition-all duration-200"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Création...
          </>
        ) : (
          <>
            <Rocket className="mr-2 h-5 w-5" />
            Créer mon profil
          </>
        )}
      </Button>
    </form>
  )
}
