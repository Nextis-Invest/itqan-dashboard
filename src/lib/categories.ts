export interface SubSubCategory {
  value: string
  label: string
  labelAr?: string
}

export interface SubCategory {
  value: string
  label: string
  labelAr?: string
  children?: SubSubCategory[]
}

export interface Category {
  value: string
  label: string
  labelAr?: string
  icon?: string
  subcategories: SubCategory[]
}

export const categories: Category[] = [
  {
    value: "graphics-design",
    label: "Graphisme & Design",
    labelAr: "التصميم الجرافيكي",
    icon: "🎨",
    subcategories: [
      {
        value: "creative-logo-design",
        label: "Logo Design",
        children: [
        ],
      },
      {
        value: "brand-style-guides",
        label: "Charte graphique",
      },
      {
        value: "game-art",
        label: "Game Art",
        children: [
          { value: "character-design", label: "Character Design" },
          { value: "props-objects-design", label: "Props & Objects" },
          { value: "backgrounds-environments-design", label: "Backgrounds & Environments" },
          { value: "game-ui-ux", label: "UI & UX" },
        ],
      },
      {
        value: "graphics-for-streamers",
        label: "Graphics pour Streamers",
      },
      {
        value: "business-cards-stationery",
        label: "Cartes de visite & Papeterie",
      },
      {
        value: "website-design",
        label: "Design de sites web",
        children: [
          { value: "website-ui-ux-design", label: "UI/UX Design" },
          { value: "website-builders-design", label: "Website Builders Design" },
        ],
      },
      {
        value: "app-design",
        label: "Design d'application",
      },
      {
        value: "ux-design",
        label: "UX Design",
      },
      {
        value: "landing-page-design",
        label: "Landing Page Design",
      },
      {
        value: "resume-design",
        label: "Design de CV",
      },
      {
        value: "digital-illustration",
        label: "Illustration",
      },
      {
        value: "children-book-illustration",
        label: "Illustration livres pour enfants",
      },
      {
        value: "ai-avatar-design",
        label: "AI Avatar Design",
      },
      {
        value: "ai-art-prompt",
        label: "AI Artists",
        children: [
          { value: "image-generation", label: "Image Generation" },
          { value: "custom-image-prompt", label: "Custom Image Prompts" },
          { value: "comfyui-workflow", label: "ComfyUI Workflow Creation" },
        ],
      },
      {
        value: "nft",
        label: "NFT Art",
      },
      {
        value: "pattern-design",
        label: "Pattern Design",
      },
      {
        value: "fonts-typography",
        label: "Fonts & Typographie",
        children: [
          { value: "font-design", label: "Font Design" },
          { value: "typography", label: "Typography" },
          { value: "lettering", label: "Hand Lettering" },
          { value: "calligraphy", label: "Calligraphy" },
        ],
      },
      {
        value: "poster-design",
        label: "Design d'affiche",
      },
      {
        value: "brochure-design",
        label: "Design de brochure",
      },
      {
        value: "flyer-design",
        label: "Design de flyer",
      },
      {
        value: "book-design",
        label: "Design de livre",
        children: [
          { value: "book-layout", label: "Layout & Typesetting" },
          { value: "book-cover", label: "Couverture de livre" },
        ],
      },
      {
        value: "album-cover-design",
        label: "Couverture d'album",
      },
      {
        value: "podcast-cover-art",
        label: "Couverture de podcast",
      },
      {
        value: "product-packaging-design",
        label: "Packaging & Étiquettes",
        children: [
          { value: "packaging", label: "Packaging Design" },
          { value: "label", label: "Label Design" },
          { value: "dieline", label: "Dieline Design" },
        ],
      },
      {
        value: "comic-illustration",
        label: "Illustration BD",
        children: [
          { value: "comic-book-illustration", label: "Comic Book" },
          { value: "comic-panel-strip", label: "Comic Panel & Strip" },
        ],
      },
      {
        value: "storyboards",
        label: "Storyboards",
      },
      {
        value: "art-direction",
        label: "Direction artistique",
      },
      {
        value: "social-media-design",
        label: "Design Social Media",
        children: [
          { value: "headers-covers", label: "Headers & Covers" },
          { value: "social-posts-banners", label: "Posts & Bannières" },
          { value: "thumbnails-design", label: "Thumbnails" },
          { value: "ar-filters-lenses", label: "AR Filters & Lenses" },
        ],
      },
      {
        value: "catalog-design",
        label: "Design de catalogue",
      },
      {
        value: "menu-design",
        label: "Design de menu",
      },
      {
        value: "invitations",
        label: "Design d'invitations",
      },
      {
        value: "portraits-and-caricatures",
        label: "Portraits & Caricatures",
      },
      {
        value: "cartoon-illustration",
        label: "Illustration Cartoon",
      },
      {
        value: "tattoo-design",
        label: "Tattoo Design",
      },
      {
        value: "signage-design",
        label: "Signalétique",
      },
      {
        value: "banner-ads",
        label: "Bannières Web",
      },
      {
        value: "image-editing",
        label: "Retouche photo",
        children: [
          { value: "product-image-editing", label: "Retouche produit" },
          { value: "photo-manipulation", label: "Photo Manipulation" },
          { value: "portraits-retouching", label: "Retouche portrait" },
          { value: "photo-restoration", label: "Restauration photo" },
          { value: "mockups", label: "Mockups" },
        ],
      },
      {
        value: "ai-image-editing",
        label: "Retouche photo IA",
      },
      {
        value: "architectural-design-services",
        label: "Architecture & Design d'intérieur",
        children: [
          { value: "mood-boards-design", label: "Mood Boards" },
          { value: "architectural-graphics-design", label: "Graphisme architectural" },
          { value: "virtual-staging", label: "Virtual Staging" },
          { value: "planning", label: "Planification" },
          { value: "interior-design", label: "Design d'intérieur" },
          { value: "rendering-modeling", label: "3D Modeling & Rendering" },
          { value: "2d-drawings", label: "2D Drawings & Floor Plans" },
        ],
      },
      {
        value: "landscape-design",
        label: "Design paysager",
        children: [
          { value: "landscape-planning", label: "Planning & Design" },
          { value: "landscape-3d", label: "3D Modeling & Rendering" },
          { value: "landscape-2d", label: "2D Drawings & Site Plans" },
        ],
      },
      {
        value: "building-engineering",
        label: "Ingénierie bâtiment",
        children: [
          { value: "hvac-engineering", label: "HVAC" },
          { value: "electrical-engineering", label: "Électrique" },
          { value: "plumbing-and-drainage", label: "Plomberie" },
          { value: "civil-and-structural-engineering", label: "Génie civil & structural" },
          { value: "cost-estimation", label: "Estimation des coûts" },
          { value: "solar-design", label: "Solar PV System" },
          { value: "fire-protection-system", label: "Protection incendie" },
        ],
      },
      {
        value: "bim-services",
        label: "BIM",
        children: [
          { value: "4d-simulation", label: "4D Construction Simulation" },
          { value: "bim-training", label: "Training & Implementation" },
          { value: "family-creation", label: "Family Creation" },
          { value: "bim-coordination", label: "Coordination & Clash Detection" },
          { value: "bim-3d-modeling", label: "3D Modeling" },
        ],
      },
      {
        value: "lighting-design",
        label: "Design d'éclairage",
      },
      {
        value: "character-modeling",
        label: "Character Modeling",
      },
      {
        value: "product-design-services",
        label: "Design produit & industriel",
        children: [
          { value: "concept-development", label: "Concept Development" },
          { value: "product-3d-rendering", label: "3D Modeling & Rendering" },
          { value: "prototyping-3d-printing", label: "Rapid Prototyping" },
          { value: "product-manufacturing", label: "Design for Manufacturing" },
          { value: "product-2d-drawing", label: "Technical Drawing" },
          { value: "full-product-design-process", label: "Full Design Process" },
        ],
      },
      {
        value: "booth-design",
        label: "Design de stand",
      },
      {
        value: "t-shirts",
        label: "T-Shirts & Merch",
      },
      {
        value: "fashion-design",
        label: "Fashion Design",
        children: [
          { value: "fashion-technical-drawing", label: "Technical Drawing & Tech Pack" },
          { value: "pattern-making", label: "Pattern Making" },
          { value: "fashion-illustration", label: "Fashion Illustration" },
          { value: "3d-garments", label: "3D Garment Design" },
          { value: "fashion-full-process", label: "Full Design Process" },
        ],
      },
      {
        value: "jewelry-design",
        label: "Design de bijoux",
        children: [
          { value: "jewelry-3d", label: "3D Modeling & Rendering" },
          { value: "jewelry-concept", label: "Concept Design & Sketching" },
        ],
      },
      {
        value: "presentations-design",
        label: "Design de présentations",
      },
      {
        value: "email-design",
        label: "Design d'emails",
      },
      {
        value: "icon-design",
        label: "Design d'icônes",
      },
      {
        value: "infographics-design",
        label: "Infographies",
      },
      {
        value: "car-wrap-design",
        label: "Car Wraps",
      },
      {
        value: "vector-tracing",
        label: "Vectorisation",
      },
      {
        value: "design-advice",
        label: "Conseil en design",
        children: [
          { value: "design-review-consultation", label: "Review & Consultation" },
          { value: "design-mentorship", label: "Mentorship" },
          { value: "design-lessons", label: "Lessons" },
        ],
      },
      {
        value: "graphics-services",
        label: "Autre (Graphisme)",
      },
    ],
  },
  {
    value: "programming-tech",
    label: "Programmation & Tech",
    labelAr: "البرمجة والتكنولوجيا",
    icon: "💻",
    subcategories: [
      {
        value: "website-development",
        label: "Développement web",
        children: [
          { value: "wordpress-development", label: "WordPress" },
          { value: "shopify-development", label: "Shopify" },
          { value: "wix-development", label: "Wix" },
          { value: "squarespace-development", label: "Squarespace" },
          { value: "webflow-development", label: "Webflow" },
          { value: "bubble-development", label: "Bubble" },
          { value: "woocommerce-development", label: "WooCommerce" },
          { value: "clickfunnels-development", label: "ClickFunnels" },
          { value: "custom-websites-development", label: "Custom Websites" },
          { value: "magento-development", label: "Magento" },
          { value: "drupal-development", label: "Drupal" },
          { value: "prestashop-development", label: "PrestaShop" },
        ],
      },
      {
        value: "website-maintenance",
        label: "Maintenance web",
        children: [
          { value: "web-customization", label: "Customization" },
          { value: "web-bug-fixes", label: "Bug Fixes" },
          { value: "web-backup-migration", label: "Backup & Migration" },
          { value: "web-hosting", label: "Hosting & Domain" },
          { value: "web-plugins", label: "Themes/Plugins Installation" },
          { value: "web-consultation", label: "Help/Consultation" },
          { value: "web-performance", label: "Speed Optimization" },
          { value: "web-security", label: "Security" },
          { value: "web-analytics", label: "Analytics" },
        ],
      },
      {
        value: "software-development",
        label: "Développement logiciel",
        children: [
          { value: "crm-development", label: "CRM & ERP" },
          { value: "web-application", label: "Full Stack Web Apps" },
          { value: "desktop-applications", label: "Desktop Applications" },
          { value: "api-integrations", label: "API & Integrations" },
          { value: "software-bug-fixes", label: "Bug Fixes" },
          { value: "automations-workflows", label: "Automations & Agents" },
          { value: "browser-extension", label: "Browser Extensions" },
          { value: "email-template", label: "Email Template" },
          { value: "convert-psd", label: "Figma to Web & App" },
          { value: "scripting", label: "Scripting" },
          { value: "plugins-development", label: "Plugins Development" },
        ],
      },
      {
        value: "mobile-app-services",
        label: "Développement mobile",
        children: [
          { value: "custom-app", label: "Cross-Platform" },
          { value: "convert-site-to-app", label: "Website to App" },
          { value: "android-development", label: "Android" },
          { value: "ios-development", label: "iOS" },
          { value: "tv-app-development", label: "TV App" },
        ],
      },
      {
        value: "game-development",
        label: "Développement de jeux",
        children: [
          { value: "game-prototyping", label: "Prototyping" },
          { value: "full-game-creation", label: "Full Game Creation" },
          { value: "game-mods", label: "Game Mods" },
          { value: "game-bug-fixes", label: "Bug Fixes" },
          { value: "game-consultation", label: "Consultation" },
        ],
      },
      {
        value: "ai-coding",
        label: "Développement IA",
        children: [
          { value: "ai-applications", label: "AI Mobile Apps" },
          { value: "ai-software-website", label: "AI Websites & Software" },
          { value: "custom-gpts", label: "Custom GPT Apps" },
          { value: "ai-technology-consulting", label: "AI Technology Consulting" },
          { value: "ai-integrations", label: "AI Integrations" },
        ],
      },
      {
        value: "vibe-coding",
        label: "Vibe Coding",
        children: [
          { value: "troubleshooting-improvements", label: "Troubleshooting & Improvements" },
          { value: "development-mvp", label: "Development & MVP" },
          { value: "deployments-devops", label: "Deployments & DevOps" },
          { value: "vibe-consultation-training", label: "Consultation & Training" },
        ],
      },
      {
        value: "chatbots",
        label: "Chatbot Development",
        children: [
          { value: "rule-based-chatbots", label: "Rule Based Chatbots" },
          { value: "ai-chatbot-development", label: "AI Chatbot Development" },
        ],
      },
      {
        value: "cloud",
        label: "Cloud Computing",
        children: [
          { value: "cloud-consultation", label: "Cloud Consultation" },
          { value: "cloud-network-security", label: "Cloud Network & Security" },
          { value: "cloud-management", label: "Cloud Management" },
          { value: "serverless", label: "Serverless Computing" },
        ],
      },
      {
        value: "devops",
        label: "DevOps Engineering",
        children: [
          { value: "infra-as-code", label: "Infra as Code" },
          { value: "ci-cd", label: "CI/CD" },
          { value: "containerization", label: "Containerization" },
          { value: "devops-consulting", label: "DevOps Consulting" },
        ],
      },
      {
        value: "support-it-services",
        label: "Support & IT",
        children: [
          { value: "technical-support", label: "Technical Support" },
          { value: "server-administrations", label: "Server Administration" },
          { value: "email-management", label: "Email Management" },
          { value: "voip-telephony", label: "VoIP and Telephony" },
          { value: "platform-migrations", label: "Platform Migrations" },
        ],
      },
      {
        value: "cryptocurrencies-tokens",
        label: "Crypto & Tokens",
        children: [
          { value: "e-wallet-development", label: "E-Wallet Development" },
          { value: "coin-design-tokenization", label: "Coin Design & Tokenization" },
          { value: "cryptocurrency-trading-platforms", label: "Exchange Platforms" },
          { value: "smart-contracts", label: "Smart Contracts" },
        ],
      },
      {
        value: "blockchain-cryptocurrency",
        label: "Blockchain Solutions",
        children: [
          { value: "chain-analysis", label: "Chain Analysis" },
          { value: "blockchain-protocol", label: "Protocol Development" },
          { value: "blockchain-security-audits", label: "Security & Audits" },
          { value: "decentralized-application", label: "dApps" },
        ],
      },
      {
        value: "mobile-app-maintenance",
        label: "Maintenance mobile",
        children: [
          { value: "mobile-customization", label: "Customization" },
          { value: "mobile-bug-fixes", label: "Bug Fixes" },
          { value: "mobile-consultation", label: "Consultation" },
          { value: "store-management", label: "Store Management" },
        ],
      },
      {
        value: "electronics-engineering",
        label: "Électronique",
        children: [
          { value: "industrial-automation", label: "Industrial Automation" },
          { value: "embedded-systems-iot", label: "Embedded Systems & IoT" },
          { value: "pcb", label: "Printed Circuit Boards (PCB)" },
        ],
      },
      {
        value: "cybersecurity-data-protection",
        label: "Cybersécurité",
        children: [
          { value: "cybersecurity-consultation", label: "Consultation" },
          { value: "compliance-services", label: "Compliance Services" },
          { value: "assessment-penetration-test", label: "Assessment & Penetration Test" },
          { value: "cybersecurity-management", label: "Cybersecurity Management" },
        ],
      },
      {
        value: "online-coding-lessons",
        label: "Cours de code en ligne",
      },
      {
        value: "wearable-app-development",
        label: "Wearable & VR/AR",
        children: [
          { value: "smartwatch-development", label: "Smartwatch" },
          { value: "vr-development", label: "VR & AR Development" },
        ],
      },
      {
        value: "qa-services",
        label: "QA & Review",
        children: [
          { value: "design-review", label: "Design Review" },
          { value: "code-review", label: "Code Review" },
          { value: "software-testing", label: "Software Testing" },
        ],
      },
      {
        value: "user-testing-services",
        label: "User Testing",
      },
      {
        value: "trading-bots-development",
        label: "Trading Bots",
      },
      {
        value: "programming-services",
        label: "Autre (Tech)",
      },
    ],
  },
  {
    value: "online-marketing",
    label: "Marketing Digital",
    labelAr: "التسويق الرقمي",
    icon: "📈",
    subcategories: [
      {
        value: "social-marketing",
        label: "Social Media Marketing",
        children: [
          { value: "profile-setup-integration", label: "Profile Setup & Integration" },
          { value: "social-content", label: "Social Content" },
          { value: "social-media-management", label: "Social Media Management" },
          { value: "analytics-tracking", label: "Analytics & Tracking" },
          { value: "paid-social-media", label: "Paid Social Media" },
          { value: "social-media-strategy", label: "Social Media Strategy" },
          { value: "organic-social-media", label: "Organic Social Promotions" },
        ],
      },
      {
        value: "seo-services",
        label: "SEO",
        children: [
          { value: "keyword-research", label: "Keyword Research" },
          { value: "on-page-seo", label: "On-Page SEO" },
          { value: "voice-search-optimization", label: "Voice Search SEO" },
          { value: "seo-strategy", label: "SEO Strategy" },
          { value: "technical-seo", label: "Technical SEO" },
          { value: "off-page-seo", label: "Off-Page SEO" },
          { value: "competitor-analysis", label: "Competitor Analysis" },
          { value: "seo-packages", label: "Full SEO Package" },
        ],
      },
      {
        value: "generative-engine-optimization",
        label: "Generative Engine Optimization (GEO)",
      },
      {
        value: "guest-posting-services",
        label: "Guest Posting",
      },
      {
        value: "public-relations",
        label: "Relations publiques",
        children: [
          { value: "pr-consulting", label: "Consultation" },
          { value: "event-strategy", label: "Events & Conferences" },
          { value: "press-release-distribution", label: "Press Release Pitching" },
          { value: "pr-strategic-planning", label: "Strategy & Planning" },
        ],
      },
      {
        value: "book-marketing-services",
        label: "Book & eBook Marketing",
      },
      {
        value: "podcast-marketing",
        label: "Podcast Marketing",
        children: [
          { value: "podcast-promotion", label: "Podcast Promotion" },
          { value: "podcast-advertising", label: "Advertising within Podcasts" },
        ],
      },
      {
        value: "online-video-marketing",
        label: "Video Marketing",
        children: [
          { value: "youtube-channel-management", label: "YouTube Channel Management" },
          { value: "consultation-audience-research", label: "Consultation & Audience Research" },
          { value: "video-seo", label: "Video SEO" },
          { value: "online-video-advertising", label: "Online Video Advertising" },
          { value: "video-promotion-distribution", label: "Organic Promotion" },
          { value: "youtube-monetization", label: "YouTube Monetization" },
          { value: "live-video-streaming", label: "Live Video Streaming" },
        ],
      },
      {
        value: "email-marketing",
        label: "Email Marketing",
        children: [
          { value: "campaign-management", label: "Campaign Management" },
          { value: "ai-email-marketing-personalization", label: "Email Personalization" },
          { value: "email-automation", label: "Email Automations" },
          { value: "email-platform-support", label: "Email Platform Support" },
          { value: "audience-development", label: "Audience Development" },
          { value: "cold-emailing", label: "Cold Emails" },
        ],
      },
      {
        value: "search-engine-marketing",
        label: "SEM / Google Ads",
        children: [
          { value: "sem-setup-strategy", label: "Setup & Strategy" },
          { value: "sem-management", label: "SEM Management" },
          { value: "shopping-ads", label: "Shopping Ads" },
          { value: "ad-review-optimization", label: "Ad Review & Optimization" },
        ],
      },
      {
        value: "display-advertising",
        label: "Display Advertising",
        children: [
          { value: "display-campaign-management", label: "Campaign Setup & Management" },
          { value: "display-optimization", label: "Ad Review & Optimization" },
          { value: "retargeting", label: "Retargeting" },
          { value: "native-advertising", label: "Native Advertising" },
          { value: "audio-advertising", label: "Audio Advertising" },
        ],
      },
      {
        value: "influencer-marketing",
        label: "Marketing d'influence",
        children: [
          { value: "influencer-strategy-research", label: "Strategy & Research" },
          { value: "shoutouts-promotion", label: "Shoutouts & Promotion" },
          { value: "influencer-management", label: "Influencer Management" },
          { value: "long-term-collaborations", label: "Long-Term Collaborations" },
        ],
      },
      {
        value: "community-management",
        label: "Community Management",
        children: [
          { value: "community-plan-strategy", label: "Planning, Strategy & Setup" },
          { value: "community-sourcing", label: "Sourcing & Recruitment" },
          { value: "community-monetizing", label: "Growth & Monetization" },
          { value: "community-manager", label: "Management & Engagement" },
          { value: "social-listening", label: "Social Listening" },
          { value: "event-marketing", label: "Event Marketing" },
        ],
      },
      {
        value: "local-seo-services",
        label: "SEO Local",
        children: [
          { value: "google-my-business", label: "Google Business Profile" },
          { value: "local-citation", label: "Local Citations & Directories" },
        ],
      },
      {
        value: "e-commerce-marketing",
        label: "E-Commerce Marketing",
        children: [
          { value: "promoted-listings", label: "Promoted Listings" },
          { value: "e-commerce-strategy", label: "E-Commerce Strategy" },
          { value: "ecommerce-seo-services", label: "E-Commerce SEO" },
          { value: "website-promotion", label: "Website Promotion" },
        ],
      },
      {
        value: "affiliate-marketing",
        label: "Marketing d'affiliation",
        children: [
          { value: "affiliate-recruitment", label: "Affiliates Recruitment" },
          { value: "affiliate-funnel", label: "Monetization & Funnels" },
          { value: "affiliate-links-promotion", label: "Affiliate Link Promotion" },
          { value: "affiliate-programs", label: "Affiliate Program Management" },
          { value: "affiliate-program-setup", label: "Program Strategy & Setup" },
          { value: "affiliate-marketing-consultation", label: "Consultation" },
        ],
      },
      {
        value: "mobile-app-marketing",
        label: "Marketing d'apps",
        children: [
          { value: "app-store-optimization", label: "App Store Optimization" },
          { value: "app-promotion", label: "App Promotion" },
        ],
      },
      {
        value: "music-promotion",
        label: "Music Promotion",
        children: [
          { value: "organic-music-promotion", label: "Organic Promotion" },
          { value: "paid-music-advertising", label: "Paid Advertising" },
          { value: "music-streaming-services", label: "Music Streaming Services" },
          { value: "music-playlists-placements", label: "Playlists and Placements" },
        ],
      },
      {
        value: "conversion-rate-optimization",
        label: "CRO",
      },
      {
        value: "web-analytics-services",
        label: "Web Analytics",
        children: [
          { value: "analytics-setup", label: "Setup" },
          { value: "tracking-reporting", label: "Tracking & Reporting" },
          { value: "analytics-optimization", label: "Optimization" },
        ],
      },
      {
        value: "marketing-strategy",
        label: "Stratégie marketing",
        children: [
          { value: "marketing-consulting", label: "Marketing Consulting" },
          { value: "ai-marketing-prompt-strategy", label: "AI Marketing Prompt Strategy" },
          { value: "digital-marketing-strategy", label: "Digital Marketing Strategy" },
          { value: "brand-strategy", label: "Brand Strategy" },
          { value: "ai-brand-personality-design", label: "Brand Personality Design" },
          { value: "abm-strategy", label: "ABM Strategy" },
          { value: "omnichannel", label: "Omnichannel Strategy" },
          { value: "retention-strategy", label: "CRM & Retention Strategy" },
          { value: "ugc-strategy", label: "UGC Strategy" },
        ],
      },
      {
        value: "marketing-automation",
        label: "Marketing Automation",
        children: [
          { value: "ppc-automation", label: "PPC Automation" },
          { value: "sm-automation", label: "Social Media Automation" },
          { value: "analytics-automation", label: "Analytics & Reporting Automation" },
          { value: "ai-powered-campaign-management", label: "AI-Powered Campaign Management" },
          { value: "ai-ad-bidding-automation", label: "AI-Powered Ad Bidding" },
        ],
      },
      {
        value: "social-commerce",
        label: "Social Commerce",
        children: [
          { value: "social-commerce-setup", label: "Setup & Integration" },
          { value: "social-commerce-maintenance", label: "Maintenance" },
          { value: "social-commerce-analytics", label: "Analytics & Reporting" },
        ],
      },
      {
        value: "text-message-marketing",
        label: "SMS Marketing",
      },
      {
        value: "crowdfunding",
        label: "Crowdfunding",
        children: [
          { value: "crowdfunding-campaign-marketing", label: "Campaign Marketing" },
          { value: "crowdfunding-campaign-creation", label: "Campaign Creation" },
        ],
      },
      {
        value: "conscious-branding",
        label: "Branding éthique",
        children: [
          { value: "sustainability-marketing", label: "Sustainability & Social Responsibility" },
          { value: "multicultural-marketing", label: "Diversity & Inclusion Marketing" },
          { value: "employer-branding-strategy", label: "Employer Branding" },
          { value: "occasion-based-marketing", label: "Occasion-Based Marketing" },
        ],
      },
      {
        value: "marketing-tips-and-advice",
        label: "Conseil marketing",
        children: [
          { value: "marketing-mentors", label: "Marketing Mentorship" },
          { value: "marketing-lessons", label: "Marketing Lessons" },
        ],
      },
      {
        value: "website-traffic",
        label: "Web Traffic",
      },
      {
        value: "marketing-concepts-and-ideation",
        label: "Marketing Concepts & Ideation",
      },
      {
        value: "online-marketing-services",
        label: "Autre (Marketing)",
      },
    ],
  },
  {
    value: "video-animation",
    label: "Vidéo & Animation",
    labelAr: "الفيديو والرسوم المتحركة",
    icon: "🎬",
    subcategories: [
      {
        value: "animated-explainer-videos",
        label: "Vidéos explicatives animées",
        children: [
          { value: "2d-explainers", label: "2D" },
          { value: "3d-explainers", label: "3D" },
          { value: "isometric-explainers", label: "Isometric" },
          { value: "whiteboard-animation", label: "Whiteboard Animation" },
        ],
      },
      {
        value: "video-editing",
        label: "Montage vidéo",
      },
      {
        value: "short-video-ads",
        label: "Vidéos publicitaires",
      },
      {
        value: "animated-gifs",
        label: "GIFs animés",
      },
      {
        value: "logo-animation-services",
        label: "Animation de logo",
      },
      {
        value: "ugc-videos",
        label: "UGC Videos",
        children: [
          { value: "human-ugc", label: "Human UGC" },
          { value: "ai-ugc", label: "AI UGC" },
        ],
      },
      {
        value: "video-intro-and-outro",
        label: "Intro & Outro",
      },
      {
        value: "animated-characters-modeling",
        label: "Character Animation",
      },
      {
        value: "3d-product-animation",
        label: "3D Product Animation",
      },
      {
        value: "social-media-videos",
        label: "Vidéos Social Media",
      },
      {
        value: "music-videos",
        label: "Clips musicaux",
        children: [
          { value: "lyric-videos", label: "Lyric Videos" },
          { value: "music-visualization", label: "Music Visualization" },
          { value: "dance-videos", label: "Dance Videos" },
          { value: "narrative-videos", label: "Narrative-Based" },
          { value: "performance-videos", label: "Performance Videos" },
          { value: "conceptual-videos", label: "Conceptual Videos" },
          { value: "anime-music-videos", label: "Anime Music Videos" },
          { value: "spotify-canvas", label: "Spotify Canvas" },
        ],
      },
      {
        value: "animation-for-kids",
        label: "Animation pour enfants",
      },
      {
        value: "video-art",
        label: "Video Art",
        children: [
          { value: "experimental-video-art", label: "Experimental" },
          { value: "ai-video-art", label: "AI Video Art" },
          { value: "image-animation", label: "Image Animation" },
          { value: "video-installations", label: "Video Installations" },
        ],
      },
      {
        value: "ai-videography",
        label: "AI Videography",
      },
      {
        value: "text-animation",
        label: "Text Animation",
      },
      {
        value: "filmed-video-production",
        label: "Production vidéo filmée",
      },
      {
        value: "live-action-videos",
        label: "Live Action Explainers",
      },
      {
        value: "videographers",
        label: "Vidéographes",
      },
      {
        value: "drone-videography",
        label: "Vidéo drone",
      },
      {
        value: "ecommerce-product-videos",
        label: "Vidéos produit e-commerce",
      },
      {
        value: "buy-spokesperson-video",
        label: "Vidéos porte-parole",
      },
      {
        value: "subtitles-captions",
        label: "Sous-titres",
        children: [
          { value: "professional-subtitle", label: "Subtitles" },
          { value: "creative-captions", label: "Social Media Captions" },
        ],
      },
      {
        value: "visual-effects",
        label: "Effets visuels (VFX)",
        children: [
          { value: "rotoscoping-keying", label: "Rotoscoping & Chroma Keying" },
          { value: "color-grading", label: "Color Grading" },
          { value: "match-moving", label: "Match Moving" },
          { value: "video-compositing", label: "Compositing" },
          { value: "cleanups", label: "Cleanups" },
          { value: "beauty-retouching", label: "Beauty Retouching" },
        ],
      },
      {
        value: "website-animation",
        label: "Lottie & Web Animation",
      },
      {
        value: "elearning-video-production",
        label: "Vidéo eLearning",
      },
      {
        value: "article-to-video",
        label: "Article to Video",
      },
      {
        value: "screencasting-videos",
        label: "Screencasting",
      },
      {
        value: "rigging",
        label: "Rigging",
        children: [
          { value: "3d-rigging", label: "3D Rigging" },
          { value: "2d-rigging", label: "2D Rigging" },
        ],
      },
      {
        value: "corporate-videos",
        label: "Vidéos corporate",
      },
      {
        value: "video-repurposing",
        label: "Video Repurposing",
      },
      {
        value: "slideshow-videos",
        label: "Diaporamas vidéo",
      },
      {
        value: "virtual-streaming-avatars",
        label: "Avatars virtuels & streaming",
        children: [
          { value: "vtuber", label: "Vtuber Avatars" },
          { value: "ai-avatars", label: "AI Avatars" },
          { value: "vr-metaverse-avatars", label: "VR & Metaverse Avatars" },
        ],
      },
      {
        value: "game-trailers",
        label: "Game Trailers",
      },
      {
        value: "video-advice",
        label: "Conseil vidéo",
        children: [
          { value: "video-review-consultation", label: "Review & Consultation" },
          { value: "video-mentorship", label: "Mentorship" },
          { value: "video-lessons", label: "Lessons" },
        ],
      },
      {
        value: "video-services",
        label: "Autre (Vidéo)",
      },
    ],
  },
  {
    value: "writing-translation",
    label: "Rédaction & Traduction",
    labelAr: "الكتابة والترجمة",
    icon: "✍️",
    subcategories: [
      {
        value: "articles-blogposts",
        label: "Articles & Blog Posts",
        children: [
          { value: "seo-writing", label: "SEO Writing" },
          { value: "promotional-articles", label: "Promotional Articles" },
          { value: "lifestyle-blogs", label: "Lifestyle Blogs" },
          { value: "professional-industry-articles", label: "Professional Industry Articles" },
          { value: "informative-educational-articles", label: "Informative & Educational" },
          { value: "bulk-articles", label: "Bulk Articles" },
        ],
      },
      {
        value: "proofreading-editing",
        label: "Relecture & Édition",
        children: [
          { value: "ai-content-editing", label: "AI Content Editing" },
          { value: "citation", label: "Citation" },
          { value: "proofreading-services", label: "Proofreading" },
          { value: "copy-editing-services", label: "Copy Editing" },
          { value: "review-and-rewrite", label: "Review & Rewrite" },
          { value: "formatting", label: "Formatting" },
        ],
      },
      {
        value: "quality-translation-services",
        label: "Traduction",
      },
      {
        value: "website-content",
        label: "Contenu de site web",
      },
      {
        value: "product-description",
        label: "Descriptions produit",
      },
      {
        value: "book-and-ebook-writing",
        label: "Écriture de livres & eBooks",
        children: [
          { value: "kindle-niche-research", label: "Kindle Niche Research" },
          { value: "short-stories", label: "Short Stories" },
          { value: "book-proposal", label: "Book Proposals" },
          { value: "book-blurb", label: "Book Blurbs" },
          { value: "ghostwriting", label: "Ghostwriting" },
        ],
      },
      {
        value: "book-editing",
        label: "Book Editing",
        children: [
          { value: "developmental-editing", label: "Developmental Editing" },
          { value: "line-editing", label: "Line Editing" },
        ],
      },
      {
        value: "resume-writing",
        label: "Rédaction de CV",
      },
      {
        value: "tone-of-voice",
        label: "Brand Voice & Tone",
      },
      {
        value: "ux-writing",
        label: "UX Writing",
      },
      {
        value: "email-copy",
        label: "Email Copy",
      },
      {
        value: "technical-writing-services",
        label: "Rédaction technique",
      },
      {
        value: "custom-writing-prompts",
        label: "Custom Writing Prompts",
        children: [
          { value: "technical-writing-prompts", label: "Technical Writing Prompts" },
          { value: "copywriting-prompts", label: "Copywriting Prompts" },
          { value: "creative-writing-prompts", label: "Creative Writing Prompts" },
          { value: "blogging-and-content-prompts", label: "Blogging & Content Prompts" },
        ],
      },
      {
        value: "content-strategy",
        label: "Stratégie de contenu",
      },
      {
        value: "localization",
        label: "Localisation",
      },
      {
        value: "white-papers",
        label: "White Papers",
      },
      {
        value: "sales-copy",
        label: "Sales Copy",
      },
      {
        value: "social-media-copywriting",
        label: "Copywriting Social Media",
        children: [
          { value: "posts-and-captions", label: "Posts & Captions" },
          { value: "social-media-video-scripts", label: "Video Scripts" },
          { value: "long-posts-and-articles", label: "Long Posts & Articles" },
          { value: "social-media-bios", label: "Social Media Bios" },
        ],
      },
      {
        value: "podcast",
        label: "Podcast Writing",
        children: [
          { value: "podcast-content-creation", label: "Podcast Content" },
          { value: "podcast-show-notes", label: "Show Notes" },
        ],
      },
      {
        value: "ad-copy",
        label: "Ad Copy",
      },
      {
        value: "cover-letter-services",
        label: "Lettres de motivation",
      },
      {
        value: "writing-press-releases",
        label: "Communiqués de presse",
      },
      {
        value: "case-study-writing",
        label: "Études de cas",
      },
      {
        value: "linkedin-profile-services",
        label: "Profils LinkedIn",
      },
      {
        value: "creative-writing",
        label: "Écriture créative",
        children: [
          { value: "video-game-writing", label: "Game Writing" },
          { value: "poetry-writing", label: "Poetry" },
          { value: "lyric-writing", label: "Song Lyrics" },
          { value: "letter-writing", label: "Letters" },
        ],
      },
      {
        value: "script-writing",
        label: "Scénarisation",
        children: [
          { value: "webinar-script", label: "Webinars" },
          { value: "cold-call-script", label: "Cold Calls" },
          { value: "audio-script", label: "Audio Ads" },
          { value: "script-coverage", label: "Script Coverage" },
          { value: "tv-and-movie-scripts", label: "Film & TV Screenplays" },
          { value: "chatbot-conversation-scripts", label: "Chatbot Scripts" },
          { value: "video-script", label: "Video Scripts" },
        ],
      },
      {
        value: "business-names-and-slogans",
        label: "Noms d'entreprise & Slogans",
      },
      {
        value: "elearning-content-development",
        label: "Contenu eLearning",
      },
      {
        value: "speech-writing",
        label: "Speechwriting",
        children: [
          { value: "motivational-speeches", label: "Motivational" },
          { value: "academic-speeches", label: "Academic" },
          { value: "business-speeches", label: "Business" },
          { value: "event-speeches", label: "Event" },
        ],
      },
      {
        value: "grant-writing-services",
        label: "Grant Writing",
        children: [
          { value: "grant-research", label: "Grant Research" },
          { value: "grant-proposal", label: "Grant Proposals" },
        ],
      },
      {
        value: "transcription",
        label: "Transcription",
      },
      {
        value: "research-summaries",
        label: "Recherche & Résumés",
      },
      {
        value: "beta-reader",
        label: "Beta Reading",
      },
      {
        value: "interpretation",
        label: "Interprétation",
      },
      {
        value: "academic-support",
        label: "Support académique",
        children: [
          { value: "academic-writing-revision", label: "Academic Writing Revision" },
          { value: "essay-structuring-formatting", label: "Essay Structuring & Formatting" },
          { value: "research-source-structuring", label: "Research Source Structuring" },
          { value: "academic-writing-guidance", label: "Academic Writing Guidance" },
        ],
      },
      {
        value: "writing-tips-and-advice",
        label: "Conseil rédaction",
        children: [
          { value: "writing-mentor", label: "Writing Mentorship" },
          { value: "writing-lessons", label: "Writing Lessons" },
        ],
      },
      {
        value: "writing-services",
        label: "Autre (Rédaction)",
      },
    ],
  },
  {
    value: "music-audio",
    label: "Musique & Audio",
    labelAr: "الموسيقى والصوت",
    icon: "🎵",
    subcategories: [
      { value: "voice-overs", label: "Voice Over" },
      {
        value: "mixing-mastering",
        label: "Mixing & Mastering",
        children: [
          { value: "music-mixing", label: "Mixing" },
          { value: "music-mastering", label: "Mastering" },
          { value: "dolby-atmos-immersive-audio", label: "Dolby Atmos & Immersive Audio" },
        ],
      },
      {
        value: "producers",
        label: "Music Producers",
        children: [
          { value: "ghost-production", label: "Ghost Production" },
          { value: "beat-making", label: "Beat Making" },
          { value: "backing-tracks", label: "Backing Tracks" },
          { value: "remixing", label: "Remixing" },
        ],
      },
      {
        value: "composers",
        label: "Composers",
        children: [
          { value: "film-composers", label: "Film & Soundtrack" },
          { value: "video-game-composers", label: "Game Composers" },
          { value: "musical-theater-composers", label: "Musical Theater" },
          { value: "arranging", label: "Music Arrangement" },
        ],
      },
      {
        value: "singers-vocalists",
        label: "Singers & Vocalists",
        children: [
          { value: "male-singers", label: "Male Singers" },
          { value: "female-singers", label: "Female Singers" },
          { value: "gender-neutral-singers", label: "Gender Neutral" },
          { value: "choir-gospel-singers", label: "Choir & Gospel" },
        ],
      },
      {
        value: "session-musicians",
        label: "Session Musicians",
        children: [
          { value: "guitar", label: "Guitar" },
          { value: "drums-percussion", label: "Drums & Percussion" },
          { value: "bass", label: "Bass" },
          { value: "piano-keys", label: "Piano & Keys" },
          { value: "strings", label: "Strings" },
          { value: "brass-woodwind", label: "Brass & Woodwind" },
        ],
      },
      { value: "songwriters", label: "Songwriters" },
      { value: "podcast-editing", label: "Podcast Production" },
      {
        value: "sound-design",
        label: "Sound Design",
        children: [
          { value: "sound-effects", label: "Sound Effects" },
          { value: "foley", label: "Foley" },
        ],
      },
      { value: "audiobook-production", label: "Audiobook Production" },
      {
        value: "online-music-lessons",
        label: "Cours de musique",
        children: [
          { value: "instruments-lessons", label: "Instruments" },
          { value: "production-lessons", label: "Production" },
          { value: "vocals-lessons", label: "Vocals" },
          { value: "theory-lessons", label: "Theory" },
        ],
      },
      { value: "audio-editing", label: "Audio Editing" },
      { value: "audio-ads-production", label: "Audio Ads Production" },
      { value: "music-transcription", label: "Music Transcription" },
      { value: "vocal-tuning", label: "Vocal Tuning" },
      { value: "custom-songs", label: "Custom Songs" },
      {
        value: "dj-drops-tags",
        label: "DJ Drops & Tags",
        children: [
          { value: "dj-drops", label: "DJ Drops" },
          { value: "producer-tags", label: "Producer Tags" },
        ],
      },
      {
        value: "dj-mixing",
        label: "DJ Mixing",
        children: [
          { value: "dj-sets", label: "DJ Sets" },
          { value: "mashups", label: "Mashups" },
          { value: "scratching", label: "Scratching" },
        ],
      },
      {
        value: "custom-patches-samples",
        label: "Custom Patches & Samples",
        children: [
          { value: "synth-presets", label: "Synth & Instrument Presets" },
          { value: "daw-presets", label: "DAW & Software Presets" },
          { value: "loops-samples", label: "Loops & Samples" },
        ],
      },
      { value: "meditation-music", label: "Meditation Music" },
      {
        value: "jingles-intros",
        label: "Jingles & Intros",
        children: [
          { value: "jingles", label: "Jingles" },
          { value: "intros-and-outros", label: "Intros & Outros" },
        ],
      },
      { value: "audio-logo-sonic-branding", label: "Audio Logo & Sonic Branding" },
      {
        value: "voice-synthesis-ai",
        label: "Voice Synthesis & AI",
        children: [
          { value: "text-to-speech", label: "Text-to-Speech" },
          { value: "voice-cloning", label: "Custom AI Voices" },
          { value: "speech-recognition", label: "Speech Recognition" },
        ],
      },
      { value: "audio-plugin-development", label: "Audio Plugin Development" },
      {
        value: "advice",
        label: "Conseil musique & audio",
        children: [
          { value: "music-mentorship", label: "Mentorship" },
          { value: "music-review-feedback", label: "Review & Feedback" },
        ],
      },
      { value: "music-audio-services", label: "Autre (Musique)" },
    ],
  },
  {
    value: "business",
    label: "Business",
    labelAr: "الأعمال",
    icon: "💼",
    subcategories: [
      {
        value: "legal-consulting-services",
        label: "Conseil juridique",
        children: [
          { value: "business-contracts", label: "Business & Commercial Contracts" },
          { value: "legal-research", label: "Legal Research" },
          { value: "legal-documents", label: "Legal Documents & Review" },
          { value: "legal-advice", label: "General Legal Advice" },
          { value: "legal-disputes", label: "Dispute Resolution" },
        ],
      },
      {
        value: "ecommerce-management",
        label: "E-Commerce Management",
        children: [
          { value: "ecommerce-consultation", label: "Consultation" },
          { value: "ecommerce-store-setup", label: "Store Setup" },
          { value: "product-upload", label: "Product Upload" },
          { value: "ecommerce-store-management", label: "Store Management" },
          { value: "product-research", label: "Product Research" },
        ],
      },
      {
        value: "sales",
        label: "Vente",
        children: [
          { value: "sales-strategy-planning", label: "Strategy & Planning" },
          { value: "lead-generation-services", label: "Lead Generation" },
          { value: "gtm-engineering", label: "GTM Engineering" },
          { value: "lead-qualification-services", label: "Lead Qualification" },
          { value: "deal-negotiation", label: "Deal Development" },
        ],
      },
      {
        value: "business-registration",
        label: "Création d'entreprise",
        children: [
          { value: "structure-consultation", label: "Business Structure Consultation" },
          { value: "document-preparation", label: "Document Preparation" },
          { value: "tax-setup", label: "Tax Setup & EIN Application" },
          { value: "registration", label: "Business Registration" },
          { value: "compliance-ongoing", label: "Compliance & Ongoing Requirements" },
        ],
      },
      {
        value: "intellectual-property-management",
        label: "Propriété intellectuelle",
        children: [
          { value: "patent-trademark-search", label: "Patent & Trademark Search" },
          { value: "filing-registration", label: "Filing & Registration" },
          { value: "patent-licensing", label: "Patent Licensing & Monetization" },
          { value: "trademark-monitoring", label: "Trademark Monitoring & Enforcement" },
          { value: "infringement-dmca", label: "Infringement Protection & DMCA" },
          { value: "ip-consulting", label: "IP Consulting" },
        ],
      },
      {
        value: "virtual-assistant-services",
        label: "Assistant virtuel",
        children: [
          { value: "messaging-emailing", label: "Messaging & Emailing" },
          { value: "research-assistant", label: "Research Assistant" },
          { value: "file-conversion", label: "File Conversion" },
          { value: "template-docs-formatting", label: "Template Docs & Formatting" },
          { value: "general-assistance", label: "General Assistance" },
          { value: "fact-checking", label: "Fact Checking" },
        ],
      },
      {
        value: "business-plans",
        label: "Business Plans",
        children: [
          { value: "business-plans-startups", label: "Pour Startups" },
          { value: "business-plans-loan", label: "Pour Prêt bancaire" },
          { value: "business-plans-non-profits", label: "Pour Non-Profits" },
          { value: "business-plans-immigration", label: "Pour Immigration" },
          { value: "business-plans-partnerships", label: "Pour Partnerships" },
        ],
      },
      {
        value: "market-research-reports",
        label: "Études de marché",
        children: [
          { value: "qual-quant-research", label: "Full Package Qual & Quant" },
          { value: "interviews-focus-groups", label: "Interviews & Focus Groups" },
          { value: "domain-name-research", label: "Domain Name Research" },
          { value: "online-research-service", label: "General Online Research" },
          { value: "market-research-consulting", label: "Consultation" },
          { value: "online-survey", label: "Surveys" },
        ],
      },
      {
        value: "business-tips",
        label: "Business Consulting",
        children: [
          { value: "business-strategy-innovation", label: "Strategy & Innovation" },
          { value: "business-efficiency-automation", label: "Efficiency & Automation" },
          { value: "risk-management", label: "Risk Management" },
          { value: "digital-transformation-consulting", label: "Digital Transformation" },
        ],
      },
      {
        value: "online-presentations",
        label: "Présentations",
        children: [
          { value: "pitch-decks", label: "Pitch Decks" },
          { value: "course-presentations", label: "Course Presentations" },
          { value: "business-presentations", label: "Business Presentations" },
        ],
      },
      { value: "project-management", label: "Project Management" },
      {
        value: "software-management",
        label: "Software Management",
        children: [
          { value: "crm-management", label: "CRM Management" },
          { value: "project-management-software", label: "Project Management Software" },
          { value: "erp-management", label: "ERP Management" },
        ],
      },
      {
        value: "hr-consulting",
        label: "RH Consulting",
        children: [
          { value: "organizational-development", label: "Organizational Development" },
          { value: "recruiting", label: "Talent Acquisition & Recruitment" },
          { value: "performance-management", label: "Performance Management" },
          { value: "employee-learning-development", label: "Employee Learning & Development" },
          { value: "compensation-benefits", label: "Compensation & Benefits" },
          { value: "hr-information-systems", label: "HR Information Systems" },
        ],
      },
      {
        value: "customer-care",
        label: "Customer Care",
        children: [
          { value: "customer-support", label: "Customer Support" },
          { value: "customer-plan", label: "Planning & Setup" },
          { value: "customer-consulting", label: "Consulting" },
          { value: "customer-success", label: "Customer Success" },
        ],
      },
      {
        value: "online-investigations",
        label: "Enquêtes en ligne",
        children: [
          { value: "corporate-investigations", label: "Corporate Investigations" },
          { value: "background-checks", label: "Background Checks" },
          { value: "skip-tracing", label: "Skip Tracing" },
        ],
      },
      { value: "sustainability-consulting", label: "Sustainability Consulting" },
      {
        value: "supply-chain-management",
        label: "Supply Chain Management",
        children: [
          { value: "customs-tariff-advisory", label: "Customs & Tariff Advisory" },
          { value: "logistics", label: "Logistics" },
          { value: "procurement-vendor", label: "Procurement & Vendor Management" },
        ],
      },
      {
        value: "product-management",
        label: "Product Management",
        children: [
          { value: "user-research", label: "User Research & Insights" },
          { value: "strategy-roadmapping", label: "Strategy & Roadmapping" },
          { value: "prioritization-execution", label: "Prioritization & Execution" },
          { value: "product-consultation", label: "Product Consultation" },
        ],
      },
      { value: "event-management", label: "Event Management" },
      {
        value: "ai-consulting",
        label: "AI Consulting",
        children: [
          { value: "ai-strategy", label: "AI Strategy" },
          { value: "ai-lessons", label: "AI Lessons" },
        ],
      },
      { value: "game-concept", label: "Game Concept Design" },
      {
        value: "customer-experience-management",
        label: "Customer Experience (CXM)",
        children: [
          { value: "customer-journey-mapping", label: "Customer Journey Mapping" },
          { value: "customer-personalization-strategy", label: "Personalization Strategy" },
          { value: "loyalty-retention-programs", label: "Loyalty & Retention Programs" },
          { value: "customer-engagement-strategy", label: "Engagement Strategy" },
          { value: "voice-of-customer", label: "Voice of Customer (VoC)" },
        ],
      },
      {
        value: "regulatory-compliance-consulting",
        label: "Regulatory Compliance",
        children: [
          { value: "certification-consulting-iso", label: "Certifications & Regulations" },
          { value: "fda-clearance-consulting", label: "FDA & Food Safety" },
          { value: "cybersecurity-certification", label: "IT & Cybersecurity Certification" },
          { value: "product-safety-certification", label: "Product Safety & Quality" },
          { value: "medical-device-consulting", label: "Medical Device Regulatory" },
          { value: "environmental-compliance", label: "Environmental Compliance" },
        ],
      },
      { value: "business-services", label: "Autre (Business)" },
    ],
  },
  {
    value: "finance",
    label: "Finance",
    labelAr: "المالية",
    icon: "💰",
    subcategories: [
      { value: "accounting-bookkeeping", label: "Comptabilité" },
      { value: "tax-consulting", label: "Conseil fiscal" },
      { value: "financial-planning", label: "Planification financière" },
      { value: "financial-analysis", label: "Analyse financière" },
      { value: "financial-modeling", label: "Modélisation financière" },
      { value: "fundraising", label: "Levée de fonds" },
      { value: "cryptocurrency-consulting", label: "Crypto Consulting" },
      { value: "financial-forecasting", label: "Prévisions financières" },
      { value: "payroll", label: "Paie" },
      { value: "invoicing", label: "Facturation" },
    ],
  },
  {
    value: "ai-services",
    label: "Services IA",
    labelAr: "خدمات الذكاء الاصطناعي",
    icon: "🤖",
    subcategories: [
      { value: "ai-chatbot", label: "AI Chatbots" },
      { value: "ai-content-creation", label: "AI Content Creation" },
      { value: "ai-image-generation", label: "AI Image Generation" },
      { value: "ai-video-generation", label: "AI Video Generation" },
      { value: "ai-music-generation", label: "AI Music Generation" },
      { value: "ai-voice", label: "AI Voice & TTS" },
      { value: "ai-automation", label: "AI Automation" },
      { value: "ai-data-analysis", label: "AI Data Analysis" },
      { value: "ai-model-training", label: "AI Model Training" },
      { value: "ai-prompt-engineering", label: "Prompt Engineering" },
      { value: "ai-agent-development", label: "AI Agent Development" },
    ],
  },
  {
    value: "lifestyle",
    label: "Développement personnel",
    labelAr: "التطوير الشخصي",
    icon: "🌱",
    subcategories: [
      {
        value: "online-tutoring",
        label: "Tutorat en ligne",
        children: [
          { value: "math-tutoring", label: "Maths" },
          { value: "science-tutoring", label: "Sciences" },
          { value: "social-sciences-tutoring", label: "Sciences sociales" },
          { value: "business-tutoring", label: "Business" },
          { value: "engineering-tutoring", label: "Engineering" },
        ],
      },
      { value: "language-lessons", label: "Cours de langues" },
      {
        value: "life-coaching",
        label: "Coaching de vie",
        children: [
          { value: "personal-growth", label: "Personal Growth" },
          { value: "accountability", label: "Accountability & Productivity" },
          { value: "relationship-advice", label: "Relationship Advice" },
          { value: "time-management", label: "Time Management" },
          { value: "stress-management", label: "Stress Management" },
        ],
      },
      {
        value: "gaming",
        label: "Competitive Gaming",
        children: [
          { value: "game-coaching", label: "Game Coaching" },
          { value: "esports-management-strategy", label: "eSports Management" },
        ],
      },
      { value: "gameplay-recording", label: "Game Recordings & Guides" },
      { value: "game-testing", label: "Gameplay Experience & Feedback" },
      {
        value: "career-counseling",
        label: "Conseil carrière",
        children: [
          { value: "interview-prep", label: "Interview Prep" },
          { value: "search-apply", label: "Search & Apply" },
          { value: "career-consulting", label: "Career Consulting" },
          { value: "leadership-development", label: "Leadership Development" },
          { value: "college-admission-consulting", label: "College Admission" },
        ],
      },
      { value: "arts-crafts-gifts", label: "Arts & Crafts" },
      { value: "embroidery-digitizing", label: "Embroidery Digitizing" },
      {
        value: "astrology-psychics",
        label: "Astrologie & Voyance",
        children: [
          { value: "readings", label: "Readings & Channeling" },
          { value: "astrology-and-horoscope", label: "Astrology & Horoscope" },
          { value: "numerology", label: "Numerology" },
        ],
      },
      { value: "modeling-acting", label: "Modeling & Acting" },
      {
        value: "fitness",
        label: "Fitness",
        children: [
          { value: "fitness-lessons", label: "Fitness Lessons" },
          { value: "workout-plans", label: "Workout Plans" },
          { value: "dance-lessons", label: "Dance Lessons" },
        ],
      },
      {
        value: "nutrition",
        label: "Nutrition",
        children: [
          { value: "recipe-creation", label: "Recipe Creation" },
          { value: "meal-plans", label: "Meal Plans" },
          { value: "nutrition-coaching", label: "Nutrition Coaching" },
        ],
      },
      {
        value: "wellness",
        label: "Bien-être",
        children: [
          { value: "guided-meditation", label: "Guided Meditation" },
          { value: "mindfulness-coaching", label: "Mindfulness Coaching" },
        ],
      },
      {
        value: "traveling",
        label: "Voyage",
        children: [
          { value: "local-advisors", label: "Local Advisors" },
          { value: "trip-plans", label: "Trip Plans" },
          { value: "visa-application-submission", label: "Visa Application" },
        ],
      },
      { value: "puzzle-game-creation", label: "Puzzle & Game Creation" },
      {
        value: "personal-stylists",
        label: "Styling & Beauté",
        children: [
          { value: "fashion-stylists", label: "Fashion Stylists" },
          { value: "hair-makeup", label: "Hair & Makeup" },
          { value: "skincare", label: "Skincare Advice" },
        ],
      },
      { value: "trend-forecasting", label: "Trend Forecasting" },
      { value: "family-genealogy", label: "Family & Genealogy" },
      { value: "greeting-cards-videos-online", label: "Greeting Cards & Videos" },
      {
        value: "tabletop-games",
        label: "Tabletop Games",
        children: [
          { value: "game-decks", label: "Card Games & Deck Building" },
          { value: "dungeon-masters", label: "Campaigns & Game Masters" },
        ],
      },
      { value: "lifestyle-services", label: "Autre (Lifestyle)" },
    ],
  },
  {
    value: "data",
    label: "Data",
    labelAr: "البيانات",
    icon: "📊",
    subcategories: [
      { value: "data-governance", label: "Data Governance & Protection" },
      { value: "data-mining", label: "Data Scraping" },
      { value: "data-labeling-annotation", label: "Data Labeling & Annotation" },
      { value: "data-formatting", label: "Data Formatting" },
      {
        value: "databases",
        label: "Bases de données",
        children: [
          { value: "db-consulting", label: "Consultation" },
          { value: "dba", label: "Database Administration" },
          { value: "db-queries", label: "SQL & NoSQL Queries" },
          { value: "db-design-optimization", label: "Design & Optimization" },
          { value: "database-development", label: "Database Development" },
          { value: "db-migration-performance", label: "Migration & Performance" },
        ],
      },
      { value: "data-cleaning", label: "Data Cleaning" },
      { value: "data-enrichment", label: "Data Enrichment" },
      {
        value: "data-processing",
        label: "Data Processing",
        children: [
          { value: "data-processing-consulting", label: "Consultation" },
          { value: "data-automations", label: "Automations" },
          { value: "formulas-macros", label: "Formulas & Macros" },
        ],
      },
      {
        value: "data-engineering",
        label: "Data Engineering",
        children: [
          { value: "data-warehouse", label: "Data Warehouse" },
          { value: "data-engineering-consulting", label: "Consulting" },
          { value: "data-etls", label: "Data ETLs" },
        ],
      },
      {
        value: "data-analytics",
        label: "Data Analytics",
        children: [
          { value: "bi-analytics", label: "BI Analytics" },
          { value: "data-analytics-consulting", label: "Consultation" },
          { value: "supply-chain-analytics", label: "Supply Chain Analytics" },
          { value: "financial-analytics", label: "Financial Analytics" },
          { value: "statistical-modeling", label: "Statistical Modeling" },
          { value: "product-analytics", label: "Product Analytics" },
          { value: "marketing-analytics", label: "Marketing Analytics" },
        ],
      },
      {
        value: "data-visualization",
        label: "Data Visualization",
        children: [
          { value: "dataviz-consulting", label: "Consultation" },
          { value: "dataviz-reports", label: "Reports" },
          { value: "gis", label: "Geographic Info Systems (GIS)" },
          { value: "data-dashboards", label: "Data Dashboards" },
          { value: "graphs-charts", label: "Graphs & Charts" },
        ],
      },
      {
        value: "data-science",
        label: "Data Science & ML",
        children: [
          { value: "machine-learning", label: "Machine Learning" },
          { value: "deep-learning", label: "Deep Learning" },
          { value: "computer-vision", label: "Computer Vision" },
          { value: "ai-fine-tuning", label: "AI Model Fine-Tuning" },
          { value: "text-analysis-nlp", label: "Natural Language Processing" },
          { value: "ai-models", label: "Generative Models" },
          { value: "time-series-analysis", label: "Time Series Analysis" },
          { value: "data-science-consulting", label: "Consultation" },
        ],
      },
      {
        value: "data-entry",
        label: "Saisie de données",
        children: [
          { value: "web-research", label: "Web Research" },
          { value: "copy-paste", label: "Copy Paste" },
          { value: "data-typing", label: "Data Typing" },
        ],
      },
      { value: "data-services", label: "Autre (Data)" },
    ],
  },
  {
    value: "consulting-services",
    label: "Consulting",
    labelAr: "الاستشارات",
    icon: "🎯",
    subcategories: [
      { value: "business-consulting", label: "Business Consulting" },
      { value: "marketing-consulting", label: "Marketing Consulting" },
      { value: "tech-consulting", label: "Tech Consulting" },
      { value: "financial-consulting", label: "Financial Consulting" },
      { value: "legal-consulting", label: "Legal Consulting" },
      { value: "hr-consulting", label: "HR Consulting" },
      { value: "growth-strategy", label: "Growth Strategy" },
      { value: "startup-consulting", label: "Startup Consulting" },
      { value: "ecommerce-consulting", label: "E-Commerce Consulting" },
      { value: "supply-chain-consulting", label: "Supply Chain Consulting" },
    ],
  },
  {
    value: "photography",
    label: "Photographie",
    labelAr: "التصوير الفوتوغرافي",
    icon: "📸",
    subcategories: [
      { value: "product-photographers", label: "Product Photography" },
      {
        value: "portrait-photographers",
        label: "Portrait Photography",
        children: [
          { value: "business-portrait", label: "Business & Professional" },
          { value: "personal-branding-portraits", label: "Personal Branding" },
          { value: "family-portraits", label: "Family Portraits" },
          { value: "travel-portraits", label: "Travel & Destination" },
        ],
      },
      { value: "drone-photography", label: "Drone Photography" },
      { value: "lifestyle-fashion-photographers", label: "Lifestyle & Fashion" },
      { value: "real-estate-photographers", label: "Real Estate Photography" },
      { value: "event-photographers", label: "Event Photography" },
      { value: "food-photographers", label: "Food Photography" },
      { value: "scenic-photographers", label: "Scenic Photography" },
      { value: "photo-preset-creation", label: "Photo Preset Creation" },
      {
        value: "photography-advice",
        label: "Conseil photo",
        children: [
          { value: "photography-lessons", label: "Photography Lessons" },
          { value: "photography-mentorship", label: "Photography Mentorship" },
        ],
      },
      { value: "photography-services", label: "Autre (Photo)" },
    ],
  },
]

// Helper: get flat list of main categories for navbar
export function getMainCategories() {
  return categories.map(({ value, label, labelAr, icon }) => ({
    value,
    label,
    labelAr,
    icon,
  }))
}

// Helper: find a category by value
export function findCategory(categoryValue: string) {
  return categories.find((c) => c.value === categoryValue)
}

// Helper: find a subcategory within a category
export function findSubcategory(categoryValue: string, subcategoryValue: string) {
  const cat = findCategory(categoryValue)
  return cat?.subcategories.find((s) => s.value === subcategoryValue)
}

// Helper: get all subcategories as flat array for a given category
export function getSubcategories(categoryValue: string) {
  const cat = findCategory(categoryValue)
  return cat?.subcategories ?? []
}

// Helper: total count of all categories + subcategories + sub-subcategories
export function getTotalCount() {
  let count = 0
  for (const cat of categories) {
    count++ // main category
    for (const sub of cat.subcategories) {
      count++ // subcategory
      if (sub.children) {
        count += sub.children.length // sub-subcategories
      }
    }
  }
  return count
}
