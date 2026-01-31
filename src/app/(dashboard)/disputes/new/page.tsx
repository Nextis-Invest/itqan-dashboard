"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { openDispute, getUserContracts } from "@/lib/actions/dispute"

type ContractItem = {
  id: string
  mission: { id: string; title: string }
}

export default function NewDisputePage() {
  const router = useRouter()
  const [contracts, setContracts] = useState<ContractItem[]>([])
  const [selectedContract, setSelectedContract] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getUserContracts().then((c) => setContracts(c as ContractItem[]))
  }, [])

  const handleSubmit = async () => {
    if (!selectedContract || !reason.trim()) return
    setLoading(true)
    setError("")
    try {
      await openDispute({ contractId: selectedContract, reason: reason.trim() })
      router.push("/disputes")
    } catch (e: any) {
      setError(e.message || "Erreur lors de la création du litige")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/disputes">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Ouvrir un litige</h2>
          <p className="text-neutral-400 mt-1">Sélectionnez un contrat et décrivez le problème</p>
        </div>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader><CardTitle className="text-white">Nouveau litige</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-neutral-300">Contrat concerné</Label>
            {contracts.length === 0 ? (
              <p className="text-neutral-500 text-sm">Aucun contrat éligible trouvé.</p>
            ) : (
              <select
                value={selectedContract}
                onChange={(e) => setSelectedContract(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
              >
                <option value="">— Choisir un contrat —</option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>{c.mission.title}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Raison du litige</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              placeholder="Décrivez le problème rencontré en détail..."
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedContract || !reason.trim()}
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold w-full"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Ouvrir le litige
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
