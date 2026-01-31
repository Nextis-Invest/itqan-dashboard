"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Loader2, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"

export interface AddressResult {
  label: string
  street: string
  housenumber: string
  postcode: string
  city: string
  context: string
}

interface AddressSearchProps {
  onSelect: (result: { address: string; postalCode: string; city: string; region: string }) => void
  defaultValue?: string
  className?: string
}

export function AddressSearch({ onSelect, defaultValue, className }: AddressSearchProps) {
  const [query, setQuery] = useState(defaultValue || "")
  const [results, setResults] = useState<AddressResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 3) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/adresse/search?q=${encodeURIComponent(q)}`)
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
    if (query.trim().length < 3) {
      setResults([])
      setIsOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSelect = (item: AddressResult) => {
    const street = item.housenumber
      ? `${item.housenumber} ${item.street}`
      : item.street || item.label
    setQuery(item.label)
    setIsOpen(false)
    // context format: "75, Paris, Île-de-France" — extract region from last part
    const contextParts = item.context.split(",").map((s) => s.trim())
    const region = contextParts.length >= 3 ? contextParts[contextParts.length - 1] : ""
    onSelect({
      address: street,
      postalCode: item.postcode,
      city: item.city,
      region,
    })
  }

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Tapez votre adresse..."
          className="pl-10 pr-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 animate-spin" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {results.length === 0 && !isLoading ? (
            <div className="px-4 py-6 text-center text-neutral-500 text-sm">
              Aucune adresse trouvée
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={`${item.label}-${i}`}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 hover:bg-neutral-700/50 transition-colors border-b border-neutral-700/50 last:border-0 flex items-start gap-2.5"
              >
                <MapPin className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white text-sm">{item.label}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{item.context}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
