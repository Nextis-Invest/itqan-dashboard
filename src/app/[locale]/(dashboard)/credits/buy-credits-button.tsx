"use client"

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export function BuyCreditsButton() {
  return (
    <Button
      disabled
      className="w-full bg-muted text-muted-foreground font-bold rounded-xl h-11 cursor-not-allowed"
    >
      <Clock className="mr-2 h-4 w-4" />
      Bientôt disponible
    </Button>
  )
}
