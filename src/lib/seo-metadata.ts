/**
 * SEO Metadata Generator
 * Generates optimized titles and descriptions for category pages
 */

import type { Metadata } from "next"

interface CategorySeoData {
  name: string
  slug: string
  parentName?: string
  parentSlug?: string
  gigCount?: number
}

// Locale-specific SEO templates
const SEO_TEMPLATES: Record<string, {
  categoryTitle: (name: string) => string
  categoryDesc: (name: string, count?: number) => string
  subcategoryTitle: (name: string, parent: string) => string
  subcategoryDesc: (name: string, parent: string, count?: number) => string
}> = {
  fr: {
    categoryTitle: (name) => `${name} Freelance Maroc | Services & Experts | Itqan`,
    categoryDesc: (name, count) => 
      `Trouvez les meilleurs freelances ${name} au Maroc. ${count ? `+${count} experts disponibles. ` : ""}Tarifs compétitifs, profils vérifiés. Recrutez en 24h sur Itqan.`,
    subcategoryTitle: (name, parent) => `${name} Freelance Maroc | ${parent} | Itqan`,
    subcategoryDesc: (name, parent, count) =>
      `Freelances ${name} experts au Maroc. ${count ? `${count}+ professionnels disponibles. ` : ""}Services ${parent} de qualité. Devis gratuit sur Itqan.`,
  },
  en: {
    categoryTitle: (name) => `${name} Freelancers Morocco | Services & Experts | Itqan`,
    categoryDesc: (name, count) =>
      `Find the best ${name} freelancers in Morocco. ${count ? `${count}+ experts available. ` : ""}Competitive rates, verified profiles. Hire within 24h on Itqan.`,
    subcategoryTitle: (name, parent) => `${name} Freelancers Morocco | ${parent} | Itqan`,
    subcategoryDesc: (name, parent, count) =>
      `Expert ${name} freelancers in Morocco. ${count ? `${count}+ professionals available. ` : ""}Quality ${parent} services. Free quote on Itqan.`,
  },
  es: {
    categoryTitle: (name) => `${name} Freelance Marruecos | Servicios y Expertos | Itqan`,
    categoryDesc: (name, count) =>
      `Encuentra los mejores freelancers de ${name} en Marruecos. ${count ? `+${count} expertos disponibles. ` : ""}Tarifas competitivas, perfiles verificados.`,
    subcategoryTitle: (name, parent) => `${name} Freelance Marruecos | ${parent} | Itqan`,
    subcategoryDesc: (name, parent, count) =>
      `Freelancers expertos en ${name} en Marruecos. ${count ? `${count}+ profesionales. ` : ""}Servicios de ${parent} de calidad.`,
  },
  de: {
    categoryTitle: (name) => `${name} Freelancer Marokko | Services & Experten | Itqan`,
    categoryDesc: (name, count) =>
      `Finden Sie die besten ${name} Freelancer in Marokko. ${count ? `${count}+ Experten verfügbar. ` : ""}Wettbewerbsfähige Preise, verifizierte Profile.`,
    subcategoryTitle: (name, parent) => `${name} Freelancer Marokko | ${parent} | Itqan`,
    subcategoryDesc: (name, parent, count) =>
      `${name} Experten-Freelancer in Marokko. ${count ? `${count}+ Profis verfügbar. ` : ""}Qualitäts-${parent}-Services.`,
  },
  ar: {
    categoryTitle: (name) => `${name} فريلانسر المغرب | خدمات وخبراء | إتقان`,
    categoryDesc: (name, count) =>
      `اعثر على أفضل المستقلين في ${name} في المغرب. ${count ? `+${count} خبير متاح. ` : ""}أسعار تنافسية، ملفات موثقة.`,
    subcategoryTitle: (name, parent) => `${name} فريلانسر المغرب | ${parent} | إتقان`,
    subcategoryDesc: (name, parent, count) =>
      `مستقلون خبراء في ${name} في المغرب. ${count ? `${count}+ محترف متاح. ` : ""}خدمات ${parent} عالية الجودة.`,
  },
}

// Default to French for missing locales
const getTemplates = (locale: string) => SEO_TEMPLATES[locale] || SEO_TEMPLATES.fr

/**
 * Generate metadata for a category page
 */
export function generateCategoryMetadata(
  category: CategorySeoData,
  locale: string,
  gigCount?: number
): Metadata {
  const templates = getTemplates(locale)
  
  return {
    title: templates.categoryTitle(category.name),
    description: templates.categoryDesc(category.name, gigCount),
    openGraph: {
      title: templates.categoryTitle(category.name),
      description: templates.categoryDesc(category.name, gigCount),
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: templates.categoryTitle(category.name),
      description: templates.categoryDesc(category.name, gigCount),
    },
    alternates: {
      canonical: `/categories/${category.slug}`,
      languages: Object.fromEntries(
        Object.keys(SEO_TEMPLATES).map(loc => [
          loc,
          loc === "fr" ? `/categories/${category.slug}` : `/${loc}/categories/${category.slug}`
        ])
      ),
    },
  }
}

