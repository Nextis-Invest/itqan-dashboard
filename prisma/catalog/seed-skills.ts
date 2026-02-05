import { PrismaClient } from "@prisma/client-catalog"

const prisma = new PrismaClient()

// Technologies & Services organized by category (400+ skills)
const skillsData = [
  // ═══════════════════════════════════════════════════════════════
  // DESIGN & GRAPHISME (60+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  // Logo & Identité
  { name: "Création de logo", slug: "creation-logo", category: "logo-identite" },
  { name: "Brand Identity", slug: "brand-identity", category: "logo-identite" },
  { name: "Charte graphique", slug: "charte-graphique", category: "logo-identite" },
  { name: "Logo minimaliste", slug: "logo-minimaliste", category: "logo-identite" },
  { name: "Logo 3D", slug: "logo-3d", category: "logo-identite" },
  { name: "Mascotte", slug: "mascotte", category: "logo-identite" },
  { name: "Logo vectoriel", slug: "logo-vectoriel", category: "logo-identite" },
  { name: "Rebranding", slug: "rebranding", category: "logo-identite" },
  { name: "Logo animé", slug: "logo-anime", category: "logo-identite" },
  { name: "Monogramme", slug: "monogramme", category: "logo-identite" },
  
  // Web Design
  { name: "Landing page design", slug: "landing-page-design", category: "web-design" },
  { name: "Responsive design", slug: "responsive-design", category: "web-design" },
  { name: "Wireframing", slug: "wireframing", category: "web-design" },
  { name: "Mockup design", slug: "mockup-design", category: "web-design" },
  { name: "Design system", slug: "design-system", category: "web-design" },
  { name: "Dark mode design", slug: "dark-mode-design", category: "web-design" },
  { name: "SaaS design", slug: "saas-design", category: "web-design" },
  { name: "Dashboard design", slug: "dashboard-design", category: "web-design" },
  { name: "E-commerce design", slug: "ecommerce-design", category: "web-design" },
  { name: "Blog design", slug: "blog-design", category: "web-design" },
  
  // UI/UX Design
  { name: "Figma", slug: "figma", category: "ui-ux-design" },
  { name: "Adobe XD", slug: "adobe-xd", category: "ui-ux-design" },
  { name: "Sketch", slug: "sketch", category: "ui-ux-design" },
  { name: "InVision", slug: "invision", category: "ui-ux-design" },
  { name: "Prototyping", slug: "prototyping", category: "ui-ux-design" },
  { name: "User Research", slug: "user-research", category: "ui-ux-design" },
  { name: "Usability Testing", slug: "usability-testing", category: "ui-ux-design" },
  { name: "Information Architecture", slug: "information-architecture", category: "ui-ux-design" },
  { name: "Interaction Design", slug: "interaction-design", category: "ui-ux-design" },
  { name: "Mobile UX", slug: "mobile-ux", category: "ui-ux-design" },
  { name: "UX Writing", slug: "ux-writing", category: "ui-ux-design" },
  { name: "A/B Testing Design", slug: "ab-testing-design", category: "ui-ux-design" },
  { name: "Accessibility Design", slug: "accessibility-design", category: "ui-ux-design" },
  { name: "Framer", slug: "framer", category: "ui-ux-design" },
  { name: "Principle", slug: "principle", category: "ui-ux-design" },
  
  // Illustration
  { name: "Illustration digitale", slug: "illustration-digitale", category: "illustration" },
  { name: "Illustration vectorielle", slug: "illustration-vectorielle", category: "illustration" },
  { name: "Character design", slug: "character-design", category: "illustration" },
  { name: "Illustration jeunesse", slug: "illustration-jeunesse", category: "illustration" },
  { name: "Illustration éditoriale", slug: "illustration-editoriale", category: "illustration" },
  { name: "Infographie", slug: "infographie", category: "illustration" },
  { name: "Icon design", slug: "icon-design", category: "illustration" },
  { name: "Comic/BD", slug: "comic-bd", category: "illustration" },
  { name: "Concept Art", slug: "concept-art", category: "illustration" },
  { name: "Illustration mode", slug: "illustration-mode", category: "illustration" },
  
  // Outils design généraux
  { name: "Photoshop", slug: "photoshop", category: "logo-identite" },
  { name: "Illustrator", slug: "illustrator", category: "logo-identite" },
  { name: "InDesign", slug: "indesign", category: "logo-identite" },
  { name: "CorelDRAW", slug: "coreldraw", category: "logo-identite" },
  { name: "Affinity Designer", slug: "affinity-designer", category: "logo-identite" },
  { name: "Canva", slug: "canva", category: "logo-identite" },
  { name: "Procreate", slug: "procreate", category: "illustration" },
  { name: "Clip Studio Paint", slug: "clip-studio-paint", category: "illustration" },
  
  // ═══════════════════════════════════════════════════════════════
  // DÉVELOPPEMENT WEB (100+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  // Langages Frontend
  { name: "HTML5", slug: "html5", category: "developpement-web" },
  { name: "CSS3", slug: "css3", category: "developpement-web" },
  { name: "JavaScript", slug: "javascript", category: "developpement-web" },
  { name: "TypeScript", slug: "typescript", category: "developpement-web" },
  { name: "SASS/SCSS", slug: "sass-scss", category: "developpement-web" },
  { name: "Less", slug: "less", category: "developpement-web" },
  
  // Frameworks Frontend
  { name: "React", slug: "react", category: "developpement-web" },
  { name: "Next.js", slug: "nextjs", category: "developpement-web" },
  { name: "Vue.js", slug: "vuejs", category: "developpement-web" },
  { name: "Nuxt.js", slug: "nuxtjs", category: "developpement-web" },
  { name: "Angular", slug: "angular", category: "developpement-web" },
  { name: "Svelte", slug: "svelte", category: "developpement-web" },
  { name: "SvelteKit", slug: "sveltekit", category: "developpement-web" },
  { name: "Remix", slug: "remix", category: "developpement-web" },
  { name: "Astro", slug: "astro", category: "developpement-web" },
  { name: "Solid.js", slug: "solidjs", category: "developpement-web" },
  { name: "Qwik", slug: "qwik", category: "developpement-web" },
  { name: "Alpine.js", slug: "alpinejs", category: "developpement-web" },
  { name: "HTMX", slug: "htmx", category: "developpement-web" },
  
  // CSS Frameworks
  { name: "Tailwind CSS", slug: "tailwind-css", category: "developpement-web" },
  { name: "Bootstrap", slug: "bootstrap", category: "developpement-web" },
  { name: "Material UI", slug: "material-ui", category: "developpement-web" },
  { name: "Chakra UI", slug: "chakra-ui", category: "developpement-web" },
  { name: "Ant Design", slug: "ant-design", category: "developpement-web" },
  { name: "Bulma", slug: "bulma", category: "developpement-web" },
  { name: "Radix UI", slug: "radix-ui", category: "developpement-web" },
  { name: "shadcn/ui", slug: "shadcn-ui", category: "developpement-web" },
  { name: "Styled Components", slug: "styled-components", category: "developpement-web" },
  { name: "Emotion", slug: "emotion", category: "developpement-web" },
  
  // Backend
  { name: "Node.js", slug: "nodejs", category: "developpement-web" },
  { name: "Express.js", slug: "expressjs", category: "developpement-web" },
  { name: "NestJS", slug: "nestjs", category: "developpement-web" },
  { name: "Fastify", slug: "fastify", category: "developpement-web" },
  { name: "PHP", slug: "php", category: "developpement-web" },
  { name: "Laravel", slug: "laravel", category: "developpement-web" },
  { name: "Symfony", slug: "symfony", category: "developpement-web" },
  { name: "CodeIgniter", slug: "codeigniter", category: "developpement-web" },
  { name: "Python", slug: "python", category: "developpement-web" },
  { name: "Django", slug: "django", category: "developpement-web" },
  { name: "Flask", slug: "flask", category: "developpement-web" },
  { name: "FastAPI", slug: "fastapi", category: "developpement-web" },
  { name: "Ruby", slug: "ruby", category: "developpement-web" },
  { name: "Ruby on Rails", slug: "ruby-on-rails", category: "developpement-web" },
  { name: "Go/Golang", slug: "golang", category: "developpement-web" },
  { name: "Gin", slug: "gin", category: "developpement-web" },
  { name: "Fiber", slug: "fiber", category: "developpement-web" },
  { name: "Rust", slug: "rust", category: "developpement-web" },
  { name: "Actix Web", slug: "actix-web", category: "developpement-web" },
  { name: "Java", slug: "java", category: "developpement-web" },
  { name: "Spring Boot", slug: "spring-boot", category: "developpement-web" },
  { name: "C#", slug: "csharp", category: "developpement-web" },
  { name: ".NET Core", slug: "dotnet-core", category: "developpement-web" },
  { name: "ASP.NET", slug: "aspnet", category: "developpement-web" },
  { name: "Elixir", slug: "elixir", category: "developpement-web" },
  { name: "Phoenix", slug: "phoenix", category: "developpement-web" },
  { name: "Deno", slug: "deno", category: "developpement-web" },
  { name: "Bun", slug: "bun", category: "developpement-web" },
  
  // Bases de données
  { name: "PostgreSQL", slug: "postgresql", category: "developpement-web" },
  { name: "MySQL", slug: "mysql", category: "developpement-web" },
  { name: "MariaDB", slug: "mariadb", category: "developpement-web" },
  { name: "MongoDB", slug: "mongodb", category: "developpement-web" },
  { name: "Redis", slug: "redis", category: "developpement-web" },
  { name: "SQLite", slug: "sqlite", category: "developpement-web" },
  { name: "Supabase", slug: "supabase", category: "developpement-web" },
  { name: "Firebase", slug: "firebase", category: "developpement-web" },
  { name: "PlanetScale", slug: "planetscale", category: "developpement-web" },
  { name: "Neon", slug: "neon", category: "developpement-web" },
  { name: "Prisma", slug: "prisma", category: "developpement-web" },
  { name: "Drizzle ORM", slug: "drizzle-orm", category: "developpement-web" },
  { name: "TypeORM", slug: "typeorm", category: "developpement-web" },
  { name: "Sequelize", slug: "sequelize", category: "developpement-web" },
  { name: "Mongoose", slug: "mongoose", category: "developpement-web" },
  
  // CMS / No-Code
  { name: "WordPress", slug: "wordpress", category: "developpement-web" },
  { name: "Webflow", slug: "webflow", category: "developpement-web" },
  { name: "Wix", slug: "wix", category: "developpement-web" },
  { name: "Squarespace", slug: "squarespace", category: "developpement-web" },
  { name: "Ghost", slug: "ghost", category: "developpement-web" },
  { name: "Strapi", slug: "strapi", category: "developpement-web" },
  { name: "Contentful", slug: "contentful", category: "developpement-web" },
  { name: "Sanity", slug: "sanity", category: "developpement-web" },
  { name: "Directus", slug: "directus", category: "developpement-web" },
  { name: "Payload CMS", slug: "payload-cms", category: "developpement-web" },
  { name: "KeystoneJS", slug: "keystonejs", category: "developpement-web" },
  { name: "Drupal", slug: "drupal", category: "developpement-web" },
  { name: "Joomla", slug: "joomla", category: "developpement-web" },
  { name: "Bubble", slug: "bubble", category: "developpement-web" },
  { name: "Framer Sites", slug: "framer-sites", category: "developpement-web" },
  
  // API & Services
  { name: "REST API", slug: "rest-api", category: "developpement-web" },
  { name: "GraphQL", slug: "graphql", category: "developpement-web" },
  { name: "Apollo", slug: "apollo", category: "developpement-web" },
  { name: "tRPC", slug: "trpc", category: "developpement-web" },
  { name: "WebSocket", slug: "websocket", category: "developpement-web" },
  { name: "Socket.io", slug: "socketio", category: "developpement-web" },
  { name: "Swagger/OpenAPI", slug: "swagger-openapi", category: "developpement-web" },
  { name: "Postman", slug: "postman", category: "developpement-web" },
  
  // ═══════════════════════════════════════════════════════════════
  // DÉVELOPPEMENT MOBILE (40+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  { name: "React Native", slug: "react-native", category: "developpement-mobile" },
  { name: "Expo", slug: "expo", category: "developpement-mobile" },
  { name: "Flutter", slug: "flutter", category: "developpement-mobile" },
  { name: "Dart", slug: "dart", category: "developpement-mobile" },
  { name: "Swift", slug: "swift", category: "developpement-mobile" },
  { name: "SwiftUI", slug: "swiftui", category: "developpement-mobile" },
  { name: "Objective-C", slug: "objective-c", category: "developpement-mobile" },
  { name: "Kotlin", slug: "kotlin", category: "developpement-mobile" },
  { name: "Jetpack Compose", slug: "jetpack-compose", category: "developpement-mobile" },
  { name: "iOS Development", slug: "ios-development", category: "developpement-mobile" },
  { name: "Android Development", slug: "android-development", category: "developpement-mobile" },
  { name: "Xamarin", slug: "xamarin", category: "developpement-mobile" },
  { name: ".NET MAUI", slug: "dotnet-maui", category: "developpement-mobile" },
  { name: "Ionic", slug: "ionic", category: "developpement-mobile" },
  { name: "Capacitor", slug: "capacitor", category: "developpement-mobile" },
  { name: "Cordova", slug: "cordova", category: "developpement-mobile" },
  { name: "PWA", slug: "pwa", category: "developpement-mobile" },
  { name: "App Store Optimization", slug: "app-store-optimization", category: "developpement-mobile" },
  { name: "Push Notifications", slug: "push-notifications", category: "developpement-mobile" },
  { name: "Firebase Mobile", slug: "firebase-mobile", category: "developpement-mobile" },
  { name: "RevenueCat", slug: "revenuecat", category: "developpement-mobile" },
  { name: "In-App Purchases", slug: "in-app-purchases", category: "developpement-mobile" },
  { name: "Fastlane", slug: "fastlane", category: "developpement-mobile" },
  { name: "TestFlight", slug: "testflight", category: "developpement-mobile" },
  { name: "App Distribution", slug: "app-distribution", category: "developpement-mobile" },
  { name: "Core Data", slug: "core-data", category: "developpement-mobile" },
  { name: "Room Database", slug: "room-database", category: "developpement-mobile" },
  { name: "SQLite Mobile", slug: "sqlite-mobile", category: "developpement-mobile" },
  { name: "Realm", slug: "realm", category: "developpement-mobile" },
  { name: "ARKit", slug: "arkit", category: "developpement-mobile" },
  { name: "ARCore", slug: "arcore", category: "developpement-mobile" },
  { name: "Core ML", slug: "core-ml", category: "developpement-mobile" },
  { name: "TensorFlow Lite", slug: "tensorflow-lite", category: "developpement-mobile" },
  { name: "Bluetooth LE", slug: "bluetooth-le", category: "developpement-mobile" },
  { name: "NFC Development", slug: "nfc-development", category: "developpement-mobile" },
  { name: "HealthKit", slug: "healthkit", category: "developpement-mobile" },
  { name: "WatchKit", slug: "watchkit", category: "developpement-mobile" },
  { name: "Wear OS", slug: "wear-os", category: "developpement-mobile" },
  { name: "CarPlay", slug: "carplay", category: "developpement-mobile" },
  { name: "Android Auto", slug: "android-auto", category: "developpement-mobile" },
  
  // ═══════════════════════════════════════════════════════════════
  // E-COMMERCE (35+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  { name: "Shopify", slug: "shopify", category: "e-commerce" },
  { name: "Shopify Plus", slug: "shopify-plus", category: "e-commerce" },
  { name: "Shopify Apps", slug: "shopify-apps", category: "e-commerce" },
  { name: "Liquid", slug: "liquid", category: "e-commerce" },
  { name: "WooCommerce", slug: "woocommerce", category: "e-commerce" },
  { name: "PrestaShop", slug: "prestashop", category: "e-commerce" },
  { name: "Magento", slug: "magento", category: "e-commerce" },
  { name: "Adobe Commerce", slug: "adobe-commerce", category: "e-commerce" },
  { name: "BigCommerce", slug: "bigcommerce", category: "e-commerce" },
  { name: "Wix E-commerce", slug: "wix-ecommerce", category: "e-commerce" },
  { name: "Squarespace Commerce", slug: "squarespace-commerce", category: "e-commerce" },
  { name: "Medusa", slug: "medusa", category: "e-commerce" },
  { name: "Saleor", slug: "saleor", category: "e-commerce" },
  { name: "Vendure", slug: "vendure", category: "e-commerce" },
  { name: "Snipcart", slug: "snipcart", category: "e-commerce" },
  { name: "Stripe", slug: "stripe", category: "e-commerce" },
  { name: "PayPal", slug: "paypal", category: "e-commerce" },
  { name: "Square", slug: "square", category: "e-commerce" },
  { name: "Klarna", slug: "klarna", category: "e-commerce" },
  { name: "Afterpay", slug: "afterpay", category: "e-commerce" },
  { name: "CMI Maroc", slug: "cmi-maroc", category: "e-commerce" },
  { name: "Inventory Management", slug: "inventory-management", category: "e-commerce" },
  { name: "Dropshipping", slug: "dropshipping", category: "e-commerce" },
  { name: "Print on Demand", slug: "print-on-demand", category: "e-commerce" },
  { name: "Amazon Seller", slug: "amazon-seller", category: "e-commerce" },
  { name: "eBay Seller", slug: "ebay-seller", category: "e-commerce" },
  { name: "Etsy Seller", slug: "etsy-seller", category: "e-commerce" },
  { name: "Product Photography", slug: "product-photography", category: "e-commerce" },
  { name: "Product Description", slug: "product-description", category: "e-commerce" },
  { name: "Order Fulfillment", slug: "order-fulfillment", category: "e-commerce" },
  { name: "Shipstation", slug: "shipstation", category: "e-commerce" },
  { name: "Oberlo", slug: "oberlo", category: "e-commerce" },
  { name: "Spocket", slug: "spocket", category: "e-commerce" },
  { name: "AliExpress Dropshipping", slug: "aliexpress-dropshipping", category: "e-commerce" },
  { name: "Conversion Optimization", slug: "conversion-optimization", category: "e-commerce" },
  
  // ═══════════════════════════════════════════════════════════════
  // DEVOPS & CLOUD (50+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  // Cloud Platforms
  { name: "AWS", slug: "aws", category: "devops-cloud" },
  { name: "AWS Lambda", slug: "aws-lambda", category: "devops-cloud" },
  { name: "AWS EC2", slug: "aws-ec2", category: "devops-cloud" },
  { name: "AWS S3", slug: "aws-s3", category: "devops-cloud" },
  { name: "AWS RDS", slug: "aws-rds", category: "devops-cloud" },
  { name: "AWS ECS", slug: "aws-ecs", category: "devops-cloud" },
  { name: "AWS EKS", slug: "aws-eks", category: "devops-cloud" },
  { name: "AWS CloudFront", slug: "aws-cloudfront", category: "devops-cloud" },
  { name: "Google Cloud Platform", slug: "google-cloud-platform", category: "devops-cloud" },
  { name: "GCP Cloud Run", slug: "gcp-cloud-run", category: "devops-cloud" },
  { name: "GCP Compute Engine", slug: "gcp-compute-engine", category: "devops-cloud" },
  { name: "Microsoft Azure", slug: "microsoft-azure", category: "devops-cloud" },
  { name: "Azure Functions", slug: "azure-functions", category: "devops-cloud" },
  { name: "Azure DevOps", slug: "azure-devops", category: "devops-cloud" },
  { name: "DigitalOcean", slug: "digitalocean", category: "devops-cloud" },
  { name: "Linode", slug: "linode", category: "devops-cloud" },
  { name: "Vultr", slug: "vultr", category: "devops-cloud" },
  { name: "Hetzner", slug: "hetzner", category: "devops-cloud" },
  { name: "OVH Cloud", slug: "ovh-cloud", category: "devops-cloud" },
  
  // Containers & Orchestration
  { name: "Docker", slug: "docker", category: "devops-cloud" },
  { name: "Docker Compose", slug: "docker-compose", category: "devops-cloud" },
  { name: "Kubernetes", slug: "kubernetes", category: "devops-cloud" },
  { name: "Helm", slug: "helm", category: "devops-cloud" },
  { name: "K3s", slug: "k3s", category: "devops-cloud" },
  { name: "Podman", slug: "podman", category: "devops-cloud" },
  { name: "Rancher", slug: "rancher", category: "devops-cloud" },
  
  // CI/CD
  { name: "GitHub Actions", slug: "github-actions", category: "devops-cloud" },
  { name: "GitLab CI", slug: "gitlab-ci", category: "devops-cloud" },
  { name: "Jenkins", slug: "jenkins", category: "devops-cloud" },
  { name: "CircleCI", slug: "circleci", category: "devops-cloud" },
  { name: "Travis CI", slug: "travis-ci", category: "devops-cloud" },
  { name: "Bitbucket Pipelines", slug: "bitbucket-pipelines", category: "devops-cloud" },
  { name: "ArgoCD", slug: "argocd", category: "devops-cloud" },
  { name: "FluxCD", slug: "fluxcd", category: "devops-cloud" },
  
  // Infrastructure as Code
  { name: "Terraform", slug: "terraform", category: "devops-cloud" },
  { name: "Pulumi", slug: "pulumi", category: "devops-cloud" },
  { name: "Ansible", slug: "ansible", category: "devops-cloud" },
  { name: "CloudFormation", slug: "cloudformation", category: "devops-cloud" },
  { name: "CDK", slug: "cdk", category: "devops-cloud" },
  { name: "Vagrant", slug: "vagrant", category: "devops-cloud" },
  
  // Monitoring & Logging
  { name: "Prometheus", slug: "prometheus", category: "devops-cloud" },
  { name: "Grafana", slug: "grafana", category: "devops-cloud" },
  { name: "Datadog", slug: "datadog", category: "devops-cloud" },
  { name: "New Relic", slug: "new-relic", category: "devops-cloud" },
  { name: "ELK Stack", slug: "elk-stack", category: "devops-cloud" },
  { name: "Loki", slug: "loki", category: "devops-cloud" },
  { name: "Sentry", slug: "sentry", category: "devops-cloud" },
  { name: "PagerDuty", slug: "pagerduty", category: "devops-cloud" },
  
  // Serverless & Edge
  { name: "Vercel", slug: "vercel", category: "devops-cloud" },
  { name: "Netlify", slug: "netlify", category: "devops-cloud" },
  { name: "Cloudflare Workers", slug: "cloudflare-workers", category: "devops-cloud" },
  { name: "Cloudflare Pages", slug: "cloudflare-pages", category: "devops-cloud" },
  { name: "Railway", slug: "railway", category: "devops-cloud" },
  { name: "Render", slug: "render", category: "devops-cloud" },
  { name: "Fly.io", slug: "flyio", category: "devops-cloud" },
  { name: "Coolify", slug: "coolify", category: "devops-cloud" },
  { name: "Dokku", slug: "dokku", category: "devops-cloud" },
  { name: "CapRover", slug: "caprover", category: "devops-cloud" },
  
  // OS & Security
  { name: "Linux", slug: "linux", category: "devops-cloud" },
  { name: "Ubuntu", slug: "ubuntu", category: "devops-cloud" },
  { name: "CentOS", slug: "centos", category: "devops-cloud" },
  { name: "Nginx", slug: "nginx", category: "devops-cloud" },
  { name: "Apache", slug: "apache", category: "devops-cloud" },
  { name: "Traefik", slug: "traefik", category: "devops-cloud" },
  { name: "Caddy", slug: "caddy", category: "devops-cloud" },
  { name: "SSL/TLS", slug: "ssl-tls", category: "devops-cloud" },
  { name: "Let's Encrypt", slug: "lets-encrypt", category: "devops-cloud" },
  { name: "Vault", slug: "vault", category: "devops-cloud" },
  
  // ═══════════════════════════════════════════════════════════════
  // IA & MACHINE LEARNING (45+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  // AI Models & APIs
  { name: "OpenAI API", slug: "openai-api", category: "ia-machine-learning" },
  { name: "ChatGPT", slug: "chatgpt", category: "ia-machine-learning" },
  { name: "GPT-4", slug: "gpt-4", category: "ia-machine-learning" },
  { name: "Claude API", slug: "claude-api", category: "ia-machine-learning" },
  { name: "Gemini API", slug: "gemini-api", category: "ia-machine-learning" },
  { name: "Anthropic", slug: "anthropic", category: "ia-machine-learning" },
  { name: "Mistral AI", slug: "mistral-ai", category: "ia-machine-learning" },
  { name: "LLaMA", slug: "llama", category: "ia-machine-learning" },
  { name: "Hugging Face", slug: "hugging-face", category: "ia-machine-learning" },
  { name: "LangChain", slug: "langchain", category: "ia-machine-learning" },
  { name: "LlamaIndex", slug: "llamaindex", category: "ia-machine-learning" },
  { name: "Prompt Engineering", slug: "prompt-engineering", category: "ia-machine-learning" },
  { name: "Fine-tuning", slug: "fine-tuning", category: "ia-machine-learning" },
  { name: "RAG", slug: "rag", category: "ia-machine-learning" },
  { name: "Vector Databases", slug: "vector-databases", category: "ia-machine-learning" },
  { name: "Pinecone", slug: "pinecone", category: "ia-machine-learning" },
  { name: "Weaviate", slug: "weaviate", category: "ia-machine-learning" },
  { name: "Chroma", slug: "chroma", category: "ia-machine-learning" },
  
  // ML Frameworks
  { name: "TensorFlow", slug: "tensorflow", category: "ia-machine-learning" },
  { name: "PyTorch", slug: "pytorch", category: "ia-machine-learning" },
  { name: "Keras", slug: "keras", category: "ia-machine-learning" },
  { name: "Scikit-learn", slug: "scikit-learn", category: "ia-machine-learning" },
  { name: "JAX", slug: "jax", category: "ia-machine-learning" },
  { name: "XGBoost", slug: "xgboost", category: "ia-machine-learning" },
  { name: "LightGBM", slug: "lightgbm", category: "ia-machine-learning" },
  
  // Data Science
  { name: "Data Science", slug: "data-science", category: "ia-machine-learning" },
  { name: "Pandas", slug: "pandas", category: "ia-machine-learning" },
  { name: "NumPy", slug: "numpy", category: "ia-machine-learning" },
  { name: "Jupyter", slug: "jupyter", category: "ia-machine-learning" },
  { name: "Matplotlib", slug: "matplotlib", category: "ia-machine-learning" },
  { name: "Seaborn", slug: "seaborn", category: "ia-machine-learning" },
  { name: "Plotly", slug: "plotly", category: "ia-machine-learning" },
  { name: "Apache Spark", slug: "apache-spark", category: "ia-machine-learning" },
  { name: "Databricks", slug: "databricks", category: "ia-machine-learning" },
  { name: "Snowflake", slug: "snowflake", category: "ia-machine-learning" },
  
  // Computer Vision & NLP
  { name: "Computer Vision", slug: "computer-vision", category: "ia-machine-learning" },
  { name: "OpenCV", slug: "opencv", category: "ia-machine-learning" },
  { name: "YOLO", slug: "yolo", category: "ia-machine-learning" },
  { name: "NLP", slug: "nlp", category: "ia-machine-learning" },
  { name: "spaCy", slug: "spacy", category: "ia-machine-learning" },
  { name: "NLTK", slug: "nltk", category: "ia-machine-learning" },
  
  // AI Image/Video
  { name: "Stable Diffusion", slug: "stable-diffusion", category: "ia-machine-learning" },
  { name: "Midjourney", slug: "midjourney", category: "ia-machine-learning" },
  { name: "DALL-E", slug: "dall-e", category: "ia-machine-learning" },
  { name: "RunwayML", slug: "runwayml", category: "ia-machine-learning" },
  { name: "ElevenLabs", slug: "elevenlabs", category: "ia-machine-learning" },
  { name: "Whisper", slug: "whisper", category: "ia-machine-learning" },
  
  // BI & Analytics
  { name: "Power BI", slug: "power-bi", category: "ia-machine-learning" },
  { name: "Tableau", slug: "tableau", category: "ia-machine-learning" },
  { name: "Looker", slug: "looker", category: "ia-machine-learning" },
  { name: "Metabase", slug: "metabase", category: "ia-machine-learning" },
  { name: "Apache Airflow", slug: "apache-airflow", category: "ia-machine-learning" },
  { name: "dbt", slug: "dbt", category: "ia-machine-learning" },
  
  // ═══════════════════════════════════════════════════════════════
  // MARKETING DIGITAL (60+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  // SEO
  { name: "SEO On-page", slug: "seo-on-page", category: "seo" },
  { name: "SEO Off-page", slug: "seo-off-page", category: "seo" },
  { name: "SEO Technique", slug: "seo-technique", category: "seo" },
  { name: "SEO Local", slug: "seo-local", category: "seo" },
  { name: "SEO International", slug: "seo-international", category: "seo" },
  { name: "SEO E-commerce", slug: "seo-ecommerce", category: "seo" },
  { name: "Link Building", slug: "link-building", category: "seo" },
  { name: "Keyword Research", slug: "keyword-research", category: "seo" },
  { name: "Content SEO", slug: "content-seo", category: "seo" },
  { name: "Google Search Console", slug: "google-search-console", category: "seo" },
  { name: "Ahrefs", slug: "ahrefs", category: "seo" },
  { name: "Semrush", slug: "semrush", category: "seo" },
  { name: "Moz", slug: "moz", category: "seo" },
  { name: "Screaming Frog", slug: "screaming-frog", category: "seo" },
  { name: "Surfer SEO", slug: "surfer-seo", category: "seo" },
  { name: "Clearscope", slug: "clearscope", category: "seo" },
  { name: "Schema Markup", slug: "schema-markup", category: "seo" },
  { name: "Core Web Vitals", slug: "core-web-vitals", category: "seo" },
  
  // Social Media
  { name: "Community Management", slug: "community-management", category: "social-media" },
  { name: "Social Media Strategy", slug: "social-media-strategy", category: "social-media" },
  { name: "Instagram Marketing", slug: "instagram-marketing", category: "social-media" },
  { name: "Facebook Marketing", slug: "facebook-marketing", category: "social-media" },
  { name: "LinkedIn Marketing", slug: "linkedin-marketing", category: "social-media" },
  { name: "TikTok Marketing", slug: "tiktok-marketing", category: "social-media" },
  { name: "X/Twitter Marketing", slug: "twitter-marketing", category: "social-media" },
  { name: "YouTube Marketing", slug: "youtube-marketing", category: "social-media" },
  { name: "Pinterest Marketing", slug: "pinterest-marketing", category: "social-media" },
  { name: "Snapchat Marketing", slug: "snapchat-marketing", category: "social-media" },
  { name: "Influencer Marketing", slug: "influencer-marketing", category: "social-media" },
  { name: "Social Listening", slug: "social-listening", category: "social-media" },
  { name: "Hootsuite", slug: "hootsuite", category: "social-media" },
  { name: "Buffer", slug: "buffer", category: "social-media" },
  { name: "Later", slug: "later", category: "social-media" },
  { name: "Sprout Social", slug: "sprout-social", category: "social-media" },
  
  // Email Marketing
  { name: "Email Automation", slug: "email-automation", category: "email-marketing" },
  { name: "Newsletter Design", slug: "newsletter-design", category: "email-marketing" },
  { name: "Email Copywriting", slug: "email-copywriting", category: "email-marketing" },
  { name: "Mailchimp", slug: "mailchimp", category: "email-marketing" },
  { name: "Klaviyo", slug: "klaviyo", category: "email-marketing" },
  { name: "SendGrid", slug: "sendgrid", category: "email-marketing" },
  { name: "ConvertKit", slug: "convertkit", category: "email-marketing" },
  { name: "ActiveCampaign", slug: "activecampaign", category: "email-marketing" },
  { name: "Brevo", slug: "brevo", category: "email-marketing" },
  { name: "HubSpot", slug: "hubspot", category: "email-marketing" },
  { name: "Drip Campaigns", slug: "drip-campaigns", category: "email-marketing" },
  { name: "Email Deliverability", slug: "email-deliverability", category: "email-marketing" },
  
  // Paid Advertising
  { name: "Google Ads", slug: "google-ads", category: "publicite-en-ligne" },
  { name: "Facebook Ads", slug: "facebook-ads", category: "publicite-en-ligne" },
  { name: "Instagram Ads", slug: "instagram-ads", category: "publicite-en-ligne" },
  { name: "TikTok Ads", slug: "tiktok-ads", category: "publicite-en-ligne" },
  { name: "LinkedIn Ads", slug: "linkedin-ads", category: "publicite-en-ligne" },
  { name: "YouTube Ads", slug: "youtube-ads", category: "publicite-en-ligne" },
  { name: "Twitter Ads", slug: "twitter-ads", category: "publicite-en-ligne" },
  { name: "Pinterest Ads", slug: "pinterest-ads", category: "publicite-en-ligne" },
  { name: "Microsoft Ads", slug: "microsoft-ads", category: "publicite-en-ligne" },
  { name: "Programmatic Advertising", slug: "programmatic-advertising", category: "publicite-en-ligne" },
  { name: "Retargeting", slug: "retargeting", category: "publicite-en-ligne" },
  { name: "PPC Management", slug: "ppc-management", category: "publicite-en-ligne" },
  { name: "Google Analytics", slug: "google-analytics", category: "publicite-en-ligne" },
  { name: "GA4", slug: "ga4", category: "publicite-en-ligne" },
  { name: "Google Tag Manager", slug: "google-tag-manager", category: "publicite-en-ligne" },
  { name: "Meta Pixel", slug: "meta-pixel", category: "publicite-en-ligne" },
  { name: "Conversion Tracking", slug: "conversion-tracking", category: "publicite-en-ligne" },
  
  // ═══════════════════════════════════════════════════════════════
  // VIDÉO & ANIMATION (40+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  // Video Editing
  { name: "Adobe Premiere Pro", slug: "adobe-premiere-pro", category: "video-animation" },
  { name: "Final Cut Pro", slug: "final-cut-pro", category: "video-animation" },
  { name: "DaVinci Resolve", slug: "davinci-resolve", category: "video-animation" },
  { name: "CapCut", slug: "capcut", category: "video-animation" },
  { name: "iMovie", slug: "imovie", category: "video-animation" },
  { name: "Video Editing", slug: "video-editing", category: "video-animation" },
  { name: "Color Grading", slug: "color-grading", category: "video-animation" },
  { name: "Video Production", slug: "video-production", category: "video-animation" },
  { name: "YouTube Editing", slug: "youtube-editing", category: "video-animation" },
  { name: "Short Form Video", slug: "short-form-video", category: "video-animation" },
  { name: "Reels/TikTok Editing", slug: "reels-tiktok-editing", category: "video-animation" },
  { name: "Corporate Video", slug: "corporate-video", category: "video-animation" },
  { name: "Documentary", slug: "documentary", category: "video-animation" },
  { name: "Music Video", slug: "music-video", category: "video-animation" },
  
  // Motion Graphics & Animation
  { name: "After Effects", slug: "after-effects", category: "video-animation" },
  { name: "Motion Graphics", slug: "motion-graphics", category: "video-animation" },
  { name: "Animation 2D", slug: "animation-2d", category: "video-animation" },
  { name: "Animation 3D", slug: "animation-3d", category: "video-animation" },
  { name: "Cinema 4D", slug: "cinema-4d", category: "video-animation" },
  { name: "Blender", slug: "blender", category: "video-animation" },
  { name: "Maya", slug: "maya", category: "video-animation" },
  { name: "3ds Max", slug: "3ds-max", category: "video-animation" },
  { name: "Houdini", slug: "houdini", category: "video-animation" },
  { name: "Lottie Animation", slug: "lottie-animation", category: "video-animation" },
  { name: "Rive", slug: "rive", category: "video-animation" },
  { name: "Character Animation", slug: "character-animation", category: "video-animation" },
  { name: "Explainer Video", slug: "explainer-video", category: "video-animation" },
  { name: "Whiteboard Animation", slug: "whiteboard-animation", category: "video-animation" },
  { name: "Logo Animation", slug: "logo-animation", category: "video-animation" },
  { name: "Intro/Outro", slug: "intro-outro", category: "video-animation" },
  { name: "Lyric Video", slug: "lyric-video", category: "video-animation" },
  { name: "VFX", slug: "vfx", category: "video-animation" },
  { name: "Compositing", slug: "compositing", category: "video-animation" },
  { name: "Green Screen", slug: "green-screen", category: "video-animation" },
  
  // Audio & Sound
  { name: "Audio Editing", slug: "audio-editing", category: "video-animation" },
  { name: "Sound Design", slug: "sound-design", category: "video-animation" },
  { name: "Voiceover", slug: "voiceover", category: "video-animation" },
  { name: "Podcast Editing", slug: "podcast-editing", category: "video-animation" },
  { name: "Music Production", slug: "music-production", category: "video-animation" },
  { name: "Mixing/Mastering", slug: "mixing-mastering", category: "video-animation" },
  { name: "Logic Pro", slug: "logic-pro", category: "video-animation" },
  { name: "Ableton Live", slug: "ableton-live", category: "video-animation" },
  { name: "Pro Tools", slug: "pro-tools", category: "video-animation" },
  { name: "FL Studio", slug: "fl-studio", category: "video-animation" },
  
  // ═══════════════════════════════════════════════════════════════
  // RÉDACTION & TRADUCTION (35+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  // Content Writing
  { name: "Copywriting", slug: "copywriting", category: "copywriting" },
  { name: "Rédaction SEO", slug: "redaction-seo", category: "redaction-web" },
  { name: "Content Writing", slug: "content-writing", category: "redaction-web" },
  { name: "Blog Writing", slug: "blog-writing", category: "redaction-web" },
  { name: "Article Writing", slug: "article-writing", category: "redaction-web" },
  { name: "Ghostwriting", slug: "ghostwriting", category: "copywriting" },
  { name: "Technical Writing", slug: "technical-writing", category: "redaction-web" },
  { name: "UX Writing", slug: "ux-writing-content", category: "copywriting" },
  { name: "Brand Voice", slug: "brand-voice", category: "copywriting" },
  { name: "Storytelling", slug: "storytelling", category: "copywriting" },
  { name: "Social Media Copy", slug: "social-media-copy", category: "copywriting" },
  { name: "Landing Page Copy", slug: "landing-page-copy", category: "copywriting" },
  { name: "Product Description", slug: "product-description-writing", category: "redaction-web" },
  { name: "Press Release", slug: "press-release", category: "redaction-web" },
  { name: "Script Writing", slug: "script-writing", category: "copywriting" },
  { name: "Resume Writing", slug: "resume-writing", category: "redaction-web" },
  { name: "Grant Writing", slug: "grant-writing", category: "redaction-web" },
  { name: "Speech Writing", slug: "speech-writing", category: "copywriting" },
  
  // Translation & Localization
  { name: "Traduction FR/EN", slug: "traduction-fr-en", category: "traduction" },
  { name: "Traduction FR/AR", slug: "traduction-fr-ar", category: "traduction" },
  { name: "Traduction EN/AR", slug: "traduction-en-ar", category: "traduction" },
  { name: "Traduction FR/ES", slug: "traduction-fr-es", category: "traduction" },
  { name: "Traduction FR/DE", slug: "traduction-fr-de", category: "traduction" },
  { name: "Traduction technique", slug: "traduction-technique", category: "traduction" },
  { name: "Traduction juridique", slug: "traduction-juridique", category: "traduction" },
  { name: "Traduction médicale", slug: "traduction-medicale", category: "traduction" },
  { name: "Localisation", slug: "localisation", category: "traduction" },
  { name: "Transcription", slug: "transcription", category: "traduction" },
  { name: "Sous-titrage", slug: "sous-titrage", category: "traduction" },
  { name: "Doublage", slug: "doublage", category: "traduction" },
  { name: "SDL Trados", slug: "sdl-trados", category: "traduction" },
  { name: "MemoQ", slug: "memoq", category: "traduction" },
  { name: "Relecture/Correction", slug: "relecture-correction", category: "traduction" },
  { name: "Proofreading", slug: "proofreading", category: "traduction" },
  { name: "Editing", slug: "editing", category: "traduction" },
  
  // ═══════════════════════════════════════════════════════════════
  // BUSINESS & CONSULTING (35+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  { name: "Business Plan", slug: "business-plan", category: "conseil-strategique" },
  { name: "Étude de marché", slug: "etude-marche", category: "conseil-strategique" },
  { name: "Business Strategy", slug: "business-strategy", category: "conseil-strategique" },
  { name: "Financial Modeling", slug: "financial-modeling", category: "conseil-strategique" },
  { name: "Pitch Deck", slug: "pitch-deck", category: "conseil-strategique" },
  { name: "Investor Relations", slug: "investor-relations", category: "conseil-strategique" },
  { name: "Go-to-Market", slug: "go-to-market", category: "conseil-strategique" },
  { name: "Growth Hacking", slug: "growth-hacking", category: "conseil-strategique" },
  { name: "Market Research", slug: "market-research", category: "conseil-strategique" },
  { name: "Competitive Analysis", slug: "competitive-analysis", category: "conseil-strategique" },
  { name: "SWOT Analysis", slug: "swot-analysis", category: "conseil-strategique" },
  { name: "Business Development", slug: "business-development", category: "conseil-strategique" },
  { name: "Sales Strategy", slug: "sales-strategy", category: "conseil-strategique" },
  { name: "CRM", slug: "crm", category: "conseil-strategique" },
  { name: "Salesforce", slug: "salesforce", category: "conseil-strategique" },
  { name: "HubSpot CRM", slug: "hubspot-crm", category: "conseil-strategique" },
  { name: "Pipedrive", slug: "pipedrive", category: "conseil-strategique" },
  
  // Project Management
  { name: "Gestion de projet", slug: "gestion-projet", category: "conseil-strategique" },
  { name: "Scrum", slug: "scrum", category: "conseil-strategique" },
  { name: "Agile", slug: "agile", category: "conseil-strategique" },
  { name: "Kanban", slug: "kanban", category: "conseil-strategique" },
  { name: "Jira", slug: "jira", category: "conseil-strategique" },
  { name: "Asana", slug: "asana", category: "conseil-strategique" },
  { name: "Monday.com", slug: "monday", category: "conseil-strategique" },
  { name: "Trello", slug: "trello", category: "conseil-strategique" },
  { name: "Notion", slug: "notion", category: "conseil-strategique" },
  { name: "Linear", slug: "linear", category: "conseil-strategique" },
  { name: "ClickUp", slug: "clickup", category: "conseil-strategique" },
  { name: "Basecamp", slug: "basecamp", category: "conseil-strategique" },
  { name: "Microsoft Project", slug: "microsoft-project", category: "conseil-strategique" },
  { name: "Confluence", slug: "confluence", category: "conseil-strategique" },
  { name: "Product Management", slug: "product-management", category: "conseil-strategique" },
  { name: "OKRs", slug: "okrs", category: "conseil-strategique" },
  { name: "Roadmapping", slug: "roadmapping", category: "conseil-strategique" },
  
  // ═══════════════════════════════════════════════════════════════
  // FINANCE & COMPTABILITÉ (25+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  { name: "Comptabilité générale", slug: "comptabilite-generale", category: "comptabilite-finance" },
  { name: "Comptabilité analytique", slug: "comptabilite-analytique", category: "comptabilite-finance" },
  { name: "Fiscalité marocaine", slug: "fiscalite-marocaine", category: "comptabilite-finance" },
  { name: "Fiscalité française", slug: "fiscalite-francaise", category: "comptabilite-finance" },
  { name: "TVA", slug: "tva", category: "comptabilite-finance" },
  { name: "Bilan comptable", slug: "bilan-comptable", category: "comptabilite-finance" },
  { name: "Déclarations fiscales", slug: "declarations-fiscales", category: "comptabilite-finance" },
  { name: "Paie", slug: "paie", category: "comptabilite-finance" },
  { name: "Sage Comptabilité", slug: "sage-comptabilite", category: "comptabilite-finance" },
  { name: "QuickBooks", slug: "quickbooks", category: "comptabilite-finance" },
  { name: "Xero", slug: "xero", category: "comptabilite-finance" },
  { name: "FreshBooks", slug: "freshbooks", category: "comptabilite-finance" },
  { name: "Excel Finance", slug: "excel-finance", category: "comptabilite-finance" },
  { name: "Contrôle de gestion", slug: "controle-gestion", category: "comptabilite-finance" },
  { name: "Audit", slug: "audit", category: "comptabilite-finance" },
  { name: "Reporting financier", slug: "reporting-financier", category: "comptabilite-finance" },
  { name: "Trésorerie", slug: "tresorerie", category: "comptabilite-finance" },
  { name: "Facturation", slug: "facturation", category: "comptabilite-finance" },
  { name: "Recouvrement", slug: "recouvrement", category: "comptabilite-finance" },
  { name: "IFRS", slug: "ifrs", category: "comptabilite-finance" },
  { name: "Consolidation", slug: "consolidation", category: "comptabilite-finance" },
  { name: "Due Diligence", slug: "due-diligence", category: "comptabilite-finance" },
  { name: "Valorisation entreprise", slug: "valorisation-entreprise", category: "comptabilite-finance" },
  { name: "M&A", slug: "ma", category: "comptabilite-finance" },
  { name: "Crypto Accounting", slug: "crypto-accounting", category: "comptabilite-finance" },
  
  // ═══════════════════════════════════════════════════════════════
  // JURIDIQUE (20+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  { name: "Rédaction de contrats", slug: "redaction-contrats", category: "juridique" },
  { name: "Droit des affaires", slug: "droit-affaires", category: "juridique" },
  { name: "Droit commercial", slug: "droit-commercial", category: "juridique" },
  { name: "Droit du travail", slug: "droit-travail", category: "juridique" },
  { name: "RGPD/GDPR", slug: "rgpd-gdpr", category: "juridique" },
  { name: "Propriété intellectuelle", slug: "propriete-intellectuelle", category: "juridique" },
  { name: "Marques et brevets", slug: "marques-brevets", category: "juridique" },
  { name: "CGV/CGU", slug: "cgv-cgu", category: "juridique" },
  { name: "Politique de confidentialité", slug: "politique-confidentialite", category: "juridique" },
  { name: "Droit immobilier", slug: "droit-immobilier", category: "juridique" },
  { name: "Création d'entreprise", slug: "creation-entreprise", category: "juridique" },
  { name: "Statuts société", slug: "statuts-societe", category: "juridique" },
  { name: "Pacte d'associés", slug: "pacte-associes", category: "juridique" },
  { name: "Due diligence juridique", slug: "due-diligence-juridique", category: "juridique" },
  { name: "Contentieux", slug: "contentieux", category: "juridique" },
  { name: "Médiation", slug: "mediation", category: "juridique" },
  { name: "Arbitrage", slug: "arbitrage", category: "juridique" },
  { name: "Droit numérique", slug: "droit-numerique", category: "juridique" },
  { name: "Compliance", slug: "compliance", category: "juridique" },
  { name: "Legal Operations", slug: "legal-operations", category: "juridique" },
  
  // ═══════════════════════════════════════════════════════════════
  // RESSOURCES HUMAINES (20+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  { name: "Recrutement", slug: "recrutement", category: "business-conseil" },
  { name: "Sourcing", slug: "sourcing", category: "business-conseil" },
  { name: "LinkedIn Recruiting", slug: "linkedin-recruiting", category: "business-conseil" },
  { name: "ATS", slug: "ats", category: "business-conseil" },
  { name: "Onboarding", slug: "onboarding", category: "business-conseil" },
  { name: "Formation", slug: "formation", category: "business-conseil" },
  { name: "Gestion des talents", slug: "gestion-talents", category: "business-conseil" },
  { name: "Performance Management", slug: "performance-management", category: "business-conseil" },
  { name: "Compensation & Benefits", slug: "compensation-benefits", category: "business-conseil" },
  { name: "Employee Engagement", slug: "employee-engagement", category: "business-conseil" },
  { name: "Culture d'entreprise", slug: "culture-entreprise", category: "business-conseil" },
  { name: "Employer Branding", slug: "employer-branding", category: "business-conseil" },
  { name: "HR Analytics", slug: "hr-analytics", category: "business-conseil" },
  { name: "SIRH", slug: "sirh", category: "business-conseil" },
  { name: "Workday", slug: "workday", category: "business-conseil" },
  { name: "BambooHR", slug: "bamboohr", category: "business-conseil" },
  { name: "Remote Work", slug: "remote-work", category: "business-conseil" },
  { name: "Team Building", slug: "team-building", category: "business-conseil" },
  { name: "Coaching", slug: "coaching", category: "business-conseil" },
  { name: "Leadership", slug: "leadership", category: "business-conseil" },
  
  // ═══════════════════════════════════════════════════════════════
  // AUTRES SKILLS POPULAIRES (30+ skills)
  // ═══════════════════════════════════════════════════════════════
  
  // Automation & No-Code
  { name: "Zapier", slug: "zapier", category: "ia-machine-learning" },
  { name: "Make (Integromat)", slug: "make-integromat", category: "ia-machine-learning" },
  { name: "n8n", slug: "n8n", category: "ia-machine-learning" },
  { name: "Airtable", slug: "airtable", category: "ia-machine-learning" },
  { name: "Retool", slug: "retool", category: "ia-machine-learning" },
  { name: "Appsmith", slug: "appsmith", category: "ia-machine-learning" },
  
  // Collaboration Tools
  { name: "Slack", slug: "slack", category: "conseil-strategique" },
  { name: "Microsoft Teams", slug: "microsoft-teams", category: "conseil-strategique" },
  { name: "Discord", slug: "discord", category: "conseil-strategique" },
  { name: "Zoom", slug: "zoom", category: "conseil-strategique" },
  { name: "Google Workspace", slug: "google-workspace", category: "conseil-strategique" },
  { name: "Microsoft 365", slug: "microsoft-365", category: "conseil-strategique" },
  { name: "Figma Collaboration", slug: "figma-collaboration", category: "ui-ux-design" },
  { name: "Miro", slug: "miro", category: "conseil-strategique" },
  { name: "FigJam", slug: "figjam", category: "ui-ux-design" },
  { name: "Loom", slug: "loom", category: "conseil-strategique" },
  
  // Security
  { name: "Cybersecurity", slug: "cybersecurity", category: "devops-cloud" },
  { name: "Penetration Testing", slug: "penetration-testing", category: "devops-cloud" },
  { name: "OWASP", slug: "owasp", category: "devops-cloud" },
  { name: "SOC 2", slug: "soc-2", category: "devops-cloud" },
  { name: "ISO 27001", slug: "iso-27001", category: "devops-cloud" },
  { name: "Security Audit", slug: "security-audit", category: "devops-cloud" },
  { name: "Bug Bounty", slug: "bug-bounty", category: "devops-cloud" },
  
  // Gaming & 3D
  { name: "Unity", slug: "unity", category: "video-animation" },
  { name: "Unreal Engine", slug: "unreal-engine", category: "video-animation" },
  { name: "Game Design", slug: "game-design", category: "video-animation" },
  { name: "3D Modeling", slug: "3d-modeling", category: "video-animation" },
  { name: "3D Rendering", slug: "3d-rendering", category: "video-animation" },
  { name: "ZBrush", slug: "zbrush", category: "video-animation" },
  { name: "Substance Painter", slug: "substance-painter", category: "video-animation" },
  
  // Blockchain & Web3
  { name: "Blockchain", slug: "blockchain", category: "developpement-web" },
  { name: "Solidity", slug: "solidity", category: "developpement-web" },
  { name: "Smart Contracts", slug: "smart-contracts", category: "developpement-web" },
  { name: "Ethereum", slug: "ethereum", category: "developpement-web" },
  { name: "Web3.js", slug: "web3js", category: "developpement-web" },
  { name: "NFT Development", slug: "nft-development", category: "developpement-web" },
  { name: "DeFi", slug: "defi", category: "developpement-web" },
  { name: "Hardhat", slug: "hardhat", category: "developpement-web" },
  { name: "Foundry", slug: "foundry", category: "developpement-web" },
]

async function main() {
  console.log("🌱 Seeding skills/technologies (400+ skills)...")

  // Get category IDs by slug from translations
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
  let categoryNotFound = 0

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
    
    if (!categoryId) {
      categoryNotFound++
      console.log(`⚠️  Category not found for skill "${skill.name}": ${skill.category}`)
    }

    // Create skill with translations (FR, EN, AR)
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

  console.log(`\n✅ Summary:`)
  console.log(`   - Created: ${created} skills`)
  console.log(`   - Skipped (existing): ${skipped}`)
  console.log(`   - Category not found: ${categoryNotFound}`)
  console.log(`   - Total in seed data: ${skillsData.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
