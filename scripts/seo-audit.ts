#!/usr/bin/env npx tsx
/**
 * SEO Audit Script
 * - Detects 404 errors
 * - Generates optimized sitemap
 * - Analyzes H1 and meta descriptions
 * 
 * Usage: npx tsx scripts/seo-audit.ts [baseUrl]
 * Example: npx tsx scripts/seo-audit.ts http://localhost:3000
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const BASE_URL = process.argv[2] || "http://localhost:3000"
const LOCALES = ["fr", "en", "es", "de", "pt", "it", "nl", "tr", "ar", "ja"]
const DEFAULT_LOCALE = "fr"

// SEO suffixes per locale
const SEO_SUFFIXES: Record<string, string> = {
  fr: "-freelance-maroc",
  en: "-freelance-morocco",
  ar: "-freelance-morocco",
  es: "-freelance-marruecos",
  de: "-freelance-marokko",
  pt: "-freelance-marrocos",
  it: "-freelance-marocco",
  nl: "-freelance-marokko",
  tr: "-freelance-fas",
  ja: "-freelance-morocco",
}

interface PageResult {
  url: string
  status: number
  h1: string | null
  title: string | null
  description: string | null
  issues: string[]
}

interface CrawlStats {
  total: number
  ok: number
  notFound: number
  errors: number
}

const results: PageResult[] = []
const visited = new Set<string>()
const stats: CrawlStats = { total: 0, ok: 0, notFound: 0, errors: 0 }

async function fetchPage(url: string): Promise<PageResult> {
  const result: PageResult = {
    url,
    status: 0,
    h1: null,
    title: null,
    description: null,
    issues: [],
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "SEO-Audit-Bot/1.0" },
      redirect: "follow",
    })
    
    result.status = response.status
    stats.total++

    if (response.status === 200) {
      stats.ok++
      const html = await response.text()
      
      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      result.title = titleMatch ? titleMatch[1].trim() : null
      
      // Extract meta description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
      result.description = descMatch ? descMatch[1].trim() : null
      
      // Extract H1
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
      result.h1 = h1Match ? h1Match[1].trim() : null

      // Check for SEO issues
      if (!result.title) {
        result.issues.push("❌ Missing title tag")
      } else if (result.title.length < 30) {
        result.issues.push(`⚠️ Title too short (${result.title.length} chars)`)
      } else if (result.title.length > 60) {
        result.issues.push(`⚠️ Title too long (${result.title.length} chars)`)
      }

      if (!result.description) {
        result.issues.push("❌ Missing meta description")
      } else if (result.description.length < 120) {
        result.issues.push(`⚠️ Description too short (${result.description.length} chars)`)
      } else if (result.description.length > 160) {
        result.issues.push(`⚠️ Description too long (${result.description.length} chars)`)
      }

      if (!result.h1) {
        result.issues.push("❌ Missing H1 tag")
      }

    } else if (response.status === 404) {
      stats.notFound++
      result.issues.push("🔴 404 Not Found")
    } else {
      stats.errors++
      result.issues.push(`🔴 HTTP ${response.status}`)
    }

  } catch (error) {
    stats.errors++
    result.status = 0
    result.issues.push(`🔴 Error: ${error instanceof Error ? error.message : "Unknown"}`)
  }

  return result
}

async function generateUrls(): Promise<string[]> {
  const urls: string[] = []
  
  // Static pages
  const staticPages = [
    "/",
    "/categories",
    "/login",
    "/dashboard",
  ]
  
  // Add static pages for default locale (no prefix)
  for (const page of staticPages) {
    urls.push(`${BASE_URL}${page}`)
  }
  
  // Add static pages for other locales
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    for (const page of staticPages) {
      urls.push(`${BASE_URL}/${locale}${page}`)
    }
  }

  // Get categories from DB
  const categories = await prisma.category.findMany({
    where: { level: 0 },
    include: {
      children: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  })

  // Generate category URLs
  for (const cat of categories) {
    // Default locale (FR)
    urls.push(`${BASE_URL}/categories/${cat.slug}`)
    
    // Other locales
    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) continue
      urls.push(`${BASE_URL}/${locale}/categories/${cat.slug}`)
    }

    // Subcategories with SEO suffix
    for (const sub of cat.children) {
      for (const locale of LOCALES) {
        const suffix = SEO_SUFFIXES[locale]
        const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`
        urls.push(`${BASE_URL}${prefix}/categories/${cat.slug}/${sub.slug}${suffix}`)
      }
    }
  }

  return urls
}

async function runAudit() {
  console.log("\n🔍 SEO Audit Script")
  console.log("=".repeat(50))
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Locales: ${LOCALES.join(", ")}`)
  console.log("")

  // Generate URLs to check
  console.log("📋 Generating URLs from database...")
  const urls = await generateUrls()
  console.log(`Found ${urls.length} URLs to check\n`)

  // Check each URL
  console.log("🌐 Checking pages...")
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    if (visited.has(url)) continue
    visited.add(url)

    const result = await fetchPage(url)
    results.push(result)

    // Progress indicator
    const progress = Math.round(((i + 1) / urls.length) * 100)
    const statusIcon = result.status === 200 ? "✅" : result.status === 404 ? "❌" : "⚠️"
    process.stdout.write(`\r  ${statusIcon} [${progress}%] ${url.substring(0, 60)}...`)
    
    // Small delay to avoid hammering the server
    await new Promise(r => setTimeout(r, 50))
  }

  console.log("\n")

  // Report 404s
  const notFoundPages = results.filter(r => r.status === 404)
  if (notFoundPages.length > 0) {
    console.log("🔴 404 ERRORS")
    console.log("-".repeat(50))
    for (const page of notFoundPages) {
      console.log(`  ${page.url}`)
    }
    console.log("")
  }

  // Report SEO issues
  const pagesWithIssues = results.filter(r => r.status === 200 && r.issues.length > 0)
  if (pagesWithIssues.length > 0) {
    console.log("⚠️ SEO ISSUES")
    console.log("-".repeat(50))
    for (const page of pagesWithIssues.slice(0, 20)) {
      console.log(`\n  ${page.url}`)
      for (const issue of page.issues) {
        console.log(`    ${issue}`)
      }
    }
    if (pagesWithIssues.length > 20) {
      console.log(`\n  ... and ${pagesWithIssues.length - 20} more pages with issues`)
    }
    console.log("")
  }

  // Summary
  console.log("📊 SUMMARY")
  console.log("-".repeat(50))
  console.log(`  Total pages checked: ${stats.total}`)
  console.log(`  ✅ OK: ${stats.ok}`)
  console.log(`  ❌ 404: ${stats.notFound}`)
  console.log(`  ⚠️ Errors: ${stats.errors}`)
  console.log(`  Pages with SEO issues: ${pagesWithIssues.length}`)
  console.log("")

  await prisma.$disconnect()
}

// Generate sitemap
async function generateSitemap() {
  console.log("\n📍 Generating Sitemap...")
  
  const categories = await prisma.category.findMany({
    where: { level: 0 },
    include: {
      children: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  })

  const sitemapUrls: { url: string; priority: number; changefreq: string }[] = []

  // Homepage
  sitemapUrls.push({ url: "/", priority: 1.0, changefreq: "daily" })
  sitemapUrls.push({ url: "/categories", priority: 0.9, changefreq: "daily" })

  // Categories
  for (const cat of categories) {
    sitemapUrls.push({
      url: `/categories/${cat.slug}`,
      priority: 0.8,
      changefreq: "weekly",
    })

    // Subcategories (FR only for main sitemap, others via hreflang)
    for (const sub of cat.children) {
      const suffix = SEO_SUFFIXES[DEFAULT_LOCALE]
      sitemapUrls.push({
        url: `/categories/${cat.slug}/${sub.slug}${suffix}`,
        priority: 0.7,
        changefreq: "weekly",
      })
    }
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.map(({ url, priority, changefreq }) => {
  const fullUrl = `${BASE_URL.replace("http://localhost:3000", "https://itqan.ma")}${url}`
  
  // Generate hreflang alternates
  const alternates = LOCALES.map(locale => {
    let altUrl = url
    // For subcategory pages, swap the suffix
    for (const [loc, suffix] of Object.entries(SEO_SUFFIXES)) {
      if (url.includes(suffix)) {
        altUrl = url.replace(suffix, SEO_SUFFIXES[locale])
        break
      }
    }
    const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`
    const href = `${BASE_URL.replace("http://localhost:3000", "https://itqan.ma")}${prefix}${altUrl}`
    return `    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}" />`
  }).join("\n")

  return `  <url>
    <loc>${fullUrl}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`
}).join("\n")}
</urlset>`

  // Write sitemap
  const fs = await import("fs/promises")
  const path = await import("path")
  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml")
  await fs.writeFile(sitemapPath, xml, "utf-8")
  
  console.log(`  ✅ Sitemap written to ${sitemapPath}`)
  console.log(`  📄 ${sitemapUrls.length} URLs in sitemap`)
}

// Main
async function main() {
  try {
    await runAudit()
    await generateSitemap()
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()
