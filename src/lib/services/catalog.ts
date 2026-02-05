import { prismaCatalog } from '@/lib/prisma-catalog'

export type CategoryWithTranslation = {
  id: string
  icon: string | null
  color: string | null
  level: number
  sortOrder: number
  avgTjmMin: number | null
  avgTjmMax: number | null
  parentId: string | null
  // Localized fields
  name: string
  slug: string
  description: string | null
  // Children (if loaded)
  children?: CategoryWithTranslation[]
}

/**
 * Get all categories with translations for a specific locale
 */
export async function getCategoriesWithTranslations(
  locale: string = 'fr'
): Promise<CategoryWithTranslation[]> {
  const categories = await prismaCatalog.category.findMany({
    where: { 
      isActive: true,
      level: 0, // Only root categories
    },
    include: {
      translations: {
        where: { locale },
      },
      children: {
        where: { isActive: true },
        include: {
          translations: {
            where: { locale },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })

  return categories.map((cat) => ({
    id: cat.id,
    icon: cat.icon,
    color: cat.color,
    level: cat.level,
    sortOrder: cat.sortOrder,
    avgTjmMin: cat.avgTjmMin,
    avgTjmMax: cat.avgTjmMax,
    parentId: cat.parentId,
    name: cat.translations[0]?.name || 'Unknown',
    slug: cat.translations[0]?.slug || cat.id,
    description: cat.translations[0]?.description || null,
    children: cat.children.map((sub) => ({
      id: sub.id,
      icon: sub.icon,
      color: sub.color,
      level: sub.level,
      sortOrder: sub.sortOrder,
      avgTjmMin: sub.avgTjmMin,
      avgTjmMax: sub.avgTjmMax,
      parentId: sub.parentId,
      name: sub.translations[0]?.name || 'Unknown',
      slug: sub.translations[0]?.slug || sub.id,
      description: sub.translations[0]?.description || null,
    })),
  }))
}

/**
 * Get a category by slug for a specific locale
 */
export async function getCategoryBySlug(
  slug: string,
  locale: string = 'fr'
): Promise<CategoryWithTranslation | null> {
  const translation = await prismaCatalog.categoryTranslation.findUnique({
    where: {
      locale_slug: { locale, slug },
    },
    include: {
      category: {
        include: {
          translations: {
            where: { locale },
          },
          children: {
            where: { isActive: true },
            include: {
              translations: {
                where: { locale },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  })

  if (!translation) return null

  const cat = translation.category
  return {
    id: cat.id,
    icon: cat.icon,
    color: cat.color,
    level: cat.level,
    sortOrder: cat.sortOrder,
    avgTjmMin: cat.avgTjmMin,
    avgTjmMax: cat.avgTjmMax,
    parentId: cat.parentId,
    name: cat.translations[0]?.name || 'Unknown',
    slug: cat.translations[0]?.slug || cat.id,
    description: cat.translations[0]?.description || null,
    children: cat.children.map((sub) => ({
      id: sub.id,
      icon: sub.icon,
      color: sub.color,
      level: sub.level,
      sortOrder: sub.sortOrder,
      avgTjmMin: sub.avgTjmMin,
      avgTjmMax: sub.avgTjmMax,
      parentId: sub.parentId,
      name: sub.translations[0]?.name || 'Unknown',
      slug: sub.translations[0]?.slug || sub.id,
      description: sub.translations[0]?.description || null,
    })),
  }
}

/**
 * Get all subcategories (flat list) with translations
 */
export async function getSubcategoriesWithTranslations(
  locale: string = 'fr',
  parentId?: string
): Promise<CategoryWithTranslation[]> {
  const where: { isActive: boolean; level: number; parentId?: string } = { 
    isActive: true,
    level: 1,
  }
  if (parentId) where.parentId = parentId

  const subcategories = await prismaCatalog.category.findMany({
    where,
    include: {
      translations: {
        where: { locale },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })

  return subcategories.map((sub) => ({
    id: sub.id,
    icon: sub.icon,
    color: sub.color,
    level: sub.level,
    sortOrder: sub.sortOrder,
    avgTjmMin: sub.avgTjmMin,
    avgTjmMax: sub.avgTjmMax,
    parentId: sub.parentId,
    name: sub.translations[0]?.name || 'Unknown',
    slug: sub.translations[0]?.slug || sub.id,
    description: sub.translations[0]?.description || null,
  }))
}

/**
 * Get active locales
 */
export async function getActiveLocales() {
  return prismaCatalog.locale.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * Check for slug redirect (for SEO)
 */
export async function checkSlugRedirect(
  slug: string,
  locale: string,
  entityType: string = 'category'
) {
  return prismaCatalog.slugRedirect.findUnique({
    where: {
      locale_oldSlug_entityType: {
        locale,
        oldSlug: slug,
        entityType,
      },
    },
  })
}
