"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Paramètres</h2>
        <p className="text-neutral-400 mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-lime-400" />
            <CardTitle className="text-white">Informations personnelles</CardTitle>
          </div>
          <CardDescription className="text-neutral-400">
            Mettez à jour vos informations de profil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Nom</Label>
              <Input
                placeholder="Votre nom"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Téléphone</Label>
              <Input
                placeholder="+33 6 12 34 56 78"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-300">Email</Label>
            <Input
              disabled
              placeholder="votre@email.com"
              className="bg-neutral-800/50 border-neutral-700 text-neutral-500"
            />
            <p className="text-xs text-neutral-500">L&apos;email ne peut pas être modifié</p>
          </div>
          <Button className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
            Sauvegarder
          </Button>
        </CardContent>
      </Card>

      <Separator className="bg-neutral-800" />

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-lime-400" />
            <CardTitle className="text-white">Sécurité</CardTitle>
          </div>
          <CardDescription className="text-neutral-400">
            Gérez la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 text-sm">
            Votre compte utilise l&apos;authentification par code de connexion (magic link).
            Aucun mot de passe n&apos;est nécessaire.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
