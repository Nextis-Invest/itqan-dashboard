import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePDF } from "@/lib/invoice-pdf"
import { sendEmail, invoiceEmail } from "@/lib/email"
import React from "react"

export async function POST(
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

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: { orderBy: { order: "asc" } } },
    })

    if (!invoice) {
      return NextResponse.json({ message: "Facture non trouvée" }, { status: 404 })
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoicePDF, { invoice: invoice as any })
    )

    // Send email with PDF attachment
    const emailHtml = invoiceEmail(
      invoice.invoiceNumber,
      invoice.clientName,
      invoice.totalAmount,
      invoice.currency,
      invoice.dueDate.toISOString()
    )

    const result = await sendEmail({
      to: invoice.clientEmail,
      subject: `Facture ${invoice.invoiceNumber} — Itqan`,
      html: emailHtml,
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: Buffer.from(pdfBuffer),
        },
      ],
    })

    if (!result.success) {
      return NextResponse.json(
        { message: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      )
    }

    // Update invoice status
    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status: invoice.status === "DRAFT" ? "SENT" : invoice.status,
        sentAt: new Date(),
      },
    })

    return NextResponse.json({ message: "Facture envoyée", invoice: updated })
  } catch (error) {
    console.error("POST /api/invoices/[id]/send error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
