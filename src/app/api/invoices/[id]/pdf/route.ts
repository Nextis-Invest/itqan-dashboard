import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePDF } from "@/lib/invoice-pdf"
import React from "react"

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
      include: { items: { orderBy: { order: "asc" } } },
    })

    if (!invoice) {
      return NextResponse.json({ message: "Facture non trouvée" }, { status: 404 })
    }

    if (user?.role !== "ADMIN" && invoice.clientId !== session.user.id) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoicePDF, { invoice: invoice as any })
    )

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("GET /api/invoices/[id]/pdf error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
