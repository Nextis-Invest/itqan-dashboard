"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Loader2 } from "lucide-react"
import { updateUser } from "@/lib/actions/admin"
import { toast } from "sonner"

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
    role: "CLIENT" | "FREELANCER" | "ADMIN"
  }
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone || "")
  const [role, setRole] = useState(user.role)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUser(user.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
      })
      toast.success("Utilisateur mis à jour")
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Modifier les informations de {user.name || user.email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-neutral-300">Nom</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
              placeholder="Nom complet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-neutral-300">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-neutral-300">Téléphone</Label>
            <Input
              id="edit-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
              placeholder="+212 6XX XXX XXX"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-300">Rôle</Label>
            <Select value={role} onValueChange={(v: any) => setRole(v)}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="FREELANCER">Freelancer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-neutral-400 hover:text-white">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-lime-400 text-black hover:bg-lime-300">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
