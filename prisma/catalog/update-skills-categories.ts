import { PrismaClient } from "@prisma/client-catalog"

const prisma = new PrismaClient()

// Mapping slug skill -> category slug
const skillCategoryMapping: Record<string, string> = {
  // Rédaction
  "copywriting": "copywriting",
  "redaction-seo": "redaction-web",
  "content-writing": "redaction-web",
  "blog-writing": "redaction-web",
  "article-writing": "redaction-web",
  "ghostwriting": "copywriting",
  "technical-writing": "redaction-web",
  "ux-writing-content": "copywriting",
  "brand-voice": "copywriting",
  "storytelling": "copywriting",
  "social-media-copy": "copywriting",
  "landing-page-copy": "copywriting",
  "product-description-writing": "redaction-web",
  "press-release": "redaction-web",
  "script-writing": "copywriting",
  "resume-writing": "redaction-web",
  "grant-writing": "redaction-web",
  "speech-writing": "copywriting",
  
  // Traduction
  "traduction-fr-en": "traduction",
  "traduction-fr-ar": "traduction",
  "traduction-en-ar": "traduction",
  "traduction-fr-es": "traduction",
  "traduction-fr-de": "traduction",
  "traduction-technique": "traduction",
  "traduction-juridique": "traduction",
  "traduction-medicale": "traduction",
  "localisation": "traduction",
  "transcription": "traduction",
  "sous-titrage": "traduction",
  "doublage": "traduction",
  "sdl-trados": "traduction",
  "memoq": "traduction",
  "relecture-correction": "traduction",
  "proofreading": "traduction",
  "editing": "traduction",
  
  // Business & Conseil
  "business-plan": "conseil-strategique",
  "etude-marche": "conseil-strategique",
  "business-strategy": "conseil-strategique",
  "financial-modeling": "conseil-strategique",
  "pitch-deck": "conseil-strategique",
  "investor-relations": "conseil-strategique",
  "go-to-market": "conseil-strategique",
  "growth-hacking": "conseil-strategique",
  "market-research": "conseil-strategique",
  "competitive-analysis": "conseil-strategique",
  "swot-analysis": "conseil-strategique",
  "business-development": "conseil-strategique",
  "sales-strategy": "conseil-strategique",
  "crm": "conseil-strategique",
  "salesforce": "conseil-strategique",
  "hubspot-crm": "conseil-strategique",
  "pipedrive": "conseil-strategique",
  
  // Project Management
  "gestion-projet": "conseil-strategique",
  "scrum": "conseil-strategique",
  "agile": "conseil-strategique",
  "kanban": "conseil-strategique",
  "jira": "conseil-strategique",
  "asana": "conseil-strategique",
  "monday": "conseil-strategique",
  "trello": "conseil-strategique",
  "notion": "conseil-strategique",
  "linear": "conseil-strategique",
  "clickup": "conseil-strategique",
  "basecamp": "conseil-strategique",
  "microsoft-project": "conseil-strategique",
  "confluence": "conseil-strategique",
  "product-management": "conseil-strategique",
  "okrs": "conseil-strategique",
  "roadmapping": "conseil-strategique",
  
  // Juridique
  "redaction-contrats": "juridique",
  "droit-affaires": "juridique",
  "droit-commercial": "juridique",
  "droit-travail": "juridique",
  "rgpd-gdpr": "juridique",
  "propriete-intellectuelle": "juridique",
  "marques-brevets": "juridique",
  "cgv-cgu": "juridique",
  "politique-confidentialite": "juridique",
  "droit-immobilier": "juridique",
  "creation-entreprise": "juridique",
  "statuts-societe": "juridique",
  "pacte-associes": "juridique",
  "due-diligence-juridique": "juridique",
  "contentieux": "juridique",
  "mediation": "juridique",
  "arbitrage": "juridique",
  "droit-numerique": "juridique",
  "compliance": "juridique",
  "legal-operations": "juridique",
  
  // RH -> business-conseil
  "recrutement": "business-conseil",
  "sourcing": "business-conseil",
  "linkedin-recruiting": "business-conseil",
  "ats": "business-conseil",
  "onboarding": "business-conseil",
  "formation": "business-conseil",
  "gestion-talents": "business-conseil",
  "performance-management": "business-conseil",
  "compensation-benefits": "business-conseil",
  "employee-engagement": "business-conseil",
  "culture-entreprise": "business-conseil",
  "employer-branding": "business-conseil",
  "hr-analytics": "business-conseil",
  "sirh": "business-conseil",
  "workday": "business-conseil",
  "bamboohr": "business-conseil",
  "remote-work": "business-conseil",
  "team-building": "business-conseil",
  "coaching": "business-conseil",
  "leadership": "business-conseil",
  
  // Collaboration Tools
  "slack": "conseil-strategique",
  "microsoft-teams": "conseil-strategique",
  "discord": "conseil-strategique",
  "zoom": "conseil-strategique",
  "google-workspace": "conseil-strategique",
  "microsoft-365": "conseil-strategique",
  "figma-collaboration": "ui-ux-design",
  "miro": "conseil-strategique",
  "figjam": "ui-ux-design",
  "loom": "conseil-strategique",
}

async function main() {
  console.log("🔄 Updating skill categories...")

  // Get category IDs by slug
  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: { locale: "fr" },
      },
    },
  })

  const categoryMap = new Map<string, string>()
  for (const cat of categories) {
    const frTranslation = cat.translations[0]
    if (frTranslation) {
      categoryMap.set(frTranslation.slug, cat.id)
    }
  }

  console.log(`Found ${categoryMap.size} categories`)

  let updated = 0
  let notFound = 0
  let alreadySet = 0

  for (const [skillSlug, categorySlug] of Object.entries(skillCategoryMapping)) {
    // Find skill by slug
    const skillTranslation = await prisma.skillTranslation.findFirst({
      where: { locale: "fr", slug: skillSlug },
      include: { skill: true },
    })

    if (!skillTranslation) {
      notFound++
      continue
    }

    const skill = skillTranslation.skill
    const categoryId = categoryMap.get(categorySlug)

    if (!categoryId) {
      console.log(`⚠️  Category not found: ${categorySlug}`)
      continue
    }

    // Skip if already set correctly
    if (skill.categoryId === categoryId) {
      alreadySet++
      continue
    }

    // Update skill
    await prisma.skill.update({
      where: { id: skill.id },
      data: { categoryId },
    })
    updated++
  }

  console.log(`\n✅ Summary:`)
  console.log(`   - Updated: ${updated} skills`)
  console.log(`   - Already set: ${alreadySet}`)
  console.log(`   - Not found: ${notFound}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
