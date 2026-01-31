"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/missions": "Missions",
  "/missions/new": "Nouvelle mission",
  "/freelances": "Freelances",
  "/messages": "Messages",
  "/settings": "Paramètres",
}

export function SiteHeader() {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (PAGE_TITLES[pathname]) {
      return PAGE_TITLES[pathname]
    }

    if (pathname.startsWith("/missions/")) {
      if (pathname.includes("/new")) return "Nouvelle mission"
      return "Détails mission"
    }

    return "Dashboard"
  }

  return (
    <header className="flex h-[--header-height] shrink-0 items-center border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white transition-colors" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4 bg-neutral-800"
          />
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-white">{getPageTitle()}</h1>
          </div>
        </div>
      </div>
    </header>
  )
}
