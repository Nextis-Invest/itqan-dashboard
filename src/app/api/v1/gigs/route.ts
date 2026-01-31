import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")))
  const category = searchParams.get("category")
  const subcategory = searchParams.get("subcategory")
  const search = searchParams.get("search")
  const skills = searchParams.get("skills")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const sort = searchParams.get("sort") || "popular"

  const where: any = { status: "ACTIVE" }

  if (category) where.category = category
  if (subcategory) where.subcategory = subcategory

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  if (skills) {
    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean)
    if (skillList.length > 0) {
      where.skills = { hasSome: skillList }
    }
  }

  if (minPrice || maxPrice) {
    where.basicPrice = {}
    if (minPrice) where.basicPrice.gte = parseFloat(minPrice)
    if (maxPrice) where.basicPrice.lte = parseFloat(maxPrice)
  }

  const orderByMap: Record<string, any> = {
    popular: { orderCount: "desc" },
    newest: { createdAt: "desc" },
    price_asc: { basicPrice: "asc" },
    price_desc: { basicPrice: "desc" },
  }
  const orderBy = orderByMap[sort] || orderByMap.popular

  const [gigs, total] = await Promise.all([
    prisma.gig.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        subcategory: true,
        basicPrice: true,
        basicTitle: true,
        basicDesc: true,
        standardPrice: true,
        standardTitle: true,
        standardDesc: true,
        premiumPrice: true,
        premiumTitle: true,
        premiumDesc: true,
        currency: true,
        deliveryDays: true,
        skills: true,
        images: true,
        orderCount: true,
        viewCount: true,
        createdAt: true,
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
            freelancerProfile: {
              select: {
                title: true,
                avgRating: true,
                city: true,
                verified: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    }),
    prisma.gig.count({ where }),
  ])

  return NextResponse.json(
    { data: gigs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    { headers: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "99" } }
  )
}
