"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function InvoiceFilters({ currentQ, currentStatus }: { currentQ: string; currentStatus: string }) {
  const router = useRouter()
  const [q, setQ] = useState(currentQ)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (currentStatus) params.set("status", currentStatus)
    router.push(`/admin/invoices?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par n°, client..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>
    </form>
  )
}
