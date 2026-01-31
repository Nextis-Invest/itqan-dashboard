"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

export default function NewMissionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : null,
      currency: formData.get("currency") as string || "EUR",
      category: formData.get("category") as string,
      deadline: formData.get("deadline") as string || null,
    }

    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.message || "Erreur lors de la création")
        return
      }

      router.push("/missions")
      router.refresh()
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/missions">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nouvelle mission</h2>
          <p className="text-neutral-400 mt-1">Créez une nouvelle mission pour vos freelances</p>
        </div>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Détails de la mission</CardTitle>
          <CardDescription className="text-neutral-400">
            Remplissez les informations ci-dessous
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
              <Label htmlFor="title" className="text-neutral-300">Titre *</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Ex: Développement d'une application mobile"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-neutral-300">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Décrivez votre mission en détail..."
                className="flex w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-lime-400/50 focus:outline-none focus:ring-1 focus:ring-lime-400/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-neutral-300">Budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  placeholder="5000"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-neutral-300">Devise</Label>
                <Select name="currency" defaultValue="EUR">
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="MAD">MAD (د.م.)</SelectItem>
                    <SelectItem value="SAR">SAR (﷼)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-neutral-300">Catégorie</Label>
                <Select name="category">
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem value="development">Développement</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="writing">Rédaction</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-neutral-300">Date limite</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className="bg-neutral-800 border-neutral-700 text-white focus:border-lime-400/50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Créer la mission
                  </>
                )}
              </Button>
              <Link href="/missions">
                <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
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
