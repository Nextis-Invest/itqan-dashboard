"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"
import { notifyNewReview } from "./notification"

export async function createReview(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const missionId = formData.get("missionId") as string
  const targetUserId = formData.get("targetUserId") as string
  const rating = parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string

  if (!missionId || !targetUserId || !rating || rating < 1 || rating > 5) {
    throw new Error("Données invalides")
  }

  // Verify the mission is completed and user is part of it
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  })

  if (!mission || mission.status !== "COMPLETED") {
    throw new Error("La mission doit être terminée pour laisser un avis")
  }

  const isClient = mission.clientId === session.user.id
  const isFreelancer = mission.freelancerId === session.user.id

  if (!isClient && !isFreelancer) {
    throw new Error("Vous n'êtes pas impliqué dans cette mission")
  }

  // Check no duplicate review
  const existing = await prisma.review.findUnique({
    where: { missionId_authorId: { missionId, authorId: session.user.id } },
  })
  if (existing) throw new Error("Vous avez déjà laissé un avis")

  await prisma.review.create({
    data: {
      missionId,
      authorId: session.user.id,
      targetUserId,
      rating,
      comment: comment || null,
    },
  })

  // Send in-app notification
  try {
    await notifyNewReview(targetUserId, session.user.name || "Quelqu'un", mission.title)
  } catch (e) {
    console.error("Notification error:", e)
  }

  // Update avg rating on target's profile
  const allReviews = await prisma.review.findMany({
    where: { targetUserId },
    select: { rating: true },
  })
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

  // Update freelancer or client profile
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { role: true },
  })

  if (targetUser?.role === "FREELANCER") {
    await prisma.freelancerProfile.updateMany({
      where: { userId: targetUserId },
      data: { avgRating: avg },
    })
  } else if (targetUser?.role === "CLIENT") {
    await prisma.clientProfile.updateMany({
      where: { userId: targetUserId },
      data: { avgRating: avg },
    })
  }

  revalidatePath(`/missions/${missionId}`)
  revalidatePath(`/profile/${targetUserId}`)
}
