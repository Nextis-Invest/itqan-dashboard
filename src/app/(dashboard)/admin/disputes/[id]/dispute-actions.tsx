"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Send, CheckCircle } from "lucide-react"
import {
  updateDisputeStatus,
  updateDisputeCategory,
  updateDisputePriority,
  assignDispute,
  addAdminDisputeMessage,
  resolveDispute,
} from "@/lib/actions/dispute"

type AdminUser = { id: string; name: string | null; email: string }

export function DisputeActions({
  disputeId,
  currentStatus,
  currentCategory,
  currentPriority,
  assignedToId,
  adminUsers,
}: {
  disputeId: string
  currentStatus: string
  currentCategory: string
  currentPriority: string
  assignedToId: string | null
  adminUsers: AdminUser[]
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"reply" | "internal">("reply")
  const [message, setMessage] = useState("")
  const [sendingMsg, setSendingMsg] = useState(false)

  // Resolve dialog state
  const [resolveOpen, setResolveOpen] = useState(false)
  const [resolution, setResolution] = useState("")
  const [favoredParty, setFavoredParty] = useState("NEUTRAL")
  const [adminNotes, setAdminNotes] = useState("")
  const [resolving, setResolving] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return
    setSendingMsg(true)
    try {
      await addAdminDisputeMessage(disputeId, message.trim(), activeTab === "internal")
      setMessage("")
      router.refresh()
    } catch (e) {
      console.error(e)
    }
    setSendingMsg(false)
  }

  const handleResolve = async () => {
    if (!resolution.trim()) return
    setResolving(true)
    try {
      await resolveDispute(disputeId, resolution.trim(), adminNotes.trim() || undefined, favoredParty)
      setResolveOpen(false)
      router.refresh()
    } catch (e) {
      console.error(e)
    }
    setResolving(false)
  }

  const handleChange = async (action: string, value: string) => {
    try {
      if (action === "status") await updateDisputeStatus(disputeId, value)
      if (action === "category") await updateDisputeCategory(disputeId, value)
      if (action === "priority") await updateDisputePriority(disputeId, value)
      if (action === "assign") await assignDispute(disputeId, value || null)
      router.refresh()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick actions */}
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-foreground text-sm">Actions rapides</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Statut</Label>
              <select
                value={currentStatus}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-md border border-border bg-secondary text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
              >
                <option value="OPEN">Ouvert</option>
                <option value="UNDER_REVIEW">En examen</option>
                <option value="RESOLVED">Résolu</option>
                <option value="CLOSED">Fermé</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Catégorie</Label>
              <select
                value={currentCategory}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-md border border-border bg-secondary text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
              >
                <option value="QUALITY">Qualité</option>
                <option value="DELAY">Retard</option>
                <option value="PAYMENT">Paiement</option>
                <option value="SCOPE">Périmètre</option>
                <option value="COMMUNICATION">Communication</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Priorité</Label>
              <select
                value={currentPriority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full rounded-md border border-border bg-secondary text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
              >
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyen</option>
                <option value="HIGH">Élevé</option>
                <option value="CRITICAL">Critique</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Assigné à</Label>
              <select
                value={assignedToId || ""}
                onChange={(e) => handleChange("assign", e.target.value)}
                className="w-full rounded-md border border-border bg-secondary text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
              >
                <option value="">Non assigné</option>
                {adminUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>
            </div>
          </div>

          <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold">
                <CheckCircle className="h-4 w-4 mr-2" />
                Résoudre le litige
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border text-foreground">
              <DialogHeader>
                <DialogTitle>Résoudre le litige</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80">Résolution</Label>
                  <Textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={4}
                    placeholder="Décrivez la résolution..."
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Partie favorisée</Label>
                  <select
                    value={favoredParty}
                    onChange={(e) => setFavoredParty(e.target.value)}
                    className="w-full rounded-md border border-border bg-secondary text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="FREELANCER">Freelance</option>
                    <option value="NEUTRAL">Neutre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Notes admin (optionnel)</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={2}
                    placeholder="Notes internes..."
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  onClick={handleResolve}
                  disabled={resolving || !resolution.trim()}
                  className="w-full bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
                >
                  {resolving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Confirmer la résolution
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Message input with tabs */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex gap-1 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("reply")}
              className={`text-sm ${
                activeTab === "reply"
                  ? "bg-lime-400/10 text-lime-400 hover:bg-lime-400/20 hover:text-lime-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              Répondre
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("internal")}
              className={`text-sm ${
                activeTab === "internal"
                  ? "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              Note interne
            </Button>
          </div>

          <div className={`rounded-lg ${activeTab === "internal" ? "border border-dashed border-yellow-400/30 p-3" : ""}`}>
            {activeTab === "internal" && (
              <Badge className="bg-yellow-400/10 text-yellow-400 border-0 text-[10px] mb-2">
                Visible uniquement par les admins
              </Badge>
            )}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder={activeTab === "reply" ? "Répondre au litige..." : "Ajouter une note interne..."}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground mb-3"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                disabled={sendingMsg || !message.trim()}
                className={`font-semibold ${
                  activeTab === "internal"
                    ? "bg-yellow-400 text-neutral-900 hover:bg-yellow-300"
                    : "bg-lime-400 text-neutral-900 hover:bg-lime-300"
                }`}
              >
                {sendingMsg ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                {activeTab === "reply" ? "Envoyer" : "Ajouter la note"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
