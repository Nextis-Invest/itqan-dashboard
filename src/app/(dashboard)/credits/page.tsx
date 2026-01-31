import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Crédits" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { BuyCreditsButton } from "./buy-credits-button"

export const dynamic = "force-dynamic"

const typeLabels: Record<string, { label: string; color: string }> = {
  PURCHASE: { label: "Achat", color: "text-green-400" },
  MISSION_POST: { label: "Publication mission", color: "text-red-400" },
  FEATURED: { label: "Mise en avant", color: "text-red-400" },
  REFUND: { label: "Remboursement", color: "text-green-400" },
  BONUS: { label: "Bonus", color: "text-lime-400" },
}

export default async function CreditsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { creditBalance: true },
  })

  const transactions = await prisma.creditTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Crédits</h2>
        <p className="text-neutral-400 mt-1">Gérez votre solde de crédits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-neutral-900 border-neutral-800 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-neutral-400 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-lime-400" />Solde actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-lime-400">{user?.creditBalance || 0}</div>
            <p className="text-neutral-500 text-sm mt-1">crédits disponibles</p>
            <div className="mt-4">
              <BuyCreditsButton />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Packs de crédits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { amount: 50, price: "50 MAD", popular: false },
                { amount: 200, price: "180 MAD", popular: true },
                { amount: 500, price: "400 MAD", popular: false },
              ].map((pack) => (
                <div key={pack.amount} className={`p-4 rounded-lg border text-center relative ${pack.popular ? "border-lime-400/30 bg-lime-400/5" : "border-neutral-800"}`}>
                  {pack.popular && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-lime-400 text-neutral-900 border-0 text-xs">Populaire</Badge>}
                  <p className="text-2xl font-bold text-white">{pack.amount}</p>
                  <p className="text-neutral-400 text-sm">crédits</p>
                  <p className="text-lime-400 font-semibold mt-2">{pack.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-8">Aucune transaction</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const typeInfo = typeLabels[tx.type] || { label: tx.type, color: "text-neutral-400" }
                const isPositive = tx.amount > 0
                return (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isPositive ? "bg-green-400/10" : "bg-red-400/10"}`}>
                        {isPositive ? <ArrowUpRight className="h-4 w-4 text-green-400" /> : <ArrowDownRight className="h-4 w-4 text-red-400" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{typeInfo.label}</p>
                        {tx.description && <p className="text-neutral-500 text-xs">{tx.description}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${typeInfo.color}`}>
                        {isPositive ? "+" : ""}{tx.amount}
                      </p>
                      <p className="text-neutral-500 text-xs">Solde: {tx.balanceAfter}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
