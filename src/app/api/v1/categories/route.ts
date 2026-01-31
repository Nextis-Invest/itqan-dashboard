import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  // Aggregate unique categories from freelancer profiles and missions
  const [freelancerCats, missionCats] = await Promise.all([
    prisma.freelancerProfile.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }),
    prisma.mission.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }),
  ])

  const allCats = new Set<string>()
  freelancerCats.forEach((f) => f.category && allCats.add(f.category))
  missionCats.forEach((m) => m.category && allCats.add(m.category))

  return NextResponse.json(
    { data: Array.from(allCats).sort() },
    { headers: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "99" } }
  )
}
