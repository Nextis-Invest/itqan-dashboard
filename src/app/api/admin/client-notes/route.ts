import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (admin?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 })
  }

  const body = await request.json() as { userId: string; notes: string }
  const { userId, notes } = body

  await prisma.clientProfile.update({
    where: { userId },
    data: { adminNotes: notes || null },
  })

  return NextResponse.json({ success: true })
}
