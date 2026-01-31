"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createGig(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const skillsRaw = formData.get("skills") as string
  const skills = skillsRaw ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean) : []

  const gig = await prisma.gig.create({
    data: {
      freelancerId: session.user.id,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || "",
      category: (formData.get("category") as string) || "other",
      subcategory: (formData.get("subcategory") as string) || null,
      basicPrice: parseFloat(formData.get("basicPrice") as string) || 0,
      basicTitle: (formData.get("basicTitle") as string) || "Basic",
      basicDesc: (formData.get("basicDesc") as string) || null,
      standardPrice: formData.get("standardPrice") ? parseFloat(formData.get("standardPrice") as string) : null,
      standardTitle: (formData.get("standardTitle") as string) || "Standard",
      standardDesc: (formData.get("standardDesc") as string) || null,
      premiumPrice: formData.get("premiumPrice") ? parseFloat(formData.get("premiumPrice") as string) : null,
      premiumTitle: (formData.get("premiumTitle") as string) || "Premium",
      premiumDesc: (formData.get("premiumDesc") as string) || null,
      currency: (formData.get("currency") as string) || "MAD",
      deliveryDays: parseInt(formData.get("deliveryDays") as string) || 7,
      skills,
      status: (formData.get("status") as string) === "ACTIVE" ? "ACTIVE" : "DRAFT",
    },
  })

  redirect("/gigs")
}

export async function updateGig(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const gigId = formData.get("gigId") as string
  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig || gig.freelancerId !== session.user.id) throw new Error("Non autorisé")

  const skillsRaw = formData.get("skills") as string
  const skills = skillsRaw ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean) : []

  await prisma.gig.update({
    where: { id: gigId },
    data: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || "",
      category: (formData.get("category") as string) || "other",
      subcategory: (formData.get("subcategory") as string) || null,
      basicPrice: parseFloat(formData.get("basicPrice") as string) || 0,
      basicTitle: (formData.get("basicTitle") as string) || "Basic",
      basicDesc: (formData.get("basicDesc") as string) || null,
      standardPrice: formData.get("standardPrice") ? parseFloat(formData.get("standardPrice") as string) : null,
      standardTitle: (formData.get("standardTitle") as string) || "Standard",
      standardDesc: (formData.get("standardDesc") as string) || null,
      premiumPrice: formData.get("premiumPrice") ? parseFloat(formData.get("premiumPrice") as string) : null,
      premiumTitle: (formData.get("premiumTitle") as string) || "Premium",
      premiumDesc: (formData.get("premiumDesc") as string) || null,
      currency: (formData.get("currency") as string) || "MAD",
      deliveryDays: parseInt(formData.get("deliveryDays") as string) || 7,
      skills,
    },
  })

  revalidatePath("/gigs")
  redirect("/gigs")
}

export async function updateGigStatus(gigId: string, status: "ACTIVE" | "PAUSED" | "DELETED") {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig || gig.freelancerId !== session.user.id) throw new Error("Non autorisé")

  await prisma.gig.update({ where: { id: gigId }, data: { status } })
  revalidatePath("/gigs")
}
