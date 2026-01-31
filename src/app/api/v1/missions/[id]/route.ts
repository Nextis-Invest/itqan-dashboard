import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const mission = await prisma.mission.findUnique({
    where: { id },
    select: {
      id: true, title: true, description: true, budget: true, budgetMin: true,
      budgetMax: true, budgetType: true, currency: true, deadline: true,
      duration: true, status: true, category: true, subcategory: true,
      skills: true, experienceLevel: true, remote: true, location: true,
      featured: true, viewCount: true, createdAt: true,
      client: { select: { id: true, name: true } },
      _count: { select: { proposals: true } },
    },
  })

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json(
    { data: mission },
    { headers: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "99" } }
  )
}
