import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Modifier mon profil" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { EditFreelancerForm } from "./edit-freelancer-form"
import { EditClientForm } from "./edit-client-form"
import { getCertifications } from "@/lib/actions/certification"
import { getEducations } from "@/lib/actions/education"
import { CertificationsEditor } from "./certifications-editor"
import { EducationsEditor } from "./educations-editor"

export const dynamic = "force-dynamic"

export default async function EditProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { freelancerProfile: true, clientProfile: true },
  })

  if (!user) redirect("/login")

  const [certifications, educations] = await Promise.all([
    getCertifications(session.user.id),
    getEducations(session.user.id),
  ])

  if (user.role === "FREELANCER" && user.freelancerProfile) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Modifier mon profil</h2>
          <p className="text-neutral-400 mt-1">Mettez à jour vos informations</p>
        </div>
        <EditFreelancerForm profile={user.freelancerProfile} />
        <CertificationsEditor certifications={certifications} />
        <EducationsEditor educations={educations} />
      </div>
    )
  }

  if (user.role === "CLIENT" && user.clientProfile) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Modifier mon profil</h2>
          <p className="text-neutral-400 mt-1">Mettez à jour vos informations</p>
        </div>
        <EditClientForm profile={user.clientProfile} />
        <CertificationsEditor certifications={certifications} />
        <EducationsEditor educations={educations} />
      </div>
    )
  }

  redirect("/onboarding")
}
