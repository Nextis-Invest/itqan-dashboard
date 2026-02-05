import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/dashboard")
  }

  // Check if user needs to complete account type selection
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  
  // Skip onboarding check if already on onboarding pages
  const isOnboardingPage = pathname.includes("/onboarding")

  if (!isOnboardingPage && user.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { freelancerProfile: { select: { id: true } }, clientProfile: { select: { id: true } } },
    })

    // If user has no profile, redirect to account type selection
    if (dbUser && !dbUser.freelancerProfile && !dbUser.clientProfile) {
      redirect("/onboarding/account-type")
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar
        variant="inset"
        user={{
          name: user.name || "Utilisateur",
          email: user.email || "",
          avatar: user.image || undefined,
          role: (user as any).role || "CLIENT",
        }}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
