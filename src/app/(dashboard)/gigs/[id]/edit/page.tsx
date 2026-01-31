import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { GigEditForm } from "./gig-edit-form"

export const dynamic = "force-dynamic"

export default async function EditGigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const gig = await prisma.gig.findUnique({ where: { id } })
  if (!gig || gig.freelancerId !== session.user.id) notFound()

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Modifier le gig</h2>
        <p className="text-neutral-400 mt-1">Mettez à jour votre service</p>
      </div>
      <GigEditForm gig={gig} />
    </div>
  )
}
