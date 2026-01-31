"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function toggleFavoriteFreelancer(freelancerId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const existing = await prisma.favorite.findUnique({
    where: { userId_freelancerId: { userId: session.user.id, freelancerId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, freelancerId },
    })
  }

  revalidatePath(`/profile/${freelancerId}`)
  revalidatePath("/favorites")
}

export async function toggleFavoriteMission(missionId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")

  const existing = await prisma.favorite.findUnique({
    where: { userId_missionId: { userId: session.user.id, missionId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, missionId },
    })
  }

  revalidatePath(`/missions/${missionId}`)
  revalidatePath("/favorites")
}

export async function isFavoriteFreelancer(freelancerId: string) {
  const session = await auth()
  if (!session?.user?.id) return false

  const fav = await prisma.favorite.findUnique({
    where: { userId_freelancerId: { userId: session.user.id, freelancerId } },
  })
  return !!fav
}

export async function isFavoriteMission(missionId: string) {
  const session = await auth()
  if (!session?.user?.id) return false

  const fav = await prisma.favorite.findUnique({
    where: { userId_missionId: { userId: session.user.id, missionId } },
  })
  return !!fav
}

export async function getFavorites() {
  const session = await auth()
  if (!session?.user?.id) return { freelancers: [], missions: [] }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const freelancerIds = favorites.filter(f => f.freelancerId).map(f => f.freelancerId!)
  const missionIds = favorites.filter(f => f.missionId).map(f => f.missionId!)

  const [freelancers, missions] = await Promise.all([
    freelancerIds.length > 0
      ? prisma.user.findMany({
          where: { id: { in: freelancerIds } },
          include: { freelancerProfile: true },
        })
      : [],
    missionIds.length > 0
      ? prisma.mission.findMany({
          where: { id: { in: missionIds } },
          include: { client: { select: { name: true } } },
        })
      : [],
  ])

  return { freelancers, missions }
}
