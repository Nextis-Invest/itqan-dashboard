"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Undo2 } from "lucide-react"
import { withdrawProposal } from "@/lib/actions/proposal"

export function WithdrawProposalButton({
  proposalId,
  missionId,
}: {
  proposalId: string
  missionId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleWithdraw = async () => {
    if (!confirm("Êtes-vous sûr de vouloir retirer votre proposition ?")) return

    setLoading(true)
    try {
      await withdrawProposal(proposalId)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Erreur lors du retrait")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleWithdraw}
      disabled={loading}
      variant="ghost"
      size="sm"
      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Undo2 className="mr-2 h-4 w-4" />
      )}
      Retirer ma proposition
    </Button>
  )
}
