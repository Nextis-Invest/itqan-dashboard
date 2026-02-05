import type { Metadata } from "next"
import { redirect } from "next/navigation"
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
import { FileText, DollarSign, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import Link from "next/link"
import { InvoiceActions } from "./invoice-actions"
import { InvoiceFilters } from "./invoice-filters"

export const metadata: Metadata = { title: "Factures — Admin" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
  SENT: { label: "Envoyée", color: "bg-blue-400/10 text-blue-400", dot: "bg-blue-400" },
  PAID: { label: "Payée", color: "bg-green-400/10 text-green-400", dot: "bg-green-400" },
  OVERDUE: { label: "En retard", color: "bg-red-400/10 text-red-400", dot: "bg-red-400" },
  CANCELLED: { label: "Annulée", color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
}

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const sp = await searchParams

  // Stats
  const [totalInvoiced, paidTotal, overdueTotal, pendingTotal, allCount, paidCount, overdueCount, draftCount, sentCount] =
    await Promise.all([
      prisma.invoice.aggregate({ _sum: { totalAmount: true } }),
      prisma.invoice.aggregate({ _sum: { totalAmount: true }, where: { status: "PAID" } }),
      prisma.invoice.aggregate({ _sum: { totalAmount: true }, where: { status: "OVERDUE" } }),
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ["SENT", "DRAFT"] } },
      }),
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: "PAID" } }),
      prisma.invoice.count({ where: { status: "OVERDUE" } }),
      prisma.invoice.count({ where: { status: "DRAFT" } }),
      prisma.invoice.count({ where: { status: "SENT" } }),
    ])

  // Filters
  const where: any = {}
  if (sp.status) where.status = sp.status
  if (sp.q) {
    where.OR = [
      { invoiceNumber: { contains: sp.q, mode: "insensitive" } },
      { clientName: { contains: sp.q, mode: "insensitive" } },
      { clientCompany: { contains: sp.q, mode: "insensitive" } },
    ]
  }

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      client: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  const formatMAD = (n: number | null) =>
    n ? `${Math.round(n).toLocaleString("fr-FR")} MAD` : "0 MAD"

  const statCards = [
    { label: "Total facturé", value: formatMAD(totalInvoiced._sum.totalAmount), icon: DollarSign, color: "text-lime-400", bg: "bg-lime-400/10" },
    { label: "Payé", value: formatMAD(paidTotal._sum.totalAmount), icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Impayé", value: formatMAD(overdueTotal._sum.totalAmount), icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "En attente", value: formatMAD(pendingTotal._sum.totalAmount), icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Factures", value: allCount, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Factures</h2>
          <p className="text-muted-foreground mt-1">Gérer les factures clients</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-lime-300 transition-colors"
        >
          <FileText className="h-4 w-4" />
          Nouvelle facture
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-xl bg-card/80 border border-border p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${s.bg} p-2`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <InvoiceFilters currentQ={sp.q || ""} currentStatus={sp.status || ""} />

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        <a
          href="/admin/invoices"
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            !sp.status
              ? "bg-lime-400/10 text-lime-400"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          Toutes ({allCount})
        </a>
        {Object.entries(statusMap).map(([k, v]) => {
          const count =
            k === "PAID" ? paidCount : k === "OVERDUE" ? overdueCount : k === "DRAFT" ? draftCount : k === "SENT" ? sentCount : 0
          return (
            <a
              key={k}
              href={`/admin/invoices?status=${k}${sp.q ? `&q=${sp.q}` : ""}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                sp.status === k
                  ? "bg-lime-400/10 text-lime-400"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {v.label} ({count})
            </a>
          )
        })}
      </div>

      {/* Table */}
      <Card className="bg-card/80 border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-lime-400" />
            {invoices.length} facture(s)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">N°</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Client</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Montant TTC</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Échéance</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => {
                const st = statusMap[inv.status] || statusMap.DRAFT
                return (
                  <TableRow key={inv.id} className="border-border hover:bg-accent/20 transition-colors group relative">
                    <TableCell>
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="text-foreground font-mono font-medium group-hover:text-lime-400 transition-colors text-sm"
                      >
                        {inv.invoiceNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground text-sm font-medium">{inv.clientCompany || inv.clientName}</p>
                        <p className="text-muted-foreground text-xs">{inv.clientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground font-semibold text-sm">
                        {inv.totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {inv.currency}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${st.color} border-0 text-[10px]`}>
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${st.dot} mr-1`} />
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(inv.issueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(inv.dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <div className="relative z-10">
                        <InvoiceActions invoiceId={inv.id} status={inv.status} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {invoices.length === 0 && <p className="text-muted-foreground text-center py-10">Aucune facture</p>}
        </CardContent>
      </Card>
    </div>
  )
}
