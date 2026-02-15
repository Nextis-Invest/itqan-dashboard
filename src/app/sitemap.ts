import { MetadataRoute } from 'next'
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
  // Dashboard app - minimal public pages
  const pages: MetadataRoute.Sitemap = [
    ...generateLocalizedUrls('/login', 0.8, 'monthly'),
    ...generateLocalizedUrls('/dashboard', 0.5, 'daily'),
    ...generateLocalizedUrls('/missions/new', 0.9, 'weekly'),
  ]

  return pages
}
