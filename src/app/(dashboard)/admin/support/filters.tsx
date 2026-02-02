"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusTabs = [
  { value: "ALL", label: "Tous" },
  { value: "OPEN", label: "Ouverts" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "RESOLVED", label: "Résolus" },
  { value: "CLOSED", label: "Fermés" },
]

export function AdminSupportFilters({
  currentStatus,
  currentPriority,
  currentCategory,
}: {
  currentStatus?: string
  currentPriority?: string
  currentCategory?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "ALL" || !value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/admin/support?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tabs value={currentStatus || "ALL"} onValueChange={(v) => updateParam("status", v)}>
        <TabsList className="bg-card border border-border">
          {statusTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-lime-400/10 data-[state=active]:text-lime-400 text-muted-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Select value={currentPriority || "ALL"} onValueChange={(v) => updateParam("priority", v)}>
        <SelectTrigger className="w-[140px] bg-card border-border text-foreground/80">
          <SelectValue placeholder="Priorité" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="ALL">Toutes priorités</SelectItem>
          <SelectItem value="LOW">Faible</SelectItem>
          <SelectItem value="MEDIUM">Moyen</SelectItem>
          <SelectItem value="HIGH">Élevé</SelectItem>
          <SelectItem value="URGENT">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentCategory || "ALL"} onValueChange={(v) => updateParam("category", v)}>
        <SelectTrigger className="w-[150px] bg-card border-border text-foreground/80">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="ALL">Toutes catégories</SelectItem>
          <SelectItem value="GENERAL">Général</SelectItem>
          <SelectItem value="PAYMENT">Paiement</SelectItem>
          <SelectItem value="TECHNICAL">Technique</SelectItem>
          <SelectItem value="ACCOUNT">Compte</SelectItem>
          <SelectItem value="MISSION">Mission</SelectItem>
          <SelectItem value="OTHER">Autre</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
