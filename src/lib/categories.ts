import { prismaCatalog } from "@/lib/prisma-catalog"

// Types matching the old structure for backward compatibility
export interface SubSubCategory {
  value: string
  label: string
  labelAr?: string
}

export interface SubCategory {
  value: string
  label: string
  labelAr?: string
  children?: SubSubCategory[]
}

export interface Category {
  value: string
  label: string
  labelAr?: string
  icon?: string
  color?: string
  subcategories: SubCategory[]
}

// New types for catalog-based data
export type CatalogCategory = {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  subcategories: CatalogSubcategory[]
}

export type CatalogSubcategory = {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  avgTjmMin: number | null
  avgTjmMax: number | null
}

/**
 * Get all categories from catalog DB with translations
 */
export async function getCategoriesFromCatalog(locale: string = 'fr'): Promise<CatalogCategory[]> {
  const categories = await prismaCatalog.category.findMany({
    where: {
      level: 0,
      isActive: true,
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
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  })

  return categories.map((cat) => ({
    id: cat.id,
    slug: cat.translations[0]?.slug || cat.id,
    name: cat.translations[0]?.name || "Unknown",
    description: cat.translations[0]?.description || null,
    icon: cat.icon,
    color: cat.color,
    subcategories: cat.children.map((sub) => ({
      id: sub.id,
      slug: sub.translations[0]?.slug || sub.id,
      name: sub.translations[0]?.name || "Unknown",
      description: sub.translations[0]?.description || null,
      icon: sub.icon,
      avgTjmMin: sub.avgTjmMin,
      avgTjmMax: sub.avgTjmMax,
    })),
  }))
}

/**
 * Get category by slug from catalog
 */
export async function getCategoryBySlug(slug: string, locale: string = 'fr'): Promise<CatalogCategory | null> {
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
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  })

  if (!translation || !translation.category.isActive) return null

  const cat = translation.category
  return {
    id: cat.id,
    slug: cat.translations[0]?.slug || cat.id,
    name: cat.translations[0]?.name || "Unknown",
    description: cat.translations[0]?.description || null,
    icon: cat.icon,
    color: cat.color,
    subcategories: cat.children.map((sub) => ({
      id: sub.id,
      slug: sub.translations[0]?.slug || sub.id,
      name: sub.translations[0]?.name || "Unknown",
      description: sub.translations[0]?.description || null,
      icon: sub.icon,
      avgTjmMin: sub.avgTjmMin,
      avgTjmMax: sub.avgTjmMax,
    })),
  }
}

/**
 * Get subcategory by slugs
 */
export async function getSubcategoryBySlug(
  categorySlug: string,
  subSlug: string,
  locale: string = 'fr'
): Promise<{ category: CatalogCategory; subcategory: CatalogSubcategory } | null> {
  const category = await getCategoryBySlug(categorySlug, locale)
  if (!category) return null

  const subcategory = category.subcategories.find((s) => s.slug === subSlug)
  if (!subcategory) return null

  return { category, subcategory }
}

/**
 * Convert catalog categories to old format for backward compatibility
 * This allows gradual migration of components
 */
export async function getCategoriesLegacyFormat(locale: string = 'fr'): Promise<Category[]> {
  const catalogCategories = await getCategoriesFromCatalog(locale)
  
  // Also get Arabic translations for labelAr
  const arCategories = locale !== 'ar' 
    ? await getCategoriesFromCatalog('ar')
    : null

  return catalogCategories.map((cat, idx) => ({
    value: cat.slug,
    label: cat.name,
    labelAr: arCategories?.[idx]?.name,
    icon: cat.icon || undefined,
    color: cat.color || undefined,
    subcategories: cat.subcategories.map((sub, subIdx) => ({
      value: sub.slug,
      label: sub.name,
      labelAr: arCategories?.[idx]?.subcategories[subIdx]?.name,
    })),
  }))
}

/**
 * Get all active locales from catalog
 */
export async function getActiveLocales() {
  return prismaCatalog.locale.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * Flat list of all subcategories with parent info
 */
export async function getAllSubcategories(locale: string = 'fr') {
  const categories = await getCategoriesFromCatalog(locale)
  return categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      ...sub,
      categoryId: cat.id,
      categorySlug: cat.slug,
      categoryName: cat.name,
    }))
  )
}

// Legacy export - empty array, use getCategoriesFromCatalog() instead
export const categories: Category[] = []
