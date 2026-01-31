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
import { Search } from "lucide-react"
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
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Rechercher une mission..."
            className="pl-9 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
          />
        </div>

        <Select value={category || "__all__"} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px] bg-neutral-800 border-neutral-700 text-white">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            <SelectItem value="__all__">Toutes catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-end">
        <div className="flex gap-2 items-center">
          <Input
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            type="number"
            placeholder="Budget min"
            className="w-32 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
          />
          <span className="text-neutral-500">—</span>
          <Input
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            type="number"
            placeholder="Budget max"
            className="w-32 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRemote(!remote)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              remote ? "bg-lime-400" : "bg-neutral-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                remote ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-neutral-300 text-sm">Remote uniquement</span>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            Réinitialiser
          </Button>
          <Button
            onClick={applyFilters}
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
          >
            <Search className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
        </div>
      </div>
    </div>
  )
}
