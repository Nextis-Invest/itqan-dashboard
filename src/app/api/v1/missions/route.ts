import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")))
  const category = searchParams.get("category")
  const skills = searchParams.get("skills")
  const remote = searchParams.get("remote")

  const where: any = { status: "OPEN" }
  if (category) where.category = category
  if (skills) where.skills = { hasSome: skills.split(",").map((s) => s.trim()) }
  if (remote === "true") where.remote = true

  const [missions, total] = await Promise.all([
    prisma.mission.findMany({
      where,
      select: {
        id: true, title: true, description: true, budget: true, budgetMin: true,
        budgetMax: true, budgetType: true, currency: true, deadline: true,
        category: true, skills: true, remote: true, location: true,
        featured: true, createdAt: true,
        client: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.mission.count({ where }),
  ])

  return NextResponse.json(
    { data: missions, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    { headers: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "99" } }
  )
}