/**
 * Generate metadata for a subcategory page
 */
export function generateSubcategoryMetadata(
  subcategory: CategorySeoData,
  locale: string,
  gigCount?: number
): Metadata {
  const templates = getTemplates(locale)
  
  if (!subcategory.parentName || !subcategory.parentSlug) {
    return generateCategoryMetadata(subcategory, locale, gigCount)
  }

  const SEO_SUFFIXES: Record<string, string> = {
    fr: "-freelance-maroc",
    en: "-freelance-morocco",
    es: "-freelance-marruecos",
    de: "-freelance-marokko",
    ar: "-freelance-morocco",
  }
  
  const suffix = SEO_SUFFIXES[locale] || SEO_SUFFIXES.fr
  const canonicalPath = `/categories/${subcategory.parentSlug}/${subcategory.slug}${suffix}`

  return {
    title: templates.subcategoryTitle(subcategory.name, subcategory.parentName),
    description: templates.subcategoryDesc(subcategory.name, subcategory.parentName, gigCount),
    openGraph: {
      title: templates.subcategoryTitle(subcategory.name, subcategory.parentName),
      description: templates.subcategoryDesc(subcategory.name, subcategory.parentName, gigCount),
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: templates.subcategoryTitle(subcategory.name, subcategory.parentName),
      description: templates.subcategoryDesc(subcategory.name, subcategory.parentName, gigCount),
    },
    alternates: {
      canonical: canonicalPath,
      languages: Object.fromEntries(
        Object.keys(SEO_SUFFIXES).map(loc => {
          const locSuffix = SEO_SUFFIXES[loc] || SEO_SUFFIXES.fr
          const path = `/categories/${subcategory.parentSlug}/${subcategory.slug}${locSuffix}`
          return [loc, loc === "fr" ? path : `/${loc}${path}`]
        })
      ),
    },
  }
}

/**
 * Get optimized H1 for category pages
 */
export function getCategoryH1(name: string, locale: string): string {
  const h1Templates: Record<string, (name: string) => string> = {
    fr: (n) => `Freelances ${n} au Maroc`,
    en: (n) => `${n} Freelancers in Morocco`,
    es: (n) => `Freelancers de ${n} en Marruecos`,
    de: (n) => `${n} Freelancer in Marokko`,
    ar: (n) => `مستقلون ${n} في المغرب`,
  }
  return (h1Templates[locale] || h1Templates.fr)(name)
}

/**
 * Get optimized H1 for subcategory pages
 */
export function getSubcategoryH1(name: string, parentName: string, locale: string): string {
  const h1Templates: Record<string, (name: string, parent: string) => string> = {
    fr: (n, p) => `${n} - Freelances ${p} Maroc`,
    en: (n, p) => `${n} - ${p} Freelancers Morocco`,
    es: (n, p) => `${n} - Freelancers ${p} Marruecos`,
    de: (n, p) => `${n} - ${p} Freelancer Marokko`,
    ar: (n, p) => `${n} - مستقلون ${p} المغرب`,
  }
  return (h1Templates[locale] || h1Templates.fr)(name, parentName)
}

// ==================== SKILLS SEO ====================

interface SkillSeoData {
  name: string
  slug: string
  categoryName?: string
  categorySlug?: string
}

