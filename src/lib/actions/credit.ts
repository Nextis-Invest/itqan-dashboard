"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function purchaseCredits(amount: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  if (amount <= 0) throw new Error("Montant invalide")

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { creditBalance: true } })
  if (!user) throw new Error("Utilisateur introuvable")

  const newBalance = user.creditBalance + amount

  await prisma.$transaction([
    prisma.user.update({ where: { id: session.user.id }, data: { creditBalance: newBalance } }),
    prisma.creditTransaction.create({
      data: {
        userId: session.user.id,
        amount,
        type: "PURCHASE",
        description: `Achat de ${amount} crédits`,
        balanceAfter: newBalance,
      },
    }),
  ])

  revalidatePath("/credits")
}

export async function spendCredits(userId: string, amount: number, type: "MISSION_POST" | "FEATURED", referenceId?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { creditBalance: true } })
  if (!user || user.creditBalance < amount) throw new Error("Crédits insuffisants")

  const newBalance = user.creditBalance - amount

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { creditBalance: newBalance } }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type,
        description: type === "MISSION_POST" ? "Publication de mission" : "Mise en avant",
        referenceId,
        balanceAfter: newBalance,
      },
    }),
  ])
}
