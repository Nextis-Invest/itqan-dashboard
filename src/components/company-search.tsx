"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Loader2, Building2, X, PenLine } from "lucide-react"
import { Input } from "@/components/ui/input"

export interface CompanyResult {
  siren: string
  siret: string
  name: string
  address: string
  postalCode: string
  city: string
  legalForm: string
  legalFormCode: string
  activity: string
  activityLabel: string
  size: string
  createdAt: string
  dirigeants: { nom: string; prenom: string; qualite: string }[]
}

interface CompanySearchProps {
  onSelect: (company: CompanyResult) => void
  onManualMode?: () => void
  className?: string
}

export function CompanySearch({ onSelect, onManualMode, className }: CompanySearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<CompanyResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<CompanyResult | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/entreprises/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.data || [])
      setIsOpen(true)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSelect = (company: CompanyResult) => {
    setSelected(company)
    setIsOpen(false)
    setQuery("")
    onSelect(company)
  }

  const handleClear = () => {
    setSelected(null)
    setQuery("")
    setResults([])
  }

  if (selected) {
    return (
      <div className={className}>
        <div className="bg-secondary border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-lime-400/10 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="h-5 w-5 text-lime-400" />
              </div>
              <div>
                <p className="text-foreground font-medium">{selected.name}</p>
                <p className="text-muted-foreground text-sm mt-0.5">
                  SIREN: {selected.siren}
                  {selected.legalForm && ` · ${selected.legalForm}`}
                </p>
                {selected.city && (
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {selected.address ? `${selected.address}, ` : ""}{selected.postalCode} {selected.city}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1 shrink-0"
            >
              <X className="h-3.5 w-3.5" />
              Modifier
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Rechercher par nom ou SIREN..."
          className="pl-10 pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400/50"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-secondary border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {results.length === 0 && !isLoading ? (
            <div className="px-4 py-6 text-center text-muted-foreground text-sm">
              Aucun résultat trouvé
            </div>
          ) : (
            results.map((company) => (
              <button
                key={company.siren}
                type="button"
                onClick={() => handleSelect(company)}
                className="w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border last:border-0"
              >
                <p className="text-foreground text-sm font-medium">{company.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {company.siren}
                  {company.legalForm && ` · ${company.legalForm}`}
                  {company.city && ` · ${company.city}`}
                </p>
              </button>
            ))
          )}
        </div>
      )}

      {/* Manual mode link */}
      {onManualMode && (
        <button
          type="button"
          onClick={onManualMode}
          className="mt-2 text-sm text-muted-foreground hover:text-lime-400 transition-colors flex items-center gap-1.5"
        >
          <PenLine className="h-3.5 w-3.5" />
          Saisie manuelle
        </button>
      )}
    </div>
  )
}
