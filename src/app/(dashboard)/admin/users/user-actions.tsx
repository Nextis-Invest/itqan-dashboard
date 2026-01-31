"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreHorizontal, Pencil, UserCog, ShieldCheck, ShieldOff, Ban, CheckCircle, Trash2, Loader2 } from "lucide-react"
import { verifyUser, suspendUser, updateUser, deleteUser } from "@/lib/actions/admin"
import { EditUserDialog } from "./edit-user-dialog"
import { toast } from "sonner"

interface AdminUserActionsProps {
  userId: string
  name: string | null
  email: string
  phone: string | null
  role: "CLIENT" | "FREELANCER" | "ADMIN"
  verified: boolean
  suspended: boolean
}

export function AdminUserActions({
  userId,
  name,
  email,
  phone,
  role,
  verified,
  suspended,
}: AdminUserActionsProps) {
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleRoleChange = async (newRole: "CLIENT" | "FREELANCER" | "ADMIN") => {
    if (newRole === role) return
    setLoading(true)
    try {
      await updateUser(userId, { role: newRole })
      toast.success(`Rôle changé en ${newRole}`)
    } catch (err: any) {
      toast.error(err.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    try {
      await verifyUser(userId, !verified)
      toast.success(verified ? "Vérification retirée" : "Utilisateur vérifié")
    } catch (err: any) {
      toast.error(err.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async () => {
    setLoading(true)
    try {
      await suspendUser(userId, !suspended)
      toast.success(suspended ? "Utilisateur réactivé" : "Utilisateur suspendu")
    } catch (err: any) {
      toast.error(err.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteUser(userId)
      toast.success("Utilisateur supprimé")
      setDeleteOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800">
          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer">
              <UserCog className="h-4 w-4 mr-2" />
              Changer le rôle
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-neutral-900 border-neutral-800">
              {(["CLIENT", "FREELANCER", "ADMIN"] as const).map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`cursor-pointer ${
                    r === role
                      ? "text-lime-400 bg-lime-400/10"
                      : "text-neutral-300 focus:text-white focus:bg-neutral-800"
                  }`}
                >
                  {r}
                  {r === role && " ✓"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={handleVerify}
            className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
          >
            {verified ? (
              <>
                <ShieldOff className="h-4 w-4 mr-2" />
                Retirer vérification
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Vérifier
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleSuspend}
            className={`cursor-pointer ${
              suspended
                ? "text-green-400 focus:text-green-300 focus:bg-neutral-800"
                : "text-neutral-300 focus:text-white focus:bg-neutral-800"
            }`}
          >
            {suspended ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Réactiver
              </>
            ) : (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Suspendre
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-neutral-800" />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-400 focus:text-red-300 focus:bg-red-400/10 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={{ id: userId, name, email, phone, role }}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Supprimer l&apos;utilisateur</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Êtes-vous sûr de vouloir supprimer <strong className="text-white">{name || email}</strong> ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Supprimer définitivement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
