import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: dates relative to now
const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000);

async function main() {
  console.log('🌱 Seeding Itqan Dashboard...');

  // ═══════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════

  // --- Admins ---
  const adminNextis = await prisma.user.upsert({
    where: { id: 'admin-nextis-001' },
    update: {},
    create: {
      id: 'admin-nextis-001',
      name: 'Nextis',
      email: 'nextis.invest@gmail.com',
      role: 'ADMIN',
      emailVerified: daysAgo(90),
      creditBalance: 0,
    },
  });

  const adminAmina = await prisma.user.upsert({
    where: { email: 'amina.support@itqan.ma' },
    update: {},
    create: {
      id: 'seed-admin-02',
      name: 'Amina Support',
      email: 'amina.support@itqan.ma',
      role: 'ADMIN',
      emailVerified: daysAgo(60),
    },
  });

  const adminHassan = await prisma.user.upsert({
    where: { email: 'hassan.admin@itqan.ma' },
    update: {},
    create: {
      id: 'seed-admin-03',
      name: 'Hassan Admin',
      email: 'hassan.admin@itqan.ma',
      role: 'ADMIN',
      emailVerified: daysAgo(60),
    },
  });

  console.log('  ✅ Admins');

  // --- Clients ---
  const clientsData = [
    { id: 'seed-client-01', name: 'Karim Benali', email: 'karim@techvision.ma', creditBalance: 50, company: 'TechVision', size: 'SARL', industry: 'tech', city: 'Casablanca', website: 'https://techvision.ma' },
    { id: 'seed-client-02', name: 'Sarah Dupont', email: 'sarah@agencebleu.fr', creditBalance: 30, company: 'Agence Bleu', size: 'agency', industry: 'marketing', city: 'Paris', country: 'FR', website: 'https://agencebleu.fr' },
    { id: 'seed-client-03', name: 'Youssef El Amrani', email: 'youssef@darkom.ma', creditBalance: 20, company: 'DarKom', size: 'startup', industry: 'e-commerce', city: 'Rabat', website: 'https://darkom.ma' },
    { id: 'seed-client-04', name: 'Nadia Fassi', email: 'nadia@greenlogistics.ma', creditBalance: 40, company: 'Green Logistics', size: 'PME', industry: 'logistics', city: 'Tanger', website: 'https://greenlogistics.ma' },
    { id: 'seed-client-05', name: 'Marc Lefèvre', email: 'marc@innovatech.fr', creditBalance: 60, company: 'InnovaTech', size: 'scale-up', industry: 'SaaS', city: 'Lyon', country: 'FR', website: 'https://innovatech.fr' },
  ];

  const clients: Record<string, any> = {};
  for (const c of clientsData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        email: c.email,
        role: 'CLIENT',
        emailVerified: daysAgo(Math.floor(Math.random() * 60) + 30),
        creditBalance: c.creditBalance,
      },
    });
    clients[c.id] = user;

    await prisma.clientProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        id: `cp-${c.id}`,
        userId: user.id,
        companyName: c.company,
        companySize: c.size,
        industry: c.industry,
        city: c.city,
        country: c.country || 'MA',
        website: c.website,
        verified: true,
        totalMissions: 0,
        totalSpent: 0,
      },
    });
  }
  console.log('  ✅ Clients (5)');

  // --- Freelancers ---
  const freelancersData = [
    { id: 'seed-fl-01', name: 'Amine Tazi', email: 'amine.tazi@gmail.com', title: 'Développeur Fullstack', bio: 'Développeur fullstack passionné avec 5 ans d\'expérience en React et Node.js. Spécialisé dans les applications web performantes et les architectures modernes.', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js', 'TailwindCSS'], category: 'developpement-web', city: 'Casablanca', dailyRate: 450, experience: 5, verified: true, github: 'https://github.com/aminetazi', linkedin: 'https://linkedin.com/in/aminetazi' },
    { id: 'seed-fl-02', name: 'Fatima Zahra Ouali', email: 'fz.ouali@gmail.com', title: 'Designer UI/UX', bio: 'Designer UI/UX créative, je transforme vos idées en interfaces élégantes et intuitives. Experte Figma et Adobe Creative Suite.', skills: ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Prototyping', 'Design System'], category: 'design-creatif', city: 'Rabat', dailyRate: 400, experience: 4, verified: true, portfolio: 'https://fzouali.design' },
    { id: 'seed-fl-03', name: 'Omar Khalil', email: 'omar.khalil@gmail.com', title: 'Développeur Mobile', bio: 'Expert en développement mobile cross-platform. React Native et Flutter, avec un focus sur la performance et l\'expérience utilisateur.', skills: ['React Native', 'Flutter', 'Dart', 'TypeScript', 'Firebase', 'iOS', 'Android'], category: 'mobile', city: 'Marrakech', dailyRate: 500, experience: 6, verified: true, github: 'https://github.com/omarkhalil' },
    { id: 'seed-fl-04', name: 'Hind Bennani', email: 'hind.b@gmail.com', title: 'Spécialiste Marketing Digital', bio: 'Experte en marketing digital, SEO et publicité en ligne. J\'aide les entreprises à augmenter leur visibilité et générer des leads qualifiés.', skills: ['SEO', 'Google Ads', 'Facebook Ads', 'Analytics', 'Content Marketing', 'Email Marketing'], category: 'marketing-digital', city: 'Casablanca', dailyRate: 350, experience: 3, verified: true },
    { id: 'seed-fl-05', name: 'Rachid Alaoui', email: 'rachid.alaoui@gmail.com', title: 'Data Scientist', bio: 'Data scientist senior avec 7 ans d\'expérience en machine learning et analyse de données. Python, TensorFlow, et solutions Big Data.', skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'SQL', 'Tableau', 'R'], category: 'data-it', city: 'Rabat', dailyRate: 600, experience: 7, verified: true, github: 'https://github.com/rachidalaoui', linkedin: 'https://linkedin.com/in/rachidalaoui' },
    { id: 'seed-fl-06', name: 'Salma El Idrissi', email: 'salma.idrissi@gmail.com', title: 'Rédactrice Web', bio: 'Rédactrice web bilingue français/arabe. Contenu SEO-friendly, articles de blog, et copywriting pour sites web et réseaux sociaux.', skills: ['Rédaction web', 'SEO', 'Copywriting', 'WordPress', 'Français', 'Arabe'], category: 'traduction-redaction', city: 'Fès', dailyRate: 250, experience: 2, verified: false },
    { id: 'seed-fl-07', name: 'Mehdi Chraibi', email: 'mehdi.c@gmail.com', title: 'Développeur Backend', bio: 'Développeur backend Python/Django avec une expertise en APIs REST et architectures microservices. Code propre et bien testé.', skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'REST API'], category: 'developpement-web', city: 'Casablanca', dailyRate: 480, experience: 5, verified: true, github: 'https://github.com/mehdichraibi' },
    { id: 'seed-fl-08', name: 'Layla Moussaoui', email: 'layla.m@gmail.com', title: 'Comptable Freelance', bio: 'Comptable expérimentée, je gère votre comptabilité et vos déclarations fiscales. Maîtrise de Sage et des normes comptables marocaines.', skills: ['Sage', 'Excel', 'Comptabilité', 'Fiscalité', 'Bilan', 'TVA'], category: 'comptabilite-finance', city: 'Tanger', dailyRate: 300, experience: 4, verified: false },
    { id: 'seed-fl-09', name: 'Yassine Berrada', email: 'yassine.b@gmail.com', title: 'Ingénieur DevOps', bio: 'DevOps engineer passionné par l\'automatisation et le cloud. AWS, Docker, Kubernetes, CI/CD - je construis des infrastructures scalables.', skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'GitHub Actions'], category: 'devops', city: 'Casablanca', dailyRate: 550, experience: 6, verified: true, github: 'https://github.com/yassineberrada' },
    { id: 'seed-fl-10', name: 'Imane Hajji', email: 'imane.h@gmail.com', title: 'Community Manager', bio: 'Community manager créative, je gère vos réseaux sociaux et crée du contenu engageant. Instagram, TikTok, LinkedIn.', skills: ['Instagram', 'TikTok', 'LinkedIn', 'Canva', 'Content Creation', 'Social Media Strategy'], category: 'marketing-digital', city: 'Marrakech', dailyRate: 280, experience: 2, verified: false },
    { id: 'seed-fl-11', name: 'Khalid Ziani', email: 'khalid.z@gmail.com', title: 'Développeur WordPress', bio: 'Spécialiste WordPress et PHP. Sites vitrines, e-commerce WooCommerce, et développement de plugins sur mesure.', skills: ['WordPress', 'PHP', 'WooCommerce', 'HTML/CSS', 'JavaScript', 'MySQL'], category: 'developpement-web', city: 'Agadir', dailyRate: 320, experience: 4, verified: false },
    { id: 'seed-fl-12', name: 'Nora Saidi', email: 'nora.s@gmail.com', title: 'Traductrice FR/EN/AR', bio: 'Traductrice professionnelle trilingue. Traduction technique, juridique et marketing. Qualité et respect des délais garantis.', skills: ['Français', 'Anglais', 'Arabe', 'Traduction technique', 'Localisation', 'SDL Trados'], category: 'traduction-redaction', city: 'Rabat', dailyRate: 350, experience: 5, verified: true },
  ];

  const freelancers: Record<string, any> = {};
  for (const f of freelancersData) {
    const user = await prisma.user.upsert({
      where: { email: f.email },
      update: {},
      create: {
        id: f.id,
        name: f.name,
        email: f.email,
        role: 'FREELANCER',
        emailVerified: daysAgo(Math.floor(Math.random() * 60) + 30),
      },
    });
    freelancers[f.id] = user;

    await prisma.freelancerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        id: `fp-${f.id}`,
        userId: user.id,
        title: f.title,
        bio: f.bio,
        dailyRate: f.dailyRate,
        city: f.city,
        skills: f.skills,
        category: f.category,
        experience: f.experience,
        verified: f.verified,
        available: true,
        remote: true,
        completedMissions: f.verified ? Math.floor(Math.random() * 15) + 3 : Math.floor(Math.random() * 3),
        avgRating: f.verified ? parseFloat((4 + Math.random()).toFixed(1)) : null,
        portfolioUrl: f.portfolio || null,
        githubUrl: f.github || null,
        linkedinUrl: f.linkedin || null,
      },
    });
  }
  console.log('  ✅ Freelancers (12)');

  // ═══════════════════════════════════════════
  // MISSIONS (15)
  // ═══════════════════════════════════════════

  const missionsData = [
    // OPEN (5)
    { id: 'seed-mission-01', title: 'Développement d\'une application mobile e-commerce', description: 'Nous recherchons un développeur mobile expérimenté pour créer une application e-commerce complète avec React Native. L\'application doit inclure : catalogue produits, panier, paiement en ligne, notifications push, et espace client. Design fourni par notre équipe.', clientId: 'seed-client-01', status: 'OPEN' as const, category: 'mobile', skills: ['React Native', 'TypeScript', 'Firebase', 'Stripe'], budgetMin: 15000, budgetMax: 25000, budgetType: 'FIXED', deadline: daysFromNow(45), duration: '2-3 mois', experienceLevel: 'senior', remote: true, location: 'Casablanca', featured: true, viewCount: 87 },
    { id: 'seed-mission-02', title: 'Refonte UI/UX site web corporate', description: 'Refonte complète de l\'interface utilisateur de notre site corporate. Objectifs : moderniser le design, améliorer l\'expérience utilisateur, et optimiser le parcours de conversion. Livrable attendu : maquettes Figma + prototype interactif.', clientId: 'seed-client-02', status: 'OPEN' as const, category: 'design-creatif', skills: ['Figma', 'UI/UX', 'Prototyping', 'Design System'], budgetMin: 8000, budgetMax: 12000, budgetType: 'FIXED', deadline: daysFromNow(30), duration: '3-4 semaines', experienceLevel: 'intermediaire', remote: true, location: 'Paris', viewCount: 54 },
    { id: 'seed-mission-03', title: 'Campagne SEO et Google Ads', description: 'Mise en place et gestion d\'une campagne SEO + Google Ads pour notre site e-commerce. Objectifs : augmenter le trafic organique de 40% et générer des leads qualifiés via Ads. Rapport mensuel exigé.', clientId: 'seed-client-03', status: 'OPEN' as const, category: 'marketing-digital', skills: ['SEO', 'Google Ads', 'Analytics', 'Content Marketing'], budgetMin: 5000, budgetMax: 8000, budgetType: 'FIXED', deadline: daysFromNow(60), duration: '3 mois', experienceLevel: 'intermediaire', remote: true, location: 'Rabat', viewCount: 42 },
    { id: 'seed-mission-04', title: 'Dashboard analytics avec React et D3.js', description: 'Développement d\'un dashboard interactif pour visualiser nos données de vente et de logistique. Stack imposé : React, D3.js, et intégration API REST existante. Graphiques temps réel et exports PDF.', clientId: 'seed-client-04', status: 'OPEN' as const, category: 'developpement-web', skills: ['React', 'D3.js', 'TypeScript', 'REST API', 'TailwindCSS'], budgetMin: 10000, budgetMax: 18000, budgetType: 'FIXED', deadline: daysFromNow(40), duration: '4-6 semaines', experienceLevel: 'senior', remote: true, location: 'Tanger', featured: true, viewCount: 63 },
    { id: 'seed-mission-05', title: 'Traduction site web FR/AR/EN', description: 'Traduction professionnelle de notre site web (environ 50 pages) du français vers l\'arabe et l\'anglais. Contenu marketing et technique. Relecture et validation incluses.', clientId: 'seed-client-03', status: 'OPEN' as const, category: 'traduction-redaction', skills: ['Français', 'Arabe', 'Anglais', 'Traduction technique', 'Localisation'], budgetMin: 3000, budgetMax: 5000, budgetType: 'FIXED', deadline: daysFromNow(21), duration: '2-3 semaines', experienceLevel: 'intermediaire', remote: true, viewCount: 31 },

    // IN_PROGRESS (4)
    { id: 'seed-mission-06', title: 'Application de gestion de stock', description: 'Développement d\'une application web de gestion de stock pour notre entrepôt. Fonctionnalités : inventaire, entrées/sorties, alertes stock bas, rapports, et scan code-barres. Stack : Next.js + PostgreSQL.', clientId: 'seed-client-04', status: 'IN_PROGRESS' as const, category: 'developpement-web', skills: ['Next.js', 'PostgreSQL', 'TypeScript', 'Prisma', 'TailwindCSS'], budgetMin: 20000, budgetMax: 35000, budgetType: 'FIXED', deadline: daysFromNow(30), duration: '2-3 mois', experienceLevel: 'senior', remote: true, location: 'Tanger', freelancerId: 'seed-fl-01', viewCount: 45 },
    { id: 'seed-mission-07', title: 'API REST microservices Node.js', description: 'Conception et développement d\'une architecture microservices en Node.js pour notre plateforme SaaS. Authentification, gestion utilisateurs, facturation, et notifications. Documentation Swagger requise.', clientId: 'seed-client-05', status: 'IN_PROGRESS' as const, category: 'developpement-web', skills: ['Node.js', 'TypeScript', 'Docker', 'PostgreSQL', 'Redis', 'Swagger'], budgetMin: 12000, budgetMax: 20000, budgetType: 'FIXED', deadline: daysFromNow(20), duration: '6-8 semaines', experienceLevel: 'senior', remote: true, location: 'Lyon', freelancerId: 'seed-fl-07', viewCount: 38 },
    { id: 'seed-mission-08', title: 'Stratégie social media et community management', description: 'Gestion de nos réseaux sociaux (Instagram, LinkedIn, Facebook) pendant 3 mois. Création de contenu, planification, interaction avec la communauté, et reporting mensuel.', clientId: 'seed-client-01', status: 'IN_PROGRESS' as const, category: 'marketing-digital', skills: ['Social Media', 'Content Creation', 'Instagram', 'LinkedIn', 'Canva'], budgetMin: 4000, budgetMax: 6000, budgetType: 'FIXED', deadline: daysFromNow(60), duration: '3 mois', experienceLevel: 'junior', remote: true, location: 'Casablanca', freelancerId: 'seed-fl-10', viewCount: 29 },
    { id: 'seed-mission-09', title: 'Infrastructure DevOps et CI/CD', description: 'Mise en place d\'une infrastructure DevOps complète : dockerisation des services, pipeline CI/CD avec GitHub Actions, déploiement sur AWS (ECS), monitoring et alerting.', clientId: 'seed-client-05', status: 'IN_PROGRESS' as const, category: 'devops', skills: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Terraform', 'Monitoring'], budgetMin: 15000, budgetMax: 22000, budgetType: 'FIXED', deadline: daysFromNow(25), duration: '4-6 semaines', experienceLevel: 'senior', remote: true, location: 'Lyon', freelancerId: 'seed-fl-09', viewCount: 41 },

    // COMPLETED (3)
    { id: 'seed-mission-10', title: 'Création identité visuelle startup', description: 'Création de l\'identité visuelle complète de notre startup : logo, charte graphique, templates réseaux sociaux, et cartes de visite.', clientId: 'seed-client-03', status: 'COMPLETED' as const, category: 'design-creatif', skills: ['Logo', 'Illustrator', 'Charte graphique', 'Branding'], budgetMin: 4000, budgetMax: 7000, budgetType: 'FIXED', deadline: daysAgo(5), duration: '2-3 semaines', experienceLevel: 'intermediaire', remote: true, location: 'Rabat', freelancerId: 'seed-fl-02', viewCount: 56 },
    { id: 'seed-mission-11', title: 'Analyse de données et tableau de bord Power BI', description: 'Analyse de nos données commerciales (3 ans) et création d\'un tableau de bord Power BI interactif. Indicateurs clés, prévisions et recommandations stratégiques.', clientId: 'seed-client-04', status: 'COMPLETED' as const, category: 'data-it', skills: ['Python', 'Power BI', 'SQL', 'Data Analysis', 'Pandas'], budgetMin: 8000, budgetMax: 12000, budgetType: 'FIXED', deadline: daysAgo(10), duration: '3-4 semaines', experienceLevel: 'senior', remote: true, location: 'Tanger', freelancerId: 'seed-fl-05', viewCount: 34 },
    { id: 'seed-mission-12', title: 'Site vitrine WordPress pour restaurant', description: 'Création d\'un site vitrine WordPress pour un restaurant : menu, réservation en ligne, galerie photos, et intégration Google Maps. Design responsive et SEO basique.', clientId: 'seed-client-01', status: 'COMPLETED' as const, category: 'developpement-web', skills: ['WordPress', 'PHP', 'WooCommerce', 'SEO', 'Responsive'], budgetMin: 3000, budgetMax: 5000, budgetType: 'FIXED', deadline: daysAgo(15), duration: '2 semaines', experienceLevel: 'junior', remote: true, location: 'Casablanca', freelancerId: 'seed-fl-11', viewCount: 48 },

    // DRAFT (2)
    { id: 'seed-mission-13', title: 'Application mobile de livraison', description: 'Projet en cours de cadrage : application mobile de livraison à la demande pour Tanger et sa région. Deux apps (client + livreur) + back-office admin.', clientId: 'seed-client-04', status: 'DRAFT' as const, category: 'mobile', skills: ['React Native', 'Node.js', 'MongoDB', 'Google Maps API'], budgetMin: 30000, budgetMax: 50000, budgetType: 'FIXED', deadline: daysFromNow(90), duration: '3-4 mois', experienceLevel: 'senior', viewCount: 0 },
    { id: 'seed-mission-14', title: 'Mise en place ERP comptable', description: 'Brouillon : recherche d\'un expert comptable pour la mise en place d\'un ERP comptable adapté aux normes marocaines. Formation de l\'équipe incluse.', clientId: 'seed-client-01', status: 'DRAFT' as const, category: 'comptabilite-finance', skills: ['Sage', 'Comptabilité', 'ERP', 'Formation'], budgetMin: 10000, budgetMax: 15000, budgetType: 'FIXED', deadline: daysFromNow(60), duration: '1-2 mois', experienceLevel: 'senior', viewCount: 0 },

    // CANCELLED (1)
    { id: 'seed-mission-15', title: 'Rédaction contenu blog tech', description: 'Projet annulé : rédaction de 20 articles de blog sur les tendances tech au Maroc. Projet annulé suite à restructuration interne.', clientId: 'seed-client-05', status: 'CANCELLED' as const, category: 'traduction-redaction', skills: ['Rédaction web', 'SEO', 'Tech', 'Français'], budgetMin: 2000, budgetMax: 3500, budgetType: 'FIXED', deadline: daysAgo(20), duration: '1 mois', experienceLevel: 'junior', viewCount: 22 },
  ];

  for (const m of missionsData) {
    await prisma.mission.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        title: m.title,
        description: m.description,
        clientId: m.clientId,
        status: m.status,
        category: m.category,
        skills: m.skills,
        budgetMin: m.budgetMin,
        budgetMax: m.budgetMax,
        budgetType: m.budgetType,
        currency: 'MAD',
        deadline: m.deadline,
        duration: m.duration,
        experienceLevel: m.experienceLevel,
        remote: m.remote ?? true,
        location: m.location || null,
        featured: m.featured || false,
        viewCount: m.viewCount || 0,
        freelancerId: m.freelancerId || null,
        createdAt: daysAgo(Math.floor(Math.random() * 30) + 15),
      },
    });
  }
  console.log('  ✅ Missions (15)');

  // ═══════════════════════════════════════════
  // PROPOSALS (25+)
  // ═══════════════════════════════════════════

  const proposalsData = [
    // Mission 01 - App mobile e-commerce (OPEN) - 4 proposals
    { id: 'seed-prop-01', missionId: 'seed-mission-01', freelancerId: 'seed-fl-03', price: 22000, estimatedDays: 60, status: 'PENDING' as const, message: 'Bonjour Karim, je suis très intéressé par ce projet. J\'ai développé 3 applications e-commerce similaires en React Native. Je peux livrer une app performante avec une UX soignée. Voir mon portfolio pour des exemples.' },
    { id: 'seed-prop-02', missionId: 'seed-mission-01', freelancerId: 'seed-fl-01', price: 20000, estimatedDays: 50, status: 'PENDING' as const, message: 'Salam, en tant que développeur fullstack React/Node, je peux gérer le front mobile avec React Native et le backend. Prix compétitif pour une solution complète.' },
    { id: 'seed-prop-03', missionId: 'seed-mission-01', freelancerId: 'seed-fl-07', price: 18000, estimatedDays: 55, status: 'PENDING' as const, message: 'Bonjour, bien que spécialisé backend, j\'ai une solide expérience en React Native. Je propose un prix attractif avec un backend robuste en Python/FastAPI.' },

    // Mission 02 - Refonte UI/UX (OPEN) - 3 proposals
    { id: 'seed-prop-04', missionId: 'seed-mission-02', freelancerId: 'seed-fl-02', price: 10000, estimatedDays: 25, status: 'PENDING' as const, message: 'Bonjour Sarah, la refonte UI/UX est mon domaine d\'expertise. Je travaille avec Figma et je livre des prototypes interactifs détaillés. Consultons ensemble pour définir la direction créative.' },
    { id: 'seed-prop-05', missionId: 'seed-mission-02', freelancerId: 'seed-fl-10', price: 7500, estimatedDays: 20, status: 'PENDING' as const, message: 'Je propose un design moderne et épuré pour votre site corporate. Mon approche : recherche utilisateur, wireframes, puis maquettes haute fidélité.' },

    // Mission 03 - Campagne SEO (OPEN) - 3 proposals
    { id: 'seed-prop-06', missionId: 'seed-mission-03', freelancerId: 'seed-fl-04', price: 7000, estimatedDays: 90, status: 'PENDING' as const, message: 'Salam Youssef, le SEO et Google Ads sont mon quotidien. J\'ai géré des budgets Ads de 50k+ MAD et augmenté le trafic organique de mes clients de 60% en moyenne. Je suis votre personne.' },
    { id: 'seed-prop-07', missionId: 'seed-mission-03', freelancerId: 'seed-fl-06', price: 5500, estimatedDays: 90, status: 'PENDING' as const, message: 'Bonjour, en tant que rédactrice web spécialisée SEO, je peux créer du contenu optimisé et gérer votre stratégie SEO on-page. Pour le volet Ads, je collabore avec un expert certifié Google.' },

    // Mission 04 - Dashboard analytics (OPEN) - 3 proposals
    { id: 'seed-prop-08', missionId: 'seed-mission-04', freelancerId: 'seed-fl-01', price: 15000, estimatedDays: 35, status: 'PENDING' as const, message: 'Bonjour Nadia, React et la data visualization sont mes points forts. J\'ai déjà réalisé 2 dashboards similaires avec D3.js. Je peux démarrer immédiatement.' },
    { id: 'seed-prop-09', missionId: 'seed-mission-04', freelancerId: 'seed-fl-05', price: 16000, estimatedDays: 30, status: 'PENDING' as const, message: 'En tant que data scientist, je combine expertise data et développement. Dashboard React + D3.js avec des insights data pertinents pour votre business logistique.' },
    { id: 'seed-prop-10', missionId: 'seed-mission-04', freelancerId: 'seed-fl-07', price: 13000, estimatedDays: 40, status: 'PENDING' as const, message: 'Je propose une approche API-first : backend solide en FastAPI/Python et frontend React/D3.js. Tests automatisés et documentation complète inclus.' },

    // Mission 05 - Traduction (OPEN) - 2 proposals
    { id: 'seed-prop-11', missionId: 'seed-mission-05', freelancerId: 'seed-fl-12', price: 4000, estimatedDays: 18, status: 'PENDING' as const, message: 'Bonjour, traductrice trilingue FR/EN/AR avec 5 ans d\'expérience. Spécialisée en traduction technique et marketing. Je garantis qualité et respect des délais.' },
    { id: 'seed-prop-12', missionId: 'seed-mission-05', freelancerId: 'seed-fl-06', price: 3500, estimatedDays: 15, status: 'PENDING' as const, message: 'Rédactrice bilingue FR/AR, je peux gérer la traduction vers l\'arabe et collaborer avec un traducteur anglais de confiance pour la version EN.' },

    // Mission 06 - Gestion de stock (IN_PROGRESS) - Amine accepted
    { id: 'seed-prop-13', missionId: 'seed-mission-06', freelancerId: 'seed-fl-01', price: 28000, estimatedDays: 60, status: 'ACCEPTED' as const, message: 'Bonjour Nadia, Next.js et PostgreSQL sont mon stack principal. J\'ai réalisé un projet similaire de gestion d\'entrepôt l\'an dernier. Voici ma proposition détaillée avec un planning phase par phase.' },
    { id: 'seed-prop-14', missionId: 'seed-mission-06', freelancerId: 'seed-fl-07', price: 25000, estimatedDays: 55, status: 'REJECTED' as const, message: 'Je propose une architecture microservices avec Next.js et Prisma. Mon expertise Python/Django peut aussi être un atout pour le backend.' },
    { id: 'seed-prop-15', missionId: 'seed-mission-06', freelancerId: 'seed-fl-11', price: 22000, estimatedDays: 70, status: 'REJECTED' as const, message: 'Développeur expérimenté, je peux créer cette application avec WordPress et des plugins personnalisés pour la gestion de stock.' },

    // Mission 07 - API microservices (IN_PROGRESS) - Mehdi accepted
    { id: 'seed-prop-16', missionId: 'seed-mission-07', freelancerId: 'seed-fl-07', price: 17000, estimatedDays: 45, status: 'ACCEPTED' as const, message: 'Marc, les architectures microservices sont ma spécialité. Django + FastAPI pour des services performants et bien documentés. J\'inclus la documentation Swagger et les tests unitaires.' },
    { id: 'seed-prop-17', missionId: 'seed-mission-07', freelancerId: 'seed-fl-01', price: 18000, estimatedDays: 40, status: 'REJECTED' as const, message: 'Node.js est mon langage de prédilection pour les microservices. Express + TypeScript pour un code maintenable et performant.' },

    // Mission 08 - Social media (IN_PROGRESS) - Imane accepted
    { id: 'seed-prop-18', missionId: 'seed-mission-08', freelancerId: 'seed-fl-10', price: 5000, estimatedDays: 90, status: 'ACCEPTED' as const, message: 'Bonjour Karim ! Le community management est ma passion. Je crée du contenu engageant et je connais bien le marché tech marocain. Voici des exemples de mes campagnes précédentes.' },
    { id: 'seed-prop-19', missionId: 'seed-mission-08', freelancerId: 'seed-fl-04', price: 5500, estimatedDays: 90, status: 'REJECTED' as const, message: 'En tant que spécialiste marketing digital, je peux gérer vos réseaux sociaux avec une approche data-driven et des KPIs clairs.' },

    // Mission 09 - DevOps (IN_PROGRESS) - Yassine accepted
    { id: 'seed-prop-20', missionId: 'seed-mission-09', freelancerId: 'seed-fl-09', price: 19000, estimatedDays: 35, status: 'ACCEPTED' as const, message: 'Bonjour Marc, AWS et Kubernetes sont mon terrain de jeu quotidien. Infrastructure as Code avec Terraform, pipelines CI/CD robustes, et monitoring complet avec Grafana/Prometheus.' },

    // Mission 10 - Identité visuelle (COMPLETED) - FZ accepted
    { id: 'seed-prop-21', missionId: 'seed-mission-10', freelancerId: 'seed-fl-02', price: 6000, estimatedDays: 18, status: 'ACCEPTED' as const, message: 'Youssef, l\'identité visuelle est au cœur de mon métier. Je propose un processus créatif en 3 phases : recherche, exploration, finalisation. Résultat garanti.' },

    // Mission 11 - Power BI (COMPLETED) - Rachid accepted
    { id: 'seed-prop-22', missionId: 'seed-mission-11', freelancerId: 'seed-fl-05', price: 10000, estimatedDays: 25, status: 'ACCEPTED' as const, message: 'Nadia, l\'analyse de données et la visualisation Power BI sont mes compétences principales. J\'analyse vos données, identifie les tendances et crée un dashboard actionnable.' },

    // Mission 12 - WordPress restaurant (COMPLETED) - Khalid accepted
    { id: 'seed-prop-23', missionId: 'seed-mission-12', freelancerId: 'seed-fl-11', price: 4000, estimatedDays: 14, status: 'ACCEPTED' as const, message: 'Karim, WordPress est mon expertise depuis 4 ans. Sites vitrines avec réservation, c\'est mon quotidien. Je livre un site rapide, responsive et optimisé SEO.' },
    { id: 'seed-prop-24', missionId: 'seed-mission-12', freelancerId: 'seed-fl-01', price: 4500, estimatedDays: 10, status: 'REJECTED' as const, message: 'Je peux créer ce site avec Next.js pour de meilleures performances, mais je suis aussi à l\'aise avec WordPress si vous préférez.' },

    // Mission 15 - Blog tech (CANCELLED) - had 1 proposal
    { id: 'seed-prop-25', missionId: 'seed-mission-15', freelancerId: 'seed-fl-06', price: 2500, estimatedDays: 30, status: 'PENDING' as const, message: 'Bonjour Marc, la rédaction tech est un domaine que j\'affectionne. 20 articles bien documentés et optimisés SEO, c\'est tout à fait faisable en 1 mois.' },
  ];

  for (const p of proposalsData) {
    await prisma.proposal.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        missionId: p.missionId,
        freelancerId: p.freelancerId,
        price: p.price,
        estimatedDays: p.estimatedDays,
        status: p.status,
        message: p.message,
        createdAt: daysAgo(Math.floor(Math.random() * 20) + 5),
      },
    });
  }
  console.log('  ✅ Proposals (25)');

  // ═══════════════════════════════════════════
  // CONTRACTS (7) - for IN_PROGRESS and COMPLETED missions
  // ═══════════════════════════════════════════

  const contractsData = [
    { id: 'seed-contract-01', missionId: 'seed-mission-06', proposalId: 'seed-prop-13', clientId: 'seed-client-04', freelancerId: 'seed-fl-01', totalAmount: 28000, status: 'ACTIVE' as const, startDate: daysAgo(20), endDate: daysFromNow(40), signedByClient: true, signedByFreelancer: true, terms: 'Contrat de prestation freelance pour le développement d\'une application de gestion de stock. Paiement par jalons selon avancement.' },
    { id: 'seed-contract-02', missionId: 'seed-mission-07', proposalId: 'seed-prop-16', clientId: 'seed-client-05', freelancerId: 'seed-fl-07', totalAmount: 17000, status: 'ACTIVE' as const, startDate: daysAgo(15), endDate: daysFromNow(30), signedByClient: true, signedByFreelancer: true, terms: 'Contrat pour la conception et le développement d\'une architecture microservices. Documentation Swagger incluse.' },
    { id: 'seed-contract-03', missionId: 'seed-mission-08', proposalId: 'seed-prop-18', clientId: 'seed-client-01', freelancerId: 'seed-fl-10', totalAmount: 5000, status: 'ACTIVE' as const, startDate: daysAgo(25), endDate: daysFromNow(65), signedByClient: true, signedByFreelancer: true, terms: 'Contrat de community management pour 3 mois. Rapport mensuel exigé.' },
    { id: 'seed-contract-04', missionId: 'seed-mission-09', proposalId: 'seed-prop-20', clientId: 'seed-client-05', freelancerId: 'seed-fl-09', totalAmount: 19000, status: 'ACTIVE' as const, startDate: daysAgo(10), endDate: daysFromNow(25), signedByClient: true, signedByFreelancer: true, terms: 'Mise en place infrastructure DevOps complète avec CI/CD et monitoring.' },
    { id: 'seed-contract-05', missionId: 'seed-mission-10', proposalId: 'seed-prop-21', clientId: 'seed-client-03', freelancerId: 'seed-fl-02', totalAmount: 6000, status: 'COMPLETED' as const, startDate: daysAgo(40), endDate: daysAgo(22), signedByClient: true, signedByFreelancer: true, terms: 'Création identité visuelle complète pour DarKom.' },
    { id: 'seed-contract-06', missionId: 'seed-mission-11', proposalId: 'seed-prop-22', clientId: 'seed-client-04', freelancerId: 'seed-fl-05', totalAmount: 10000, status: 'COMPLETED' as const, startDate: daysAgo(45), endDate: daysAgo(20), signedByClient: true, signedByFreelancer: true, terms: 'Analyse de données et création tableau de bord Power BI.' },
    { id: 'seed-contract-07', missionId: 'seed-mission-12', proposalId: 'seed-prop-23', clientId: 'seed-client-01', freelancerId: 'seed-fl-11', totalAmount: 4000, status: 'COMPLETED' as const, startDate: daysAgo(35), endDate: daysAgo(21), signedByClient: true, signedByFreelancer: true, terms: 'Création site vitrine WordPress avec réservation en ligne.' },
  ];

  for (const c of contractsData) {
    await prisma.contract.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        missionId: c.missionId,
        proposalId: c.proposalId,
        clientId: c.clientId,
        freelancerId: c.freelancerId,
        totalAmount: c.totalAmount,
        currency: 'MAD',
        status: c.status,
        startDate: c.startDate,
        endDate: c.endDate,
        signedByClient: c.signedByClient,
        signedByFreelancer: c.signedByFreelancer,
        terms: c.terms,
      },
    });
  }
  console.log('  ✅ Contracts (7)');

  // ═══════════════════════════════════════════
  // MILESTONES
  // ═══════════════════════════════════════════

  const milestonesData = [
    // Contract 01 - Gestion de stock (ACTIVE)
    { id: 'seed-ms-01', contractId: 'seed-contract-01', title: 'Maquettes et architecture', amount: 5000, status: 'APPROVED' as const, dueDate: daysAgo(10), completedAt: daysAgo(12), approvedAt: daysAgo(10) },
    { id: 'seed-ms-02', contractId: 'seed-contract-01', title: 'Développement module inventaire', amount: 8000, status: 'IN_PROGRESS' as const, dueDate: daysFromNow(10) },
    { id: 'seed-ms-03', contractId: 'seed-contract-01', title: 'Module entrées/sorties et alertes', amount: 8000, status: 'PENDING' as const, dueDate: daysFromNow(25) },
    { id: 'seed-ms-04', contractId: 'seed-contract-01', title: 'Tests et déploiement', amount: 7000, status: 'PENDING' as const, dueDate: daysFromNow(40) },

    // Contract 02 - API microservices (ACTIVE)
    { id: 'seed-ms-05', contractId: 'seed-contract-02', title: 'Architecture et auth service', amount: 5000, status: 'APPROVED' as const, dueDate: daysAgo(5), completedAt: daysAgo(6), approvedAt: daysAgo(5) },
    { id: 'seed-ms-06', contractId: 'seed-contract-02', title: 'Services utilisateurs et facturation', amount: 7000, status: 'IN_PROGRESS' as const, dueDate: daysFromNow(15) },
    { id: 'seed-ms-07', contractId: 'seed-contract-02', title: 'Documentation et déploiement', amount: 5000, status: 'PENDING' as const, dueDate: daysFromNow(30) },

    // Contract 05 - Identité visuelle (COMPLETED)
    { id: 'seed-ms-08', contractId: 'seed-contract-05', title: 'Recherche et moodboard', amount: 1500, status: 'PAID' as const, dueDate: daysAgo(35), completedAt: daysAgo(36), approvedAt: daysAgo(35) },
    { id: 'seed-ms-09', contractId: 'seed-contract-05', title: 'Logo et propositions', amount: 2500, status: 'PAID' as const, dueDate: daysAgo(28), completedAt: daysAgo(29), approvedAt: daysAgo(28) },
    { id: 'seed-ms-10', contractId: 'seed-contract-05', title: 'Charte graphique et livrables', amount: 2000, status: 'PAID' as const, dueDate: daysAgo(22), completedAt: daysAgo(23), approvedAt: daysAgo(22) },

    // Contract 06 - Power BI (COMPLETED)
    { id: 'seed-ms-11', contractId: 'seed-contract-06', title: 'Audit et nettoyage données', amount: 3000, status: 'PAID' as const, dueDate: daysAgo(38), completedAt: daysAgo(39), approvedAt: daysAgo(38) },
    { id: 'seed-ms-12', contractId: 'seed-contract-06', title: 'Dashboard Power BI', amount: 5000, status: 'PAID' as const, dueDate: daysAgo(28), completedAt: daysAgo(29), approvedAt: daysAgo(28) },
    { id: 'seed-ms-13', contractId: 'seed-contract-06', title: 'Formation et documentation', amount: 2000, status: 'PAID' as const, dueDate: daysAgo(20), completedAt: daysAgo(21), approvedAt: daysAgo(20) },
  ];

  for (const ms of milestonesData) {
    await prisma.milestone.upsert({
      where: { id: ms.id },
      update: {},
      create: {
        id: ms.id,
        contractId: ms.contractId,
        title: ms.title,
        amount: ms.amount,
        status: ms.status,
        dueDate: ms.dueDate,
        completedAt: ms.completedAt || null,
        approvedAt: ms.approvedAt || null,
      },
    });
  }
  console.log('  ✅ Milestones (13)');

  // ═══════════════════════════════════════════
  // REVIEWS (12)
  // ═══════════════════════════════════════════

  const reviewsData = [
    // Mission 10 - Identité visuelle (Youssef → FZ, FZ → Youssef)
    { id: 'seed-review-01', missionId: 'seed-mission-10', authorId: 'seed-client-03', targetUserId: 'seed-fl-02', rating: 5, comment: 'Fatima Zahra a fait un travail exceptionnel sur notre identité visuelle. Créative, réactive et professionnelle. Le logo est parfait et la charte graphique très complète. Je recommande vivement !' },
    { id: 'seed-review-02', missionId: 'seed-mission-10', authorId: 'seed-fl-02', targetUserId: 'seed-client-03', rating: 5, comment: 'Excellent client ! Youssef a été très clair dans ses attentes et réactif pour les validations. Collaboration très agréable.' },

    // Mission 11 - Power BI (Nadia → Rachid, Rachid → Nadia)
    { id: 'seed-review-03', missionId: 'seed-mission-11', authorId: 'seed-client-04', targetUserId: 'seed-fl-05', rating: 5, comment: 'Rachid est un vrai expert data. Son dashboard Power BI a transformé notre façon de suivre les performances. Analyse pertinente et livrables de qualité.' },
    { id: 'seed-review-04', missionId: 'seed-mission-11', authorId: 'seed-fl-05', targetUserId: 'seed-client-04', rating: 4, comment: 'Bonne collaboration avec Nadia. Les données étaient bien organisées. Un petit délai sur les validations mais dans l\'ensemble un bon projet.' },

    // Mission 12 - WordPress restaurant (Karim → Khalid, Khalid → Karim)
    { id: 'seed-review-05', missionId: 'seed-mission-12', authorId: 'seed-client-01', targetUserId: 'seed-fl-11', rating: 4, comment: 'Khalid a livré un bon site WordPress dans les délais. Le design est clean et la réservation fonctionne bien. Quelques petits ajustements demandés mais rien de majeur.' },
    { id: 'seed-review-06', missionId: 'seed-mission-12', authorId: 'seed-fl-11', targetUserId: 'seed-client-01', rating: 5, comment: 'Karim est un client idéal : brief clair, feedback constructif et paiement rapide. Merci !' },

    // Additional reviews for freelancers from past hypothetical missions
    { id: 'seed-review-07', missionId: 'seed-mission-10', authorId: 'seed-client-01', targetUserId: 'seed-fl-01', rating: 5, comment: 'Amine est un développeur fullstack exceptionnel. Code propre, architecture solide et excellent communicateur. Un plaisir de travailler avec lui.' },
    { id: 'seed-review-08', missionId: 'seed-mission-11', authorId: 'seed-client-05', targetUserId: 'seed-fl-07', rating: 4, comment: 'Mehdi maîtrise parfaitement Python et Django. API bien structurée et documentée. Je recommande pour tout projet backend.' },
    { id: 'seed-review-09', missionId: 'seed-mission-12', authorId: 'seed-client-02', targetUserId: 'seed-fl-04', rating: 5, comment: 'Hind a boosté notre trafic de 45% en 2 mois grâce à une stratégie SEO/Ads très efficace. Reporting clair et résultats concrets.' },
    { id: 'seed-review-10', missionId: 'seed-mission-10', authorId: 'seed-client-04', targetUserId: 'seed-fl-09', rating: 5, comment: 'Yassine a mis en place une infra DevOps impeccable. CI/CD fluide, monitoring complet. Notre temps de déploiement est passé de 2h à 5 minutes.' },
    { id: 'seed-review-11', missionId: 'seed-mission-11', authorId: 'seed-client-01', targetUserId: 'seed-fl-03', rating: 4, comment: 'Omar a développé une très bonne app mobile. UX fluide et performances au rendez-vous. Petit retard sur le planning mais qualité au top.' },
    { id: 'seed-review-12', missionId: 'seed-mission-12', authorId: 'seed-client-03', targetUserId: 'seed-fl-12', rating: 5, comment: 'Nora est une traductrice exceptionnelle. Traduction précise et naturelle dans les 3 langues. Respect parfait des délais.' },
  ];

  for (const r of reviewsData) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        missionId: r.missionId,
        authorId: r.authorId,
        targetUserId: r.targetUserId,
        rating: r.rating,
        comment: r.comment,
        createdAt: daysAgo(Math.floor(Math.random() * 20) + 5),
      },
    });
  }
  console.log('  ✅ Reviews (12)');

  // ═══════════════════════════════════════════
  // GIGS (8)
  // ═══════════════════════════════════════════

  const gigsData = [
    { id: 'seed-gig-01', freelancerId: 'seed-fl-11', title: 'Site web vitrine WordPress professionnel', description: 'Je crée votre site web vitrine WordPress sur mesure. Design responsive, optimisé SEO, et facile à gérer. Inclut : installation, thème personnalisé, pages principales, formulaire de contact, et formation.', category: 'developpement-web', skills: ['WordPress', 'PHP', 'SEO', 'Responsive'], basicPrice: 1500, basicTitle: 'Basique', basicDesc: 'Site 3 pages, thème standard, formulaire contact', standardPrice: 3000, standardTitle: 'Standard', standardDesc: 'Site 7 pages, design personnalisé, blog, SEO on-page', premiumPrice: 5000, premiumTitle: 'Premium', premiumDesc: 'Site 15 pages, e-commerce WooCommerce, multilingue, formation', deliveryDays: 14, status: 'ACTIVE' as const, viewCount: 124, orderCount: 8 },
    { id: 'seed-gig-02', freelancerId: 'seed-fl-02', title: 'Logo et charte graphique professionnels', description: 'Création de votre identité visuelle : logo unique, charte graphique complète, et déclinaisons pour tous supports. Processus créatif en 3 étapes avec vos retours.', category: 'design-creatif', skills: ['Logo', 'Illustrator', 'Branding', 'Charte graphique'], basicPrice: 800, basicTitle: 'Logo seul', basicDesc: '3 propositions de logo, 2 révisions, fichiers HD', standardPrice: 1500, standardTitle: 'Logo + Charte', standardDesc: 'Logo + charte graphique, typographies, palette couleurs', premiumPrice: 2500, premiumTitle: 'Identité complète', premiumDesc: 'Logo, charte, carte visite, en-tête, templates réseaux sociaux', deliveryDays: 10, status: 'ACTIVE' as const, viewCount: 89, orderCount: 12 },
    { id: 'seed-gig-03', freelancerId: 'seed-fl-03', title: 'Application mobile React Native sur mesure', description: 'Développement d\'une application mobile cross-platform (iOS + Android) en React Native. Interface soignée, performances optimales, et code maintenable.', category: 'mobile', skills: ['React Native', 'TypeScript', 'Firebase', 'iOS', 'Android'], basicPrice: 5000, basicTitle: 'App simple', basicDesc: 'App 3-5 écrans, navigation, design basique', standardPrice: 10000, standardTitle: 'App complète', standardDesc: 'App 10 écrans, auth, API, push notifications', premiumPrice: 18000, premiumTitle: 'App premium', premiumDesc: 'App complexe, paiement, chat, admin panel, publication stores', deliveryDays: 30, status: 'ACTIVE' as const, viewCount: 67, orderCount: 4 },
    { id: 'seed-gig-04', freelancerId: 'seed-fl-04', title: 'Audit SEO complet et plan d\'action', description: 'Audit SEO technique et sémantique complet de votre site web. Analyse de la concurrence, recommandations priorisées, et plan d\'action détaillé pour améliorer votre positionnement Google.', category: 'marketing-digital', skills: ['SEO', 'Google Analytics', 'Search Console', 'Semrush'], basicPrice: 800, basicTitle: 'Audit rapide', basicDesc: 'Audit technique, rapport 10 pages, top 5 actions', standardPrice: 1500, standardTitle: 'Audit complet', standardDesc: 'Audit technique + sémantique, analyse concurrence, 30 pages', premiumPrice: 3000, premiumTitle: 'Audit + Implémentation', premiumDesc: 'Audit complet + implémentation des corrections sur 1 mois', deliveryDays: 7, status: 'ACTIVE' as const, viewCount: 93, orderCount: 15 },
    { id: 'seed-gig-05', freelancerId: 'seed-fl-05', title: 'Dashboard data et analyses Python', description: 'Analyse de vos données et création de dashboards interactifs. Python, Pandas, et outils de visualisation pour transformer vos données en insights actionnables.', category: 'data-it', skills: ['Python', 'Pandas', 'Power BI', 'Data Analysis', 'SQL'], basicPrice: 2000, basicTitle: 'Analyse basique', basicDesc: 'Nettoyage données, analyse exploratoire, rapport PDF', standardPrice: 5000, standardTitle: 'Dashboard interactif', standardDesc: 'Analyse + dashboard Power BI/Tableau, 5 KPIs', premiumPrice: 10000, premiumTitle: 'Solution complète', premiumDesc: 'Pipeline data, dashboard avancé, prédictions ML, formation', deliveryDays: 14, status: 'ACTIVE' as const, viewCount: 45, orderCount: 6 },
    { id: 'seed-gig-06', freelancerId: 'seed-fl-01', title: 'Application web Next.js sur mesure', description: 'Développement d\'applications web modernes avec Next.js, React, et TypeScript. Architecture scalable, SEO-friendly, et déploiement inclus.', category: 'developpement-web', skills: ['Next.js', 'React', 'TypeScript', 'Prisma', 'TailwindCSS'], basicPrice: 3000, basicTitle: 'Landing page', basicDesc: 'Landing page responsive, animations, formulaire contact', standardPrice: 8000, standardTitle: 'Application web', standardDesc: 'App 5-10 pages, auth, CRUD, dashboard basique', premiumPrice: 15000, premiumTitle: 'SaaS complet', premiumDesc: 'App SaaS complète, multi-tenant, paiement, admin panel', deliveryDays: 21, status: 'ACTIVE' as const, viewCount: 78, orderCount: 5 },
    { id: 'seed-gig-07', freelancerId: 'seed-fl-12', title: 'Traduction professionnelle FR/EN/AR', description: 'Traduction de haute qualité entre le français, l\'anglais et l\'arabe. Spécialisée dans les domaines technique, juridique et marketing.', category: 'traduction-redaction', skills: ['Français', 'Anglais', 'Arabe', 'Traduction technique'], basicPrice: 500, basicTitle: '1000 mots', basicDesc: 'Traduction 1000 mots, 1 paire de langues, relecture', standardPrice: 1200, standardTitle: '3000 mots', standardDesc: 'Traduction 3000 mots, 2 paires, glossaire inclus', premiumPrice: 2500, premiumTitle: 'Site web complet', premiumDesc: 'Traduction site web, 3 langues, localisation, SEO', deliveryDays: 5, status: 'ACTIVE' as const, viewCount: 56, orderCount: 18 },
    { id: 'seed-gig-08', freelancerId: 'seed-fl-09', title: 'Setup DevOps et CI/CD', description: 'Mise en place d\'une infrastructure DevOps moderne : conteneurisation Docker, orchestration Kubernetes, CI/CD pipelines, et monitoring. Cloud AWS, GCP ou Azure.', category: 'devops', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], basicPrice: 2000, basicTitle: 'Docker + CI/CD', basicDesc: 'Dockerisation app, pipeline CI/CD GitHub Actions', standardPrice: 5000, standardTitle: 'Infra complète', standardDesc: 'Docker, Kubernetes, CI/CD, monitoring basique', premiumPrice: 10000, premiumTitle: 'Enterprise', premiumDesc: 'Infra K8s multi-env, IaC Terraform, monitoring avancé, formation', deliveryDays: 14, status: 'ACTIVE' as const, viewCount: 41, orderCount: 3 },
  ];

  for (const g of gigsData) {
    await prisma.gig.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        freelancerId: g.freelancerId,
        title: g.title,
        description: g.description,
        category: g.category,
        skills: g.skills,
        basicPrice: g.basicPrice,
        basicTitle: g.basicTitle,
        basicDesc: g.basicDesc,
        standardPrice: g.standardPrice,
        standardTitle: g.standardTitle,
        standardDesc: g.standardDesc,
        premiumPrice: g.premiumPrice,
        premiumTitle: g.premiumTitle,
        premiumDesc: g.premiumDesc,
        deliveryDays: g.deliveryDays,
        status: g.status,
        viewCount: g.viewCount,
        orderCount: g.orderCount,
        images: [],
        createdAt: daysAgo(Math.floor(Math.random() * 40) + 10),
      },
    });
  }
  console.log('  ✅ Gigs (8)');

  // ═══════════════════════════════════════════
  // CONVERSATIONS & MESSAGES (6)
  // ═══════════════════════════════════════════

  const conversationsData = [
    { id: 'seed-conv-01', missionId: 'seed-mission-06', participants: ['seed-client-04', 'seed-fl-01'], messages: [
      { id: 'seed-msg-01', senderId: 'seed-client-04', content: 'Bonjour Amine, j\'ai validé votre proposition. Quand pouvez-vous commencer ?', createdAt: daysAgo(20) },
      { id: 'seed-msg-02', senderId: 'seed-fl-01', content: 'Bonjour Nadia ! Merci pour votre confiance. Je peux commencer dès lundi. Je vous envoie le contrat et le planning détaillé aujourd\'hui.', createdAt: daysAgo(20) },
      { id: 'seed-msg-03', senderId: 'seed-client-04', content: 'Parfait ! J\'ai signé le contrat. Bonne chance pour le projet.', createdAt: daysAgo(19) },
      { id: 'seed-msg-04', senderId: 'seed-fl-01', content: 'Merci ! J\'ai terminé la première milestone (maquettes). Pouvez-vous valider quand vous avez un moment ?', createdAt: daysAgo(10) },
      { id: 'seed-msg-05', senderId: 'seed-client-04', content: 'Super travail ! Les maquettes sont validées. Vous pouvez passer au module inventaire.', createdAt: daysAgo(9) },
    ]},
    { id: 'seed-conv-02', missionId: 'seed-mission-07', participants: ['seed-client-05', 'seed-fl-07'], messages: [
      { id: 'seed-msg-06', senderId: 'seed-client-05', content: 'Salut Mehdi, ta proposition pour les microservices est intéressante. Peut-on faire un call pour discuter de l\'architecture ?', createdAt: daysAgo(16) },
      { id: 'seed-msg-07', senderId: 'seed-fl-07', content: 'Bien sûr Marc ! Je suis dispo demain à 14h. Je prépare un schéma d\'architecture pour notre discussion.', createdAt: daysAgo(16) },
      { id: 'seed-msg-08', senderId: 'seed-client-05', content: 'Parfait, à demain alors. J\'aimerais aussi discuter de la stratégie de testing.', createdAt: daysAgo(16) },
    ]},
    { id: 'seed-conv-03', missionId: 'seed-mission-10', participants: ['seed-client-03', 'seed-fl-02'], messages: [
      { id: 'seed-msg-09', senderId: 'seed-fl-02', content: 'Youssef, voici les 3 propositions de logo. Quelle direction préférez-vous ?', createdAt: daysAgo(32) },
      { id: 'seed-msg-10', senderId: 'seed-client-03', content: 'J\'adore la proposition 2 ! Le style minimaliste correspond parfaitement à notre vision. Peut-on explorer des variantes de couleur ?', createdAt: daysAgo(31) },
      { id: 'seed-msg-11', senderId: 'seed-fl-02', content: 'Absolument ! Je vous envoie 4 variantes de couleur d\'ici demain.', createdAt: daysAgo(31) },
      { id: 'seed-msg-12', senderId: 'seed-client-03', content: 'La variante en bleu/orange est parfaite ! On valide celle-ci. Merci Fatima Zahra !', createdAt: daysAgo(29) },
    ]},
    { id: 'seed-conv-04', missionId: 'seed-mission-01', participants: ['seed-client-01', 'seed-fl-03'], messages: [
      { id: 'seed-msg-13', senderId: 'seed-client-01', content: 'Bonjour Omar, votre portfolio d\'apps mobiles est impressionnant. Avez-vous de l\'expérience avec les intégrations de paiement au Maroc ?', createdAt: daysAgo(8) },
      { id: 'seed-msg-14', senderId: 'seed-fl-03', content: 'Merci Karim ! Oui, j\'ai intégré CMI et Payzone dans 2 projets récents. Je peux vous montrer des demos si vous le souhaitez.', createdAt: daysAgo(8) },
      { id: 'seed-msg-15', senderId: 'seed-client-01', content: 'Ce serait super ! On peut organiser un appel cette semaine ?', createdAt: daysAgo(7) },
    ]},
    { id: 'seed-conv-05', missionId: 'seed-mission-09', participants: ['seed-client-05', 'seed-fl-09'], messages: [
      { id: 'seed-msg-16', senderId: 'seed-fl-09', content: 'Marc, j\'ai dockerisé tous les services et le pipeline CI/CD est en place. On peut faire une demo ?', createdAt: daysAgo(5) },
      { id: 'seed-msg-17', senderId: 'seed-client-05', content: 'Excellent ! Oui, organisons une demo vendredi à 10h avec l\'équipe tech.', createdAt: daysAgo(5) },
      { id: 'seed-msg-18', senderId: 'seed-fl-09', content: 'C\'est noté. Je prépare aussi la doc Terraform pour la revue.', createdAt: daysAgo(4) },
    ]},
    { id: 'seed-conv-06', missionId: 'seed-mission-08', participants: ['seed-client-01', 'seed-fl-10'], messages: [
      { id: 'seed-msg-19', senderId: 'seed-fl-10', content: 'Karim, voici le rapport du premier mois. Engagement en hausse de 35% sur Instagram ! 🎉', createdAt: daysAgo(3) },
      { id: 'seed-msg-20', senderId: 'seed-client-01', content: 'Bravo Imane ! Les chiffres sont très encourageants. Continue comme ça !', createdAt: daysAgo(3) },
    ]},
  ];

  for (const conv of conversationsData) {
    await prisma.conversation.upsert({
      where: { id: conv.id },
      update: {},
      create: {
        id: conv.id,
        missionId: conv.missionId || null,
        lastMessageAt: conv.messages[conv.messages.length - 1].createdAt,
      },
    });

    for (const pId of conv.participants) {
      const cpId = `${conv.id}-${pId}`;
      await prisma.conversationParticipant.upsert({
        where: { id: cpId },
        update: {},
        create: {
          id: cpId,
          conversationId: conv.id,
          userId: pId,
          unreadCount: 0,
        },
      });
    }

    for (const msg of conv.messages) {
      await prisma.chatMessage.upsert({
        where: { id: msg.id },
        update: {},
        create: {
          id: msg.id,
          conversationId: conv.id,
          senderId: msg.senderId,
          content: msg.content,
          type: 'TEXT',
          createdAt: msg.createdAt,
        },
      });
    }
  }
  console.log('  ✅ Conversations (6) & Messages (20)');

  // ═══════════════════════════════════════════
  // NOTIFICATIONS (25+)
  // ═══════════════════════════════════════════

  const notificationsData = [
    // New proposals for clients
    { id: 'seed-notif-01', userId: 'seed-client-01', type: 'NEW_PROPOSAL', title: 'Nouvelle proposition reçue', body: 'Omar Khalil a soumis une proposition pour "Développement d\'une application mobile e-commerce"', entityType: 'proposal', entityId: 'seed-prop-01', actionUrl: '/dashboard/missions/seed-mission-01', read: true },
    { id: 'seed-notif-02', userId: 'seed-client-01', type: 'NEW_PROPOSAL', title: 'Nouvelle proposition reçue', body: 'Amine Tazi a soumis une proposition pour "Développement d\'une application mobile e-commerce"', entityType: 'proposal', entityId: 'seed-prop-02', actionUrl: '/dashboard/missions/seed-mission-01', read: true },
    { id: 'seed-notif-03', userId: 'seed-client-02', type: 'NEW_PROPOSAL', title: 'Nouvelle proposition reçue', body: 'Fatima Zahra Ouali a soumis une proposition pour "Refonte UI/UX site web corporate"', entityType: 'proposal', entityId: 'seed-prop-04', actionUrl: '/dashboard/missions/seed-mission-02', read: false },
    { id: 'seed-notif-04', userId: 'seed-client-03', type: 'NEW_PROPOSAL', title: 'Nouvelle proposition reçue', body: 'Hind Bennani a soumis une proposition pour "Campagne SEO et Google Ads"', entityType: 'proposal', entityId: 'seed-prop-06', actionUrl: '/dashboard/missions/seed-mission-03', read: false },
    { id: 'seed-notif-05', userId: 'seed-client-04', type: 'NEW_PROPOSAL', title: 'Nouvelle proposition reçue', body: 'Amine Tazi a soumis une proposition pour "Dashboard analytics avec React et D3.js"', entityType: 'proposal', entityId: 'seed-prop-08', actionUrl: '/dashboard/missions/seed-mission-04', read: false },

    // Proposal accepted for freelancers
    { id: 'seed-notif-06', userId: 'seed-fl-01', type: 'PROPOSAL_ACCEPTED', title: 'Proposition acceptée !', body: 'Votre proposition pour "Application de gestion de stock" a été acceptée par Nadia Fassi', entityType: 'proposal', entityId: 'seed-prop-13', actionUrl: '/dashboard/missions/seed-mission-06', read: true },
    { id: 'seed-notif-07', userId: 'seed-fl-07', type: 'PROPOSAL_ACCEPTED', title: 'Proposition acceptée !', body: 'Votre proposition pour "API REST microservices Node.js" a été acceptée par Marc Lefèvre', entityType: 'proposal', entityId: 'seed-prop-16', actionUrl: '/dashboard/missions/seed-mission-07', read: true },
    { id: 'seed-notif-08', userId: 'seed-fl-10', type: 'PROPOSAL_ACCEPTED', title: 'Proposition acceptée !', body: 'Votre proposition pour "Stratégie social media" a été acceptée par Karim Benali', entityType: 'proposal', entityId: 'seed-prop-18', actionUrl: '/dashboard/missions/seed-mission-08', read: true },
    { id: 'seed-notif-09', userId: 'seed-fl-09', type: 'PROPOSAL_ACCEPTED', title: 'Proposition acceptée !', body: 'Votre proposition pour "Infrastructure DevOps et CI/CD" a été acceptée par Marc Lefèvre', entityType: 'proposal', entityId: 'seed-prop-20', actionUrl: '/dashboard/missions/seed-mission-09', read: true },

    // Mission completed
    { id: 'seed-notif-10', userId: 'seed-client-03', type: 'MISSION_COMPLETED', title: 'Mission terminée', body: '"Création identité visuelle startup" a été marquée comme terminée', entityType: 'mission', entityId: 'seed-mission-10', actionUrl: '/dashboard/missions/seed-mission-10', read: true },
    { id: 'seed-notif-11', userId: 'seed-client-04', type: 'MISSION_COMPLETED', title: 'Mission terminée', body: '"Analyse de données et tableau de bord Power BI" a été marquée comme terminée', entityType: 'mission', entityId: 'seed-mission-11', actionUrl: '/dashboard/missions/seed-mission-11', read: true },
    { id: 'seed-notif-12', userId: 'seed-client-01', type: 'MISSION_COMPLETED', title: 'Mission terminée', body: '"Site vitrine WordPress pour restaurant" a été marquée comme terminée', entityType: 'mission', entityId: 'seed-mission-12', actionUrl: '/dashboard/missions/seed-mission-12', read: true },

    // New reviews
    { id: 'seed-notif-13', userId: 'seed-fl-02', type: 'NEW_REVIEW', title: 'Nouvel avis reçu', body: 'Youssef El Amrani vous a donné 5 étoiles pour "Création identité visuelle startup"', entityType: 'review', entityId: 'seed-review-01', actionUrl: '/dashboard/reviews', read: true },
    { id: 'seed-notif-14', userId: 'seed-fl-05', type: 'NEW_REVIEW', title: 'Nouvel avis reçu', body: 'Nadia Fassi vous a donné 5 étoiles pour "Analyse de données"', entityType: 'review', entityId: 'seed-review-03', actionUrl: '/dashboard/reviews', read: false },
    { id: 'seed-notif-15', userId: 'seed-fl-11', type: 'NEW_REVIEW', title: 'Nouvel avis reçu', body: 'Karim Benali vous a donné 4 étoiles pour "Site WordPress"', entityType: 'review', entityId: 'seed-review-05', actionUrl: '/dashboard/reviews', read: false },

    // New messages
    { id: 'seed-notif-16', userId: 'seed-fl-01', type: 'NEW_MESSAGE', title: 'Nouveau message', body: 'Nadia Fassi vous a envoyé un message', entityType: 'conversation', entityId: 'seed-conv-01', actionUrl: '/dashboard/messages', read: true },
    { id: 'seed-notif-17', userId: 'seed-fl-07', type: 'NEW_MESSAGE', title: 'Nouveau message', body: 'Marc Lefèvre vous a envoyé un message', entityType: 'conversation', entityId: 'seed-conv-02', actionUrl: '/dashboard/messages', read: true },

    // Milestone approved
    { id: 'seed-notif-18', userId: 'seed-fl-01', type: 'MILESTONE_APPROVED', title: 'Jalon validé', body: 'Le jalon "Maquettes et architecture" a été approuvé par le client', entityType: 'milestone', entityId: 'seed-ms-01', actionUrl: '/dashboard/contracts/seed-contract-01', read: true },
    { id: 'seed-notif-19', userId: 'seed-fl-07', type: 'MILESTONE_APPROVED', title: 'Jalon validé', body: 'Le jalon "Architecture et auth service" a été approuvé par le client', entityType: 'milestone', entityId: 'seed-ms-05', actionUrl: '/dashboard/contracts/seed-contract-02', read: true },

    // Contract signed
    { id: 'seed-notif-20', userId: 'seed-fl-01', type: 'CONTRACT_SIGNED', title: 'Contrat signé', body: 'Le contrat pour "Application de gestion de stock" a été signé par les deux parties', entityType: 'contract', entityId: 'seed-contract-01', actionUrl: '/dashboard/contracts/seed-contract-01', read: true },

    // Proposal rejected
    { id: 'seed-notif-21', userId: 'seed-fl-07', type: 'PROPOSAL_REJECTED', title: 'Proposition non retenue', body: 'Votre proposition pour "Application de gestion de stock" n\'a pas été retenue', entityType: 'proposal', entityId: 'seed-prop-14', actionUrl: '/dashboard/proposals', read: true },
    { id: 'seed-notif-22', userId: 'seed-fl-11', type: 'PROPOSAL_REJECTED', title: 'Proposition non retenue', body: 'Votre proposition pour "Application de gestion de stock" n\'a pas été retenue', entityType: 'proposal', entityId: 'seed-prop-15', actionUrl: '/dashboard/proposals', read: true },

    // System notifications
    { id: 'seed-notif-23', userId: 'seed-fl-01', type: 'BADGE_EARNED', title: 'Nouveau badge !', body: 'Félicitations ! Vous avez obtenu le badge "Top Rated"', entityType: 'badge', actionUrl: '/dashboard/profile', read: false },
    { id: 'seed-notif-24', userId: 'seed-fl-02', type: 'BADGE_EARNED', title: 'Nouveau badge !', body: 'Félicitations ! Vous avez obtenu le badge "Verified"', entityType: 'badge', actionUrl: '/dashboard/profile', read: false },
    { id: 'seed-notif-25', userId: 'seed-client-01', type: 'CREDITS_LOW', title: 'Crédits faibles', body: 'Il vous reste 5 crédits. Rechargez pour continuer à publier des missions.', entityType: 'credit', actionUrl: '/dashboard/credits', read: false },
  ];

  for (const n of notificationsData) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: {},
      create: {
        id: n.id,
        userId: n.userId,
        type: n.type,
        title: n.title,
        body: n.body,
        entityType: n.entityType || null,
        entityId: n.entityId || null,
        actionUrl: n.actionUrl || null,
        read: n.read,
        readAt: n.read ? daysAgo(Math.floor(Math.random() * 5) + 1) : null,
        createdAt: daysAgo(Math.floor(Math.random() * 15) + 1),
      },
    });
  }
  console.log('  ✅ Notifications (25)');

  // ═══════════════════════════════════════════
  // BADGES (15)
  // ═══════════════════════════════════════════

  const badgesData = [
    { userId: 'seed-fl-01', type: 'TOP_RATED', name: 'Top Rated', description: 'Freelancer avec une note moyenne supérieure à 4.8', icon: '⭐' },
    { userId: 'seed-fl-01', type: 'VERIFIED', name: 'Vérifié', description: 'Identité et compétences vérifiées', icon: '✅' },
    { userId: 'seed-fl-01', type: 'FAST_DELIVERY', name: 'Livraison Rapide', description: 'Livre toujours en avance ou à temps', icon: '⚡' },
    { userId: 'seed-fl-02', type: 'VERIFIED', name: 'Vérifié', description: 'Identité et compétences vérifiées', icon: '✅' },
    { userId: 'seed-fl-02', type: 'RISING_STAR', name: 'Étoile Montante', description: 'Progression remarquable sur la plateforme', icon: '🌟' },
    { userId: 'seed-fl-03', type: 'VERIFIED', name: 'Vérifié', description: 'Identité et compétences vérifiées', icon: '✅' },
    { userId: 'seed-fl-03', type: 'TOP_RATED', name: 'Top Rated', description: 'Freelancer avec une note moyenne supérieure à 4.8', icon: '⭐' },
    { userId: 'seed-fl-04', type: 'VERIFIED', name: 'Vérifié', description: 'Identité et compétences vérifiées', icon: '✅' },
    { userId: 'seed-fl-05', type: 'VERIFIED', name: 'Vérifié', description: 'Identité et compétences vérifiées', icon: '✅' },
    { userId: 'seed-fl-05', type: 'EXPERT', name: 'Expert', description: 'Plus de 5 ans d\'expérience vérifiée', icon: '🏆' },
    { userId: 'seed-fl-07', type: 'VERIFIED', name: 'Vérifié', description: 'Identité et compétences vérifiées', icon: '✅' },
    { userId: 'seed-fl-09', type: 'VERIFIED', name: 'Vérifié', description: 'Identité et compétences vérifiées', icon: '✅' },
    { userId: 'seed-fl-09', type: 'FAST_DELIVERY', name: 'Livraison Rapide', description: 'Livre toujours en avance ou à temps', icon: '⚡' },
    { userId: 'seed-fl-12', type: 'VERIFIED', name: 'Vérifié', description: 'Identité et compétences vérifiées', icon: '✅' },
    { userId: 'seed-fl-12', type: 'RISING_STAR', name: 'Étoile Montante', description: 'Progression remarquable sur la plateforme', icon: '🌟' },
  ];

  for (const b of badgesData) {
    const badgeId = `seed-badge-${b.userId}-${b.type}`;
    await prisma.badge.upsert({
      where: { userId_type: { userId: b.userId, type: b.type } },
      update: {},
      create: {
        id: badgeId,
        userId: b.userId,
        type: b.type,
        name: b.name,
        description: b.description,
        icon: b.icon,
        earnedAt: daysAgo(Math.floor(Math.random() * 60) + 10),
      },
    });
  }
  console.log('  ✅ Badges (15)');

  // ═══════════════════════════════════════════
  // CERTIFICATIONS (8)
  // ═══════════════════════════════════════════

  const certificationsData = [
    { id: 'seed-cert-01', userId: 'seed-fl-09', name: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services', issueDate: new Date('2023-06-15'), url: 'https://aws.amazon.com/certification/' },
    { id: 'seed-cert-02', userId: 'seed-fl-05', name: 'Google Data Analytics Professional Certificate', issuer: 'Google', issueDate: new Date('2023-03-20'), url: 'https://grow.google/certificates/data-analytics/' },
    { id: 'seed-cert-03', userId: 'seed-fl-04', name: 'Google Analytics Individual Qualification', issuer: 'Google', issueDate: new Date('2024-01-10'), url: 'https://skillshop.google.com/' },
    { id: 'seed-cert-04', userId: 'seed-fl-01', name: 'Meta Front-End Developer Professional Certificate', issuer: 'Meta', issueDate: new Date('2023-09-05'), url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
    { id: 'seed-cert-05', userId: 'seed-fl-07', name: 'Professional Scrum Master I (PSM I)', issuer: 'Scrum.org', issueDate: new Date('2023-11-18'), url: 'https://www.scrum.org/certifications/professional-scrum-master-i' },
    { id: 'seed-cert-06', userId: 'seed-fl-09', name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Cloud Native Computing Foundation', issueDate: new Date('2024-02-22'), url: 'https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/' },
    { id: 'seed-cert-07', userId: 'seed-fl-05', name: 'TensorFlow Developer Certificate', issuer: 'Google', issueDate: new Date('2023-08-30'), url: 'https://www.tensorflow.org/certificate' },
    { id: 'seed-cert-08', userId: 'seed-fl-03', name: 'React Native – The Complete Guide', issuer: 'Udemy', issueDate: new Date('2022-12-01'), url: 'https://www.udemy.com/' },
  ];

  for (const cert of certificationsData) {
    await prisma.certification.upsert({
      where: { id: cert.id },
      update: {},
      create: {
        id: cert.id,
        userId: cert.userId,
        name: cert.name,
        issuer: cert.issuer,
        issueDate: cert.issueDate,
        url: cert.url,
      },
    });
  }
  console.log('  ✅ Certifications (8)');

  // ═══════════════════════════════════════════
  // EDUCATION (10)
  // ═══════════════════════════════════════════

  const educationData = [
    { id: 'seed-edu-01', userId: 'seed-fl-01', school: 'ENSIAS - École Nationale Supérieure d\'Informatique et d\'Analyse des Systèmes', degree: 'Ingénieur d\'État', field: 'Génie Logiciel', startYear: 2016, endYear: 2019 },
    { id: 'seed-edu-02', userId: 'seed-fl-02', school: 'ENA - École Nationale d\'Architecture', degree: 'Architecte d\'État', field: 'Design & Architecture', startYear: 2017, endYear: 2020 },
    { id: 'seed-edu-03', userId: 'seed-fl-03', school: 'EMI - École Mohammadia d\'Ingénieurs', degree: 'Ingénieur d\'État', field: 'Informatique', startYear: 2015, endYear: 2018 },
    { id: 'seed-edu-04', userId: 'seed-fl-05', school: 'UM6P - Université Mohammed VI Polytechnique', degree: 'Master', field: 'Data Science & Intelligence Artificielle', startYear: 2015, endYear: 2017 },
    { id: 'seed-edu-05', userId: 'seed-fl-07', school: 'EHTP - École Hassania des Travaux Publics', degree: 'Ingénieur d\'État', field: 'Informatique et Modélisation', startYear: 2016, endYear: 2019 },
    { id: 'seed-edu-06', userId: 'seed-fl-09', school: 'INPT - Institut National des Postes et Télécommunications', degree: 'Ingénieur d\'État', field: 'Télécoms et Réseaux', startYear: 2015, endYear: 2018 },
    { id: 'seed-edu-07', userId: 'seed-fl-12', school: 'ENCG - École Nationale de Commerce et de Gestion', degree: 'Master', field: 'Commerce International', startYear: 2016, endYear: 2018 },
    { id: 'seed-edu-08', userId: 'seed-fl-04', school: 'ENSA - École Nationale des Sciences Appliquées', degree: 'Ingénieur d\'État', field: 'Génie Informatique', startYear: 2018, endYear: 2021 },
    { id: 'seed-edu-09', userId: 'seed-fl-08', school: 'ISCAE - Institut Supérieur de Commerce et d\'Administration des Entreprises', degree: 'Master', field: 'Comptabilité, Contrôle et Audit', startYear: 2017, endYear: 2019 },
    { id: 'seed-edu-10', userId: 'seed-fl-06', school: 'Université Mohammed V de Rabat', degree: 'Licence', field: 'Lettres et Sciences Humaines', startYear: 2019, endYear: 2022 },
  ];

  for (const edu of educationData) {
    await prisma.education.upsert({
      where: { id: edu.id },
      update: {},
      create: {
        id: edu.id,
        userId: edu.userId,
        school: edu.school,
        degree: edu.degree,
        field: edu.field,
        startYear: edu.startYear,
        endYear: edu.endYear,
      },
    });
  }
  console.log('  ✅ Education (10)');

  // ═══════════════════════════════════════════
  // SUPPORT TICKETS (4)
  // ═══════════════════════════════════════════

  const ticketsData = [
    { id: 'seed-ticket-01', userId: 'seed-fl-06', subject: 'Problème de vérification de profil', message: 'Bonjour, j\'ai soumis mes documents de vérification il y a 2 semaines mais mon profil n\'est toujours pas vérifié. Pouvez-vous vérifier l\'état de ma demande ?', status: 'RESOLVED' as const, priority: 'MEDIUM' as const },
    { id: 'seed-ticket-02', userId: 'seed-client-03', subject: 'Question sur les crédits', message: 'Bonjour, je souhaite comprendre comment fonctionnent les crédits pour la publication de missions. Combien de crédits faut-il pour une mission featured ?', status: 'RESOLVED' as const, priority: 'LOW' as const },
    { id: 'seed-ticket-03', userId: 'seed-fl-11', subject: 'Paiement non reçu', message: 'Bonjour, la mission "Site vitrine WordPress" est terminée et validée par le client mais je n\'ai toujours pas reçu mon paiement. Cela fait 5 jours. Merci de vérifier.', status: 'OPEN' as const, priority: 'HIGH' as const },
    { id: 'seed-ticket-04', userId: 'seed-client-01', subject: 'Bug affichage dashboard', message: 'Le dashboard ne charge pas correctement sur mobile Safari. Les graphiques sont tronqués et le menu ne fonctionne pas. Version iOS 17.4.', status: 'IN_PROGRESS' as const, priority: 'MEDIUM' as const },
  ];

  for (const t of ticketsData) {
    await prisma.supportTicket.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        userId: t.userId,
        subject: t.subject,
        message: t.message,
        status: t.status,
        priority: t.priority,
        createdAt: daysAgo(Math.floor(Math.random() * 20) + 3),
      },
    });
  }

  // Add replies to resolved tickets
  const ticketRepliesData = [
    { id: 'seed-reply-01', ticketId: 'seed-ticket-01', userId: 'seed-admin-02', message: 'Bonjour Salma, nous avons vérifié vos documents et tout est en ordre. Votre profil est maintenant vérifié. Désolé pour le délai !' },
    { id: 'seed-reply-02', ticketId: 'seed-ticket-02', userId: 'seed-admin-02', message: 'Bonjour Youssef, la publication d\'une mission standard coûte 5 crédits. Pour une mission featured, c\'est 15 crédits. Vous pouvez acheter des crédits depuis votre espace client.' },
    { id: 'seed-reply-03', ticketId: 'seed-ticket-04', userId: 'seed-admin-03', message: 'Merci pour le signalement Karim. Nous avons identifié le bug et un correctif est en cours de déploiement. Il sera disponible d\'ici 24h.' },
  ];

  for (const r of ticketRepliesData) {
    await prisma.ticketReply.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        ticketId: r.ticketId,
        userId: r.userId,
        message: r.message,
        createdAt: daysAgo(Math.floor(Math.random() * 5) + 1),
      },
    });
  }
  console.log('  ✅ Support Tickets (4) & Replies (3)');

  // ═══════════════════════════════════════════
  // CREDIT TRANSACTIONS (8)
  // ═══════════════════════════════════════════

  const creditTxData = [
    { id: 'seed-ctx-01', userId: 'seed-client-01', amount: 100, type: 'PURCHASE' as const, description: 'Achat de 100 crédits', balanceAfter: 100 },
    { id: 'seed-ctx-02', userId: 'seed-client-01', amount: -5, type: 'MISSION_POST' as const, description: 'Publication mission: Site vitrine WordPress pour restaurant', referenceId: 'seed-mission-12', balanceAfter: 95 },
    { id: 'seed-ctx-03', userId: 'seed-client-01', amount: -15, type: 'FEATURED' as const, description: 'Mission featured: Développement application mobile e-commerce', referenceId: 'seed-mission-01', balanceAfter: 80 },
    { id: 'seed-ctx-04', userId: 'seed-client-01', amount: -5, type: 'MISSION_POST' as const, description: 'Publication mission: Stratégie social media', referenceId: 'seed-mission-08', balanceAfter: 75 },
    { id: 'seed-ctx-05', userId: 'seed-client-03', amount: 50, type: 'PURCHASE' as const, description: 'Achat de 50 crédits', balanceAfter: 50 },
    { id: 'seed-ctx-06', userId: 'seed-client-03', amount: -5, type: 'MISSION_POST' as const, description: 'Publication mission: Traduction site web FR/AR/EN', referenceId: 'seed-mission-05', balanceAfter: 45 },
    { id: 'seed-ctx-07', userId: 'seed-client-04', amount: 80, type: 'PURCHASE' as const, description: 'Achat de 80 crédits', balanceAfter: 80 },
    { id: 'seed-ctx-08', userId: 'seed-client-05', amount: 100, type: 'PURCHASE' as const, description: 'Achat de 100 crédits', balanceAfter: 100 },
  ];

  for (const ctx of creditTxData) {
    await prisma.creditTransaction.upsert({
      where: { id: ctx.id },
      update: {},
      create: {
        id: ctx.id,
        userId: ctx.userId,
        amount: ctx.amount,
        type: ctx.type,
        description: ctx.description,
        referenceId: ctx.referenceId || null,
        balanceAfter: ctx.balanceAfter,
        createdAt: daysAgo(Math.floor(Math.random() * 30) + 5),
      },
    });
  }
  console.log('  ✅ Credit Transactions (8)');

  // ═══════════════════════════════════════════
  // FAVORITES (7)
  // ═══════════════════════════════════════════

  const favoritesData = [
    { id: 'seed-fav-01', userId: 'seed-client-01', freelancerId: 'seed-fl-01' },
    { id: 'seed-fav-02', userId: 'seed-client-01', freelancerId: 'seed-fl-03' },
    { id: 'seed-fav-03', userId: 'seed-client-02', freelancerId: 'seed-fl-02' },
    { id: 'seed-fav-04', userId: 'seed-client-03', freelancerId: 'seed-fl-12' },
    { id: 'seed-fav-05', userId: 'seed-client-04', freelancerId: 'seed-fl-05' },
    { id: 'seed-fav-06', userId: 'seed-client-05', freelancerId: 'seed-fl-09' },
    { id: 'seed-fav-07', userId: 'seed-client-05', freelancerId: 'seed-fl-07' },
  ];

  for (const f of favoritesData) {
    await prisma.favorite.upsert({
      where: { userId_freelancerId: { userId: f.userId, freelancerId: f.freelancerId } },
      update: {},
      create: {
        id: f.id,
        userId: f.userId,
        freelancerId: f.freelancerId,
      },
    });
  }
  console.log('  ✅ Favorites (7)');

  // ═══════════════════════════════════════════
  // DISPUTES (2)
  // ═══════════════════════════════════════════

  const disputesData = [
    { id: 'seed-dispute-01', missionId: 'seed-mission-12', openedById: 'seed-fl-11', reason: 'Le client a validé la mission mais le paiement du dernier jalon n\'a pas été libéré depuis 7 jours. J\'ai relancé plusieurs fois sans réponse.', status: 'OPEN' as const, adminNotes: 'En attente de réponse du client. Relance envoyée.' },
    { id: 'seed-dispute-02', missionId: 'seed-mission-10', openedById: 'seed-client-03', reason: 'Le freelancer n\'a pas livré les fichiers source (fichiers .ai et .psd) comme convenu dans le contrat initial.', status: 'RESOLVED' as const, resolution: 'Après médiation, le freelancer a fourni tous les fichiers source. Le client a confirmé la réception. Dispute close.', resolvedAt: daysAgo(15) },
  ];

  for (const d of disputesData) {
    await prisma.dispute.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        missionId: d.missionId,
        openedById: d.openedById,
        reason: d.reason,
        status: d.status,
        adminNotes: d.adminNotes || null,
        resolution: d.resolution || null,
        resolvedAt: d.resolvedAt || null,
        createdAt: daysAgo(d.status === 'RESOLVED' ? 25 : 7),
      },
    });
  }
  console.log('  ✅ Disputes (2)');

  // ═══════════════════════════════════════════
  // PAYMENTS (for completed contracts)
  // ═══════════════════════════════════════════

  const paymentsData = [
    // Contract 05 - Identité visuelle (COMPLETED)
    { id: 'seed-pay-01', contractId: 'seed-contract-05', amount: 6000, fee: 600, netAmount: 5400, status: 'RELEASED' as const, method: 'bank_transfer', escrowedAt: daysAgo(40), releasedAt: daysAgo(20) },
    // Contract 06 - Power BI (COMPLETED)
    { id: 'seed-pay-02', contractId: 'seed-contract-06', amount: 10000, fee: 1000, netAmount: 9000, status: 'RELEASED' as const, method: 'bank_transfer', escrowedAt: daysAgo(45), releasedAt: daysAgo(18) },
    // Contract 07 - WordPress (COMPLETED)
    { id: 'seed-pay-03', contractId: 'seed-contract-07', amount: 4000, fee: 400, netAmount: 3600, status: 'RELEASED' as const, method: 'bank_transfer', escrowedAt: daysAgo(35), releasedAt: daysAgo(19) },
    // Contract 01 - Gestion stock (ACTIVE) - partial escrow
    { id: 'seed-pay-04', contractId: 'seed-contract-01', amount: 5000, fee: 500, netAmount: 4500, status: 'RELEASED' as const, method: 'escrow', escrowedAt: daysAgo(18), releasedAt: daysAgo(10) },
    { id: 'seed-pay-05', contractId: 'seed-contract-01', amount: 8000, fee: 800, netAmount: 7200, status: 'ESCROWED' as const, method: 'escrow', escrowedAt: daysAgo(5) },
    // Contract 02 - Microservices (ACTIVE) - partial
    { id: 'seed-pay-06', contractId: 'seed-contract-02', amount: 5000, fee: 500, netAmount: 4500, status: 'RELEASED' as const, method: 'escrow', escrowedAt: daysAgo(12), releasedAt: daysAgo(5) },
  ];

  for (const p of paymentsData) {
    await prisma.payment.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        contractId: p.contractId,
        amount: p.amount,
        currency: 'MAD',
        fee: p.fee,
        netAmount: p.netAmount,
        status: p.status,
        method: p.method,
        escrowedAt: p.escrowedAt || null,
        releasedAt: p.releasedAt || null,
      },
    });
  }
  console.log('  ✅ Payments (6)');

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
