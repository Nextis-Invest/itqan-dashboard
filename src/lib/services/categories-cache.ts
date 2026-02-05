import { prisma } from "@/lib/prisma"
import { withCache, invalidateCache } from "@/lib/redis"

export interface CategoryTree {
  id: string
  slug: string
  name: string
  nameAr: string | null
  icon: string | null
  level: number
  order: number
  parentId: string | null
  children: CategoryTree[]
}

// Cache keys
const CACHE_KEYS = {
  ALL_CATEGORIES: "categories:all",
  TREE: "categories:tree",
  BY_SLUG: (slug: string) => `categories:slug:${slug}`,
  BY_PARENT: (parentId: string | null) =>
    `categories:parent:${parentId || "root"}`,
}

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  CATEGORIES: 3600, // 1 hour
  TREE: 7200, // 2 hours
}

/**
 * Get all categories with caching
 */
export async function getCachedCategories() {
  return withCache(
    CACHE_KEYS.ALL_CATEGORIES,
    async () => {
      return prisma.category.findMany({
        orderBy: [{ level: "asc" }, { order: "asc" }, { name: "asc" }],
      })
    },
    CACHE_TTL.CATEGORIES
  )
}

/**
 * Get category tree with caching
 */
export async function getCachedCategoryTree(): Promise<CategoryTree[]> {
  return withCache(
    CACHE_KEYS.TREE,
    async () => {
      const allCategories = await prisma.category.findMany({
        orderBy: [{ level: "asc" }, { order: "asc" }, { name: "asc" }],
      })

      // Build tree structure
      const categoryMap = new Map<string, CategoryTree>()
      const rootCategories: CategoryTree[] = []

      // First pass: create all category objects
      allCategories.forEach((cat) => {
        categoryMap.set(cat.id, {
          ...cat,
          children: [],
        })
      })

      // Second pass: build tree
      allCategories.forEach((cat) => {
        const category = categoryMap.get(cat.id)!
        if (cat.parentId) {
          const parent = categoryMap.get(cat.parentId)
          if (parent) {
            parent.children.push(category)
          } else {
            rootCategories.push(category)
          }
        } else {
          rootCategories.push(category)
        }
      })

      return rootCategories
    },
    CACHE_TTL.TREE
  )
}

/**
 * Get category by slug with caching
 */
export async function getCachedCategoryBySlug(slug: string) {
  return withCache(
    CACHE_KEYS.BY_SLUG(slug),
    async () => {
      return prisma.category.findUnique({
        where: { slug },
        include: {
          parent: true,
          children: {
            orderBy: [{ order: "asc" }, { name: "asc" }],
          },
        },
      })
    },
    CACHE_TTL.CATEGORIES
  )
}

/**
 * Get categories by parent with caching
 */
export async function getCachedCategoriesByParent(parentId: string | null) {
  return withCache(
    CACHE_KEYS.BY_PARENT(parentId),
    async () => {
      return prisma.category.findMany({
        where: { parentId },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      })
    },
    CACHE_TTL.CATEGORIES
  )
}

/**
 * Invalidate all category caches
 */
export async function invalidateCategoryCache() {
  await Promise.all([
    invalidateCache(CACHE_KEYS.ALL_CATEGORIES),
    invalidateCache(CACHE_KEYS.TREE),
    invalidateCache("categories:slug:*"),
    invalidateCache("categories:parent:*"),
  ])
}

/**
 * Invalidate cache for a specific category
 */
export async function invalidateCategoryCacheBySlug(slug: string) {
  await invalidateCache(CACHE_KEYS.BY_SLUG(slug))
}
