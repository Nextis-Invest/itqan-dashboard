import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: { orderBy: { order: "asc" } },
        client: { select: { name: true, email: true, image: true } },
      },
    })

    if (!invoice) {
      return NextResponse.json({ message: "Facture non trouvée" }, { status: 404 })
    }

    // Clients can only see their own invoices
    if (user?.role !== "ADMIN" && invoice.clientId !== session.user.id) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("GET /api/invoices/[id] error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, notes, paidAt, dueDate, items } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (dueDate) updateData.dueDate = new Date(dueDate)
    if (paidAt) updateData.paidAt = new Date(paidAt)
    if (status === "PAID" && !paidAt) updateData.paidAt = new Date()

    // If items are provided, recalculate totals
    if (items?.length) {
      const { calculateInvoiceTotals } = await import("@/lib/invoice")
      const invoice = await prisma.invoice.findUnique({ where: { id }, select: { taxRate: true } })
      const totals = calculateInvoiceTotals(items, invoice?.taxRate ?? 20)
      updateData.subtotal = totals.subtotal
      updateData.taxAmount = totals.taxAmount
      updateData.totalAmount = totals.totalAmount

      // Delete old items and create new ones
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } })
      await prisma.invoiceItem.createMany({
        data: items.map((item: any, index: number) => ({
          invoiceId: id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.quantity * item.unitPrice,
          order: index,
        })),
      })
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        items: { orderBy: { order: "asc" } },
        client: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PATCH /api/invoices/[id] error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    const { id } = await params
    await prisma.invoice.delete({ where: { id } })
    return NextResponse.json({ message: "Facture supprimée" })
  } catch (error) {
    console.error("DELETE /api/invoices/[id] error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
