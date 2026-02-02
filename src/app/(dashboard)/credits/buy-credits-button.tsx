"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, Sparkles } from "lucide-react"
import { purchaseCredits } from "@/lib/actions/credit"

export function BuyCreditsButton() {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      onClick={async () => {
        setLoading(true)
        await purchaseCredits(50)
        setLoading(false)
      }}
      disabled={loading}
      className="w-full bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-900 hover:from-lime-300 hover:to-lime-400 font-bold shadow-lg shadow-lime-400/20 hover:shadow-lime-400/30 transition-all duration-200 rounded-xl h-11"
    >
      {loading ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Achat en cours...</>
      ) : (
        <><Sparkles className="mr-2 h-4 w-4" />Acheter des crédits</>
      )}
    </Button>
  )
}
