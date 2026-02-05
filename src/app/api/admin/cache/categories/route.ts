import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { invalidateCategoryCache } from "@/lib/services/categories-cache"

/**
 * DELETE /api/admin/cache/categories
 * Invalidate all category caches
 */
export async function DELETE() {
  try {
    const session = await auth()

    // Only admins can invalidate cache
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await invalidateCategoryCache()

    return NextResponse.json({
      success: true,
      message: "Category cache invalidated successfully",
    })
  } catch (error) {
    console.error("Failed to invalidate category cache:", error)
    return NextResponse.json(
      { error: "Failed to invalidate cache" },
      { status: 500 }
    )
  }
}
