"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get("q") || "")

  const updateSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) {
        params.set("q", q)
      } else {
        params.delete("q")
      }
      params.delete("page")
      startTransition(() => {
        router.push(`/admin/users?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      {isPending && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
      )}
      <Input
        placeholder="Rechercher par nom ou email..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          updateSearch(e.target.value)
        }}
        className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground w-full max-w-sm"
      />
    </div>
  )
}
