import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#a3e635",
  },
  brandName: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#65a30d",
    letterSpacing: 2,
  },
  invoiceTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  infoBlock: {
    width: "48%",
  },
  infoLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#65a30d",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },
  infoBold: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 4,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  // Table
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  colDesc: { width: "45%" },
  colQty: { width: "15%", textAlign: "center" },
  colUnit: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  cellText: {
    fontSize: 10,
    color: "#374151",
  },
  cellBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  // Totals
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  totalsBlock: {
    width: 220,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 10,
    color: "#374151",
    fontFamily: "Helvetica-Bold",
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#65a30d",
    borderRadius: 4,
    marginTop: 4,
  },
  totalFinalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  totalFinalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  // Notes
  notesSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#a3e635",
  },
  notesTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#65a30d",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#9ca3af",
    lineHeight: 1.5,
  },
})

interface InvoiceItemData {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  order: number
}

interface InvoiceData {
  id: string
  invoiceNumber: string
  status: string
  issueDate: string | Date
  dueDate: string | Date
  paidAt?: string | Date | null
  subtotal: number
  taxRate: number
  taxAmount: number
  totalAmount: number
  currency: string
  notes?: string | null
  issuerName: string
  issuerAddress?: string | null
  issuerIce?: string | null
  issuerRc?: string | null
  issuerIf?: string | null
  clientName: string
  clientEmail: string
  clientCompany?: string | null
  clientIce?: string | null
  clientRc?: string | null
  clientAddress?: string | null
  clientCity?: string | null
  items: InvoiceItemData[]
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatAmount(amount: number, currency: string = "MAD"): string {
  return `${amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

export function InvoicePDF({ invoice }: { invoice: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>ITQAN</Text>
            <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>
              Plateforme Freelance Maroc
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* Issuer & Client Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Emetteur</Text>
            <Text style={styles.infoBold}>{invoice.issuerName}</Text>
            {invoice.issuerAddress && (
              <Text style={styles.infoText}>{invoice.issuerAddress}</Text>
            )}
            {invoice.issuerIce && (
              <Text style={styles.infoText}>ICE : {invoice.issuerIce}</Text>
            )}
            {invoice.issuerRc && (
              <Text style={styles.infoText}>RC : {invoice.issuerRc}</Text>
            )}
            {invoice.issuerIf && (
              <Text style={styles.infoText}>IF : {invoice.issuerIf}</Text>
            )}
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoBold}>
              {invoice.clientCompany || invoice.clientName}
            </Text>
            {invoice.clientCompany && (
              <Text style={styles.infoText}>{invoice.clientName}</Text>
            )}
            <Text style={styles.infoText}>{invoice.clientEmail}</Text>
            {invoice.clientAddress && (
              <Text style={styles.infoText}>{invoice.clientAddress}</Text>
            )}
            {invoice.clientCity && (
              <Text style={styles.infoText}>{invoice.clientCity}</Text>
            )}
            {invoice.clientIce && (
              <Text style={styles.infoText}>ICE : {invoice.clientIce}</Text>
            )}
            {invoice.clientRc && (
              <Text style={styles.infoText}>RC : {invoice.clientRc}</Text>
            )}
          </View>
        </View>

        {/* Dates & Status */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date emission</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.issueDate)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date echeance</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Devise</Text>
            <Text style={styles.metaValue}>{invoice.currency}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Statut</Text>
            <Text style={styles.metaValue}>
              {invoice.status === "PAID"
                ? "Payee"
                : invoice.status === "SENT"
                  ? "Envoyee"
                  : invoice.status === "DRAFT"
                    ? "Brouillon"
                    : invoice.status === "OVERDUE"
                      ? "En retard"
                      : "Annulee"}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}>
              <Text style={styles.tableHeaderText}>Description</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={{ ...styles.tableHeaderText, textAlign: "center" }}>Qte</Text>
            </View>
            <View style={styles.colUnit}>
              <Text style={{ ...styles.tableHeaderText, textAlign: "right" }}>P.U. HT</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={{ ...styles.tableHeaderText, textAlign: "right" }}>Montant HT</Text>
            </View>
          </View>

          {invoice.items
            .sort((a, b) => a.order - b.order)
            .map((item, i) => (
              <View
                key={item.id}
                style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
              >
                <View style={styles.colDesc}>
                  <Text style={styles.cellText}>{item.description}</Text>
                </View>
                <View style={styles.colQty}>
                  <Text style={{ ...styles.cellText, textAlign: "center" }}>
                    {item.quantity}
                  </Text>
                </View>
                <View style={styles.colUnit}>
                  <Text style={{ ...styles.cellText, textAlign: "right" }}>
                    {formatAmount(item.unitPrice, invoice.currency)}
                  </Text>
                </View>
                <View style={styles.colAmount}>
                  <Text style={{ ...styles.cellBold, textAlign: "right" }}>
                    {formatAmount(item.amount, invoice.currency)}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT</Text>
              <Text style={styles.totalValue}>
                {formatAmount(invoice.subtotal, invoice.currency)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA ({invoice.taxRate}%)</Text>
              <Text style={styles.totalValue}>
                {formatAmount(invoice.taxAmount, invoice.currency)}
              </Text>
            </View>
            <View style={styles.totalFinalRow}>
              <Text style={styles.totalFinalLabel}>Total TTC</Text>
              <Text style={styles.totalFinalValue}>
                {formatAmount(invoice.totalAmount, invoice.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes & Conditions</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerText}>
              {invoice.issuerName} — Plateforme Freelance Maroc
            </Text>
            {invoice.issuerIce && (
              <Text style={styles.footerText}>ICE : {invoice.issuerIce}</Text>
            )}
          </View>
          <View>
            <Text style={styles.footerText}>
              Facture {invoice.invoiceNumber}
            </Text>
            <Text style={styles.footerText}>
              Generee le {formatDate(new Date())}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
