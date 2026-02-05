"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { createUser } from "@/lib/actions/admin"
import { toast } from "sonner"

export function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"CLIENT" | "FREELANCER" | "ADMIN">("CLIENT")

  const reset = () => {
    setName("")
    setEmail("")
    setPhone("")
    setRole("CLIENT")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setLoading(true)
    try {
      await createUser({ name: name.trim(), email: email.trim(), role, phone: phone.trim() || undefined })
      toast.success("Utilisateur créé avec succès")
      reset()
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger asChild>
        <Button className="bg-lime-400 text-black hover:bg-lime-300 font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Créer un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Créer un utilisateur</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajouter un nouvel utilisateur à la plateforme
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/80">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary border-border text-foreground"
              placeholder="Nom complet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary border-border text-foreground"
              placeholder="email@exemple.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground/80">Téléphone (optionnel)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-secondary border-border text-foreground"
              placeholder="+212 6XX XXX XXX"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground/80">Rôle</Label>
            <Select value={role} onValueChange={(v: any) => setRole(v)}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-border">
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="FREELANCER">Freelancer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-lime-400 text-black hover:bg-lime-300">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
