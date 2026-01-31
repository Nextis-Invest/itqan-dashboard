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
import { Loader2, Save, X } from "lucide-react"
import { createFreelancerProfile } from "@/lib/actions/profile"

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
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Profil Freelance</CardTitle>
        <CardDescription className="text-neutral-400">
          Ces informations seront visibles par les clients
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <div className="space-y-2">
            <Label className="text-neutral-300">Titre professionnel *</Label>
            <Input
              name="title"
              required
              placeholder="Ex: Développeur React Senior"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Bio</Label>
            <Textarea
              name="bio"
              rows={4}
              placeholder="Décrivez votre expérience et vos compétences..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Compétences</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tapez et appuyez Entrée"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
              <Button
                type="button"
                onClick={addSkill}
                variant="outline"
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
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
                    onClick={() => removeSkill(skill)}
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
              <Label className="text-neutral-300">Catégorie</Label>
              <Select name="category">
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Ville</Label>
              <Input
                name="city"
                placeholder="Casablanca"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Tarif journalier</Label>
              <Input
                name="dailyRate"
                type="number"
                step="0.01"
                placeholder="1500"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Devise</Label>
              <Select name="currency" defaultValue="MAD">
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isRemote ? "bg-lime-400" : "bg-neutral-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isRemote ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <Label className="text-neutral-300">Disponible en remote</Label>
          </div>

          <div className="space-y-4">
            <Label className="text-neutral-300 text-sm font-medium">Liens (optionnel)</Label>
            <div className="grid grid-cols-1 gap-3">
              <Input
                name="portfolioUrl"
                placeholder="URL Portfolio"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
              <Input
                name="linkedinUrl"
                placeholder="URL LinkedIn"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
              <Input
                name="githubUrl"
                placeholder="URL GitHub"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Créer mon profil
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
