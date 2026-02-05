import { PrismaClient } from '@prisma/client-catalog'

const globalForPrismaCatalog = globalThis as unknown as {
  prismaCatalog: PrismaClient | undefined
}

export const prismaCatalog =
  globalForPrismaCatalog.prismaCatalog ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrismaCatalog.prismaCatalog = prismaCatalog
}

export type { Category, CategoryTranslation, Skill, SkillTranslation, Locale, SlugRedirect } from '@prisma/client-catalog'
