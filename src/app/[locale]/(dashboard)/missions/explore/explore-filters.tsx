"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { categories } from "@/lib/categories"

interface ExploreFiltersProps {
  currentQ: string
  currentCategory: string
  currentBudgetMin: string
  currentBudgetMax: string
  currentRemote: boolean
}

export function ExploreFilters({
  currentQ,
  currentCategory,
  currentBudgetMin,
  currentBudgetMax,
  currentRemote,
}: ExploreFiltersProps) {
  const router = useRouter()
  const [q, setQ] = useState(currentQ)
  const [category, setCategory] = useState(currentCategory)
  const [budgetMin, setBudgetMin] = useState(currentBudgetMin)
  const [budgetMax, setBudgetMax] = useState(currentBudgetMax)
  const [remote, setRemote] = useState(currentRemote)

  const hasFilters = category || budgetMin || budgetMax || remote

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (category && category !== "__all__") params.set("category", category)
    if (budgetMin) params.set("budgetMin", budgetMin)
    if (budgetMax) params.set("budgetMax", budgetMax)
    if (remote) params.set("remote", "true")
    router.push(`/missions/explore?${params.toString()}`)
  }

  const clearFilters = () => {
    setQ("")
    setCategory("")
    setBudgetMin("")
    setBudgetMax("")
    setRemote(false)
    router.push("/missions/explore")
  }

  return (
    <div className="space-y-4">
      {/* Search bar - prominent */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          placeholder="Rechercher une demande par titre, compétence, description..."
          className="pl-12 pr-4 py-6 bg-card border-border text-foreground text-base placeholder:text-muted-foreground focus:border-lime-400/50 focus:ring-lime-400/20 rounded-xl"
        />
      </div>

      {/* Horizontal filter bar */}
      <div className="flex items-center gap-3 flex-wrap rounded-xl bg-card/80 border border-border p-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-lime-400" />
          <span className="hidden sm:inline">Filtres</span>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Category */}
        <Select value={category || "__all__"} onValueChange={setCategory}>
          <SelectTrigger className="w-auto min-w-[160px] bg-secondary/50 border-border text-foreground text-sm rounded-lg h-9">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-secondary border-border">
            <SelectItem value="__all__">Toutes catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Budget range */}
        <div className="flex items-center gap-2">
          <Input
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            type="number"
            placeholder="Min"
            className="w-24 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50 text-sm rounded-lg h-9"
          />
          <span className="text-muted-foreground/60 text-sm">—</span>
          <Input
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            type="number"
            placeholder="Max"
            className="w-24 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50 text-sm rounded-lg h-9"
          />
        </div>

        {/* Remote toggle pill */}
        <button
          type="button"
          onClick={() => setRemote(!remote)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
            remote
              ? "bg-lime-400 text-neutral-900 border-lime-400"
              : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground hover:border-border"
          }`}
        >
          🌍 Remote
        </button>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground hover:bg-accent h-9 px-3"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Effacer
            </Button>
          )}
          <Button
            size="sm"
            onClick={applyFilters}
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold h-9 px-4 shadow-lg shadow-lime-400/10"
          >
            <Search className="mr-1.5 h-3.5 w-3.5" />
            Filtrer
          </Button>
        </div>
      </div>
    </div>
  )
}
