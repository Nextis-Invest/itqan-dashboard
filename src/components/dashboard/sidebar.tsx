"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Briefcase,
  Users,
  MessageSquare,
  FileText,
  Search,
  Package,
  CreditCard,
  ClipboardList,
  ShieldCheck,
  AlertTriangle,
  Headphones,
  PlusCircle,
  DollarSign,
  FileCheck,
  Bell,
  Heart,
  Key,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
}

function getNavigation(role?: string): { main: NavItem[]; system: NavItem[] } {
  if (role === "ADMIN") {
    return {
      main: [
        { title: "Tableau de bord", url: "/admin", icon: LayoutDashboard },
        { title: "Utilisateurs", url: "/admin/users", icon: Users },
        { title: "Missions", url: "/admin/missions", icon: Briefcase },
        { title: "Factures", url: "/admin/invoices", icon: FileText },
        { title: "Litiges", url: "/admin/disputes", icon: AlertTriangle },
        { title: "Support", url: "/admin/support", icon: Headphones },
      ],
      system: [
        { title: "Clés API", url: "/settings/api-keys", icon: Key },
        { title: "Paramètres", url: "/settings", icon: Settings },
      ],
    }
  }

  if (role === "FREELANCER") {
    return {
      main: [
        { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
        { title: "Missions", url: "/missions", icon: Briefcase },
        { title: "Explorer les missions", url: "/missions/explore", icon: Search },
        { title: "Mes Gigs", url: "/gigs", icon: Package },
        { title: "Mes propositions", url: "/proposals", icon: FileText },
        { title: "Contrats", url: "/contracts", icon: FileCheck },
        { title: "Litiges", url: "/disputes", icon: ShieldCheck },
        { title: "Messages", url: "/messages", icon: MessageSquare },
        { title: "Notifications", url: "/notifications", icon: Bell },
        { title: "Favoris", url: "/favorites", icon: Heart },
        { title: "Mon Profil", url: "/profile", icon: User },
      ],
      system: [
        { title: "TJM & Dispo", url: "/freelancer/tjm", icon: DollarSign },
        { title: "Support", url: "/support", icon: Headphones },
        { title: "Paramètres", url: "/settings", icon: Settings },
      ],
    }
  }

  return {
    main: [
      { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
      { title: "Mes Missions", url: "/missions", icon: Briefcase },
      { title: "Publier", url: "/missions/new", icon: PlusCircle },
      { title: "Contrats", url: "/contracts", icon: FileCheck },
      { title: "Messages", url: "/messages", icon: MessageSquare },
      { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "Favoris", url: "/favorites", icon: Heart },
      { title: "Mes factures", url: "/invoices", icon: FileText },
      { title: "Crédits", url: "/credits", icon: CreditCard },
      { title: "Litiges", url: "/disputes", icon: ShieldCheck },
      { title: "Commandes", url: "/orders", icon: ClipboardList },
      { title: "Mon Profil", url: "/profile", icon: User },
    ],
    system: [
      { title: "Support", url: "/support", icon: Headphones },
      { title: "Paramètres", url: "/settings", icon: Settings },
    ],
  }
}

export function DashboardSidebar({ user, ...props }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { main: navigationItems, system: settingsItems } = getNavigation(user?.role)

  const isActive = (url: string) => {
    if (url === "/dashboard" || url === "/admin") return pathname === url
    return pathname.startsWith(url)
  }

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/80 overflow-x-hidden">
      {/* Logo header with subtle glow */}
      <SidebarHeader className="border-b border-border/60 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="hover:bg-transparent">
              <Link
                href={user?.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 group"
              >
                <div className="relative">
                  <Image
                    src="/icons/Itqan-Logo-icon.svg"
                    alt="Itqan"
                    width={40}
                    height={40}
                    className="h-10 w-10 transition-all duration-300 dark:brightness-100 brightness-0"
                    priority
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 overflow-x-hidden">
        {/* Navigation section header */}
        <div className="mb-2 px-3 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Navigation
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        <SidebarMenu>
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.url)
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={active}
                  className={cn(
                    "transition-all duration-200 relative group/item",
                    active
                      ? "bg-gradient-to-r from-[color-mix(in_oklch,var(--brand),transparent_85%)] to-transparent text-[var(--brand)] border-l-2 border-[var(--brand)]"
                      : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground border-l-2 border-transparent"
                  )}
                >
                  <Link href={item.url}>
                    <Icon
                      className={cn(
                        "size-4 transition-colors duration-200",
                        active
                          ? "text-lime-400"
                          : "text-muted-foreground group-hover/item:text-lime-400"
                      )}
                    />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <SidebarSeparator className="my-4 bg-secondary/60" />

        {/* System section header */}
        <div className="mb-2 px-3 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Système
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        <SidebarMenu>
          {settingsItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.url)
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={active}
                  className={cn(
                    "transition-all duration-200 relative group/item",
                    active
                      ? "bg-gradient-to-r from-[color-mix(in_oklch,var(--brand),transparent_85%)] to-transparent text-[var(--brand)] border-l-2 border-[var(--brand)]"
                      : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground border-l-2 border-transparent"
                  )}
                >
                  <Link href={item.url}>
                    <Icon
                      className={cn(
                        "size-4 transition-colors duration-200",
                        active
                          ? "text-[var(--brand)]"
                          : "text-muted-foreground group-hover/item:text-[var(--brand)]"
                      )}
                    />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 pt-4">
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" className="hover:bg-secondary/70 transition-all duration-200 group/user">
                <Link href="/profile" className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="size-8 border-2 border-border group-hover/user:border-[color-mix(in_oklch,var(--brand),transparent_60%)] transition-colors duration-300">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[color-mix(in_oklch,var(--brand),transparent_80%)] to-emerald-400/20 text-[var(--brand)] text-xs font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online status ring */}
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-foreground text-sm group-hover/user:text-[color-mix(in_oklch,var(--brand),transparent_10%)] transition-colors">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                      {user.email}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 text-muted-foreground"
              >
                <button
                  className="w-full"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="size-4" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-secondary/70 transition-all duration-200 text-muted-foreground hover:text-foreground"
              >
                <Link href="/login">
                  <User className="size-4" />
                  <span className="font-medium">Connexion</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
