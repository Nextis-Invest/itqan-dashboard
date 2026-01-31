"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const BADGE_DEFS: Record<string, { name: string; description: string; icon: string }> = {
  VERIFIED: { name: "Vérifié", description: "Profil vérifié par l'administration", icon: "✅" },
  TOP_RATED: { name: "Top Rated", description: "Note moyenne ≥ 4.5 et 5+ missions", icon: "⭐" },
  RISING_TALENT: { name: "Talent montant", description: "1+ mission avec note ≥ 4.0", icon: "🚀" },
  EXPERT: { name: "Expert", description: "Reconnu comme expert dans son domaine", icon: "🏆" },
  FAST_RESPONDER: { name: "Réponse rapide", description: "Temps de réponse < 60 minutes", icon: "⚡" },
}

export async function assignBadge(userId: string, type: string) {
  const def = BADGE_DEFS[type]
  if (!def) throw new Error("Type de badge invalide")

  return prisma.badge.upsert({
    where: { userId_type: { userId, type } },
    update: {},
    create: {
      userId,
      type,
      name: def.name,
      description: def.description,
      icon: def.icon,
    },
  })
}

export async function removeBadge(userId: string, type: string) {
  return prisma.badge.deleteMany({ where: { userId, type } })
}

export async function getUserBadges(userId: string) {
  return prisma.badge.findMany({
    where: { userId },
    orderBy: { earnedAt: "asc" },
  })
}

export async function autoAssignBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      freelancerProfile: true,
    },
  })

  if (!user?.freelancerProfile) return

  const fp = user.freelancerProfile

  // VERIFIED — handled by admin action, skip here
  
  // TOP_RATED
  if (fp.avgRating && fp.avgRating >= 4.5 && fp.completedMissions >= 5) {
    await assignBadge(userId, "TOP_RATED")
  }

  // RISING_TALENT
  if (fp.completedMissions >= 1 && fp.avgRating && fp.avgRating >= 4.0) {
    await assignBadge(userId, "RISING_TALENT")
  }
}

export async function adminAssignBadge(userId: string, type: string) {
  const badge = await assignBadge(userId, type)
  revalidatePath("/admin/users")
  revalidatePath(`/profile/${userId}`)
  return badge
}

export async function adminRemoveBadge(userId: string, type: string) {
  await removeBadge(userId, type)
  revalidatePath("/admin/users")
  revalidatePath(`/profile/${userId}`)
}

export async function getBadgeDefs() {
  return BADGE_DEFS
}
