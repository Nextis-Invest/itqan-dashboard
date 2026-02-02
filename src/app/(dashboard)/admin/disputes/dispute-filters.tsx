"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const statusTabs = [
  { value: "", label: "Tous" },
  { value: "OPEN", label: "Ouverts" },
  { value: "UNDER_REVIEW", label: "En examen" },
  { value: "RESOLVED", label: "Résolus" },
  { value: "CLOSED", label: "Fermés" },
]

const categories = [
  { value: "", label: "Toutes catégories" },
  { value: "QUALITY", label: "Qualité" },
  { value: "DELAY", label: "Retard" },
  { value: "PAYMENT", label: "Paiement" },
  { value: "SCOPE", label: "Périmètre" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "OTHER", label: "Autre" },
]

const priorities = [
  { value: "", label: "Toutes priorités" },
  { value: "LOW", label: "Faible" },
  { value: "MEDIUM", label: "Moyen" },
  { value: "HIGH", label: "Élevé" },
  { value: "CRITICAL", label: "Critique" },
]

export function AdminDisputeFilters({
  currentStatus,
  currentCategory,
  currentPriority,
}: {
  currentStatus: string
  currentCategory: string
  currentPriority: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/disputes?${params.toString()}`)
  }

  return (
    <div className="space-y-3">
      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap">
        {statusTabs.map((tab) => (
          <Button
            key={tab.value}
            variant="ghost"
            size="sm"
            onClick={() => updateFilter("status", tab.value)}
            className={`text-sm ${
              currentStatus === tab.value
                ? "bg-lime-400/10 text-lime-400 hover:bg-lime-400/20 hover:text-lime-400"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Dropdowns */}
      <div className="flex gap-3">
        <select
          value={currentCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="rounded-md border border-border bg-secondary text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={currentPriority}
          onChange={(e) => updateFilter("priority", e.target.value)}
          className="rounded-md border border-border bg-secondary text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
