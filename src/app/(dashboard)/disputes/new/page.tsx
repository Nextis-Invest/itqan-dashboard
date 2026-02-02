"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, AlertTriangle, FileText, Flag, MessageSquareWarning } from "lucide-react"
import Link from "next/link"
import { openDispute, getUserContracts } from "@/lib/actions/dispute"

type ContractItem = {
  id: string
  mission: { id: string; title: string }
}

const categories = [
  { value: "QUALITY", label: "Qualité du travail", icon: "🎯" },
  { value: "DELAY", label: "Retard de livraison", icon: "⏰" },
  { value: "PAYMENT", label: "Problème de paiement", icon: "💳" },
  { value: "SCOPE", label: "Dépassement du périmètre", icon: "📐" },
  { value: "COMMUNICATION", label: "Communication", icon: "💬" },
  { value: "OTHER", label: "Autre", icon: "📋" },
]

const priorities = [
  { value: "LOW", label: "Faible", color: "border-border hover:border-border text-muted-foreground" },
  { value: "MEDIUM", label: "Moyen", color: "border-blue-500/30 hover:border-blue-500/50 text-blue-400" },
  { value: "HIGH", label: "Élevé", color: "border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400" },
  { value: "CRITICAL", label: "Critique", color: "border-red-500/30 hover:border-red-500/50 text-red-400" },
]

export default function NewDisputePage() {
  const router = useRouter()
  const [contracts, setContracts] = useState<ContractItem[]>([])
  const [selectedContract, setSelectedContract] = useState("")
  const [category, setCategory] = useState("OTHER")
  const [priority, setPriority] = useState("MEDIUM")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getUserContracts().then((c) => setContracts(c as ContractItem[]))
  }, [])

  const handleSubmit = async () => {
    if (!selectedContract || reason.trim().length < 50) return
    setLoading(true)
    setError("")
    try {
      await openDispute({ contractId: selectedContract, category, priority, reason: reason.trim() })
      router.push("/disputes")
    } catch (e: any) {
      setError(e.message || "Erreur lors de la création du litige")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/disputes" className="rounded-xl p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Ouvrir un litige</h2>
          <p className="text-muted-foreground mt-1">Sélectionnez un contrat et décrivez le problème</p>
        </div>
      </div>

      {/* Step 1: Contract */}
      <Card className="bg-card/80 border-border/80">
        <CardHeader>
          <CardTitle className="text-foreground text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-lime-400" />
            1. Contrat concerné
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-6">
              <AlertTriangle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Aucun contrat éligible trouvé</p>
            </div>
          ) : (
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/50 text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/30 transition-all"
            >
              <option value="">— Choisir un contrat —</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>{c.mission.title}</option>
              ))}
            </select>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Category */}
      <Card className="bg-card/80 border-border/80">
        <CardHeader>
          <CardTitle className="text-foreground text-sm flex items-center gap-2">
            <Flag className="h-4 w-4 text-lime-400" />
            2. Catégorie et priorité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-3 block">Catégorie</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`p-3 rounded-xl border text-left text-sm transition-all ${
                    category === c.value
                      ? "bg-lime-400/10 border-lime-400/30 text-lime-400"
                      : "bg-secondary/30 border-border text-muted-foreground hover:border-border hover:text-foreground/80"
                  }`}
                >
                  <span className="text-lg">{c.icon}</span>
                  <p className="mt-1 text-xs font-medium">{c.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-3 block">Priorité</Label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    priority === p.value
                      ? `${p.color} bg-muted/50`
                      : "border-border text-muted-foreground hover:border-border"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Description */}
      <Card className="bg-card/80 border-border/80">
        <CardHeader>
          <CardTitle className="text-foreground text-sm flex items-center gap-2">
            <MessageSquareWarning className="h-4 w-4 text-lime-400" />
            3. Description du problème
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={6}
            placeholder="Décrivez le problème rencontré, les étapes déjà entreprises..."
            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl focus-visible:ring-lime-400/30 focus-visible:border-lime-400/30 resize-none"
          />
          <div className="flex items-center justify-between">
            {reason.length > 0 && reason.length < 50 ? (
              <p className="text-amber-400 text-xs">Minimum 50 caractères ({reason.length}/50)</p>
            ) : reason.length >= 50 ? (
              <p className="text-lime-400 text-xs">✓ {reason.length} caractères</p>
            ) : (
              <p className="text-muted-foreground text-xs">Minimum 50 caractères</p>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-xl bg-red-400/10 border border-red-400/20 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading || !selectedContract || reason.trim().length < 50}
        className="w-full bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold shadow-lg shadow-lime-400/20 rounded-xl h-12 text-base disabled:shadow-none"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Ouvrir le litige
      </Button>
    </div>
  )
}
