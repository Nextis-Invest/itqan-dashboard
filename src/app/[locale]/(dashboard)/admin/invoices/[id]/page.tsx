import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, ArrowLeft, Building2, User, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { InvoiceDetailActions } from "./invoice-detail-actions"

export const metadata: Metadata = { title: "Détail facture — Admin" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-muted/50 text-muted-foreground" },
  SENT: { label: "Envoyée", color: "bg-blue-400/10 text-blue-400" },
  PAID: { label: "Payée", color: "bg-green-400/10 text-green-400" },
  OVERDUE: { label: "En retard", color: "bg-red-400/10 text-red-400" },
  CANCELLED: { label: "Annulée", color: "bg-muted/50 text-muted-foreground" },
}

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const { id } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: { orderBy: { order: "asc" } },
      client: { select: { name: true, email: true, image: true } },
    },
  })

  if (!invoice) notFound()

  const st = statusMap[invoice.status] || statusMap.DRAFT
  const formatDate = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/invoices" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground tracking-tight font-mono">
                {invoice.invoiceNumber}
              </h2>
              <Badge className={`${st.color} border-0`}>{st.label}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Créée le {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>
        <InvoiceDetailActions invoiceId={invoice.id} status={invoice.status} />
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Issuer */}
        <Card className="bg-card/80 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Émetteur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-semibold text-foreground">{invoice.issuerName}</p>
            {invoice.issuerAddress && <p className="text-muted-foreground">{invoice.issuerAddress}</p>}
            {invoice.issuerIce && <p className="text-muted-foreground">ICE : {invoice.issuerIce}</p>}
            {invoice.issuerRc && <p className="text-muted-foreground">RC : {invoice.issuerRc}</p>}
            {invoice.issuerIf && <p className="text-muted-foreground">IF : {invoice.issuerIf}</p>}
          </CardContent>
        </Card>

        {/* Client */}
        <Card className="bg-card/80 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" /> Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-semibold text-foreground">{invoice.clientCompany || invoice.clientName}</p>
            {invoice.clientCompany && <p className="text-muted-foreground">{invoice.clientName}</p>}
            <p className="text-muted-foreground">{invoice.clientEmail}</p>
            {invoice.clientAddress && (
              <p className="text-muted-foreground">
                {invoice.clientAddress}{invoice.clientCity ? `, ${invoice.clientCity}` : ""}
              </p>
            )}
            {invoice.clientIce && <p className="text-muted-foreground">ICE : {invoice.clientIce}</p>}
            {invoice.clientRc && <p className="text-muted-foreground">RC : {invoice.clientRc}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-card/80 border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Calendar className="h-3 w-3" /> Date d&apos;émission
          </div>
          <p className="text-foreground font-medium text-sm">{formatDate(invoice.issueDate)}</p>
        </div>
        <div className="rounded-xl bg-card/80 border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Clock className="h-3 w-3" /> Date d&apos;échéance
          </div>
          <p className="text-foreground font-medium text-sm">{formatDate(invoice.dueDate)}</p>
        </div>
        {invoice.sentAt && (
          <div className="rounded-xl bg-card/80 border border-border p-4">
            <div className="flex items-center gap-2 text-blue-400 text-xs mb-1">
              <FileText className="h-3 w-3" /> Envoyée le
            </div>
            <p className="text-foreground font-medium text-sm">{formatDate(invoice.sentAt)}</p>
          </div>
        )}
        {invoice.paidAt && (
          <div className="rounded-xl bg-card/80 border border-border p-4">
            <div className="flex items-center gap-2 text-green-400 text-xs mb-1">
              <FileText className="h-3 w-3" /> Payée le
            </div>
            <p className="text-foreground font-medium text-sm">{formatDate(invoice.paidAt)}</p>
          </div>
        )}
      </div>

      {/* Items Table */}
      <Card className="bg-card/80 border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-lime-400" />
            Lignes de facturation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">#</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Description</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-center">Qté</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-right">P.U. HT</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-right">Montant HT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, i) => (
                <TableRow key={item.id} className="border-border">
                  <TableCell className="text-muted-foreground text-sm">{i + 1}</TableCell>
                  <TableCell className="text-foreground text-sm">{item.description}</TableCell>
                  <TableCell className="text-muted-foreground text-sm text-center">{item.quantity}</TableCell>
                  <TableCell className="text-muted-foreground text-sm text-right">
                    {item.unitPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {invoice.currency}
                  </TableCell>
                  <TableCell className="text-foreground font-medium text-sm text-right">
                    {item.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {invoice.currency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card className="bg-card/80 border-border">
        <CardContent className="py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total HT</span>
            <span className="text-foreground font-medium">
              {invoice.subtotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {invoice.currency}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">TVA ({invoice.taxRate}%)</span>
            <span className="text-foreground font-medium">
              {invoice.taxAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {invoice.currency}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3 border-t border-border">
            <span className="text-lime-400">Total TTC</span>
            <span className="text-lime-400">
              {invoice.totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {invoice.currency}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card className="bg-card/80 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Notes & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm whitespace-pre-wrap">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
