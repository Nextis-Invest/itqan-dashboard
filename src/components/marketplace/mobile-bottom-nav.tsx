"use client"

import Link from "next/link"
import { Home, Search, Plus, User, Menu, Briefcase, LogIn, ChevronDown, ArrowRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import Image from "next/image"

const categories = [
  { slug: "graphics-design", name: "Graphisme & Design" },
  { slug: "programming-tech", name: "Programmation & Tech" },
  { slug: "online-marketing", name: "Marketing Digital" },
  { slug: "video-animation", name: "Vidéo & Animation" },
  { slug: "writing-translation", name: "Rédaction & Traduction" },
  { slug: "business", name: "Business" },
]

export function MobileBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden">
      <div className="grid grid-cols-5 items-center bg-black border-t border-white/10 px-1 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {/* Accueil */}
        <Link 
          href="/marketplace" 
          className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-neutral-400 hover:text-lime-300 active:text-lime-400 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Accueil</span>
        </Link>

        {/* Recherche */}
        <Link 
          href="/marketplace/search" 
          className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-neutral-400 hover:text-lime-300 active:text-lime-400 transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium">Recherche</span>
        </Link>

        {/* CTA central — bouton + */}
        <div className="flex justify-center">
          <Link
            href="/missions/new"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-lime-400 text-black active:scale-95 transition-transform shadow-lg shadow-lime-400/20"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Connexion */}
        <Link 
          href="/login" 
          className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-neutral-400 hover:text-lime-300 active:text-lime-400 transition-colors"
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Compte</span>
        </Link>

        {/* Menu hamburger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-neutral-400 hover:text-lime-300 transition-colors">
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-medium">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="bg-black/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl p-0 h-[70vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <Image 
                src="/icons/itqan-logo.svg" 
                alt="Itqan" 
                width={120} 
                height={40} 
                className="h-8 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 mt-2 text-white overflow-y-auto px-2 pb-4">
              {/* Catégories collapsible */}
              <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-white/5 hover:text-lime-300 transition-colors rounded-xl">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm">Catégories</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col bg-white/5 border-l-2 border-lime-400/30 ml-4 rounded-lg">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/marketplace/categories/${cat.slug}`}
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-3 pl-8 pr-4 py-2.5 hover:bg-white/5 hover:text-lime-300 transition-colors text-left"
                      >
                        <ArrowRight className="h-3 w-3 text-neutral-500" />
                        <span className="text-sm">{cat.name}</span>
                      </Link>
                    ))}
                    <Link
                      href="/marketplace/categories"
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center gap-3 pl-8 pr-4 py-2.5 hover:bg-white/5 text-lime-400 transition-colors text-left"
                    >
                      <ArrowRight className="h-3 w-3" />
                      <span className="text-sm font-medium">Voir toutes</span>
                    </Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Publier une mission */}
              <Link
                href="/missions/new"
                onClick={() => setSheetOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-lime-300 transition-colors rounded-xl"
              >
                <Plus className="h-4 w-4 text-neutral-400" />
                <span className="text-sm">Publier une mission</span>
              </Link>

              {/* Connexion */}
              <Link
                href="/login"
                onClick={() => setSheetOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-lime-300 transition-colors rounded-xl"
              >
                <LogIn className="h-4 w-4 text-neutral-400" />
                <span className="text-sm">Connexion / Inscription</span>
              </Link>
            </nav>

            {/* Footer CTA */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4 bg-black/95 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <Link
                href="/missions/new"
                onClick={() => setSheetOpen(false)}
                className="flex items-center justify-center w-full bg-lime-400 text-black font-medium rounded-full px-6 py-3 hover:bg-lime-300 transition-all"
              >
                Soumettre une demande
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
