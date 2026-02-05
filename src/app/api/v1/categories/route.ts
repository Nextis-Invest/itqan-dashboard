import { NextResponse } from "next/server"
import { getCachedCategoryTree } from "@/lib/services/categories-cache"

export async function GET() {
  try {
    // Get categories from cache (or database if cache miss)
    const categories = await getCachedCategoryTree()

    return NextResponse.json(
      {
        data: categories,
        cached: true
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "99",
        },
      }
    )
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
