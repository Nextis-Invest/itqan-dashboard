import { PrismaClient, Role } from '@prisma/client'
import { PrismaClient as CatalogClient } from '@prisma/client-catalog'

const prisma = new PrismaClient()
const catalog = new CatalogClient()

// ==================== DATA ====================

const firstNames = {
  male: ['Youssef', 'Mohammed', 'Ahmed', 'Amine', 'Hamza', 'Omar', 'Ayoub', 'Reda', 'Karim', 'Mehdi', 'Zakaria', 'Rachid', 'Khalid', 'Abdellah', 'Nabil', 'Samir', 'Bilal', 'Ismail', 'Adil', 'Hicham', 'Soufiane', 'Yassine', 'Abderrahim', 'Mouad', 'Badr', 'Othmane', 'Taha', 'Walid', 'Fouad', 'Anass'],
  female: ['Fatima', 'Amina', 'Sara', 'Meryem', 'Khadija', 'Zineb', 'Salma', 'Hajar', 'Imane', 'Nadia', 'Sanaa', 'Houda', 'Laila', 'Malak', 'Rim', 'Ghita', 'Asmae', 'Ikram', 'Kawtar', 'Nisrine', 'Yasmine', 'Douae', 'Soukaina', 'Chaimae', 'Loubna', 'Hanae', 'Safae', 'Rajae', 'Widad', 'Nawal']
}

const lastNames = ['Alaoui', 'Benjelloun', 'Bennani', 'Berrada', 'Chaoui', 'Chraibi', 'El Amrani', 'El Fassi', 'El Idrissi', 'El Mansouri', 'Ezzahri', 'Filali', 'Hajji', 'Hassani', 'Kadiri', 'Kettani', 'Lahlou', 'Lazrak', 'Mouline', 'Naciri', 'Ouazzani', 'Rahhali', 'Sbai', 'Sefrioui', 'Skalli', 'Tazi', 'Zemmouri', 'Boutaleb', 'Benkirane', 'Lamrani']

const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda']

const skillsBySubcategory: Record<string, string[]> = {
  'logo-identite': ['Logo Design', 'Illustrator', 'Brand Identity', 'Photoshop', 'Branding', 'Design Graphique'],
  'web-design': ['Figma', 'Sketch', 'Adobe XD', 'Web Design', 'UI Design', 'Responsive Design'],
  'ui-ux-design': ['UX Research', 'Wireframing', 'Prototyping', 'Figma', 'User Testing', 'Design Thinking'],
  'illustration': ['Illustration', 'Procreate', 'Digital Art', 'Character Design', 'Illustrator', 'Drawing'],
  'developpement-web': ['React', 'Next.js', 'Node.js', 'TypeScript', 'Vue.js', 'PHP', 'Laravel', 'WordPress', 'HTML/CSS', 'JavaScript'],
  'developpement-mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Mobile UI', 'Firebase'],
  'e-commerce': ['Shopify', 'WooCommerce', 'Magento', 'PrestaShop', 'E-commerce Strategy', 'Payment Integration'],
  'devops-cloud': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Azure', 'GCP', 'Terraform'],
  'ia-machine-learning': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Science'],
  'seo': ['SEO', 'Google Analytics', 'SEMrush', 'Ahrefs', 'Keyword Research', 'Technical SEO', 'Link Building'],
  'social-media': ['Community Management', 'Facebook Ads', 'Instagram', 'TikTok', 'Social Media Marketing', 'Content Creation', 'LinkedIn'],
  'email-marketing': ['Mailchimp', 'Klaviyo', 'Email Automation', 'Newsletter', 'CRM', 'Lead Generation', 'Copywriting Email'],
  'publicite-en-ligne': ['Google Ads', 'Facebook Ads', 'PPC', 'Display Advertising', 'Retargeting', 'Media Buying', 'Performance Marketing'],
  'redaction-web': ['Rédaction SEO', 'Content Writing', 'Blogging', 'Storytelling', 'Rédaction Web', 'Articles'],
  'copywriting': ['Copywriting', 'Sales Copy', 'Landing Pages', 'Ad Copy', 'Brand Voice', 'Persuasive Writing'],
  'traduction': ['Traduction Français', 'Traduction Anglais', 'Traduction Arabe', 'Localisation', 'Transcription', 'Interprétation'],
  'montage-video': ['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Montage Vidéo', 'Color Grading', 'Video Editing'],
  'motion-design': ['After Effects', 'Motion Graphics', 'Animation', 'Cinema 4D', 'Blender', 'Visual Effects'],
  'animation-2d-3d': ['Animation 2D', 'Animation 3D', 'Blender', 'Maya', 'Character Animation', '3D Modeling'],
  'conseil-strategique': ['Business Strategy', 'Consulting', 'Market Analysis', 'Business Plan', 'Growth Strategy', 'Strategic Planning'],
  'comptabilite-finance': ['Comptabilité', 'Finance', 'Excel', 'Sage', 'Fiscalité', 'Gestion Financière', 'Audit'],
  'juridique': ['Droit des Affaires', 'Contrats', 'RGPD', 'Propriété Intellectuelle', 'Conseil Juridique', 'Droit Commercial']
}

