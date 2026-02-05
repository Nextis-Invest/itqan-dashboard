"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Shield, Bell, Palette, Mail, Phone, Lock, Eye, Loader2, Moon, Sun } from "lucide-react"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return

      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const data = await response.json()
          setName(data.user.name || "")
          setPhone(data.user.phone || "")
          setEmail(data.user.email || "")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchUserData()
    } else if (status === "unauthenticated") {
      setIsLoading(false)
    }
  }, [session, status])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de la sauvegarde")
      }

      setMessage({ type: "success", text: "Modifications enregistrées avec succès" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
      </div>
    )
  }
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground mt-1">Gérez votre compte et vos préférences</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-card/80 border-border/80 overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-lime-400/10 p-2.5">
              <User className="h-5 w-5 text-lime-400" />
            </div>
            <div>
              <CardTitle className="text-foreground">Informations personnelles</CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-0.5">
                Mettez à jour vos informations de profil
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <form onSubmit={handleSave} className="space-y-5">
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-lime-400/10 text-lime-400 border border-lime-400/20"
                    : "bg-red-400/10 text-red-400 border border-red-400/20"
                }`}
              >
                {message.text}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3 w-3" /> Nom
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/30 focus:ring-lime-400/20 rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> Téléphone
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212 6 12 34 56 78"
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/30 focus:ring-lime-400/20 rounded-xl h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <Input
                disabled
                value={email}
                placeholder="votre@email.com"
                className="bg-secondary/30 border-border text-muted-foreground rounded-xl h-11"
              />
              <p className="text-[11px] text-muted-foreground">L&apos;email ne peut pas être modifié</p>
            </div>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold rounded-xl shadow-lg shadow-lime-400/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                "Sauvegarder les modifications"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="bg-card/80 border-border/80 overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-400/10 p-2.5">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-foreground">Sécurité</CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-0.5">
                Gérez la sécurité de votre compte
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/60">
            <div className="rounded-lg bg-green-400/10 p-2">
              <Lock className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">Authentification par magic link</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Votre compte utilise l&apos;authentification par code de connexion. Aucun mot de passe n&apos;est nécessaire.
              </p>
            </div>
            <div className="shrink-0">
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">Actif</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="bg-card/80 border-border/80 overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-400/10 p-2.5">
              <Bell className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-foreground">Notifications</CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-0.5">
                Contrôlez les notifications que vous recevez
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {[
            { label: "Nouvelles propositions", desc: "Recevez une notification quand un freelance postule", defaultOn: true },
            { label: "Messages", desc: "Notifications pour les nouveaux messages", defaultOn: true },
            { label: "Mises à jour de contrat", desc: "Jalons soumis, approuvés, etc.", defaultOn: true },
            { label: "Emails marketing", desc: "Offres et actualités de la plateforme", defaultOn: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/60">
              <div>
                <p className="text-foreground text-sm font-medium">{item.label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.defaultOn ? "bg-lime-400" : "bg-secondary"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${item.defaultOn ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-card/80 border-border/80 overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-400/10 p-2.5">
              <Palette className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-foreground">Apparence</CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-0.5">
                Personnalisez l&apos;interface
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/60">
            <div className="flex items-center gap-3">
              {mounted && theme === "dark" ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-foreground text-sm font-medium">Thème sombre</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {mounted && theme === "dark"
                    ? "Le thème sombre est activé"
                    : "Le thème clair est activé"}
                </p>
              </div>
            </div>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === "dark" ? "bg-lime-400" : "bg-secondary"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
