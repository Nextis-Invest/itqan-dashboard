"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

export function MarketplaceSearchBar() {
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const t = useTranslations('categories')
  const router = useRouter()

  const suggestions = [
    "React",
    "UX Design", 
    "SEO",
    "Community Manager",
  ]

  const handleSubmit = (value: string) => {
    const text = value || query
    if (!text.trim()) return
    const encoded = encodeURIComponent(text.trim())
    router.push(`/marketplace/search?q=${encoded}`)
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div
        className={`relative flex items-center rounded-full border transition-all duration-300 ${
          focused
            ? "border-lime-400/50 bg-card shadow-[0_0_30px_rgba(163,230,53,0.15)]"
            : "border-border bg-card"
        }`}
      >
        <Search className="ml-3 sm:ml-4 h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(query)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 min-w-0 bg-transparent px-2 sm:px-3 py-3 sm:py-3.5 text-foreground placeholder-muted-foreground outline-none text-sm"
        />
        <button
          onClick={() => handleSubmit(query)}
          className="mr-1.5 flex h-8 sm:h-9 shrink-0 items-center justify-center rounded-full bg-lime-400 text-black font-medium px-3 sm:px-4 transition-all hover:bg-lime-300 active:scale-95 text-xs sm:text-sm gap-1.5"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Rechercher</span>
        </button>
      </div>

      {/* Suggestion chips */}
      <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s)
              handleSubmit(s)
            }}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-all hover:border-lime-400/30 hover:bg-accent hover:text-foreground whitespace-nowrap"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
