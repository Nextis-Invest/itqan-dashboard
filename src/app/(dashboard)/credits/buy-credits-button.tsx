"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"
import { purchaseCredits } from "@/lib/actions/credit"

export function BuyCreditsButton() {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      onClick={async () => {
        setLoading(true)
        // In production, this would open a Stripe/CMI checkout
        // For now, add 50 demo credits
        await purchaseCredits(50)
        setLoading(false)
      }}
      disabled={loading}
      className="w-full bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
    >
      {loading ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Achat en cours...</>
      ) : (
        <><CreditCard className="mr-2 h-4 w-4" />Acheter des crédits</>
      )}
    </Button>
  )
}
