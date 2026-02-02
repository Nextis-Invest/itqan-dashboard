import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Crédits" }
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ArrowUpRight, ArrowDownRight, Sparkles, Zap, Crown } from "lucide-react"
import { BuyCreditsButton } from "./buy-credits-button"

export const dynamic = "force-dynamic"

const typeLabels: Record<string, { label: string; color: string; icon: "up" | "down" }> = {
  PURCHASE: { label: "Achat", color: "text-green-400", icon: "up" },
  MISSION_POST: { label: "Publication mission", color: "text-red-400", icon: "down" },
  FEATURED: { label: "Mise en avant", color: "text-red-400", icon: "down" },
  REFUND: { label: "Remboursement", color: "text-green-400", icon: "up" },
  BONUS: { label: "Bonus", color: "text-lime-400", icon: "up" },
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
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Crédits</h2>
        <p className="text-muted-foreground mt-1">Gérez votre solde de crédits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Balance card with gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-400/20 via-lime-400/10 to-transparent border border-lime-400/20 p-6 md:col-span-1">
          <div className="absolute top-0 right-0 w-40 h-40 bg-lime-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 text-lime-400/80 text-sm font-medium mb-3">
              <CreditCard className="h-4 w-4" />
              Solde actuel
            </div>
            <div className="text-5xl font-black text-foreground tracking-tight">{user?.creditBalance || 0}</div>
            <p className="text-muted-foreground text-sm mt-1">crédits disponibles</p>
            <div className="mt-5">
              <BuyCreditsButton />
            </div>
          </div>
        </div>

        {/* Packs */}
        <div className="md:col-span-2 rounded-2xl bg-card/80 border border-border p-6">
          <h3 className="text-foreground font-semibold mb-4">Packs de crédits</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { amount: 50, price: "50 MAD", popular: false, icon: Zap, label: "Starter" },
              { amount: 200, price: "180 MAD", popular: true, icon: Sparkles, label: "Pro" },
              { amount: 500, price: "400 MAD", popular: false, icon: Crown, label: "Business" },
            ].map((pack) => {
              const Icon = pack.icon
              return (
                <div
                  key={pack.amount}
                  className={`group relative p-5 rounded-xl border text-center transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                    pack.popular
                      ? "border-lime-400/30 bg-lime-400/5 hover:bg-lime-400/10 shadow-lg shadow-lime-400/5"
                      : "border-border bg-secondary/30 hover:bg-accent/50 hover:border-border"
                  }`}
                >
                  {pack.popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 border-0 text-[10px] font-bold shadow-lg shadow-lime-400/30">
                      Populaire
                    </Badge>
                  )}
                  <Icon className={`h-5 w-5 mx-auto mb-2 ${pack.popular ? "text-lime-400" : "text-muted-foreground"}`} />
                  <p className="text-xs text-muted-foreground font-medium">{pack.label}</p>
                  <p className="text-3xl font-black text-foreground mt-1">{pack.amount}</p>
                  <p className="text-muted-foreground text-xs">crédits</p>
                  <p className={`font-bold mt-3 text-sm ${pack.popular ? "text-lime-400" : "text-foreground"}`}>{pack.price}</p>
                  {pack.popular && <p className="text-lime-400/60 text-[10px] mt-1">-10% de réduction</p>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="bg-card/80 border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            Historique des transactions
            {transactions.length > 0 && (
              <span className="text-xs text-muted-foreground font-normal">({transactions.length})</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4 rounded-2xl bg-secondary/30 p-5 inline-block">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">Aucune transaction</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => {
                const typeInfo = typeLabels[tx.type] || { label: tx.type, color: "text-muted-foreground", icon: "down" as const }
                const isPositive = tx.amount > 0
                return (
                  <div key={tx.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${isPositive ? "bg-green-400/10 group-hover:bg-green-400/15" : "bg-red-400/10 group-hover:bg-red-400/15"}`}>
                        {isPositive ? <ArrowUpRight className="h-4 w-4 text-green-400" /> : <ArrowDownRight className="h-4 w-4 text-red-400" />}
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">{typeInfo.label}</p>
                        <div className="flex items-center gap-2">
                          {tx.description && <p className="text-muted-foreground text-xs">{tx.description}</p>}
                          <p className="text-muted-foreground text-xs">
                            {new Date(tx.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${typeInfo.color}`}>
                        {isPositive ? "+" : ""}{tx.amount}
                      </p>
                      <p className="text-muted-foreground text-[11px]">Solde: {tx.balanceAfter}</p>
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
