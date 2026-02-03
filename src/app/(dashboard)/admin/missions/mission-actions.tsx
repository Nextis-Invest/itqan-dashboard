"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { MoreHorizontal, Eye, ArrowRightLeft, Star, StarOff, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react"
import { updateMissionStatusAdmin, toggleMissionFeatured, deleteMissionPermanent, approveMission, rejectMission } from "@/lib/actions/admin"

const statusOptions = [
  { value: "PENDING_REVIEW", label: "En attente" },
  { value: "OPEN", label: "Ouverte" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED", label: "Terminée" },
  { value: "CANCELLED", label: "Annulée" },
  { value: "REJECTED", label: "Rejetée" },
] as const

export function AdminMissionActions({
  missionId,
  status,
  featured,
}: {
  missionId: string
  status: string
  featured: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      await updateMissionStatusAdmin(missionId, newStatus as any)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async () => {
    setLoading(true)
    try {
      await toggleMissionFeatured(missionId)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Supprimer définitivement cette mission ? Cette action est irréversible.")) return
    setLoading(true)
    try {
      await deleteMissionPermanent(missionId)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setLoading(true)
    try {
      await approveMission(missionId)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    const reason = prompt("Raison du rejet (optionnel) :")
    setLoading(true)
    try {
      await rejectMission(missionId, reason || undefined)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const canDelete = status === "DRAFT" || status === "CANCELLED"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={loading}
          className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border w-56">
        <DropdownMenuItem asChild className="text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-accent">
          <Link href={`/missions/${missionId}`}>
            <Eye className="mr-2 h-4 w-4" />
            Voir la mission
          </Link>
        </DropdownMenuItem>

        {status === "PENDING_REVIEW" && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleApprove}
              className="text-lime-400 hover:text-lime-300 focus:text-lime-300 focus:bg-lime-500/10"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider la mission
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleReject}
              className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter la mission
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-accent">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Changer le statut
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-card border-border">
            {statusOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                disabled={opt.value === status}
                onClick={() => handleStatusChange(opt.value)}
                className={`text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-accent ${
                  opt.value === status ? "opacity-50" : ""
                }`}
              >
                {opt.label}
                {opt.value === status && " ✓"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem
          onClick={handleToggleFeatured}
          className="text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-accent"
        >
          {featured ? (
            <>
              <StarOff className="mr-2 h-4 w-4" />
              Retirer la mise en avant
            </>
          ) : (
            <>
              <Star className="mr-2 h-4 w-4" />
              Mettre en avant
            </>
          )}
        </DropdownMenuItem>

        {canDelete && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
