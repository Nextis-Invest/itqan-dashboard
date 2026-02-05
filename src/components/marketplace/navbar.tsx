"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Search, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import { getSeoSuffix } from "@/lib/seo-suffixes"

interface Subcategory {
  slug: string
  name: string
}

interface Category {
  slug: string
  name: string
  icon: string | null
  children?: Subcategory[]
}

interface MarketplaceNavbarProps {
  categories: Category[]
}

export function MarketplaceNavbar({ categories }: MarketplaceNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const params = useParams()
  
  // Get locale from params or pathname
  const locale = (params?.locale as string) || pathname?.split("/")[1] || "fr"

  // Detect current category from URL
  const currentCategorySlug = useMemo(() => {
    const match = pathname?.match(/\/marketplace\/categories\/([^/]+)/)
    return match ? match[1] : null
  }, [pathname])

  // Get current category with subcategories
  const currentCategory = useMemo(() => {
    if (!currentCategorySlug) return null
    return categories.find(cat => cat.slug === currentCategorySlug) || null
  }, [currentCategorySlug, categories])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/marketplace/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  // Build subcategory URL with SEO suffix
  const buildSubcategoryUrl = (categorySlug: string, subcategorySlug: string) => {
    const suffix = getSeoSuffix(locale)
    return `/marketplace/categories/${categorySlug}/${subcategorySlug}${suffix}`
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
            : "bg-background"
        }`}
      >
        <div className={`transition-all duration-300 ${scrolled ? "px-4 md:px-6" : "max-w-5xl mx-auto px-4 pt-3"}`}>
          <div
            className={`flex items-center gap-4 h-14 transition-all duration-300 ${
              scrolled
                ? ""
                : "bg-card/90 backdrop-blur-xl rounded-full px-6 border border-border/50"
            }`}
          >
            {/* Logo */}
            <Link href="/marketplace" className="shrink-0">
              <Logo
                width={100}
                height={34}
                className="h-8 w-auto"
              />
            </Link>

            {/* Search bar — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-auto"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-400/50 transition-colors"
                />
              </div>
            </form>

            {/* Right side — desktop */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                href="/login"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="text-sm bg-lime-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-lime-300 transition-colors"
              >
                S&apos;inscrire
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden ml-auto text-foreground/80 hover:text-foreground transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Categories bar — main categories */}
        <div className={`hidden md:block ${scrolled ? "border-t border-border/50" : "mt-2"}`}>
          <div className={`relative ${scrolled ? "px-4 md:px-6" : "max-w-5xl mx-auto px-4"}`}>
            {/* Gradient fade left */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            {/* Gradient fade right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
              {categories.map((cat) => {
                const isActive = currentCategorySlug === cat.slug
                return (
                  <Link
                    key={cat.slug}
                    href={`/marketplace/categories/${cat.slug}`}
                    className={`whitespace-nowrap px-3 py-2 text-[13px] font-medium transition-colors border-b-2 ${
                      isActive
                        ? "text-lime-400 border-lime-400"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                    }`}
                  >
                    {cat.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Subcategories bar — shown when on a category page */}
        {currentCategory && currentCategory.children && currentCategory.children.length > 0 && (
          <div className="hidden md:block border-t border-border/30 bg-card/50">
            <div className={`relative ${scrolled ? "px-4 md:px-6" : "max-w-5xl mx-auto px-4"}`}>
              {/* Gradient fade left */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card/50 to-transparent z-10 pointer-events-none" />
              {/* Gradient fade right */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card/50 to-transparent z-10 pointer-events-none" />

              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
                {currentCategory.children.map((sub) => {
                  const subUrl = buildSubcategoryUrl(currentCategory.slug, sub.slug)
                  const isSubActive = pathname?.includes(`/${sub.slug}`)
                  return (
                    <Link
                      key={sub.slug}
                      href={subUrl}
                      className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                        isSubActive
                          ? "bg-lime-400/20 text-lime-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="pt-20 px-6 space-y-6 overflow-y-auto max-h-screen pb-20">
              {/* Mobile search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher un service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-400/50"
                  />
                </div>
              </form>

              {/* Categories with subcategories */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Catégories
                </p>
                {categories.map((cat) => {
                  const isActive = currentCategorySlug === cat.slug
                  return (
                    <div key={cat.slug} className="space-y-1">
                      <Link
                        href={`/marketplace/categories/${cat.slug}`}
                        className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-lime-400/10 text-lime-400 font-medium"
                            : "text-foreground/80 hover:bg-card hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </Link>
                      {/* Show subcategories if this is the active category */}
                      {isActive && cat.children && cat.children.length > 0 && (
                        <div className="pl-4 space-y-1">
                          {cat.children.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={buildSubcategoryUrl(cat.slug, sub.slug)}
                              className="block px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Auth links */}
              <div className="space-y-3 pt-4 border-t border-border">
                <Link
                  href="/login"
                  className="block w-full text-center py-3 rounded-xl border border-border text-foreground/80 hover:bg-card hover:text-foreground transition-colors text-sm"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition-colors text-sm"
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to push content below the navbar */}
      <div className={`${currentCategory?.children?.length ? "h-[148px] md:h-[140px]" : "h-[120px] md:h-[108px]"}`} />
    </>
  )
}