const titlesBySubcategory: Record<string, string[]> = {
  'logo-identite': ['Designer Logo', 'Graphiste Identité Visuelle', 'Expert Branding', 'Créateur d\'Identité de Marque'],
  'web-design': ['Web Designer', 'UI Designer Freelance', 'Designer Web Créatif', 'Expert Design Web'],
  'ui-ux-design': ['UX Designer', 'UI/UX Designer', 'Product Designer', 'Expert UX Research'],
  'illustration': ['Illustrateur Digital', 'Artiste Illustrateur', 'Character Designer', 'Illustrateur Freelance'],
  'developpement-web': ['Développeur Full-Stack', 'Développeur Front-End React', 'Expert WordPress', 'Développeur Back-End Node.js', 'Développeur Web Freelance'],
  'developpement-mobile': ['Développeur Mobile', 'Expert React Native', 'Développeur iOS/Android', 'Développeur Flutter'],
  'e-commerce': ['Expert E-commerce', 'Développeur Shopify', 'Spécialiste WooCommerce', 'Consultant E-commerce'],
  'devops-cloud': ['Ingénieur DevOps', 'Cloud Architect', 'Expert AWS', 'Spécialiste Infrastructure Cloud'],
  'ia-machine-learning': ['Data Scientist', 'Ingénieur Machine Learning', 'Expert IA', 'Développeur Python ML'],
  'seo': ['Expert SEO', 'Consultant SEO', 'Spécialiste Référencement', 'SEO Manager Freelance'],
  'social-media': ['Community Manager', 'Social Media Manager', 'Expert Réseaux Sociaux', 'Stratégiste Social Media'],
  'email-marketing': ['Expert Email Marketing', 'Spécialiste Automation', 'Email Marketing Manager', 'Growth Hacker Email'],
  'publicite-en-ligne': ['Expert Google Ads', 'Media Buyer', 'Spécialiste Publicité Digitale', 'Performance Marketer'],
  'redaction-web': ['Rédacteur Web', 'Content Writer', 'Rédacteur SEO', 'Créateur de Contenu'],
  'copywriting': ['Copywriter', 'Expert Copywriting', 'Rédacteur Publicitaire', 'Copywriter Freelance'],
  'traduction': ['Traducteur Professionnel', 'Expert Traduction', 'Traducteur Multilingue', 'Spécialiste Localisation'],
  'montage-video': ['Monteur Vidéo', 'Video Editor Pro', 'Expert Montage Vidéo', 'Réalisateur Monteur'],
  'motion-design': ['Motion Designer', 'Expert After Effects', 'Animateur Motion Graphics', 'Designer Motion'],
  'animation-2d-3d': ['Animateur 3D', 'Expert Animation', 'Artiste 3D', 'Animateur 2D/3D'],
  'conseil-strategique': ['Consultant Stratégique', 'Business Consultant', 'Expert Stratégie', 'Conseiller en Développement'],
  'comptabilite-finance': ['Expert-Comptable', 'Consultant Finance', 'Comptable Freelance', 'Analyste Financier'],
  'juridique': ['Juriste Freelance', 'Consultant Juridique', 'Expert Droit des Affaires', 'Conseiller Juridique']
}

