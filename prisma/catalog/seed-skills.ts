import { PrismaClient } from "@prisma/client-catalog"

const prisma = new PrismaClient()

// Technologies & Services organized by category
const skillsData = [
  // === DÉVELOPPEMENT WEB ===
  { name: "WordPress", slug: "wordpress", category: "developpement-web" },
  { name: "React", slug: "react", category: "developpement-web" },
  { name: "Next.js", slug: "nextjs", category: "developpement-web" },
  { name: "Vue.js", slug: "vuejs", category: "developpement-web" },
  { name: "Angular", slug: "angular", category: "developpement-web" },
  { name: "Node.js", slug: "nodejs", category: "developpement-web" },
  { name: "PHP", slug: "php", category: "developpement-web" },
  { name: "Laravel", slug: "laravel", category: "developpement-web" },
  { name: "Symfony", slug: "symfony", category: "developpement-web" },
  { name: "Django", slug: "django", category: "developpement-web" },
  { name: "Python", slug: "python", category: "developpement-web" },
  { name: "Ruby on Rails", slug: "ruby-on-rails", category: "developpement-web" },
  { name: "TypeScript", slug: "typescript", category: "developpement-web" },
  { name: "JavaScript", slug: "javascript", category: "developpement-web" },
  { name: "HTML/CSS", slug: "html-css", category: "developpement-web" },
  { name: "Tailwind CSS", slug: "tailwind-css", category: "developpement-web" },
  { name: "Bootstrap", slug: "bootstrap", category: "developpement-web" },
  { name: "SASS/SCSS", slug: "sass-scss", category: "developpement-web" },

  // === E-COMMERCE ===
  { name: "Shopify", slug: "shopify", category: "e-commerce" },
  { name: "WooCommerce", slug: "woocommerce", category: "e-commerce" },
  { name: "PrestaShop", slug: "prestashop", category: "e-commerce" },
  { name: "Magento", slug: "magento", category: "e-commerce" },
  { name: "Stripe", slug: "stripe", category: "e-commerce" },
  { name: "PayPal", slug: "paypal", category: "e-commerce" },

  // === MOBILE ===
  { name: "React Native", slug: "react-native", category: "developpement-mobile" },
  { name: "Flutter", slug: "flutter", category: "developpement-mobile" },
  { name: "Swift", slug: "swift", category: "developpement-mobile" },
  { name: "Kotlin", slug: "kotlin", category: "developpement-mobile" },
  { name: "iOS", slug: "ios", category: "developpement-mobile" },
  { name: "Android", slug: "android", category: "developpement-mobile" },

  // === DEVOPS & CLOUD ===
  { name: "AWS", slug: "aws", category: "devops-cloud" },
  { name: "Google Cloud", slug: "google-cloud", category: "devops-cloud" },
  { name: "Azure", slug: "azure", category: "devops-cloud" },
  { name: "Docker", slug: "docker", category: "devops-cloud" },
  { name: "Kubernetes", slug: "kubernetes", category: "devops-cloud" },
  { name: "CI/CD", slug: "ci-cd", category: "devops-cloud" },
  { name: "GitHub Actions", slug: "github-actions", category: "devops-cloud" },
  { name: "Terraform", slug: "terraform", category: "devops-cloud" },
  { name: "Linux", slug: "linux", category: "devops-cloud" },

  // === DATA & IA ===
  { name: "Machine Learning", slug: "machine-learning", category: "ia-machine-learning" },
  { name: "Deep Learning", slug: "deep-learning", category: "ia-machine-learning" },
  { name: "TensorFlow", slug: "tensorflow", category: "ia-machine-learning" },
  { name: "PyTorch", slug: "pytorch", category: "ia-machine-learning" },
  { name: "OpenAI API", slug: "openai-api", category: "ia-machine-learning" },
  { name: "ChatGPT", slug: "chatgpt", category: "ia-machine-learning" },
  { name: "Data Science", slug: "data-science", category: "ia-machine-learning" },
  { name: "Power BI", slug: "power-bi", category: "ia-machine-learning" },
  { name: "Tableau", slug: "tableau", category: "ia-machine-learning" },
  { name: "SQL", slug: "sql", category: "ia-machine-learning" },
  { name: "PostgreSQL", slug: "postgresql", category: "ia-machine-learning" },
  { name: "MongoDB", slug: "mongodb", category: "ia-machine-learning" },

  // === DESIGN ===
  { name: "Figma", slug: "figma", category: "design-graphisme" },
  { name: "Adobe XD", slug: "adobe-xd", category: "design-graphisme" },
  { name: "Sketch", slug: "sketch", category: "design-graphisme" },
  { name: "Photoshop", slug: "photoshop", category: "design-graphisme" },
  { name: "Illustrator", slug: "illustrator", category: "design-graphisme" },
  { name: "InDesign", slug: "indesign", category: "design-graphisme" },
  { name: "After Effects", slug: "after-effects", category: "design-graphisme" },
  { name: "Premiere Pro", slug: "premiere-pro", category: "design-graphisme" },
  { name: "Canva", slug: "canva", category: "design-graphisme" },
  { name: "Blender", slug: "blender", category: "design-graphisme" },

  // === MARKETING ===
  { name: "Google Ads", slug: "google-ads", category: "marketing-digital" },
  { name: "Facebook Ads", slug: "facebook-ads", category: "marketing-digital" },
  { name: "TikTok Ads", slug: "tiktok-ads", category: "marketing-digital" },
  { name: "SEO", slug: "seo", category: "marketing-digital" },
  { name: "SEA", slug: "sea", category: "marketing-digital" },
  { name: "Google Analytics", slug: "google-analytics", category: "marketing-digital" },
  { name: "HubSpot", slug: "hubspot", category: "marketing-digital" },
  { name: "Mailchimp", slug: "mailchimp", category: "marketing-digital" },
  { name: "Klaviyo", slug: "klaviyo", category: "marketing-digital" },
  { name: "Semrush", slug: "semrush", category: "marketing-digital" },
  { name: "Ahrefs", slug: "ahrefs", category: "marketing-digital" },

  // === VIDÉO & ANIMATION ===
  { name: "Final Cut Pro", slug: "final-cut-pro", category: "video-animation" },
  { name: "DaVinci Resolve", slug: "davinci-resolve", category: "video-animation" },
  { name: "Motion Graphics", slug: "motion-graphics", category: "video-animation" },
  { name: "Animation 2D", slug: "animation-2d", category: "video-animation" },
  { name: "Animation 3D", slug: "animation-3d", category: "video-animation" },
  { name: "Cinema 4D", slug: "cinema-4d", category: "video-animation" },

  // === RÉDACTION ===
  { name: "Copywriting", slug: "copywriting", category: "redaction-traduction" },
  { name: "Rédaction SEO", slug: "redaction-seo", category: "redaction-traduction" },
  { name: "Traduction FR/AR", slug: "traduction-fr-ar", category: "redaction-traduction" },
  { name: "Traduction FR/EN", slug: "traduction-fr-en", category: "redaction-traduction" },
  { name: "Transcription", slug: "transcription", category: "redaction-traduction" },
  { name: "Content Writing", slug: "content-writing", category: "redaction-traduction" },

  // === BUSINESS ===
  { name: "Business Plan", slug: "business-plan", category: "business-conseil" },
  { name: "Comptabilité", slug: "comptabilite", category: "business-conseil" },
  { name: "Conseil juridique", slug: "conseil-juridique", category: "business-conseil" },
  { name: "Excel avancé", slug: "excel-avance", category: "business-conseil" },
  { name: "Gestion de projet", slug: "gestion-projet", category: "business-conseil" },
  { name: "Scrum/Agile", slug: "scrum-agile", category: "business-conseil" },
]

async function main() {
  console.log("🌱 Seeding skills/technologies...")

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

  let created = 0
  let skipped = 0

  for (const skill of skillsData) {
    // Check if skill already exists
    const existing = await prisma.skillTranslation.findFirst({
      where: { locale: "fr", slug: skill.slug },
    })

    if (existing) {
      skipped++
      continue
    }

    // Find category ID
    const categoryId = categoryMap.get(skill.category) || null

    // Create skill with translations
    await prisma.skill.create({
      data: {
        categoryId,
        isActive: true,
        translations: {
          create: [
            { locale: "fr", name: skill.name, slug: skill.slug },
            { locale: "en", name: skill.name, slug: skill.slug },
            { locale: "ar", name: skill.name, slug: skill.slug },
          ],
        },
      },
    })
    created++
  }

  console.log(`✅ Created ${created} skills, skipped ${skipped} existing`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
