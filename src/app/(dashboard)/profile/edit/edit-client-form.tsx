"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { updateClientProfile } from "@/lib/actions/profile"
import Link from "next/link"
import type { ClientProfile } from "@prisma/client"

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

export function EditClientForm({ profile }: { profile: ClientProfile }) {
  const [isPending, setIsPending] = useState(false)

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle className="text-white">Modifier le profil</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            setIsPending(true)
            try {
              await updateClientProfile(formData)
            } catch {
              setIsPending(false)
            }
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label className="text-neutral-300">Nom de l&apos;entreprise</Label>
            <Input name="companyName" defaultValue={profile.companyName || ""} className="bg-neutral-800 border-neutral-700 text-white focus:border-lime-400/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Taille</Label>
              <Select name="companySize" defaultValue={profile.companySize || undefined}>
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
              <Select name="industry" defaultValue={profile.industry || undefined}>
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  {industries.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Site web</Label>
              <Input name="website" defaultValue={profile.website || ""} className="bg-neutral-800 border-neutral-700 text-white focus:border-lime-400/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Ville</Label>
              <Input name="city" defaultValue={profile.city || ""} className="bg-neutral-800 border-neutral-700 text-white focus:border-lime-400/50" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending} className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : <><Save className="mr-2 h-4 w-4" />Enregistrer</>}
            </Button>
            <Link href="/profile">
              <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-neutral-800">Annuler</Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
