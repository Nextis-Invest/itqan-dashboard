// App configuration - centralized URLs and settings

const cleanUrl = (url: string) => url.replace(/\/$/, '')

export const config = {
  // Dashboard URL (app.itqan.ma)
  appUrl: cleanUrl(process.env.NEXT_PUBLIC_APP_URL || 'https://app.itqan.ma'),
  
  // Marketing site URL (itqan.ma)
  siteUrl: cleanUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://itqan.ma'),
} as const

// Site links helper (marketing site)
export const siteLinks = {
  home: config.siteUrl,
  freelances: `${config.siteUrl}/freelances`,
  missions: `${config.siteUrl}/missions`,
  guide: `${config.siteUrl}/guide`,
} as const
