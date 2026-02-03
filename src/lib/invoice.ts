import { prisma } from "@/lib/prisma"

/**
 * Generate the next invoice number in format ITQ-YYYY-NNNN
 */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `ITQ-${year}-`

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: { startsWith: prefix },
    },
    orderBy: { invoiceNumber: "desc" },
    select: { invoiceNumber: true },
  })

  let nextNum = 1
  if (lastInvoice) {
    const lastNum = parseInt(lastInvoice.invoiceNumber.replace(prefix, ""), 10)
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1
    }
  }

  return `${prefix}${String(nextNum).padStart(4, "0")}`
}

/**
 * Calculate invoice totals from items
 */
export function calculateInvoiceTotals(
  items: { quantity: number; unitPrice: number }[],
  taxRate: number = 20
): { subtotal: number; taxAmount: number; totalAmount: number } {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100
  const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100

  return { subtotal: Math.round(subtotal * 100) / 100, taxAmount, totalAmount }
}
