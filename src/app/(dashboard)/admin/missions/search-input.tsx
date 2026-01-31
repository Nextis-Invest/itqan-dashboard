"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function AdminMissionsSearch({
  currentQ,
  currentStatus,
}: {
  currentQ: string
  currentStatus: string
}) {
  const router = useRouter()
  const [q, setQ] = useState(currentQ)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (currentStatus) params.set("status", currentStatus)
    router.push(`/admin/missions?${params.toString()}`)
  }

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Rechercher par titre..."
        className="pl-9 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
      />
    </div>
  )
}
