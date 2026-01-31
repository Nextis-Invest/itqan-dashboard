"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Category {
  slug: string
  name: string
  icon: string | null
}

interface MarketplaceNavbarProps {
  categories: Category[]
}

export function MarketplaceNavbar({ categories }: MarketplaceNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

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
      window.location.href = `/categories?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-neutral-950 backdrop-blur-xl border-b border-neutral-800 shadow-lg shadow-black/20"
            : "bg-neutral-950"
        }`}
      >
        <div className={`transition-all duration-300 px-6 md:px-10 ${scrolled ? "" : "pt-3"}`}>
          <div
            className={`flex items-center gap-4 h-14 transition-all duration-300 ${
              scrolled
                ? ""
                : "bg-neutral-900/90 backdrop-blur-xl rounded-full px-6 border border-neutral-800/50"
            }`}
          >
            {/* Logo */}
            <Link href="/marketplace/categories" className="shrink-0">
              <Image
                src="/icons/itqan-logo.svg"
                alt="Itqan"
                width={160}
                height={48}
                className="h-14 w-auto"
              />
            </Link>

            {/* Search bar — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-auto"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-lime-400/50 transition-colors"
                />
              </div>
            </form>

            {/* Right side — desktop */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                href="/login"
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/login"
                className="text-sm bg-lime-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-lime-300 transition-colors"
              >
                S&apos;inscrire
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden ml-auto text-neutral-300 hover:text-white transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Categories bar — always visible, full width */}
        <div className={`hidden md:block ${scrolled ? "border-t border-neutral-800/50" : "mt-2"}`}>
          <div className="relative px-6 md:px-10">
            {/* Gradient fade left */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
            {/* Gradient fade right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

            <div className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide py-2">
              {categories.map((cat) => {
                const isActive = pathname?.startsWith(`/marketplace/categories/${cat.slug}`)
                return (
                  <Link
                    key={cat.slug}
                    href={`/marketplace/categories/${cat.slug}`}
                    className={`whitespace-nowrap px-3 py-2 text-[13px] font-medium transition-colors border-b-2 ${
                      isActive
                        ? "text-lime-400 border-lime-400"
                        : "text-neutral-400 border-transparent hover:text-white hover:border-neutral-600"
                    }`}
                  >
                    {cat.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-neutral-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="pt-20 px-6 space-y-6">
              {/* Mobile search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Rechercher un service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-lime-400/50"
                  />
                </div>
              </form>

              {/* Categories */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  Catégories
                </p>
                {categories.map((cat) => {
                  const isActive = pathname?.startsWith(`/marketplace/categories/${cat.slug}`)
                  return (
                    <Link
                      key={cat.slug}
                      href={`/marketplace/categories/${cat.slug}`}
                      className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-lime-400/10 text-lime-400 font-medium"
                          : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  )
                })}
              </div>

              {/* Auth links */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <Link
                  href="/login"
                  className="block w-full text-center py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors text-sm"
                >
                  Se connecter
                </Link>
                <Link
                  href="/login"
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
      <div className="h-[120px] md:h-[108px]" />
    </>
  )
}