const bioTemplates: Record<string, string[]> = {
  'logo-identite': [
    'Passionné par le design, je crée des logos uniques qui racontent votre histoire.',
    'Expert en identité visuelle avec plus de {exp} ans d\'expérience.',
    'Je transforme vos idées en logos mémorables et impactants.',
  ],
  'web-design': [
    'Designer web créatif spécialisé dans les interfaces modernes et intuitives.',
    'Je conçois des expériences web qui captivent et convertissent.',
    '{exp} ans d\'expérience en design web responsive et UX-friendly.',
  ],
  'ui-ux-design': [
    'UX Designer centré utilisateur, je crée des expériences digitales fluides.',
    'Expert en recherche utilisateur et prototypage rapide.',
    'Je conçois des interfaces qui allient esthétique et usabilité.',
  ],
  'illustration': [
    'Illustrateur digital passionné, je donne vie à vos projets créatifs.',
    'Style unique et polyvalent pour tous types de projets d\'illustration.',
    'De l\'esquisse au rendu final, je crée des visuels qui marquent.',
  ],
  'developpement-web': [
    'Développeur Full-Stack passionné par les technologies modernes.',
    '{exp} ans d\'expérience en développement web React/Node.js.',
    'Je transforme vos idées en applications web performantes.',
  ],
  'developpement-mobile': [
    'Expert en développement mobile cross-platform.',
    'Je crée des applications mobiles natives et performantes.',
    'Passionné par l\'innovation mobile depuis {exp} ans.',
  ],
  'e-commerce': [
    'Spécialiste e-commerce, je booste vos ventes en ligne.',
    'Expert Shopify/WooCommerce avec un track record prouvé.',
    'Je crée des boutiques en ligne qui convertissent.',
  ],
  'devops-cloud': [
    'Ingénieur DevOps expert en automatisation et cloud.',
    'J\'optimise vos infrastructures pour la performance et la sécurité.',
    'Spécialiste AWS/GCP avec {exp} ans d\'expérience.',
  ],
  'ia-machine-learning': [
    'Data Scientist passionné par l\'intelligence artificielle.',
    'Expert en modèles ML et deep learning.',
    'Je transforme vos données en insights actionnables.',
  ],
  'seo': [
    'Expert SEO, j\'améliore votre visibilité sur Google.',
    '{exp} ans d\'expérience en référencement naturel.',
    'Stratégies SEO sur-mesure pour des résultats durables.',
  ],
  'social-media': [
    'Community Manager créatif et stratégique.',
    'J\'amplifie votre présence sur les réseaux sociaux.',
    'Expert en création de contenu viral et engagement.',
  ],
  'email-marketing': [
    'Spécialiste email marketing et automation.',
    'Je crée des campagnes email qui génèrent des conversions.',
    'Expert en stratégies de nurturing et de fidélisation.',
  ],
  'publicite-en-ligne': [
    'Expert Google Ads et Facebook Ads certifié.',
    'J\'optimise vos campagnes pour un ROI maximal.',
    'Media Buyer avec un track record de succès.',
  ],
  'redaction-web': [
    'Rédacteur web SEO passionné par les mots.',
    'Je crée du contenu qui engage et convertit.',
    '{exp} ans d\'expérience en rédaction digitale.',
  ],
  'copywriting': [
    'Copywriter expert en persuasion et conversion.',
    'Mes mots vendent, vos clients achètent.',
    'Expert en copywriting pour le digital.',
  ],
  'traduction': [
    'Traducteur professionnel multilingue.',
    'Traductions de qualité native en FR/EN/AR.',
    'Expert en localisation et adaptation culturelle.',
  ],
  'montage-video': [
    'Monteur vidéo créatif et technique.',
    'Je raconte des histoires visuelles captivantes.',
    '{exp} ans d\'expérience en post-production vidéo.',
  ],
  'motion-design': [
    'Motion Designer passionné par l\'animation.',
    'Je donne vie à vos idées en motion graphics.',
    'Expert After Effects et Cinema 4D.',
  ],
  'animation-2d-3d': [
    'Animateur 3D spécialisé en character animation.',
    'Je crée des animations 2D/3D de haute qualité.',
    'Expert Blender/Maya avec un style unique.',
  ],
  'conseil-strategique': [
    'Consultant stratégique pour PME et startups.',
    'J\'accompagne votre croissance avec des stratégies sur-mesure.',
    '{exp} ans d\'expérience en conseil aux entreprises.',
  ],
  'comptabilite-finance': [
    'Expert-comptable freelance rigoureux et disponible.',
    'Je gère votre comptabilité avec précision.',
    'Conseil en gestion financière et fiscalité.',
  ],
  'juridique': [
    'Juriste freelance spécialisé en droit des affaires.',
    'Conseil juridique pour startups et PME.',
    'Expert en contrats et conformité RGPD.',
  ]
}

// ==================== HELPERS ====================

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  const value = Math.random() * (max - min) + min
  return Number(value.toFixed(decimals))
}

function generateDisplayName(firstName: string, lastName: string): string {
  return `${firstName}.${lastName.charAt(0)}`
}

function generateBio(subcategorySlug: string, experience: number): string {
  const templates = bioTemplates[subcategorySlug] || [
    'Freelancer professionnel avec {exp} ans d\'expérience.',
    'Expert dans mon domaine, je livre un travail de qualité.',
    'Passionné par mon métier depuis {exp} ans.',
  ]
  const template = random(templates)
  return template.replace('{exp}', String(experience))
}

