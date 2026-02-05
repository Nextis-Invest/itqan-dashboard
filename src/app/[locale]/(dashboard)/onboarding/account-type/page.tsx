import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { AccountTypeSelector } from "./account-type-selector"

export const metadata: Metadata = { title: "Choisir votre type de compte" }

export const dynamic = "force-dynamic"

export default async function AccountTypePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { freelancerProfile: true, clientProfile: true },
  })

  if (!user) redirect("/login")

  // If user already has a profile, skip to dashboard
  if (user.freelancerProfile || user.clientProfile) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400/20 to-emerald-400/20 border border-lime-400/20">
            <span className="text-3xl">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Bienvenue sur Itqan{user.name ? `, ${user.name.split(" ")[0]}` : ""} !
            </h1>
            <p className="text-muted-foreground mt-2">
              Comment souhaitez-vous utiliser la plateforme ?
            </p>
          </div>
        </div>

        <AccountTypeSelector userId={user.id} />

        <p className="text-center text-xs text-muted-foreground">
          Vous pourrez modifier ce choix plus tard dans vos paramètres
        </p>
      </div>
    </div>
  )
}
