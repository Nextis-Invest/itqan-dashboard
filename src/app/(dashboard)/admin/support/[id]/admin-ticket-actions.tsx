"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Loader2 } from "lucide-react"
import {
  updateTicketStatus,
  updateTicketPriority,
  assignTicket,
} from "@/lib/actions/support"

interface Props {
  ticketId: string
  currentStatus: string
  currentPriority: string
  currentAssignedToId: string | null
  admins: { id: string; name: string | null; email: string }[]
}

export function AdminTicketActions({
  ticketId,
  currentStatus,
  currentPriority,
  currentAssignedToId,
  admins,
}: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAction(fn: () => Promise<void>) {
    setLoading(true)
    try {
      await fn()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={loading}
          className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 w-56">
        <DropdownMenuLabel className="text-neutral-400 text-xs">Statut</DropdownMenuLabel>
        {currentStatus !== "IN_PROGRESS" && (
          <DropdownMenuItem
            className="text-blue-400 focus:bg-blue-400/10 focus:text-blue-400"
            onClick={() => handleAction(() => updateTicketStatus(ticketId, "IN_PROGRESS"))}
          >
            En cours
          </DropdownMenuItem>
        )}
        {currentStatus !== "RESOLVED" && (
          <DropdownMenuItem
            className="text-green-400 focus:bg-green-400/10 focus:text-green-400"
            onClick={() => handleAction(() => updateTicketStatus(ticketId, "RESOLVED"))}
          >
            Résolu
          </DropdownMenuItem>
        )}
        {currentStatus !== "CLOSED" && (
          <DropdownMenuItem
            className="text-neutral-400 focus:bg-neutral-800 focus:text-neutral-300"
            onClick={() => handleAction(() => updateTicketStatus(ticketId, "CLOSED"))}
          >
            Fermer
          </DropdownMenuItem>
        )}
        {currentStatus === "CLOSED" && (
          <DropdownMenuItem
            className="text-lime-400 focus:bg-lime-400/10 focus:text-lime-400"
            onClick={() => handleAction(() => updateTicketStatus(ticketId, "OPEN"))}
          >
            Rouvrir
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-neutral-800" />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-neutral-300 focus:bg-neutral-800">
            Priorité
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-neutral-900 border-neutral-800">
            {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
              <DropdownMenuItem
                key={p}
                disabled={p === currentPriority}
                className="text-neutral-300 focus:bg-neutral-800"
                onClick={() => handleAction(() => updateTicketPriority(ticketId, p))}
              >
                {{ LOW: "Faible", MEDIUM: "Moyen", HIGH: "Élevé", URGENT: "Urgent" }[p]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-neutral-300 focus:bg-neutral-800">
            Assigner
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-neutral-900 border-neutral-800">
            <DropdownMenuItem
              className="text-neutral-400 focus:bg-neutral-800"
              disabled={!currentAssignedToId}
              onClick={() => handleAction(() => assignTicket(ticketId, null))}
            >
              Non assigné
            </DropdownMenuItem>
            {admins.map((admin) => (
              <DropdownMenuItem
                key={admin.id}
                disabled={admin.id === currentAssignedToId}
                className="text-neutral-300 focus:bg-neutral-800"
                onClick={() => handleAction(() => assignTicket(ticketId, admin.id))}
              >
                {admin.name || admin.email}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
