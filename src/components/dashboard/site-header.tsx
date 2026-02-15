"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, ChevronRight, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUnreadCount } from "@/lib/actions/notification"
import { cn } from "@/lib/utils"

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

const PAGE_PARENTS: Record<string, { title: string; url: string }> = {
  "/missions/new": { title: "Missions", url: "/missions" },
  "/missions/explore": { title: "Missions", url: "/missions" },
  "/disputes/new": { title: "Litiges", url: "/disputes" },
  "/support/new": { title: "Support", url: "/support" },
  "/admin/users": { title: "Administration", url: "/admin" },
  "/admin/missions": { title: "Administration", url: "/admin" },
  "/admin/disputes": { title: "Administration", url: "/admin" },
  "/admin/support": { title: "Administration", url: "/admin" },
}

export function SiteHeader() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    getUnreadCount().then(setUnreadCount).catch(() => {})
    const interval = setInterval(() => {
      getUnreadCount().then(setUnreadCount).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const getPageTitle = () => {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
    if (pathname.startsWith("/missions/")) {
      if (pathname.includes("/new")) return "Nouvelle mission"
      if (pathname.includes("/edit")) return "Modifier la mission"
      if (pathname.includes("/explore")) return "Explorer les missions"
      return "Détails mission"
    }
    if (pathname.startsWith("/contracts/")) return "Détails contrat"
    if (pathname.startsWith("/profile/")) return "Profil"
    if (pathname.startsWith("/support/") && !pathname.startsWith("/support/new")) return "Ticket support"
    if (pathname.startsWith("/disputes/")) return "Détail du litige"
    if (pathname.startsWith("/admin/disputes/")) return "Gestion du litige"
    if (pathname.startsWith("/admin/support/")) return "Ticket support"
    if (pathname.startsWith("/admin/")) return "Administration"
    return ""
  }

  const parent = PAGE_PARENTS[pathname]
  const pageTitle = getPageTitle()

  return (
    <header className="relative flex h-[--header-height] shrink-0 items-center bg-background/60 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
        {/* Left side: trigger + breadcrumb */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200 rounded-md" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4 bg-secondary"
          />
          <div className="flex items-center gap-1.5">
            {parent && (
              <>
                <Link
                  href={parent.url}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground/80 transition-colors"
                >
                  {parent.title}
                </Link>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </>
            )}
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right side: notifications + avatar */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <Link
            href="/notifications"
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200",
              "hover:text-foreground hover:bg-secondary/60",
              unreadCount > 0 && "text-foreground/80"
            )}
          >
            <Bell className="h-[18px] w-[18px]" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-lime-400 px-1 text-[10px] font-bold text-black shadow-lg shadow-lime-400/30"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-full bg-lime-400 animate-ping opacity-30" />
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-secondary/60"
            aria-label="Changer de thème"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-secondary mx-1" />

          {/* User avatar quick link */}
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-secondary/60 group"
          >
            <Avatar className="size-7 border border-border group-hover:border-lime-400/40 transition-colors duration-300">
              <AvatarFallback className="bg-gradient-to-br from-lime-400/20 to-emerald-400/20 text-lime-400 text-[10px] font-semibold">
                U
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />
    </header>
  )
}
