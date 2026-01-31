import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")))
  const category = searchParams.get("category")

  const where: any = { status: "ACTIVE" }
  if (category) where.category = category

  const [gigs, total] = await Promise.all([
    prisma.gig.findMany({
      where,
      select: {
        id: true, title: true, description: true, category: true, subcategory: true,
        basicPrice: true, basicTitle: true, standardPrice: true, standardTitle: true,
        premiumPrice: true, premiumTitle: true, currency: true, deliveryDays: true,
        skills: true, images: true, orderCount: true, createdAt: true,
        freelancer: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { orderCount: "desc" },
    }),
    prisma.gig.count({ where }),
  ])

  return NextResponse.json(
    { data: gigs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    { headers: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "99" } }
  )
}
