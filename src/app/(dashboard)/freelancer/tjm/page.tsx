import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TjmForm } from "./tjm-form"

export const dynamic = "force-dynamic"

export default async function TjmPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { freelancerProfile: true },
  })

  if (!user || user.role !== "FREELANCER") redirect("/dashboard")
  if (!user.freelancerProfile) redirect("/onboarding")

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">TJM & Disponibilité</h2>
        <p className="text-neutral-400 mt-1">Gérez vos tarifs et votre disponibilité</p>
      </div>

      <TjmForm profile={user.freelancerProfile} />
    </div>
  )
}
