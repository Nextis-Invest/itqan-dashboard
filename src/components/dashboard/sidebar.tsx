"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Image from "next/image"
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
        { title: "Litiges", url: "/admin/disputes", icon: AlertTriangle },
        { title: "Support", url: "/admin/support", icon: Headphones },
      ],
      system: [
        { title: "Paramètres", url: "/settings", icon: Settings },
      ],
    }
  }

  if (role === "FREELANCER") {
    return {
      main: [
        { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
        { title: "Mes Gigs", url: "/gigs", icon: Package },
        { title: "Rechercher", url: "/search", icon: Search },
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
        { title: "Paramètres", url: "/settings", icon: Settings },
      ],
    }
  }

  // CLIENT (default)
  return {
    main: [
      { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
      { title: "Mes Missions", url: "/missions", icon: Briefcase },
      { title: "Publier", url: "/missions/new", icon: PlusCircle },
      { title: "Contrats", url: "/contracts", icon: FileCheck },
      { title: "Messages", url: "/messages", icon: MessageSquare },
      { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "Favoris", url: "/favorites", icon: Heart },
      { title: "Crédits", url: "/credits", icon: CreditCard },
      { title: "Litiges", url: "/disputes", icon: ShieldCheck },
      { title: "Commandes", url: "/orders", icon: ClipboardList },
      { title: "Mon Profil", url: "/profile", icon: User },
    ],
    system: [
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
    <Sidebar collapsible="icon" {...props} className="border-r border-neutral-800">
      <SidebarHeader className="border-b border-neutral-800 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="hover:bg-transparent">
              <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex items-center gap-2">
                <Image src="/icons/itqan-logo.svg" alt="Itqan" width={120} height={40} className="h-10 w-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <div className="mb-2 px-3">
          <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-medium">
            Navigation
          </span>
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
                  className={`transition-all duration-200 ${
                    active
                      ? "bg-lime-400/10 text-lime-400 border-l-2 border-lime-400"
                      : "hover:bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Link href={item.url}>
                    <Icon className="size-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <SidebarSeparator className="my-4 bg-neutral-800" />

        <div className="mb-2 px-3">
          <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-medium">
            Système
          </span>
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
                  className={`transition-all duration-200 ${
                    active
                      ? "bg-lime-400/10 text-lime-400 border-l-2 border-lime-400"
                      : "hover:bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Link href={item.url}>
                    <Icon className="size-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800 pt-4">
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" className="hover:bg-neutral-800 transition-colors">
                <Link href="/profile" className="flex items-center gap-3">
                  <Avatar className="size-8 border border-neutral-700">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-lime-400/10 text-lime-400 text-xs font-medium">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-white text-sm">{user.name}</span>
                    <span className="text-[11px] text-neutral-500 truncate max-w-[140px]">
                      {user.email}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-red-500/10 hover:text-red-400 transition-colors text-neutral-400"
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
              <SidebarMenuButton asChild className="hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white">
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
