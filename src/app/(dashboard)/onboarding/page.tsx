import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Onboarding" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { FreelancerOnboardingForm } from "./freelancer-form"
import { ClientOnboardingForm } from "./client-form"

export const dynamic = "force-dynamic"

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { freelancerProfile: true, clientProfile: true },
  })

  if (!user) redirect("/login")

  // Already has profile? Go to dashboard
  if (user.role === "FREELANCER" && user.freelancerProfile) redirect("/dashboard")
  if (user.role === "CLIENT" && user.clientProfile) redirect("/dashboard")

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header with step indicator */}
      <div className="text-center space-y-4">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.4)]" />
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-lime-400 to-lime-400/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Étape 1 sur 2</p>

        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight">
            Complétez votre profil
          </h2>
          <p className="text-muted-foreground mt-2">
            {user.role === "FREELANCER"
              ? "Présentez-vous aux clients potentiels"
              : "Décrivez votre entreprise"}
          </p>
        </div>
      </div>

      {user.role === "FREELANCER" ? (
        <FreelancerOnboardingForm />
      ) : (
        <ClientOnboardingForm />
      )}
    </div>
  )
}
