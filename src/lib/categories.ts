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

/**
 * Resolve a locale-specific slug to its French (base) equivalent
 * Used for querying the main DB which stores French slugs
 */
export async function resolveFrenchSlugs(
  categorySlug: string,
  subSlug: string,
  locale: string
): Promise<{ frCategorySlug: string; frSubSlug: string } | null> {
  if (locale === 'fr') {
    return { frCategorySlug: categorySlug, frSubSlug: subSlug }
  }

  // Find category by locale slug
  const catTranslation = await prismaCatalog.categoryTranslation.findUnique({
    where: { locale_slug: { locale, slug: categorySlug } },
    include: { category: true },
  })
  if (!catTranslation) return null

  // Get French slug for category
  const frCatTranslation = await prismaCatalog.categoryTranslation.findUnique({
    where: { categoryId_locale: { categoryId: catTranslation.categoryId, locale: 'fr' } },
  })
  if (!frCatTranslation) return null

  // Find subcategory by locale slug
  const subTranslation = await prismaCatalog.categoryTranslation.findUnique({
    where: { locale_slug: { locale, slug: subSlug } },
    include: { category: true },
  })
  if (!subTranslation) return null

  // Get French slug for subcategory
  const frSubTranslation = await prismaCatalog.categoryTranslation.findUnique({
    where: { categoryId_locale: { categoryId: subTranslation.categoryId, locale: 'fr' } },
  })
  if (!frSubTranslation) return null

  return {
    frCategorySlug: frCatTranslation.slug,
    frSubSlug: frSubTranslation.slug,
  }
}

/**
 * Get category with siblings for navigation, by locale-specific slug
 */
export async function getCategoryWithChildren(
  categorySlug: string,
  locale: string
): Promise<{
  id: string
  name: string
  slug: string
  frSlug: string
  children: Array<{ id: string; name: string; slug: string; frSlug: string }>
} | null> {
  const translation = await prismaCatalog.categoryTranslation.findUnique({
    where: { locale_slug: { locale, slug: categorySlug } },
    include: {
      category: {
        include: {
          translations: { where: { locale: 'fr' } },
          children: {
            where: { isActive: true },
            include: {
              translations: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  })

  if (!translation) return null

  const cat = translation.category
  const frSlug = cat.translations[0]?.slug || categorySlug

  return {
    id: cat.id,
    name: translation.name,
    slug: categorySlug,
    frSlug,
    children: cat.children.map((child) => {
      const childLocaleTranslation = child.translations.find((t) => t.locale === locale)
      const childFrTranslation = child.translations.find((t) => t.locale === 'fr')
      return {
        id: child.id,
        name: childLocaleTranslation?.name || childFrTranslation?.name || 'Unknown',
        slug: childLocaleTranslation?.slug || childFrTranslation?.slug || child.id,
        frSlug: childFrTranslation?.slug || child.id,
      }
    }),
  }
}

/**
 * Get subcategory info by locale-specific slug
 */
export async function getSubcategoryInfo(
  subSlug: string,
  locale: string
): Promise<{ id: string; name: string; slug: string; frSlug: string } | null> {
  const translation = await prismaCatalog.categoryTranslation.findUnique({
    where: { locale_slug: { locale, slug: subSlug } },
    include: {
      category: {
        include: {
          translations: { where: { locale: 'fr' } },
        },
      },
    },
  })

  if (!translation) return null

  return {
    id: translation.category.id,
    name: translation.name,
    slug: subSlug,
    frSlug: translation.category.translations[0]?.slug || subSlug,
  }
}

// Legacy export - empty array, use getCategoriesFromCatalog() instead
export const categories: Category[] = []
