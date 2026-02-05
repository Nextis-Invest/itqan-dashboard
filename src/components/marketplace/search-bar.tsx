"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

interface MarketplaceSearchBarProps {
  /** "default" for regular pages, "hero" for dark gradient backgrounds */
  variant?: "default" | "hero"
  /** Show suggestion chips below the search bar */
  showSuggestions?: boolean
  /** Custom placeholder (overrides translation) */
  placeholder?: string
  /** Additional classes */
  className?: string
}

export function MarketplaceSearchBar({ 
  variant = "default",
  showSuggestions = true,
  placeholder,
  className = ""
}: MarketplaceSearchBarProps) {
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

  const isHero = variant === "hero"

  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <div
        className={`relative flex items-center rounded-full border transition-all duration-300 ${
          focused
            ? isHero
              ? "border-lime-400/50 bg-black/60 shadow-[0_0_30px_rgba(163,230,53,0.15)] backdrop-blur-md"
              : "border-lime-400/50 bg-card shadow-[0_0_30px_rgba(163,230,53,0.15)]"
            : isHero
              ? "border-white/10 bg-black/40 backdrop-blur-md"
              : "border-border bg-card"
        }`}
      >
        <Search className={`ml-3 sm:ml-4 h-4 w-4 shrink-0 ${isHero ? "text-neutral-500" : "text-muted-foreground"}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(query)}
          placeholder={placeholder || t('searchPlaceholder')}
          className={`flex-1 min-w-0 bg-transparent px-2 sm:px-3 py-3 sm:py-3.5 outline-none text-sm ${
            isHero 
              ? "text-white placeholder-neutral-500" 
              : "text-foreground placeholder-muted-foreground"
          }`}
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
      {showSuggestions && (
        <div className={`mt-3 flex flex-wrap gap-1.5 sm:gap-2 ${isHero ? "justify-center" : ""}`}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s)
                handleSubmit(s)
              }}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-all whitespace-nowrap ${
                isHero
                  ? "border-white/10 bg-white/5 text-neutral-400 hover:border-lime-400/30 hover:bg-white/10 hover:text-white"
                  : "border-border bg-card text-muted-foreground hover:border-lime-400/30 hover:bg-accent hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
