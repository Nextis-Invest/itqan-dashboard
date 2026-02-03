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
import { FileText, Download } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = { title: "Mes factures" }
export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
  SENT: { label: "Envoyée", color: "bg-blue-400/10 text-blue-400", dot: "bg-blue-400" },
  PAID: { label: "Payée", color: "bg-green-400/10 text-green-400", dot: "bg-green-400" },
  OVERDUE: { label: "En retard", color: "bg-red-400/10 text-red-400", dot: "bg-red-400" },
  CANCELLED: { label: "Annulée", color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
}

export default async function ClientInvoicesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const invoices = await prisma.invoice.findMany({
    where: {
      clientId: session.user.id,
      status: { not: "DRAFT" },
    },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Mes factures</h2>
        <p className="text-muted-foreground mt-1">Consultez et téléchargez vos factures</p>
      </div>

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
                  <TableRow key={inv.id} className="border-border hover:bg-accent/20 transition-colors">
                    <TableCell>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="text-foreground font-mono font-medium hover:text-lime-400 transition-colors text-sm"
                      >
                        {inv.invoiceNumber}
                      </Link>
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
                      <div className="flex gap-2">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Voir
                        </Link>
                        <a
                          href={`/api/invoices/${inv.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-lime-400 hover:text-lime-300 flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" /> PDF
                        </a>
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
