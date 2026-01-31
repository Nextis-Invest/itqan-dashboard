"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getUnreadCount } from "@/lib/actions/notification"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/missions": "Missions",
  "/missions/new": "Nouvelle mission",
  "/missions/explore": "Explorer les missions",
  "/freelances": "Freelances",
  "/messages": "Messages",
  "/settings": "Paramètres",
  "/contracts": "Contrats",
  "/notifications": "Notifications",
  "/favorites": "Favoris",
  "/proposals": "Propositions",
  "/profile": "Mon profil",
  "/gigs": "Mes services",
  "/gigs/new": "Nouveau service",
  "/search": "Recherche",
  "/credits": "Crédits",
  "/orders": "Historique",
  "/disputes": "Litiges",
  "/disputes/new": "Nouveau litige",
  "/admin": "Administration",
  "/admin/users": "Gestion des utilisateurs",
  "/admin/missions": "Gestion des missions",
  "/admin/disputes": "Gestion des litiges",
  "/admin/support": "Support",
  "/support": "Support",
  "/support/new": "Nouveau ticket",
}

export function SiteHeader() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    getUnreadCount().then(setUnreadCount).catch(() => {})
    const interval = setInterval(() => {
      getUnreadCount().then(setUnreadCount).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const getPageTitle = () => {
    if (PAGE_TITLES[pathname]) {
      return PAGE_TITLES[pathname]
    }

    if (pathname.startsWith("/missions/")) {
      if (pathname.includes("/new")) return "Nouvelle mission"
      if (pathname.includes("/edit")) return "Modifier la mission"
      if (pathname.includes("/explore")) return "Explorer les missions"
      return "Détails mission"
    }

    if (pathname.startsWith("/contracts/")) return "Détails contrat"
    if (pathname.startsWith("/gigs/")) return "Détails service"
    if (pathname.startsWith("/profile/")) return "Profil"
    if (pathname.startsWith("/support/") && !pathname.startsWith("/support/new")) return "Ticket support"
    if (pathname.startsWith("/disputes/")) return "Détail du litige"
    if (pathname.startsWith("/admin/disputes/")) return "Gestion du litige"
    if (pathname.startsWith("/admin/support/")) return "Ticket support"
    if (pathname.startsWith("/admin/")) return "Administration"

    return ""
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
        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-neutral-800"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-lime-400 px-1 text-[10px] font-bold text-neutral-900">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
