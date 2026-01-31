import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")))
  const category = searchParams.get("category")
  const city = searchParams.get("city")
  const skills = searchParams.get("skills")

  const where: any = { verified: true }
  if (category) where.category = category
  if (city) where.city = { contains: city, mode: "insensitive" }
  if (skills) {
    where.skills = { hasSome: skills.split(",").map((s) => s.trim()) }
  }

  const [profiles, total] = await Promise.all([
    prisma.freelancerProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { completedMissions: "desc" },
    }),
    prisma.freelancerProfile.count({ where }),
  ])

  const data = profiles.map((p) => ({
    id: p.user.id,
    name: p.user.name,
    image: p.user.image,
    title: p.title,
    city: p.city,
    country: p.country,
    skills: p.skills,
    category: p.category,
    dailyRate: p.dailyRate,
    currency: p.currency,
    avgRating: p.avgRating,
    completedMissions: p.completedMissions,
    available: p.available,
    remote: p.remote,
  }))

  return NextResponse.json(
    { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    { headers: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "99" } }
  )
}
