"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Trash2, ArrowLeft, Send, Save } from "lucide-react"
import Link from "next/link"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

interface Client {
  id: string
  name: string | null
  email: string
  clientProfile?: {
    companyName?: string | null
    ice?: string | null
    rc?: string | null
    address?: string | null
    city?: string | null
  } | null
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("Paiement à 30 jours. Merci pour votre confiance.")
  const [taxRate, setTaxRate] = useState(20)
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ])
  const [loading, setLoading] = useState(false)

  // Set default due date to 30 days from now
  useEffect(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    setDueDate(d.toISOString().split("T")[0])
  }, [])

  // Fetch clients
  useEffect(() => {
    fetch("/api/admin/users?role=CLIENT")
      .then((r) => r.json())
      .then((data) => {
        // Handle both array and paginated response
        const users = Array.isArray(data) ? data : data.users || []
        setClients(users)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (clientId) {
      const c = clients.find((cl) => cl.id === clientId)
      setSelectedClient(c || null)
    } else {
      setSelectedClient(null)
    }
  }, [clientId, clients])

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }])
  }

  function removeItem(i: number) {
    if (items.length > 1) setItems(items.filter((_, idx) => idx !== i))
  }

  function updateItem(i: number, field: keyof InvoiceItem, value: string | number) {
    const updated = [...items]
    if (field === "description") {
      updated[i].description = value as string
    } else {
      updated[i][field] = parseFloat(value as string) || 0
    }
    setItems(updated)
  }

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100
  const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100

  async function handleSubmit(sendNow: boolean) {
    if (!clientId || !dueDate || items.some((it) => !it.description || it.unitPrice <= 0)) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          dueDate,
          items,
          notes,
          taxRate,
          sendNow,
        }),
      })

      if (res.ok) {
        const invoice = await res.json()
        if (sendNow) {
          await fetch(`/api/invoices/${invoice.id}/send`, { method: "POST" })
        }
        router.push("/admin/invoices")
      } else {
        const err = await res.json()
        alert(err.message || "Erreur lors de la création")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/invoices" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Nouvelle facture</h2>
          <p className="text-muted-foreground mt-1">Créer une facture pour un client</p>
        </div>
      </div>

      {/* Client Selection */}
      <Card className="bg-card/80 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sélectionner un client</Label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">— Choisir un client —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.clientProfile?.companyName
                    ? `${c.clientProfile.companyName} (${c.name || c.email})`
                    : c.name || c.email}
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <div className="rounded-lg bg-secondary/50 p-4 space-y-1 text-sm">
              <p className="font-medium text-foreground">
                {selectedClient.clientProfile?.companyName || selectedClient.name}
              </p>
              <p className="text-muted-foreground">{selectedClient.email}</p>
              {selectedClient.clientProfile?.ice && (
                <p className="text-muted-foreground">ICE : {selectedClient.clientProfile.ice}</p>
              )}
              {selectedClient.clientProfile?.rc && (
                <p className="text-muted-foreground">RC : {selectedClient.clientProfile.rc}</p>
              )}
              {selectedClient.clientProfile?.address && (
                <p className="text-muted-foreground">
                  {selectedClient.clientProfile.address}
                  {selectedClient.clientProfile.city ? `, ${selectedClient.clientProfile.city}` : ""}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card className="bg-card/80 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date d&apos;échéance</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <Label>Taux TVA (%)</Label>
              <Input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card className="bg-card/80 border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground text-lg">Lignes de facturation</CardTitle>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-3 text-xs text-muted-foreground uppercase tracking-wider px-1">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Quantité</div>
            <div className="col-span-2">Prix unitaire HT</div>
            <div className="col-span-2 text-right">Montant HT</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5">
                <Input
                  placeholder="Description..."
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  step="0.5"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                />
              </div>
              <div className="col-span-2 text-right font-medium text-foreground text-sm">
                {(item.quantity * item.unitPrice).toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}{" "}
                MAD
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  className="h-8 w-8 text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total HT</span>
              <span className="text-foreground font-medium">
                {subtotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} MAD
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TVA ({taxRate}%)</span>
              <span className="text-foreground font-medium">
                {taxAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} MAD
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span className="text-lime-400">Total TTC</span>
              <span className="text-lime-400">
                {totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} MAD
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="bg-card/80 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Notes & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Conditions de paiement, mentions..."
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => handleSubmit(false)} disabled={loading}>
          <Save className="mr-2 h-4 w-4" /> Créer en brouillon
        </Button>
        <Button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="bg-lime-400 text-neutral-900 hover:bg-lime-300"
        >
          <Send className="mr-2 h-4 w-4" /> Créer et envoyer
        </Button>
      </div>
    </div>
  )
}
