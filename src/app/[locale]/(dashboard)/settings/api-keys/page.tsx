"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Key,
  Plus,
  Loader2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
} from "lucide-react"

interface ApiKey {
  id: string
  provider: string
  name: string
  key: string // Masked
  isActive: boolean
  usageCount: number
  lastUsedAt: string | null
  errorCount: number
  lastError: string | null
  createdAt: string
  updatedAt: string
}

const PROVIDERS = [
  { value: "gemini", label: "Google Gemini" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "mistral", label: "Mistral AI" },
]

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Jamais"
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `${diffMins} min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}j`
  return date.toLocaleDateString("fr-FR")
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

export default function ApiKeysPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [newProvider, setNewProvider] = useState("")
  const [newName, setNewName] = useState("")
  const [newKey, setNewKey] = useState("")

  const fetchApiKeys = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/api-keys")
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data)
      } else if (response.status === 403) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching API keys:", error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchApiKeys()
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, fetchApiKeys, router])

  const handleAddKey = async () => {
    if (!newProvider || !newKey) {
      setMessage({ type: "error", text: "Provider et clé API sont requis" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: newProvider,
          name: newName || `${newProvider.charAt(0).toUpperCase() + newProvider.slice(1)} Key`,
          key: newKey,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de l'ajout")
      }

      setMessage({ type: "success", text: "Clé API ajoutée avec succès" })
      setIsAddDialogOpen(false)
      setNewProvider("")
      setNewName("")
      setNewKey("")
      fetchApiKeys()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch("/api/admin/api-keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      fetchApiKeys()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/api-keys?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      setDeleteConfirmId(null)
      setMessage({ type: "success", text: "Clé API supprimée" })
      fetchApiKeys()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    }
  }

  // Group keys by provider
  const keysByProvider = apiKeys.reduce((acc, key) => {
    if (!acc[key.provider]) {
      acc[key.provider] = []
    }
    acc[key.provider].push(key)
    return acc
  }, {} as Record<string, ApiKey[]>)

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Clés API</h2>
          <p className="text-muted-foreground mt-1">
            Gérez les clés API pour les services externes
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold rounded-xl shadow-lg shadow-lime-400/20">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une clé
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-lime-400" />
                Ajouter une clé API
              </DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle clé API pour les services d&apos;IA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  Provider
                </Label>
                <Select value={newProvider} onValueChange={setNewProvider}>
                  <SelectTrigger className="bg-muted/50 border-border rounded-xl h-11">
                    <SelectValue placeholder="Sélectionner un provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  Nom (optionnel)
                </Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Production Key 1"
                  className="bg-muted/50 border-border rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  Clé API
                </Label>
                <Input
                  type="password"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="AIza..."
                  className="bg-muted/50 border-border rounded-xl h-11 font-mono"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddKey}
                disabled={isSubmitting || !newProvider || !newKey}
                className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  "Ajouter"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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

      {apiKeys.length === 0 ? (
        <Card className="bg-card/80 border-border/80 overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted/50 p-4 mb-4">
              <Key className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aucune clé API configurée
            </h3>
            <p className="text-muted-foreground text-sm text-center max-w-sm mb-4">
              Ajoutez des clés API pour permettre aux services d&apos;IA de fonctionner.
              Vous pouvez ajouter plusieurs clés pour éviter les limites de rate.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold rounded-xl shadow-lg shadow-lime-400/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre première clé
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(keysByProvider).map(([provider, keys]) => {
            const providerInfo = PROVIDERS.find((p) => p.value === provider)
            return (
              <Card key={provider} className="bg-card/80 border-border/80 overflow-hidden">
                <CardHeader className="border-b border-border/60 bg-card/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-lime-400/10 p-2.5">
                      <Key className="h-5 w-5 text-lime-400" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground capitalize">
                        {providerInfo?.label || provider}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-xs mt-0.5">
                        {keys.length} clé{keys.length > 1 ? "s" : ""} configurée{keys.length > 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="divide-y divide-border/60">
                  {keys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="py-4 first:pt-4 last:pb-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`mt-1 rounded-full p-1.5 ${
                              apiKey.isActive
                                ? "bg-green-400/10"
                                : "bg-muted/50"
                            }`}
                          >
                            {apiKey.isActive ? (
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground truncate">
                                {apiKey.name}
                              </span>
                              <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded font-mono">
                                {apiKey.key}
                              </code>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {formatNumber(apiKey.usageCount)} utilisations
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(apiKey.lastUsedAt)}
                              </span>
                              {apiKey.errorCount > 0 && (
                                <span className="flex items-center gap-1 text-amber-400">
                                  <AlertTriangle className="h-3 w-3" />
                                  {apiKey.errorCount} erreurs
                                </span>
                              )}
                            </div>
                            {apiKey.lastError && (
                              <p className="mt-1 text-xs text-red-400 truncate">
                                Dernière erreur: {apiKey.lastError}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleActive(apiKey.id, apiKey.isActive)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              apiKey.isActive ? "bg-lime-400" : "bg-secondary"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                apiKey.isActive ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          {deleteConfirmId === apiKey.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(apiKey.id)}
                                className="h-8 px-2 rounded-lg"
                              >
                                Confirmer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteConfirmId(null)}
                                className="h-8 px-2 rounded-lg"
                              >
                                Annuler
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteConfirmId(apiKey.id)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}

          {/* Info card */}
          <Card className="bg-amber-400/5 border-amber-400/20 overflow-hidden">
            <CardContent className="flex items-start gap-3 py-4">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">
                  Conseil : Ajoutez plusieurs clés pour éviter les limites de rate
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Le système utilisera automatiquement les clés actives en rotation. Si une clé
                  atteint sa limite ou génère des erreurs, la suivante sera utilisée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
