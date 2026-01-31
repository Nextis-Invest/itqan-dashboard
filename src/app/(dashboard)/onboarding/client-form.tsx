"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { createClientProfile } from "@/lib/actions/profile"

const industries = [
  { value: "tech", label: "Technologie" },
  { value: "finance", label: "Finance" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "education", label: "Éducation" },
  { value: "health", label: "Santé" },
  { value: "media", label: "Médias" },
  { value: "real-estate", label: "Immobilier" },
  { value: "consulting", label: "Conseil" },
  { value: "other", label: "Autre" },
]

export function ClientOnboardingForm() {
  const [isPending, setIsPending] = useState(false)

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Profil Client</CardTitle>
        <CardDescription className="text-neutral-400">
          Ces informations seront visibles par les freelances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            setIsPending(true)
            try {
              await createClientProfile(formData)
            } catch {
              setIsPending(false)
            }
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label className="text-neutral-300">Nom de l&apos;entreprise *</Label>
            <Input
              name="companyName"
              required
              placeholder="Ex: Itqan Technologies"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Taille de l&apos;entreprise</Label>
              <Select name="companySize">
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="1-10">1-10 employés</SelectItem>
                  <SelectItem value="11-50">11-50 employés</SelectItem>
                  <SelectItem value="51-200">51-200 employés</SelectItem>
                  <SelectItem value="200+">200+ employés</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Secteur</Label>
              <Select name="industry">
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  {industries.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Site web</Label>
              <Input
                name="website"
                placeholder="https://example.com"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
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
