import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getCategoriesWithTranslations } from '@/lib/services/catalog'
import { config } from '@/lib/config'

const LOCALES = ['fr', 'en', 'ar'] as const

/**
 * Generate URLs for all locales
 */
function generateLocalizedUrls(
  path: string,
  priority: number,
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  return LOCALES.map((locale) => ({
    url: `${config.appUrl}/${locale}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${config.appUrl}/${l}${path}`])
      ),
    },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  // Fetch categories from catalog
  const categories = await getCategoriesWithTranslations('fr')

  // Fetch active gigs
  const gigs = await prisma.gig.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, updatedAt: true },
  })

  // Homepage (marketplace)
  const homepage: MetadataRoute.Sitemap = generateLocalizedUrls(
    '/marketplace',
    1.0,
    'daily'
  )

  // Categories index
  const categoriesIndex: MetadataRoute.Sitemap = generateLocalizedUrls(
    '/marketplace/categories',
    0.9,
    'weekly'
  )

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) => [
    // Parent category
    ...generateLocalizedUrls(`/marketplace/categories/${cat.slug}`, 0.85, 'weekly'),
    // Subcategories
    ...(cat.children?.flatMap((sub) =>
      generateLocalizedUrls(`/marketplace/categories/${cat.slug}/${sub.slug}`, 0.8, 'weekly')
    ) || []),
  ])

  // Gig pages
  const gigPages: MetadataRoute.Sitemap = gigs.flatMap((gig) =>
    LOCALES.map((locale) => ({
      url: `${config.appUrl}/${locale}/marketplace/gigs/${gig.id}`,
      lastModified: gig.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${config.appUrl}/${l}/marketplace/gigs/${gig.id}`])
        ),
      },
    }))
  )

  return [
    ...homepage,
    ...categoriesIndex,
    ...categoryPages,
    ...gigPages,
  ]
}
