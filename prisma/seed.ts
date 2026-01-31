import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Clean existing data in reverse dependency order
  await prisma.chatMessage.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.invitation.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.review.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.dispute.deleteMany()
  await prisma.mission.deleteMany()
  await prisma.gig.deleteMany()
  await prisma.certification.deleteMany()
  await prisma.education.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.creditTransaction.deleteMany()
  await prisma.ticketReply.deleteMany()
  await prisma.supportTicket.deleteMany()
  await prisma.freelancerProfile.deleteMany()
  await prisma.clientProfile.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log("🧹 Cleaned existing data")

  // ==================== USERS ====================
  
  // Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin Itqan",
      email: "admin@itqan.ma",
      role: "ADMIN",
      creditBalance: 1000,
    },
  })

  // Client users (8)
  const clientData = [
    { name: "Youssef Benali", email: "youssef@techmaroc.ma", company: "TechMaroc", industry: "Technologie", size: "50-100", city: "Casablanca", website: "https://techmaroc.ma" },
    { name: "Salma El Fassi", email: "salma@bloomstudio.ma", company: "Bloom Studio", industry: "Agence créative", size: "10-25", city: "Rabat", website: "https://bloomstudio.ma" },
    { name: "Karim Tazi", email: "karim@nexawave.ma", company: "Nexawave", industry: "SaaS", size: "25-50", city: "Casablanca", website: "https://nexawave.ma" },
    { name: "Nadia Chraibi", email: "nadia@artisandigital.ma", company: "Artisan Digital", industry: "E-commerce", size: "10-25", city: "Marrakech", website: "https://artisandigital.ma" },
    { name: "Omar Kettani", email: "omar@freshbrand.ma", company: "FreshBrand", industry: "Marketing", size: "5-10", city: "Tanger", website: "https://freshbrand.ma" },
    { name: "Leila Amrani", email: "leila@velocity.ma", company: "VeloCity", industry: "Logistique", size: "50-100", city: "Casablanca", website: "https://velocity.ma" },
    { name: "Rachid Moussaoui", email: "rachid@spectralab.ma", company: "SpectraLab", industry: "Recherche & Data", size: "25-50", city: "Rabat", website: "https://spectralab.ma" },
    { name: "Fatima Zahra Idrissi", email: "fatima@atlasventures.ma", company: "Atlas Ventures", industry: "Investissement", size: "10-25", city: "Casablanca", website: "https://atlasventures.ma" },
  ]

  const clients: any[] = []
  for (const c of clientData) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        role: "CLIENT",
        creditBalance: Math.floor(Math.random() * 500) + 100,
        clientProfile: {
          create: {
            companyName: c.company,
            industry: c.industry,
            companySize: c.size,
            city: c.city,
            website: c.website,
            verified: true,
            totalMissions: 0,
            totalSpent: 0,
          },
        },
      },
    })
    clients.push(user)
  }

  console.log(`✅ Created ${clients.length} clients`)

  // Freelancer users (11)
  const freelancerData = [
    {
      name: "Amine Bouazza",
      email: "amine.bouazza@gmail.com",
      title: "Développeur Full-Stack Senior",
      bio: "Plus de 7 ans d'expérience en développement web. Spécialisé React, Next.js et Node.js. J'accompagne les startups marocaines dans leur transformation digitale.",
      city: "Casablanca",
      category: "developpement-web",
      skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
      dailyRate: 2200,
      hourlyRate: 275,
      experience: 7,
      verified: true,
      avgRating: 4.8,
      completedMissions: 23,
    },
    {
      name: "Sara Benjelloun",
      email: "sara.benjelloun@gmail.com",
      title: "Designer UI/UX & Directrice Artistique",
      bio: "Passionnée par le design centré utilisateur. Je crée des expériences digitales mémorables pour des marques ambitieuses au Maroc et en Europe.",
      city: "Rabat",
      category: "design-creatif",
      skills: ["Figma", "Adobe XD", "Illustrator", "Photoshop", "Design System", "Prototypage"],
      dailyRate: 1800,
      hourlyRate: 225,
      experience: 5,
      verified: true,
      avgRating: 4.9,
      completedMissions: 18,
    },
    {
      name: "Mehdi El Alami",
      email: "mehdi.elalami@gmail.com",
      title: "Développeur Mobile Flutter & React Native",
      bio: "Expert en développement d'applications mobiles cross-platform. J'ai livré plus de 15 applications sur iOS et Android pour des clients au Maroc et à l'international.",
      city: "Marrakech",
      category: "developpement-mobile",
      skills: ["Flutter", "React Native", "Dart", "Firebase", "iOS", "Android"],
      dailyRate: 2000,
      hourlyRate: 250,
      experience: 6,
      verified: true,
      avgRating: 4.7,
      completedMissions: 15,
    },
    {
      name: "Hajar Mansouri",
      email: "hajar.mansouri@gmail.com",
      title: "Consultante SEO & Marketing Digital",
      bio: "Spécialiste du référencement naturel et du marketing de contenu. J'aide les entreprises marocaines à gagner en visibilité sur Google.",
      city: "Casablanca",
      category: "marketing-digital",
      skills: ["SEO", "Google Ads", "Google Analytics", "Content Marketing", "Social Media", "Email Marketing"],
      dailyRate: 1500,
      hourlyRate: 188,
      experience: 4,
      verified: true,
      avgRating: 4.6,
      completedMissions: 12,
    },
    {
      name: "Yassine Kabbaj",
      email: "yassine.kabbaj@gmail.com",
      title: "Data Scientist & ML Engineer",
      bio: "Data scientist passionné par l'IA et le machine learning. Je transforme les données brutes en insights actionnables pour les décideurs.",
      city: "Rabat",
      category: "data-it",
      skills: ["Python", "TensorFlow", "Pandas", "SQL", "Power BI", "Machine Learning"],
      dailyRate: 2500,
      hourlyRate: 313,
      experience: 5,
      verified: true,
      avgRating: 4.9,
      completedMissions: 10,
    },
    {
      name: "Zineb Ouazzani",
      email: "zineb.ouazzani@gmail.com",
      title: "Experte Comptabilité & Finance",
      bio: "Comptable agréée avec une solide expérience en gestion financière des PME marocaines. Bilan, fiscalité, audit.",
      city: "Fès",
      category: "comptabilite-finance",
      skills: ["Comptabilité", "Fiscalité", "Sage", "Excel avancé", "Audit", "Business Plan"],
      dailyRate: 1200,
      hourlyRate: 150,
      experience: 8,
      verified: true,
      avgRating: 4.5,
      completedMissions: 20,
    },
    {
      name: "Khalid Berrada",
      email: "khalid.berrada@gmail.com",
      title: "Développeur Backend Python/Django",
      bio: "Développeur backend spécialisé en Python et Django. Architecture API RESTful et microservices.",
      city: "Tanger",
      category: "developpement-web",
      skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Docker", "AWS"],
      dailyRate: 1800,
      hourlyRate: 225,
      experience: 5,
      verified: false,
      avgRating: 4.4,
      completedMissions: 8,
    },
    {
      name: "Imane Chakir",
      email: "imane.chakir@gmail.com",
      title: "Traductrice FR/AR/EN & Rédactrice Web",
      bio: "Traductrice trilingue et rédactrice web SEO. Contenu optimisé pour le marché marocain et francophone.",
      city: "Agadir",
      category: "traduction-redaction",
      skills: ["Traduction FR/AR", "Traduction EN/FR", "Rédaction SEO", "Copywriting", "Localisation", "Relecture"],
      dailyRate: 800,
      hourlyRate: 100,
      experience: 4,
      verified: false,
      avgRating: 4.3,
      completedMissions: 14,
    },
    {
      name: "Adil Naciri",
      email: "adil.naciri@gmail.com",
      title: "Ingénieur BTP & Génie Civil",
      bio: "Ingénieur en génie civil avec expertise en gestion de projets BTP. Études techniques et suivi de chantier.",
      city: "Casablanca",
      category: "btp-ingenierie",
      skills: ["AutoCAD", "Revit", "Gestion de projet", "Études techniques", "BIM", "Calcul de structures"],
      dailyRate: 2000,
      hourlyRate: 250,
      experience: 10,
      verified: false,
      avgRating: 4.6,
      completedMissions: 7,
    },
    {
      name: "Rim Alaoui",
      email: "rim.alaoui@gmail.com",
      title: "Community Manager & Social Media",
      bio: "Community manager créative, spécialisée dans les stratégies social media pour les marques marocaines.",
      city: "Marrakech",
      category: "marketing-digital",
      skills: ["Instagram", "TikTok", "Meta Ads", "Canva", "Stratégie Social Media", "Influence Marketing"],
      dailyRate: 900,
      hourlyRate: 113,
      experience: 3,
      verified: false,
      avgRating: 4.2,
      completedMissions: 6,
    },
    {
      name: "Hamza El Ouardi",
      email: "hamza.elouardi@gmail.com",
      title: "DevOps & Cloud Architect",
      bio: "Expert DevOps et cloud, j'aide les entreprises à moderniser leur infrastructure et automatiser leurs déploiements.",
      city: "Rabat",
      category: "data-it",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"],
      dailyRate: 2300,
      hourlyRate: 288,
      experience: 6,
      verified: false,
      avgRating: 4.7,
      completedMissions: 9,
    },
  ]

  const freelancers: any[] = []
  for (const f of freelancerData) {
    const user = await prisma.user.create({
      data: {
        name: f.name,
        email: f.email,
        role: "FREELANCER",
        freelancerProfile: {
          create: {
            title: f.title,
            bio: f.bio,
            city: f.city,
            category: f.category,
            skills: f.skills,
            dailyRate: f.dailyRate,
            hourlyRate: f.hourlyRate,
            experience: f.experience,
            verified: f.verified,
            avgRating: f.avgRating,
            completedMissions: f.completedMissions,
            available: true,
            remote: true,
            weeklyHours: 40,
          },
        },
      },
      include: { freelancerProfile: true },
    })
    freelancers.push(user)
  }

  console.log(`✅ Created ${freelancers.length} freelancers`)

  // ==================== MISSIONS (15) ====================
  const missionData = [
    {
      title: "Refonte site e-commerce",
      description: "Refonte complète de notre boutique en ligne sous Next.js avec intégration de paiement CMI. Design moderne, responsive, optimisé SEO. Migration depuis WordPress existant.",
      budget: 45000, budgetMin: 35000, budgetMax: 55000, budgetType: "FIXED",
      status: "COMPLETED" as const, category: "developpement-web",
      skills: ["Next.js", "React", "Tailwind CSS", "Stripe"],
      clientIdx: 0, freelancerIdx: 0, deadline: new Date("2025-03-15"),
    },
    {
      title: "Application mobile livraison",
      description: "Développement d'une application mobile de livraison last-mile pour le marché marocain. iOS et Android avec Flutter, backend Firebase.",
      budget: 80000, budgetMin: 60000, budgetMax: 90000, budgetType: "FIXED",
      status: "IN_PROGRESS" as const, category: "developpement-mobile",
      skills: ["Flutter", "Firebase", "Google Maps API", "Dart"],
      clientIdx: 5, freelancerIdx: 2, deadline: new Date("2025-08-01"),
    },
    {
      title: "Campagne SEO Maroc",
      description: "Audit SEO complet et mise en place d'une stratégie de référencement pour un site e-commerce marocain. Objectif : top 3 sur les mots-clés principaux.",
      budget: 15000, budgetMin: 10000, budgetMax: 20000, budgetType: "FIXED",
      status: "COMPLETED" as const, category: "marketing-digital",
      skills: ["SEO", "Google Analytics", "Content Marketing"],
      clientIdx: 4, freelancerIdx: 3, deadline: new Date("2025-02-28"),
    },
    {
      title: "Dashboard analytics React",
      description: "Création d'un tableau de bord analytics avec React et D3.js. Visualisation des données de vente en temps réel avec graphiques interactifs.",
      budget: 35000, budgetMin: 25000, budgetMax: 40000, budgetType: "FIXED",
      status: "IN_PROGRESS" as const, category: "developpement-web",
      skills: ["React", "D3.js", "TypeScript", "API REST"],
      clientIdx: 6, freelancerIdx: 0, deadline: new Date("2025-07-15"),
    },
    {
      title: "Identité visuelle startup fintech",
      description: "Création de l'identité visuelle complète pour une startup fintech marocaine : logo, charte graphique, templates réseaux sociaux, carte de visite.",
      budget: 12000, budgetMin: 8000, budgetMax: 15000, budgetType: "FIXED",
      status: "COMPLETED" as const, category: "design-creatif",
      skills: ["Illustrator", "Photoshop", "Branding", "Design System"],
      clientIdx: 7, freelancerIdx: 1, deadline: new Date("2025-01-30"),
    },
    {
      title: "API microservices e-santé",
      description: "Architecture et développement d'une API microservices pour une plateforme de télémédecine. Python/FastAPI avec PostgreSQL.",
      budget: 60000, budgetMin: 50000, budgetMax: 70000, budgetType: "FIXED",
      status: "OPEN" as const, category: "developpement-web",
      skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "Microservices"],
      clientIdx: 2, freelancerIdx: null, deadline: new Date("2025-09-30"),
    },
    {
      title: "Analyse données clients retail",
      description: "Analyse prédictive des données clients d'une chaîne retail marocaine. Segmentation, prédiction de churn, recommandations personnalisées.",
      budget: 30000, budgetMin: 25000, budgetMax: 40000, budgetType: "FIXED",
      status: "OPEN" as const, category: "data-it",
      skills: ["Python", "Pandas", "Machine Learning", "Power BI"],
      clientIdx: 6, freelancerIdx: null, deadline: new Date("2025-08-30"),
    },
    {
      title: "Traduction site web FR/AR",
      description: "Traduction complète d'un site corporate du français vers l'arabe. 50 pages environ avec adaptation culturelle et SEO multilingue.",
      budget: 8000, budgetMin: 5000, budgetMax: 10000, budgetType: "FIXED",
      status: "OPEN" as const, category: "traduction-redaction",
      skills: ["Traduction FR/AR", "SEO", "Localisation"],
      clientIdx: 3, freelancerIdx: null, deadline: new Date("2025-07-30"),
    },
    {
      title: "Application de gestion RH",
      description: "Développement d'une application web de gestion RH : congés, fiches de paie, évaluations. Stack React/Node.js.",
      budget: 55000, budgetMin: 45000, budgetMax: 65000, budgetType: "FIXED",
      status: "IN_PROGRESS" as const, category: "developpement-web",
      skills: ["React", "Node.js", "PostgreSQL", "PDF generation"],
      clientIdx: 0, freelancerIdx: 6, deadline: new Date("2025-08-15"),
    },
    {
      title: "Stratégie social media restaurant",
      description: "Mise en place d'une stratégie social media pour une chaîne de restaurants à Marrakech. Création de contenu, planning éditorial, gestion de communauté.",
      budget: 7000, budgetMin: 5000, budgetMax: 9000, budgetType: "FIXED",
      status: "COMPLETED" as const, category: "marketing-digital",
      skills: ["Instagram", "TikTok", "Content Marketing", "Community Management"],
      clientIdx: 3, freelancerIdx: 9, deadline: new Date("2025-02-15"),
    },
    {
      title: "Étude technique bâtiment commercial",
      description: "Réalisation d'une étude technique complète pour un bâtiment commercial à Casablanca. Plans AutoCAD, calculs de structure, estimation budgétaire.",
      budget: 25000, budgetMin: 20000, budgetMax: 30000, budgetType: "FIXED",
      status: "DRAFT" as const, category: "btp-ingenierie",
      skills: ["AutoCAD", "Calcul de structures", "Études techniques"],
      clientIdx: 7, freelancerIdx: null, deadline: new Date("2025-10-01"),
    },
    {
      title: "Migration cloud AWS",
      description: "Migration de l'infrastructure on-premise vers AWS. Setup CI/CD, conteneurisation Docker/Kubernetes, monitoring.",
      budget: 50000, budgetMin: 40000, budgetMax: 60000, budgetType: "FIXED",
      status: "OPEN" as const, category: "data-it",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
      clientIdx: 2, freelancerIdx: null, deadline: new Date("2025-09-15"),
    },
    {
      title: "Comptabilité et bilan annuel PME",
      description: "Tenue de la comptabilité et établissement du bilan annuel pour une PME dans le secteur du textile. Déclarations fiscales incluses.",
      budget: 18000, budgetMin: 15000, budgetMax: 22000, budgetType: "FIXED",
      status: "OPEN" as const, category: "comptabilite-finance",
      skills: ["Comptabilité", "Fiscalité", "Sage", "Bilan"],
      clientIdx: 4, freelancerIdx: null, deadline: new Date("2025-12-31"),
    },
    {
      title: "Design UI/UX application bancaire",
      description: "Refonte de l'interface utilisateur d'une application bancaire mobile. User research, wireframes, maquettes haute fidélité, prototype interactif.",
      budget: 28000, budgetMin: 22000, budgetMax: 35000, budgetType: "FIXED",
      status: "DRAFT" as const, category: "design-creatif",
      skills: ["Figma", "User Research", "Prototypage", "Design System"],
      clientIdx: 7, freelancerIdx: null, deadline: new Date("2025-11-01"),
    },
    {
      title: "Rédaction contenu blog tech",
      description: "Rédaction de 20 articles de blog optimisés SEO pour un site tech marocain. Sujets : IA, cloud, cybersécurité, développement.",
      budget: 6000, budgetMin: 4000, budgetMax: 8000, budgetType: "FIXED",
      status: "OPEN" as const, category: "traduction-redaction",
      skills: ["Rédaction SEO", "Copywriting", "Tech writing"],
      clientIdx: 0, freelancerIdx: null, deadline: new Date("2025-08-30"),
    },
  ]

  const missions: any[] = []
  for (const m of missionData) {
    const mission = await prisma.mission.create({
      data: {
        title: m.title,
        description: m.description,
        budget: m.budget,
        budgetMin: m.budgetMin,
        budgetMax: m.budgetMax,
        budgetType: m.budgetType,
        status: m.status,
        category: m.category,
        skills: m.skills,
        remote: true,
        clientId: clients[m.clientIdx].id,
        freelancerId: m.freelancerIdx !== null ? freelancers[m.freelancerIdx].id : undefined,
        deadline: m.deadline,
        viewCount: Math.floor(Math.random() * 200) + 20,
      },
    })
    missions.push(mission)
  }

  console.log(`✅ Created ${missions.length} missions`)

  // ==================== PROPOSALS (25) ====================
  const proposalData = [
    // Mission 0 (Refonte e-commerce - COMPLETED) - accepted proposal from freelancer 0
    { missionIdx: 0, freelancerIdx: 0, price: 42000, days: 30, status: "ACCEPTED" as const, message: "Je propose une refonte complète sous Next.js 14 avec App Router. Mon expérience en e-commerce me permettra de livrer un site performant et optimisé." },
    { missionIdx: 0, freelancerIdx: 6, price: 38000, days: 35, status: "REJECTED" as const, message: "Je peux réaliser cette refonte avec Django et un frontend React. Budget compétitif et livraison rapide." },
    // Mission 1 (App mobile - IN_PROGRESS) - accepted proposal from freelancer 2
    { missionIdx: 1, freelancerIdx: 2, price: 75000, days: 60, status: "ACCEPTED" as const, message: "Spécialiste Flutter, je développerai une app performante avec géolocalisation temps réel et notifications push." },
    { missionIdx: 1, freelancerIdx: 0, price: 70000, days: 55, status: "REJECTED" as const, message: "Je propose React Native pour cette app avec un backend Node.js robuste." },
    // Mission 2 (SEO - COMPLETED) - accepted
    { missionIdx: 2, freelancerIdx: 3, price: 14000, days: 45, status: "ACCEPTED" as const, message: "Mon expertise SEO locale me permet de garantir des résultats mesurables sur le marché marocain." },
    // Mission 3 (Dashboard analytics - IN_PROGRESS) - accepted
    { missionIdx: 3, freelancerIdx: 0, price: 33000, days: 25, status: "ACCEPTED" as const, message: "Expert React et data visualization, je créerai un dashboard interactif et performant." },
    { missionIdx: 3, freelancerIdx: 6, price: 30000, days: 30, status: "REJECTED" as const, message: "Je propose une solution Python/Django avec des graphiques Chart.js." },
    // Mission 4 (Identité visuelle - COMPLETED) - accepted
    { missionIdx: 4, freelancerIdx: 1, price: 11000, days: 15, status: "ACCEPTED" as const, message: "Directrice artistique avec un portfolio riche en branding fintech. Je vous créerai une identité unique." },
    // Mission 5 (API microservices - OPEN) - pending proposals
    { missionIdx: 5, freelancerIdx: 6, price: 55000, days: 45, status: "PENDING" as const, message: "Expert Python/FastAPI, je peux architecturer et développer vos microservices avec les meilleures pratiques." },
    { missionIdx: 5, freelancerIdx: 0, price: 58000, days: 40, status: "PENDING" as const, message: "Je propose une architecture microservices avec Node.js et TypeScript, containerisée avec Docker." },
    { missionIdx: 5, freelancerIdx: 10, price: 52000, days: 50, status: "PENDING" as const, message: "DevOps et backend, je peux gérer l'architecture cloud et le développement des APIs." },
    // Mission 6 (Data analytics - OPEN)
    { missionIdx: 6, freelancerIdx: 4, price: 28000, days: 20, status: "PENDING" as const, message: "Data scientist senior, je réaliserai une analyse complète avec des modèles prédictifs de haute qualité." },
    { missionIdx: 6, freelancerIdx: 10, price: 32000, days: 25, status: "PENDING" as const, message: "Je combine mes compétences DevOps et data pour livrer des dashboards et des pipelines de données fiables." },
    // Mission 7 (Traduction - OPEN)
    { missionIdx: 7, freelancerIdx: 7, price: 7500, days: 20, status: "PENDING" as const, message: "Traductrice FR/AR native avec expérience en localisation de sites web. Adaptation culturelle garantie." },
    // Mission 8 (App RH - IN_PROGRESS)
    { missionIdx: 8, freelancerIdx: 6, price: 50000, days: 50, status: "ACCEPTED" as const, message: "Je développerai une application RH complète avec Django REST et React. Expérience en applications de gestion." },
    // Mission 9 (Social media - COMPLETED)
    { missionIdx: 9, freelancerIdx: 9, price: 6500, days: 30, status: "ACCEPTED" as const, message: "Community manager basée à Marrakech, je connais parfaitement le marché local de la restauration." },
    { missionIdx: 9, freelancerIdx: 3, price: 7000, days: 30, status: "REJECTED" as const, message: "Je propose une stratégie social media intégrée à une campagne SEO locale." },
    // Mission 11 (Migration cloud - OPEN)
    { missionIdx: 11, freelancerIdx: 10, price: 48000, days: 35, status: "PENDING" as const, message: "Expert AWS et Kubernetes, je migrerai votre infra avec zéro downtime. Setup CI/CD inclus." },
    { missionIdx: 11, freelancerIdx: 6, price: 45000, days: 40, status: "PENDING" as const, message: "Je peux gérer la migration vers AWS avec Docker et Terraform." },
    // Mission 12 (Comptabilité - OPEN)
    { missionIdx: 12, freelancerIdx: 5, price: 16000, days: 90, status: "PENDING" as const, message: "Comptable agréée avec 8 ans d'expérience en PME textile. Je gère la comptabilité et les déclarations fiscales." },
    // Mission 14 (Rédaction blog - OPEN)
    { missionIdx: 14, freelancerIdx: 7, price: 5500, days: 40, status: "PENDING" as const, message: "Rédactrice web SEO, je créerai des articles tech engageants et optimisés pour le référencement." },
    { missionIdx: 14, freelancerIdx: 3, price: 5800, days: 35, status: "PENDING" as const, message: "Consultante SEO, je rédige du contenu tech optimisé avec une approche marketing." },
    // Extra proposals for variety
    { missionIdx: 1, freelancerIdx: 10, price: 72000, days: 55, status: "REJECTED" as const, message: "DevOps avec compétences mobile, je peux gérer le backend cloud de l'application." },
    { missionIdx: 0, freelancerIdx: 10, price: 40000, days: 32, status: "REJECTED" as const, message: "Je propose une solution avec pipeline CI/CD intégrée dès le départ." },
    { missionIdx: 3, freelancerIdx: 4, price: 32000, days: 22, status: "PENDING" as const, message: "Data scientist, je suis expert en visualisation de données avec Python et D3.js." },
  ]

  const proposals: any[] = []
  for (const p of proposalData) {
    const proposal = await prisma.proposal.create({
      data: {
        missionId: missions[p.missionIdx].id,
        freelancerId: freelancers[p.freelancerIdx].id,
        price: p.price,
        estimatedDays: p.days,
        status: p.status,
        message: p.message,
      },
    })
    proposals.push(proposal)
  }

  console.log(`✅ Created ${proposals.length} proposals`)

  // ==================== REVIEWS (12) ====================
  const reviewData = [
    // Mission 0 (Refonte e-commerce - client reviews freelancer)
    { missionIdx: 0, authorIdx: "client", authorClientIdx: 0, targetFreelancerIdx: 0, rating: 5, comment: "Excellent travail ! Amine a livré un site e-commerce rapide et esthétique. Communication parfaite tout au long du projet." },
    { missionIdx: 0, authorIdx: "freelancer", authorFreelancerIdx: 0, targetClientIdx: 0, rating: 5, comment: "Client professionnel avec des specs claires. Collaboration très agréable." },
    // Mission 2 (SEO)
    { missionIdx: 2, authorIdx: "client", authorClientIdx: 4, targetFreelancerIdx: 3, rating: 4, comment: "Hajar a fait un excellent audit SEO. Le trafic organique a augmenté de 45% en 3 mois. Quelques délais mais résultats au rendez-vous." },
    { missionIdx: 2, authorIdx: "freelancer", authorFreelancerIdx: 3, targetClientIdx: 4, rating: 5, comment: "Omar est un client réactif qui comprend l'importance du SEO. Très bon projet." },
    // Mission 4 (Identité visuelle)
    { missionIdx: 4, authorIdx: "client", authorClientIdx: 7, targetFreelancerIdx: 1, rating: 5, comment: "Sara est une artiste exceptionnelle. L'identité visuelle dépasse nos attentes. Un vrai talent marocain !" },
    { missionIdx: 4, authorIdx: "freelancer", authorFreelancerIdx: 1, targetClientIdx: 7, rating: 4, comment: "Projet intéressant pour Atlas Ventures. Brief clair mais quelques changements de direction en cours de route." },
    // Mission 9 (Social media)
    { missionIdx: 9, authorIdx: "client", authorClientIdx: 3, targetFreelancerIdx: 9, rating: 4, comment: "Rim a dynamisé notre présence sur Instagram. Les contenus sont créatifs et engageants. Bonne connaissance du marché marocain." },
    { missionIdx: 9, authorIdx: "freelancer", authorFreelancerIdx: 9, targetClientIdx: 3, rating: 4, comment: "Projet sympa avec Artisan Digital. L'équipe est créative et ouverte aux idées." },
    // Extra reviews
    { missionIdx: 0, authorIdx: "extra_client", authorClientIdx: 2, targetFreelancerIdx: 0, rating: 5, comment: "J'ai travaillé avec Amine sur un autre projet. Développeur très compétent et fiable." },
    { missionIdx: 2, authorIdx: "extra_client", authorClientIdx: 1, targetFreelancerIdx: 3, rating: 4, comment: "Hajar nous a aidé à optimiser notre blog. Résultats visibles en quelques semaines." },
    { missionIdx: 4, authorIdx: "extra_client", authorClientIdx: 2, targetFreelancerIdx: 1, rating: 5, comment: "Design magnifique, Sara a un sens esthétique remarquable." },
    { missionIdx: 9, authorIdx: "extra_client", authorClientIdx: 5, targetFreelancerIdx: 2, rating: 3, comment: "Bon travail dans l'ensemble mais la communication pourrait être améliorée. Le livrable final était correct." },
  ]

  for (const r of reviewData) {
    let authorId: string
    let targetUserId: string

    if (r.authorIdx === "client") {
      authorId = clients[r.authorClientIdx!].id
      targetUserId = freelancers[r.targetFreelancerIdx!].id
    } else if (r.authorIdx === "freelancer") {
      authorId = freelancers[r.authorFreelancerIdx!].id
      targetUserId = clients[r.targetClientIdx!].id
    } else {
      authorId = clients[r.authorClientIdx!].id
      targetUserId = freelancers[r.targetFreelancerIdx!].id
    }

    await prisma.review.create({
      data: {
        missionId: missions[r.missionIdx].id,
        authorId,
        targetUserId,
        rating: r.rating,
        comment: r.comment,
      },
    })
  }

  console.log("✅ Created 12 reviews")

  // ==================== GIGS (8) ====================
  const gigData = [
    {
      freelancerIdx: 0, title: "Création site WordPress professionnel", category: "developpement-web",
      description: "Je crée votre site WordPress professionnel, responsive et optimisé SEO. Thème personnalisé, intégration de plugins premium, formation à l'utilisation.",
      basicPrice: 3000, basicDesc: "Site vitrine 5 pages, thème standard", standardPrice: 6000, standardDesc: "Site vitrine 10 pages, design sur mesure, SEO", premiumPrice: 12000, premiumDesc: "Site e-commerce WooCommerce complet",
      skills: ["WordPress", "PHP", "WooCommerce", "SEO"], deliveryDays: 14, status: "ACTIVE" as const,
    },
    {
      freelancerIdx: 1, title: "Design logo et identité visuelle", category: "design-creatif",
      description: "Création de votre logo et identité visuelle complète. Plusieurs propositions, retouches illimitées, livraison fichiers sources.",
      basicPrice: 1500, basicDesc: "Logo seul, 3 propositions, 2 retouches", standardPrice: 4000, standardDesc: "Logo + charte graphique + carte de visite", premiumPrice: 8000, premiumDesc: "Identité complète : logo, charte, papeterie, templates social media",
      skills: ["Illustrator", "Photoshop", "Branding"], deliveryDays: 7, status: "ACTIVE" as const,
    },
    {
      freelancerIdx: 3, title: "Audit SEO complet", category: "marketing-digital",
      description: "Audit SEO technique et sémantique complet de votre site. Rapport détaillé avec recommandations priorisées et plan d'action.",
      basicPrice: 2000, basicDesc: "Audit technique basique, rapport PDF", standardPrice: 5000, standardDesc: "Audit complet + plan d'action + suivi 1 mois", premiumPrice: 10000, premiumDesc: "Audit + optimisation + suivi 3 mois + reporting",
      skills: ["SEO", "Google Analytics", "Ahrefs", "Screaming Frog"], deliveryDays: 10, status: "ACTIVE" as const,
    },
    {
      freelancerIdx: 2, title: "Développement application mobile", category: "developpement-mobile",
      description: "Je développe votre application mobile cross-platform avec Flutter. Design moderne, performance native, publication sur les stores.",
      basicPrice: 15000, basicDesc: "App simple 3-5 écrans, design basique", standardPrice: 35000, standardDesc: "App complète, design custom, API backend", premiumPrice: 60000, premiumDesc: "App complexe, backend, admin panel, support 3 mois",
      skills: ["Flutter", "Dart", "Firebase", "API REST"], deliveryDays: 30, status: "ACTIVE" as const,
    },
    {
      freelancerIdx: 4, title: "Dashboard Power BI personnalisé", category: "data-it",
      description: "Création de tableaux de bord interactifs Power BI pour visualiser vos données métier. Connexion à vos sources, KPIs personnalisés.",
      basicPrice: 3000, basicDesc: "Dashboard 1 page, 5 visuels", standardPrice: 7000, standardDesc: "Dashboard multi-pages, 15+ visuels, formations", premiumPrice: 15000, premiumDesc: "Solution BI complète, pipeline données, maintenance 3 mois",
      skills: ["Power BI", "SQL", "Python", "Data Modeling"], deliveryDays: 7, status: "ACTIVE" as const,
    },
    {
      freelancerIdx: 5, title: "Tenue de comptabilité mensuelle", category: "comptabilite-finance",
      description: "Gestion comptable complète de votre entreprise. Saisie, rapprochement bancaire, déclarations fiscales, bilan.",
      basicPrice: 1500, basicDesc: "Saisie comptable mensuelle, auto-entrepreneur", standardPrice: 3000, standardDesc: "Comptabilité complète SARL/SA, déclarations", premiumPrice: 6000, premiumDesc: "Comptabilité + fiscalité + conseil + bilan annuel",
      skills: ["Sage", "Comptabilité", "Fiscalité", "Excel"], deliveryDays: 30, status: "ACTIVE" as const,
    },
    {
      freelancerIdx: 7, title: "Rédaction articles SEO français/arabe", category: "traduction-redaction",
      description: "Rédaction d'articles de blog optimisés SEO en français ou arabe. Recherche de mots-clés, structure optimisée, contenu original.",
      basicPrice: 400, basicDesc: "1 article 800 mots, 1 mot-clé", standardPrice: 1500, standardDesc: "5 articles 1000 mots, recherche mots-clés", premiumPrice: 4000, premiumDesc: "15 articles + stratégie éditoriale + planning",
      skills: ["Rédaction SEO", "Copywriting", "WordPress"], deliveryDays: 5, status: "ACTIVE" as const,
    },
    {
      freelancerIdx: 10, title: "Setup infrastructure cloud AWS", category: "data-it",
      description: "Configuration complète de votre infrastructure cloud sur AWS. VPC, EC2, RDS, S3, CloudFront, monitoring, CI/CD pipeline.",
      basicPrice: 5000, basicDesc: "Setup basique : VPC, EC2, RDS", standardPrice: 15000, standardDesc: "Infra complète, CI/CD, monitoring, backup", premiumPrice: 30000, premiumDesc: "Architecture haute disponibilité, Kubernetes, auto-scaling",
      skills: ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD"], deliveryDays: 14, status: "ACTIVE" as const,
    },
  ]

  const gigs: any[] = []
  for (const g of gigData) {
    const gig = await prisma.gig.create({
      data: {
        freelancerId: freelancers[g.freelancerIdx].id,
        title: g.title,
        description: g.description,
        category: g.category,
        basicPrice: g.basicPrice,
        basicDesc: g.basicDesc,
        standardPrice: g.standardPrice,
        standardDesc: g.standardDesc,
        premiumPrice: g.premiumPrice,
        premiumDesc: g.premiumDesc,
        skills: g.skills,
        deliveryDays: g.deliveryDays,
        status: g.status,
        viewCount: Math.floor(Math.random() * 150) + 10,
        orderCount: Math.floor(Math.random() * 20),
      },
    })
    gigs.push(gig)
  }

  console.log(`✅ Created ${gigs.length} gigs`)

  // ==================== CONTRACTS (5) ====================
  // Using accepted proposals: indices 0, 2, 4, 5, 7 (missions 0, 1, 2, 3, 4)
  const acceptedProposals = proposals.filter((_, i) => [0, 2, 4, 5, 7].includes(i))
  const contractMissions = [missions[0], missions[1], missions[2], missions[3], missions[4]]

  const contractData = [
    { status: "COMPLETED" as const, signed: true },
    { status: "ACTIVE" as const, signed: true },
    { status: "COMPLETED" as const, signed: true },
    { status: "ACTIVE" as const, signed: true },
    { status: "COMPLETED" as const, signed: true },
  ]

  const contracts: any[] = []
  for (let i = 0; i < 5; i++) {
    const contract = await prisma.contract.create({
      data: {
        missionId: contractMissions[i].id,
        proposalId: acceptedProposals[i].id,
        clientId: contractMissions[i].clientId,
        freelancerId: acceptedProposals[i].freelancerId,
        totalAmount: acceptedProposals[i].price,
        status: contractData[i].status,
        signedByClient: contractData[i].signed,
        signedByFreelancer: contractData[i].signed,
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-06-15"),
      },
    })
    contracts.push(contract)
  }

  console.log(`✅ Created ${contracts.length} contracts`)

  // ==================== MILESTONES (12) ====================
  const milestoneData = [
    // Contract 0 (Refonte e-commerce - completed)
    { contractIdx: 0, title: "Maquettes et design", amount: 10000, status: "APPROVED" as const },
    { contractIdx: 0, title: "Développement frontend", amount: 18000, status: "APPROVED" as const },
    { contractIdx: 0, title: "Intégration paiement et tests", amount: 14000, status: "PAID" as const },
    // Contract 1 (App mobile - active)
    { contractIdx: 1, title: "Wireframes et architecture", amount: 15000, status: "APPROVED" as const },
    { contractIdx: 1, title: "Développement screens principaux", amount: 35000, status: "IN_PROGRESS" as const },
    { contractIdx: 1, title: "Backend API et publication stores", amount: 25000, status: "PENDING" as const },
    // Contract 2 (SEO - completed)
    { contractIdx: 2, title: "Audit technique SEO", amount: 5000, status: "PAID" as const },
    { contractIdx: 2, title: "Optimisations on-page", amount: 5000, status: "PAID" as const },
    { contractIdx: 2, title: "Suivi et rapport final", amount: 4000, status: "PAID" as const },
    // Contract 3 (Dashboard analytics - active)
    { contractIdx: 3, title: "Architecture et maquettes", amount: 8000, status: "APPROVED" as const },
    { contractIdx: 3, title: "Développement composants", amount: 15000, status: "SUBMITTED" as const },
    // Contract 4 (Identité visuelle - completed)
    { contractIdx: 4, title: "Propositions logo", amount: 4000, status: "PAID" as const },
  ]

  for (const m of milestoneData) {
    await prisma.milestone.create({
      data: {
        contractId: contracts[m.contractIdx].id,
        title: m.title,
        amount: m.amount,
        status: m.status,
      },
    })
  }

  console.log("✅ Created 12 milestones")

  // ==================== CERTIFICATIONS (8) ====================
  const certData = [
    { freelancerIdx: 0, name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", issueDate: new Date("2024-03-15") },
    { freelancerIdx: 0, name: "Meta Front-End Developer", issuer: "Meta (Coursera)", issueDate: new Date("2023-09-10") },
    { freelancerIdx: 3, name: "Google Analytics Certification", issuer: "Google", issueDate: new Date("2024-01-20") },
    { freelancerIdx: 3, name: "HubSpot Inbound Marketing", issuer: "HubSpot Academy", issueDate: new Date("2023-06-15") },
    { freelancerIdx: 4, name: "TensorFlow Developer Certificate", issuer: "Google", issueDate: new Date("2024-05-10") },
    { freelancerIdx: 10, name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", issueDate: new Date("2024-02-28") },
    { freelancerIdx: 2, name: "Google Associate Android Developer", issuer: "Google", issueDate: new Date("2023-11-15") },
    { freelancerIdx: 1, name: "Scrum Master (PSM I)", issuer: "Scrum.org", issueDate: new Date("2024-04-01") },
  ]

  for (const c of certData) {
    await prisma.certification.create({
      data: {
        userId: freelancers[c.freelancerIdx].id,
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate,
      },
    })
  }

  console.log("✅ Created 8 certifications")

  // ==================== EDUCATION (10) ====================
  const eduData = [
    { freelancerIdx: 0, school: "ENSIAS - Rabat", degree: "Ingénieur d'État", field: "Génie Logiciel", startYear: 2014, endYear: 2017 },
    { freelancerIdx: 1, school: "UIR - Rabat", degree: "Master", field: "Design Digital & Communication", startYear: 2016, endYear: 2018 },
    { freelancerIdx: 2, school: "EMI - Rabat", degree: "Ingénieur d'État", field: "Informatique & Télécommunications", startYear: 2015, endYear: 2018 },
    { freelancerIdx: 3, school: "ENCG - Casablanca", degree: "Master", field: "Marketing Digital", startYear: 2017, endYear: 2019 },
    { freelancerIdx: 4, school: "UM6P - Benguerir", degree: "Master", field: "Data Science & AI", startYear: 2018, endYear: 2020 },
    { freelancerIdx: 5, school: "ENCG - Fès", degree: "Master", field: "Comptabilité, Contrôle, Audit", startYear: 2013, endYear: 2017 },
    { freelancerIdx: 6, school: "ENSA - Tanger", degree: "Ingénieur d'État", field: "Génie Informatique", startYear: 2016, endYear: 2019 },
    { freelancerIdx: 7, school: "Al Akhawayn - Ifrane", degree: "Bachelor", field: "Communication & Langues", startYear: 2017, endYear: 2020 },
    { freelancerIdx: 8, school: "EHTP - Casablanca", degree: "Ingénieur d'État", field: "Génie Civil", startYear: 2011, endYear: 2014 },
    { freelancerIdx: 10, school: "ENSIAS - Rabat", degree: "Ingénieur d'État", field: "Sécurité des Systèmes d'Information", startYear: 2015, endYear: 2018 },
  ]

  for (const e of eduData) {
    await prisma.education.create({
      data: {
        userId: freelancers[e.freelancerIdx].id,
        school: e.school,
        degree: e.degree,
        field: e.field,
        startYear: e.startYear,
        endYear: e.endYear,
      },
    })
  }

  console.log("✅ Created 10 educations")

  // ==================== EXPERIENCE (15) ====================
  const expData = [
    { freelancerIdx: 0, company: "OCP Group", title: "Développeur Full-Stack", description: "Développement de portails internes avec React et Node.js", location: "Casablanca", startDate: new Date("2019-01-01"), endDate: new Date("2021-06-30") },
    { freelancerIdx: 0, company: "Freelance", title: "Lead Developer", description: "Consulting et développement web pour startups", location: "Casablanca", startDate: new Date("2021-07-01"), endDate: null, current: true },
    { freelancerIdx: 1, company: "Publicis Maroc", title: "UI/UX Designer", description: "Design d'interfaces pour des clients grands comptes", location: "Casablanca", startDate: new Date("2018-09-01"), endDate: new Date("2020-12-31") },
    { freelancerIdx: 1, company: "Freelance", title: "Directrice Artistique", description: "Direction artistique et branding pour startups tech", location: "Rabat", startDate: new Date("2021-01-01"), endDate: null, current: true },
    { freelancerIdx: 2, company: "Inwi", title: "Développeur Mobile", description: "Développement d'applications mobiles B2C", location: "Casablanca", startDate: new Date("2018-06-01"), endDate: new Date("2020-05-31") },
    { freelancerIdx: 2, company: "Freelance", title: "Expert Flutter", description: "Développement d'applications mobiles cross-platform", location: "Marrakech", startDate: new Date("2020-06-01"), endDate: null, current: true },
    { freelancerIdx: 3, company: "Jumia Maroc", title: "SEO Manager", description: "Stratégie SEO pour la marketplace Jumia au Maroc", location: "Casablanca", startDate: new Date("2019-03-01"), endDate: new Date("2021-08-31") },
    { freelancerIdx: 4, company: "Bank of Africa", title: "Data Analyst", description: "Analyse de données clients et reporting", location: "Casablanca", startDate: new Date("2020-01-01"), endDate: new Date("2022-03-31") },
    { freelancerIdx: 4, company: "Freelance", title: "Data Scientist", description: "Consulting en data science et machine learning", location: "Rabat", startDate: new Date("2022-04-01"), endDate: null, current: true },
    { freelancerIdx: 5, company: "KPMG Maroc", title: "Auditeur Junior", description: "Audit financier et comptable", location: "Casablanca", startDate: new Date("2017-01-01"), endDate: new Date("2019-06-30") },
    { freelancerIdx: 5, company: "Freelance", title: "Expert Comptable", description: "Tenue de comptabilité et conseil fiscal pour PME", location: "Fès", startDate: new Date("2019-07-01"), endDate: null, current: true },
    { freelancerIdx: 6, company: "Capgemini Maroc", title: "Développeur Backend", description: "Développement APIs et microservices pour clients européens", location: "Casablanca", startDate: new Date("2019-09-01"), endDate: new Date("2022-01-31") },
    { freelancerIdx: 8, company: "Tgcc", title: "Ingénieur Chantier", description: "Suivi de travaux et coordination d'équipes sur chantiers", location: "Casablanca", startDate: new Date("2014-06-01"), endDate: new Date("2019-12-31") },
    { freelancerIdx: 9, company: "WeLoveBuzz", title: "Community Manager", description: "Gestion des réseaux sociaux pour plusieurs marques", location: "Casablanca", startDate: new Date("2020-01-01"), endDate: new Date("2022-06-30") },
    { freelancerIdx: 10, company: "Deloitte Maroc", title: "DevOps Engineer", description: "Infrastructure cloud et automation pour clients banking", location: "Casablanca", startDate: new Date("2018-09-01"), endDate: new Date("2021-12-31") },
  ]

  for (const e of expData) {
    await prisma.experience.create({
      data: {
        profileId: freelancers[e.freelancerIdx].freelancerProfile.id,
        company: e.company,
        title: e.title,
        description: e.description,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current || false,
      },
    })
  }

  console.log("✅ Created 15 experiences")

  // ==================== BADGES (8) ====================
  const badgeData = [
    { freelancerIdx: 0, type: "TOP_RATED", name: "Top Rated", description: "Freelance avec une note moyenne supérieure à 4.7", icon: "⭐" },
    { freelancerIdx: 0, type: "FAST_DELIVERY", name: "Livraison Rapide", description: "Livre avant le délai dans 90% des missions", icon: "⚡" },
    { freelancerIdx: 1, type: "TOP_RATED", name: "Top Rated", description: "Freelance avec une note moyenne supérieure à 4.7", icon: "⭐" },
    { freelancerIdx: 1, type: "RISING_TALENT", name: "Talent Montant", description: "Progression remarquable sur la plateforme", icon: "🚀" },
    { freelancerIdx: 2, type: "TOP_RATED", name: "Top Rated", description: "Freelance avec une note moyenne supérieure à 4.7", icon: "⭐" },
    { freelancerIdx: 4, type: "TOP_RATED", name: "Top Rated", description: "Freelance avec une note moyenne supérieure à 4.7", icon: "⭐" },
    { freelancerIdx: 4, type: "EXPERT", name: "Expert Vérifié", description: "Compétences vérifiées par notre équipe", icon: "🎯" },
    { freelancerIdx: 5, type: "VETERAN", name: "Vétéran", description: "Plus de 20 missions complétées sur la plateforme", icon: "🏆" },
  ]

  for (const b of badgeData) {
    await prisma.badge.create({
      data: {
        userId: freelancers[b.freelancerIdx].id,
        type: b.type,
        name: b.name,
        description: b.description,
        icon: b.icon,
      },
    })
  }

  console.log("✅ Created 8 badges")

  // ==================== CONVERSATIONS + MESSAGES ====================
  // Conversation 1: Between client 0 (TechMaroc) and freelancer 0 (Amine) about mission 0
  const conv1 = await prisma.conversation.create({
    data: {
      missionId: missions[0].id,
      lastMessageAt: new Date("2025-06-10T14:30:00Z"),
      participants: {
        create: [
          { userId: clients[0].id, unreadCount: 0 },
          { userId: freelancers[0].id, unreadCount: 1 },
        ],
      },
    },
  })

  const conv1Messages = [
    { senderId: clients[0].id, content: "Bonjour Amine ! J'ai vu votre profil et je suis intéressé par votre expertise Next.js pour la refonte de notre site.", createdAt: new Date("2025-06-08T10:00:00Z") },
    { senderId: freelancers[0].id, content: "Bonjour Youssef ! Merci pour votre message. J'ai regardé votre site actuel, il y a un bon potentiel d'amélioration. Quels sont vos objectifs principaux ?", createdAt: new Date("2025-06-08T10:15:00Z") },
    { senderId: clients[0].id, content: "On veut surtout améliorer les performances et le taux de conversion. Le site actuel est lent et pas mobile-friendly.", createdAt: new Date("2025-06-08T10:30:00Z") },
    { senderId: freelancers[0].id, content: "Je comprends parfaitement. Je propose une refonte sous Next.js avec ISR pour les performances. On peut planifier un call cette semaine ?", createdAt: new Date("2025-06-08T11:00:00Z") },
    { senderId: clients[0].id, content: "Parfait, jeudi à 15h ça vous va ? Je vous envoie le lien Meets.", createdAt: new Date("2025-06-10T14:30:00Z") },
  ]

  for (const msg of conv1Messages) {
    await prisma.chatMessage.create({
      data: {
        conversationId: conv1.id,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: msg.createdAt,
      },
    })
  }

  // Conversation 2: Between client 5 (VeloCity) and freelancer 2 (Mehdi) about mission 1
  const conv2 = await prisma.conversation.create({
    data: {
      missionId: missions[1].id,
      lastMessageAt: new Date("2025-06-12T16:00:00Z"),
      participants: {
        create: [
          { userId: clients[5].id, unreadCount: 2 },
          { userId: freelancers[2].id, unreadCount: 0 },
        ],
      },
    },
  })

  const conv2Messages = [
    { senderId: clients[5].id, content: "Mehdi, comment avance le développement de l'app de livraison ?", createdAt: new Date("2025-06-11T09:00:00Z") },
    { senderId: freelancers[2].id, content: "Bonjour Leila ! Les écrans principaux sont terminés. La géolocalisation fonctionne bien. Je travaille sur le système de notifications push.", createdAt: new Date("2025-06-11T09:30:00Z") },
    { senderId: clients[5].id, content: "Super ! Est-ce qu'on peut avoir une démo vendredi ?", createdAt: new Date("2025-06-11T10:00:00Z") },
    { senderId: freelancers[2].id, content: "Bien sûr, je prépare une version de test pour vendredi. Je vous enverrai le lien APK pour tester sur Android.", createdAt: new Date("2025-06-11T10:15:00Z") },
    { senderId: freelancers[2].id, content: "Voici la démo : https://drive.google.com/apk-test-velocity. N'hésitez pas à me faire vos retours !", createdAt: new Date("2025-06-12T16:00:00Z") },
  ]

  for (const msg of conv2Messages) {
    await prisma.chatMessage.create({
      data: {
        conversationId: conv2.id,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: msg.createdAt,
      },
    })
  }

  // Conversation 3: Between client 7 (Atlas Ventures) and freelancer 1 (Sara) about mission 4
  const conv3 = await prisma.conversation.create({
    data: {
      missionId: missions[4].id,
      lastMessageAt: new Date("2025-06-09T12:00:00Z"),
      participants: {
        create: [
          { userId: clients[7].id, unreadCount: 0 },
          { userId: freelancers[1].id, unreadCount: 0 },
        ],
      },
    },
  })

  const conv3Messages = [
    { senderId: clients[7].id, content: "Sara, les fichiers finaux du logo sont top ! L'équipe adore. Merci beaucoup.", createdAt: new Date("2025-06-09T10:00:00Z") },
    { senderId: freelancers[1].id, content: "Merci Fatima ! C'était un plaisir de travailler sur ce projet. J'ai aussi ajouté les templates Canva pour vos réseaux sociaux.", createdAt: new Date("2025-06-09T10:30:00Z") },
    { senderId: clients[7].id, content: "Parfait, je vais laisser un avis 5 étoiles 😊 On refera appel à vous pour le redesign du site web.", createdAt: new Date("2025-06-09T11:00:00Z") },
    { senderId: freelancers[1].id, content: "Avec plaisir ! N'hésitez pas quand vous serez prêts pour le site. Bonne continuation avec Atlas Ventures 🚀", createdAt: new Date("2025-06-09T11:30:00Z") },
    { senderId: clients[7].id, content: "Merci Sara, à bientôt !", createdAt: new Date("2025-06-09T12:00:00Z") },
  ]

  for (const msg of conv3Messages) {
    await prisma.chatMessage.create({
      data: {
        conversationId: conv3.id,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: msg.createdAt,
      },
    })
  }

  console.log("✅ Created 3 conversations with 15 messages")

  // ==================== NOTIFICATIONS (20) ====================
  const notifData = [
    { userId: freelancers[0].id, type: "PROPOSAL_ACCEPTED", title: "Proposition acceptée", body: "Votre proposition pour 'Refonte site e-commerce' a été acceptée !", entityType: "mission", entityId: missions[0].id, actionUrl: `/missions/${missions[0].id}` },
    { userId: freelancers[0].id, type: "NEW_MESSAGE", title: "Nouveau message", body: "Youssef Benali vous a envoyé un message", entityType: "conversation", actionUrl: "/messages" },
    { userId: freelancers[0].id, type: "REVIEW_RECEIVED", title: "Nouvel avis reçu", body: "Vous avez reçu un avis 5 étoiles pour 'Refonte site e-commerce'", entityType: "review", actionUrl: "/profile" },
    { userId: clients[0].id, type: "NEW_PROPOSAL", title: "Nouvelle proposition", body: "Amine Bouazza a postulé à votre mission 'Refonte site e-commerce'", entityType: "mission", entityId: missions[0].id, actionUrl: `/missions/${missions[0].id}` },
    { userId: clients[0].id, type: "MISSION_COMPLETED", title: "Mission terminée", body: "La mission 'Refonte site e-commerce' est terminée", entityType: "mission", entityId: missions[0].id },
    { userId: freelancers[2].id, type: "PROPOSAL_ACCEPTED", title: "Proposition acceptée", body: "Votre proposition pour 'Application mobile livraison' a été acceptée", entityType: "mission", entityId: missions[1].id },
    { userId: freelancers[2].id, type: "MILESTONE_APPROVED", title: "Jalon approuvé", body: "Le jalon 'Wireframes et architecture' a été approuvé", entityType: "contract" },
    { userId: clients[5].id, type: "NEW_PROPOSAL", title: "Nouvelle proposition", body: "Mehdi El Alami a postulé à votre mission", entityType: "mission", entityId: missions[1].id },
    { userId: freelancers[1].id, type: "PROPOSAL_ACCEPTED", title: "Proposition acceptée", body: "Votre proposition pour 'Identité visuelle startup fintech' a été acceptée", entityType: "mission", entityId: missions[4].id },
    { userId: freelancers[1].id, type: "REVIEW_RECEIVED", title: "Nouvel avis", body: "Vous avez reçu un avis 5 étoiles !", entityType: "review" },
    { userId: freelancers[3].id, type: "PROPOSAL_ACCEPTED", title: "Proposition acceptée", body: "Votre proposition pour 'Campagne SEO Maroc' a été acceptée", entityType: "mission", entityId: missions[2].id },
    { userId: clients[2].id, type: "NEW_PROPOSAL", title: "Nouvelles propositions", body: "3 nouvelles propositions pour 'API microservices e-santé'", entityType: "mission", entityId: missions[5].id },
    { userId: freelancers[4].id, type: "NEW_MISSION", title: "Nouvelle mission", body: "Une nouvelle mission 'Analyse données clients retail' correspond à vos compétences", entityType: "mission", entityId: missions[6].id },
    { userId: freelancers[10].id, type: "NEW_MISSION", title: "Nouvelle mission", body: "Une nouvelle mission 'Migration cloud AWS' correspond à votre profil", entityType: "mission", entityId: missions[11].id },
    { userId: freelancers[5].id, type: "NEW_MISSION", title: "Nouvelle mission", body: "Mission 'Comptabilité et bilan annuel PME' disponible", entityType: "mission", entityId: missions[12].id },
    { userId: clients[7].id, type: "PAYMENT_RELEASED", title: "Paiement libéré", body: "Le paiement de 11 000 MAD pour 'Identité visuelle startup fintech' a été libéré", entityType: "contract" },
    { userId: admin.id, type: "NEW_USER", title: "Nouvel utilisateur", body: "Un nouveau freelance s'est inscrit sur la plateforme", entityType: "user" },
    { userId: admin.id, type: "NEW_USER", title: "Nouvel utilisateur", body: "Un nouveau client s'est inscrit", entityType: "user" },
    { userId: freelancers[6].id, type: "PROPOSAL_ACCEPTED", title: "Proposition acceptée", body: "Votre proposition pour 'Application de gestion RH' a été acceptée", entityType: "mission", entityId: missions[8].id },
    { userId: freelancers[9].id, type: "REVIEW_RECEIVED", title: "Nouvel avis", body: "Vous avez reçu un avis 4 étoiles pour 'Stratégie social media restaurant'", entityType: "review" },
  ]

  for (const n of notifData) {
    await prisma.notification.create({
      data: {
        userId: n.userId,
        type: n.type,
        title: n.title,
        body: n.body,
        entityType: n.entityType,
        entityId: n.entityId,
        actionUrl: n.actionUrl,
        read: Math.random() > 0.5,
      },
    })
  }

  console.log("✅ Created 20 notifications")

  // Update client profiles with mission counts
  for (const client of clients) {
    const missionCount = await prisma.mission.count({ where: { clientId: client.id } })
    const totalSpent = await prisma.contract.aggregate({
      where: { clientId: client.id },
      _sum: { totalAmount: true },
    })
    await prisma.clientProfile.update({
      where: { userId: client.id },
      data: {
        totalMissions: missionCount,
        totalSpent: totalSpent._sum.totalAmount || 0,
      },
    })
  }

  console.log("✅ Updated client profile stats")
  console.log("🎉 Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