// Skill-specific SEO templates
const SKILL_SEO_TEMPLATES: Record<string, {
  skillTitle: (name: string) => string
  skillDesc: (name: string, count?: number) => string
  skillTitleWithCat: (name: string, cat: string) => string
  skillDescWithCat: (name: string, cat: string, count?: number) => string
}> = {
  fr: {
    skillTitle: (name) => `Freelances ${name} au Maroc | Experts Certifiés | Itqan`,
    skillDesc: (name, count) => 
      `Recrutez les meilleurs freelances ${name} au Maroc. ${count ? `+${count} experts disponibles. ` : ""}Profils vérifiés, tarifs compétitifs. Trouvez votre expert ${name} en 24h.`,
    skillTitleWithCat: (name, cat) => `Freelances ${name} Maroc | ${cat} | Itqan`,
    skillDescWithCat: (name, cat, count) =>
      `Experts ${name} freelances au Maroc. ${count ? `${count}+ professionnels ${cat}. ` : ""}Comparez les profils et tarifs. Devis gratuit sur Itqan.`,
  },
  en: {
    skillTitle: (name) => `${name} Freelancers Morocco | Certified Experts | Itqan`,
    skillDesc: (name, count) =>
      `Hire the best ${name} freelancers in Morocco. ${count ? `${count}+ experts available. ` : ""}Verified profiles, competitive rates. Find your ${name} expert in 24h.`,
    skillTitleWithCat: (name, cat) => `${name} Freelancers Morocco | ${cat} | Itqan`,
    skillDescWithCat: (name, cat, count) =>
      `Expert ${name} freelancers in Morocco. ${count ? `${count}+ ${cat} professionals. ` : ""}Compare profiles and rates. Free quote on Itqan.`,
  },
  es: {
    skillTitle: (name) => `Freelancers ${name} Marruecos | Expertos Certificados | Itqan`,
    skillDesc: (name, count) =>
      `Contrata los mejores freelancers de ${name} en Marruecos. ${count ? `+${count} expertos disponibles. ` : ""}Perfiles verificados, tarifas competitivas.`,
    skillTitleWithCat: (name, cat) => `Freelancers ${name} Marruecos | ${cat} | Itqan`,
    skillDescWithCat: (name, cat, count) =>
      `Expertos ${name} freelancers en Marruecos. ${count ? `${count}+ profesionales de ${cat}. ` : ""}Compara perfiles y tarifas.`,
  },
  de: {
    skillTitle: (name) => `${name} Freelancer Marokko | Zertifizierte Experten | Itqan`,
    skillDesc: (name, count) =>
      `Stellen Sie die besten ${name} Freelancer in Marokko ein. ${count ? `${count}+ Experten verfügbar. ` : ""}Verifizierte Profile, wettbewerbsfähige Preise.`,
    skillTitleWithCat: (name, cat) => `${name} Freelancer Marokko | ${cat} | Itqan`,
    skillDescWithCat: (name, cat, count) =>
      `${name} Experten-Freelancer in Marokko. ${count ? `${count}+ ${cat} Profis. ` : ""}Vergleichen Sie Profile und Preise.`,
  },
  ar: {
    skillTitle: (name) => `مستقلون ${name} المغرب | خبراء معتمدون | إتقان`,
    skillDesc: (name, count) =>
      `وظّف أفضل المستقلين في ${name} في المغرب. ${count ? `+${count} خبير متاح. ` : ""}ملفات موثقة، أسعار تنافسية.`,
    skillTitleWithCat: (name, cat) => `مستقلون ${name} المغرب | ${cat} | إتقان`,
    skillDescWithCat: (name, cat, count) =>
      `خبراء ${name} مستقلون في المغرب. ${count ? `${count}+ محترف ${cat}. ` : ""}قارن الملفات والأسعار.`,
  },
}

const getSkillTemplates = (locale: string) => SKILL_SEO_TEMPLATES[locale] || SKILL_SEO_TEMPLATES.fr

/**
 * Generate metadata for a skill page
 */
export function generateSkillMetadata(
  skill: SkillSeoData,
  locale: string,
  gigCount?: number
): Metadata {
  const templates = getSkillTemplates(locale)
  
  const SEO_SUFFIXES: Record<string, string> = {
    fr: "-freelance-maroc",
    en: "-freelance-morocco",
    es: "-freelance-marruecos",
    de: "-freelance-marokko",
    ar: "-freelance-morocco",
  }
  
  const suffix = SEO_SUFFIXES[locale] || SEO_SUFFIXES.fr
  const canonicalPath = `/marketplace/skills/${skill.slug}${suffix}`

  const title = skill.categoryName 
    ? templates.skillTitleWithCat(skill.name, skill.categoryName)
    : templates.skillTitle(skill.name)
    
  const description = skill.categoryName
    ? templates.skillDescWithCat(skill.name, skill.categoryName, gigCount)
    : templates.skillDesc(skill.name, gigCount)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalPath,
      languages: Object.fromEntries(
        Object.keys(SEO_SUFFIXES).map(loc => {
          const locSuffix = SEO_SUFFIXES[loc] || SEO_SUFFIXES.fr
          const path = `/marketplace/skills/${skill.slug}${locSuffix}`
          return [loc, loc === "fr" ? path : `/${loc}${path}`]
        })
      ),
    },
  }
}

/**
 * Get optimized H1 for skill pages
 */
export function getSkillH1(name: string, locale: string): string {
  const h1Templates: Record<string, (name: string) => string> = {
    fr: (n) => `Freelances ${n} au Maroc`,
    en: (n) => `${n} Freelancers in Morocco`,
    es: (n) => `Freelancers de ${n} en Marruecos`,
    de: (n) => `${n} Freelancer in Marokko`,
    ar: (n) => `مستقلون ${n} في المغرب`,
  }
  return (h1Templates[locale] || h1Templates.fr)(name)
}
