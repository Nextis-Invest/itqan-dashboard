/**
 * SEO suffixes for subcategory permalinks by locale
 */

export const SEO_SUFFIXES: Record<string, string> = {
  fr: "-freelance-maroc",
  en: "-freelance-morocco",
  ar: "-freelance-morocco", // Using English for Arabic URLs for better SEO
  es: "-freelance-marruecos",
  de: "-freelance-marokko",
  pt: "-freelance-marrocos",
  it: "-freelance-marocco",
  nl: "-freelance-marokko",
  tr: "-freelance-fas",
  ja: "-freelance-morocco",
}

export const DEFAULT_LOCALE = "fr"

/**
 * Get SEO suffix for a given locale
 */
export function getSeoSuffix(locale: string = DEFAULT_LOCALE): string {
  return SEO_SUFFIXES[locale] || SEO_SUFFIXES[DEFAULT_LOCALE]
}

/**
 * Strip any known SEO suffix from a slug
 */
export function parseSubSlug(slug: string): string {
  for (const suffix of Object.values(SEO_SUFFIXES)) {
    if (slug.endsWith(suffix)) {
      return slug.slice(0, -suffix.length)
    }
  }
  return slug
}

/**
 * Build subcategory URL with SEO suffix
 * @param categorySlug - Parent category slug
 * @param subcategorySlug - Subcategory slug (without suffix)
 * @param locale - Current locale (defaults to 'fr')
 */
export function buildSubcategoryUrl(
  categorySlug: string,
  subcategorySlug: string,
  locale: string = DEFAULT_LOCALE
): string {
  const suffix = getSeoSuffix(locale)
  return `/marketplace/categories/${categorySlug}/${subcategorySlug}${suffix}`
}

/**
 * Build category URL
 */
export function buildCategoryUrl(categorySlug: string): string {
  return `/marketplace/categories/${categorySlug}`
}

/**
 * Build categories index URL
 */
export function buildCategoriesUrl(): string {
  return `/marketplace/categories`
}
