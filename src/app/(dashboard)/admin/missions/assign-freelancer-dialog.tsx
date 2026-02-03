"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Search, Loader2 } from "lucide-react"
import { assignFreelancerAdmin, searchFreelancers } from "@/lib/actions/admin"

export function AssignFreelancerDialog({ missionId }: { missionId: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ id: string; name: string | null; email: string }[]>([])
  const [searching, setSearching] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSearch = async (q: string) => {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    setSearching(true)
    try {
      const res = await searchFreelancers(q)
      setResults(res)
    } catch { setResults([]) }
    finally { setSearching(false) }
  }

  const handleAssign = (freelancerId: string) => {
    startTransition(async () => {
      try {
        await assignFreelancerAdmin(missionId, freelancerId)
        setOpen(false)
        router.refresh()
      } catch (err: any) {
        alert(err.message || "Erreur")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-lime-400 h-8 gap-1.5">
          <UserPlus className="h-3.5 w-3.5" />
          Attribuer
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Attribuer un freelancer</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Recherchez un freelancer par nom ou email
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Nom ou email du freelancer..."
              className="pl-9 bg-secondary/60 border-border"
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {searching && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!searching && results.length === 0 && query.length >= 2 && (
              <p className="text-muted-foreground text-sm text-center py-4">Aucun freelancer trouvé</p>
            )}
            {results.map((f) => (
              <button
                key={f.id}
                onClick={() => handleAssign(f.id)}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left"
              >
                <div className="h-8 w-8 rounded-lg bg-lime-400/10 flex items-center justify-center text-lime-400 text-xs font-bold shrink-0">
                  {(f.name || f.email)?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{f.name || "—"}</p>
                  <p className="text-muted-foreground text-xs truncate">{f.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