// ==================== MAIN SEED ====================

async function main() {
  console.log('🚀 Starting freelancer seed...')
  console.log('')
  
  // Fetch all subcategories from catalog
  const subcategories = await catalog.category.findMany({
    where: { level: 1, isActive: true },
    include: {
      translations: {
        where: { locale: 'fr' }
      },
      parent: {
        include: {
          translations: {
            where: { locale: 'fr' }
          }
        }
      }
    }
  })
  
  console.log(`📁 Found ${subcategories.length} subcategories`)
  
  const TOTAL_FREELANCERS = 5000
  const freelancersPerSubcat = Math.ceil(TOTAL_FREELANCERS / subcategories.length)
  
  console.log(`👥 Creating ~${freelancersPerSubcat} freelancers per subcategory`)
  console.log('')
  
  let created = 0
  const startTime = Date.now()
  
  for (const subcat of subcategories) {
    const subcatSlug = subcat.translations[0]?.slug || 'unknown'
    const subcatName = subcat.translations[0]?.name || 'Unknown'
    const parentSlug = subcat.parent?.translations[0]?.slug || null
    
    const skills = skillsBySubcategory[subcatSlug] || ['Skill 1', 'Skill 2', 'Skill 3']
    const titles = titlesBySubcategory[subcatSlug] || ['Expert Freelance', 'Consultant', 'Spécialiste']
    
    // Prepare batch data
    const batchData: Array<{
      userData: {
        email: string
        name: string
        role: Role
      }
      profileData: {
        title: string
        bio: string
        skills: string[]
        hourlyRate: number
        dailyRate: number
        currency: string
        city: string
        available: boolean
        verified: boolean
        avgRating: number
        completedMissions: number
        category: string | null
        subcategory: string
        experience: number
      }
    }> = []
    
    for (let i = 0; i < freelancersPerSubcat; i++) {
      const isFemale = Math.random() < 0.4
      const firstName = random(isFemale ? firstNames.female : firstNames.male)
      const lastName = random(lastNames)
      const uniqueNum = `${Date.now()}${randomInt(10000, 99999)}`
      
      const hourlyRate = randomInt(150, 800)
      const experience = randomInt(1, 15)
      
      // Pick 1-3 random skills
      const numSkills = randomInt(1, 3)
      const shuffledSkills = [...skills].sort(() => Math.random() - 0.5)
      const selectedSkills = shuffledSkills.slice(0, numSkills)
      
      batchData.push({
        userData: {
          email: `${firstName.toLowerCase().replace(' ', '')}.${lastName.toLowerCase().replace(' ', '')}${uniqueNum}@example.com`,
          name: `${firstName} ${lastName}`,
          role: 'FREELANCER' as Role,
        },
        profileData: {
          title: random(titles),
          bio: generateBio(subcatSlug, experience),
          skills: selectedSkills,
          hourlyRate,
          dailyRate: hourlyRate * 8,
          currency: 'MAD',
          city: random(cities),
          available: Math.random() < 0.8,
          verified: Math.random() < 0.7,
          avgRating: randomFloat(3.5, 5.0),
          completedMissions: randomInt(0, 50),
          category: parentSlug,
          subcategory: subcatSlug,
          experience,
        }
      })
    }
    
    // Insert in parallel batches of 20
    const BATCH_SIZE = 20
    for (let i = 0; i < batchData.length; i += BATCH_SIZE) {
      const batch = batchData.slice(i, i + BATCH_SIZE)
      
      await Promise.all(
        batch.map(({ userData, profileData }) =>
          prisma.user.create({
            data: {
              ...userData,
              freelancerProfile: {
                create: profileData
              }
            }
          })
        )
      )
      
      created += batch.length
      
      if (created % 500 === 0 || created >= TOTAL_FREELANCERS - 100) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        console.log(`✅ Created ${created}/${TOTAL_FREELANCERS} freelancers... (${elapsed}s)`)
      }
    }
  }
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log('')
  console.log(`🎉 Done! Created ${created} freelancers in ${totalTime}s`)
  
  // Summary by subcategory
  const stats = await prisma.freelancerProfile.groupBy({
    by: ['subcategory'],
    _count: { id: true }
  })
  
  console.log('')
  console.log('📊 Summary by subcategory:')
  stats.forEach(s => {
    console.log(`   ${s.subcategory}: ${s._count.id} freelancers`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await catalog.$disconnect()
  })
