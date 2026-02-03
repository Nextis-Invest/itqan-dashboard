import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import { generateInvoiceNumber, calculateInvoiceTotals } from "@/lib/invoice"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const clientId = searchParams.get("clientId")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const where: any = {}

    // Clients can only see their own invoices
    if (user?.role !== "ADMIN") {
      where.clientId = session.user.id
    } else if (clientId) {
      where.clientId = clientId
    }

    if (status) {
      where.status = status
    }

    if (from || to) {
      where.issueDate = {}
      if (from) where.issueDate.gte = new Date(from)
      if (to) where.issueDate.lte = new Date(to)
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        items: { orderBy: { order: "asc" } },
        client: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("GET /api/invoices error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const {
      clientId,
      dueDate,
      items,
      notes,
      taxRate = 20,
      currency = "MAD",
      issuerName = "Itqan",
      issuerAddress,
      issuerIce,
      issuerRc,
      issuerIf,
      contractId,
      missionId,
      sendNow = false,
    } = body

    if (!clientId || !dueDate || !items?.length) {
      return NextResponse.json(
        { message: "clientId, dueDate et items sont requis" },
        { status: 400 }
      )
    }

    // Get client info
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: { clientProfile: true },
    })
    if (!client) {
      return NextResponse.json({ message: "Client non trouvé" }, { status: 404 })
    }

    const invoiceNumber = await generateInvoiceNumber()
    const totals = calculateInvoiceTotals(items, taxRate)

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId,
        contractId: contractId || null,
        missionId: missionId || null,
        status: sendNow ? "SENT" : "DRAFT",
        dueDate: new Date(dueDate),
        subtotal: totals.subtotal,
        taxRate,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        currency,
        notes: notes || null,
        issuerName,
        issuerAddress: issuerAddress || null,
        issuerIce: issuerIce || null,
        issuerRc: issuerRc || null,
        issuerIf: issuerIf || null,
        clientName: client.name || client.email,
        clientEmail: client.email,
        clientCompany: client.clientProfile?.companyName || null,
        clientIce: client.clientProfile?.ice || null,
        clientRc: client.clientProfile?.rc || null,
        clientAddress: client.clientProfile?.address || null,
        clientCity: client.clientProfile?.city || null,
        sentAt: sendNow ? new Date() : null,
        items: {
          create: items.map((item: any, index: number) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
            order: index,
          })),
        },
      },
      include: {
        items: { orderBy: { order: "asc" } },
        client: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("POST /api/invoices error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
