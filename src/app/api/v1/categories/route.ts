import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { level: 0 },
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      nameAr: true,
      icon: true,
      children: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          name: true,
          nameAr: true,
          icon: true,
          children: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              slug: true,
              name: true,
              nameAr: true,
              icon: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json(
    { data: categories },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "99",
      },
    }
  )
}
