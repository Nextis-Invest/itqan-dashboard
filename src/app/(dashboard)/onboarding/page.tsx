import { redirect } from "next/navigation"
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Complétez votre profil
        </h2>
        <p className="text-neutral-400 mt-1">
          {user.role === "FREELANCER"
            ? "Présentez-vous aux clients potentiels"
            : "Décrivez votre entreprise"}
        </p>
      </div>

      {user.role === "FREELANCER" ? (
        <FreelancerOnboardingForm />
      ) : (
        <ClientOnboardingForm />
      )}
    </div>
  )
}
