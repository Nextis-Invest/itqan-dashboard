"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Send, Download, CheckCircle, XCircle, Trash2 } from "lucide-react"

export function InvoiceActions({ invoiceId, status }: { invoiceId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleAction(action: string) {
    setLoading(true)
    try {
      if (action === "send") {
        await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" })
      } else if (action === "paid") {
        await fetch(`/api/invoices/${invoiceId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PAID" }),
        })
      } else if (action === "cancel") {
        await fetch(`/api/invoices/${invoiceId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CANCELLED" }),
        })
      } else if (action === "delete") {
        if (!confirm("Supprimer cette facture ?")) return
        await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" })
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/invoices/${invoiceId}`)}>
          <Eye className="mr-2 h-4 w-4" /> Voir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`/api/invoices/${invoiceId}/pdf`, "_blank")}>
          <Download className="mr-2 h-4 w-4" /> Télécharger PDF
        </DropdownMenuItem>
        {(status === "DRAFT" || status === "SENT" || status === "OVERDUE") && (
          <DropdownMenuItem onClick={() => handleAction("send")}>
            <Send className="mr-2 h-4 w-4" /> Envoyer par email
          </DropdownMenuItem>
        )}
        {status !== "PAID" && status !== "CANCELLED" && (
          <DropdownMenuItem onClick={() => handleAction("paid")}>
            <CheckCircle className="mr-2 h-4 w-4" /> Marquer payée
          </DropdownMenuItem>
        )}
        {status !== "CANCELLED" && status !== "PAID" && (
          <DropdownMenuItem onClick={() => handleAction("cancel")}>
            <XCircle className="mr-2 h-4 w-4" /> Annuler
          </DropdownMenuItem>
        )}
        {status === "DRAFT" && (
          <DropdownMenuItem onClick={() => handleAction("delete")} className="text-red-400">
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
