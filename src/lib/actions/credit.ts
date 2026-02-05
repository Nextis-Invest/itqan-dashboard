"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { revalidatePath } from "next/cache"

export async function purchaseCredits(amount: number) {
  // DISABLED - Requires payment integration (Stripe/CMI)
  // This function was allowing free credits without payment verification
  throw new Error("Paiement non disponible - contactez le support")
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
