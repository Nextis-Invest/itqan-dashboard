"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Send, Download, CheckCircle, XCircle } from "lucide-react"

export function InvoiceDetailActions({ invoiceId, status }: { invoiceId: string; status: string }) {
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
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`/api/invoices/${invoiceId}/pdf`, "_blank")}
      >
        <Download className="mr-2 h-4 w-4" /> PDF
      </Button>
      {(status === "DRAFT" || status === "SENT" || status === "OVERDUE") && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("send")}
          disabled={loading}
        >
          <Send className="mr-2 h-4 w-4" /> Envoyer
        </Button>
      )}
      {status !== "PAID" && status !== "CANCELLED" && (
        <Button
          size="sm"
          onClick={() => handleAction("paid")}
          disabled={loading}
          className="bg-green-600 text-white hover:bg-green-500"
        >
          <CheckCircle className="mr-2 h-4 w-4" /> Marquer payée
        </Button>
      )}
      {status !== "CANCELLED" && status !== "PAID" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("cancel")}
          disabled={loading}
          className="text-red-400 hover:text-red-300"
        >
          <XCircle className="mr-2 h-4 w-4" /> Annuler
        </Button>
      )}
    </div>
  )
}
