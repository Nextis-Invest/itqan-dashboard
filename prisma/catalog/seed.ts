import { PrismaClient } from '@prisma/client-catalog'

const prisma = new PrismaClient()

// All supported locales
const locales = [
  { id: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷', isDefault: true, sortOrder: 1 },
  { id: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇬🇧', isDefault: false, sortOrder: 2 },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦', isDefault: false, sortOrder: 3 },
  { id: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸', isDefault: false, sortOrder: 4 },
  { id: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪', isDefault: false, sortOrder: 5 },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', flag: '🇵🇹', isDefault: false, sortOrder: 6 },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', flag: '🇮🇹', isDefault: false, sortOrder: 7 },
  { id: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', flag: '🇳🇱', isDefault: false, sortOrder: 8 },
  { id: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷', isDefault: false, sortOrder: 9 },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵', isDefault: false, sortOrder: 10 },
]

type Translations = Record<string, { name: string; slug: string }>

// Main categories with all translations
const categories: Array<{
  icon: string
  color: string
  translations: Translations
  subcategories?: Array<{
    icon: string
    avgTjmMin: number
    avgTjmMax: number
    translations: Translations
  }>
}> = [
  {
    icon: 'Palette',
    color: '#8B5CF6',
    translations: {
      fr: { name: 'Design & Graphisme', slug: 'design-graphisme' },
      en: { name: 'Graphics & Design', slug: 'graphics-design' },
      ar: { name: 'التصميم والجرافيك', slug: 'تصميم-جرافيك' },
      es: { name: 'Diseño Gráfico', slug: 'diseno-grafico' },
      de: { name: 'Grafik & Design', slug: 'grafik-design' },
      pt: { name: 'Design Gráfico', slug: 'design-grafico' },
      it: { name: 'Grafica & Design', slug: 'grafica-design' },
      nl: { name: 'Grafisch Ontwerp', slug: 'grafisch-ontwerp' },
      tr: { name: 'Grafik Tasarım', slug: 'grafik-tasarim' },
      ja: { name: 'グラフィックデザイン', slug: 'graphic-design' },
    },
    subcategories: [
      {
        icon: 'PenTool',
        avgTjmMin: 300, avgTjmMax: 800,
        translations: {
          fr: { name: 'Logo & Identité', slug: 'logo-identite' },
          en: { name: 'Logo & Brand Identity', slug: 'logo-brand-identity' },
          ar: { name: 'الشعارات والهوية', slug: 'شعارات-هوية' },
          es: { name: 'Logo e Identidad', slug: 'logo-identidad' },
          de: { name: 'Logo & Markenidentität', slug: 'logo-markenidentitaet' },
          pt: { name: 'Logo e Identidade', slug: 'logo-identidade' },
          it: { name: 'Logo e Identità', slug: 'logo-identita' },
          nl: { name: 'Logo & Huisstijl', slug: 'logo-huisstijl' },
          tr: { name: 'Logo ve Kimlik', slug: 'logo-kimlik' },
          ja: { name: 'ロゴ・ブランド', slug: 'logo-brand' },
        },
      },
      {
        icon: 'Monitor',
        avgTjmMin: 400, avgTjmMax: 1200,
        translations: {
          fr: { name: 'Web Design', slug: 'web-design' },
          en: { name: 'Web Design', slug: 'web-design' },
          ar: { name: 'تصميم الويب', slug: 'تصميم-ويب' },
          es: { name: 'Diseño Web', slug: 'diseno-web' },
          de: { name: 'Webdesign', slug: 'webdesign' },
          pt: { name: 'Web Design', slug: 'web-design' },
          it: { name: 'Web Design', slug: 'web-design' },
          nl: { name: 'Webdesign', slug: 'webdesign' },
          tr: { name: 'Web Tasarım', slug: 'web-tasarim' },
          ja: { name: 'Webデザイン', slug: 'web-design' },
        },
      },
      {
        icon: 'Smartphone',
        avgTjmMin: 500, avgTjmMax: 1500,
        translations: {
          fr: { name: 'UI/UX Design', slug: 'ui-ux-design' },
          en: { name: 'UI/UX Design', slug: 'ui-ux-design' },
          ar: { name: 'تصميم واجهات', slug: 'تصميم-واجهات' },
          es: { name: 'Diseño UI/UX', slug: 'diseno-ui-ux' },
          de: { name: 'UI/UX Design', slug: 'ui-ux-design' },
          pt: { name: 'Design UI/UX', slug: 'design-ui-ux' },
          it: { name: 'Design UI/UX', slug: 'design-ui-ux' },
          nl: { name: 'UI/UX Ontwerp', slug: 'ui-ux-ontwerp' },
          tr: { name: 'UI/UX Tasarım', slug: 'ui-ux-tasarim' },
          ja: { name: 'UI/UXデザイン', slug: 'ui-ux-design' },
        },
      },
      {
        icon: 'Image',
        avgTjmMin: 250, avgTjmMax: 600,
        translations: {
          fr: { name: 'Illustration', slug: 'illustration' },
          en: { name: 'Illustration', slug: 'illustration' },
          ar: { name: 'الرسوم التوضيحية', slug: 'رسوم-توضيحية' },
          es: { name: 'Ilustración', slug: 'ilustracion' },
          de: { name: 'Illustration', slug: 'illustration' },
          pt: { name: 'Ilustração', slug: 'ilustracao' },
          it: { name: 'Illustrazione', slug: 'illustrazione' },
          nl: { name: 'Illustratie', slug: 'illustratie' },
          tr: { name: 'İllüstrasyon', slug: 'ilustrasyon' },
          ja: { name: 'イラスト', slug: 'illustration' },
        },
      },
    ],
  },
  {
    icon: 'Code',
    color: '#3B82F6',
    translations: {
      fr: { name: 'Développement & IT', slug: 'developpement-it' },
      en: { name: 'Programming & Tech', slug: 'programming-tech' },
      ar: { name: 'التطوير والبرمجة', slug: 'تطوير-برمجة' },
      es: { name: 'Programación y Tech', slug: 'programacion-tech' },
      de: { name: 'Programmierung & Tech', slug: 'programmierung-tech' },
      pt: { name: 'Programação e Tech', slug: 'programacao-tech' },
      it: { name: 'Programmazione e Tech', slug: 'programmazione-tech' },
      nl: { name: 'Programmeren & Tech', slug: 'programmeren-tech' },
      tr: { name: 'Yazılım ve Teknoloji', slug: 'yazilim-teknoloji' },
      ja: { name: 'プログラミング', slug: 'programming-tech' },
    },
    subcategories: [
      {
        icon: 'Globe',
        avgTjmMin: 400, avgTjmMax: 1500,
        translations: {
          fr: { name: 'Développement Web', slug: 'developpement-web' },
          en: { name: 'Web Development', slug: 'web-development' },
          ar: { name: 'تطوير الويب', slug: 'تطوير-ويب' },
          es: { name: 'Desarrollo Web', slug: 'desarrollo-web' },
          de: { name: 'Webentwicklung', slug: 'webentwicklung' },
          pt: { name: 'Desenvolvimento Web', slug: 'desenvolvimento-web' },
          it: { name: 'Sviluppo Web', slug: 'sviluppo-web' },
          nl: { name: 'Webontwikkeling', slug: 'webontwikkeling' },
          tr: { name: 'Web Geliştirme', slug: 'web-gelistirme' },
          ja: { name: 'Web開発', slug: 'web-development' },
        },
      },
      {
        icon: 'Smartphone',
        avgTjmMin: 500, avgTjmMax: 2000,
        translations: {
          fr: { name: 'Développement Mobile', slug: 'developpement-mobile' },
          en: { name: 'Mobile Development', slug: 'mobile-development' },
          ar: { name: 'تطوير التطبيقات', slug: 'تطوير-تطبيقات' },
          es: { name: 'Desarrollo Móvil', slug: 'desarrollo-movil' },
          de: { name: 'Mobile Entwicklung', slug: 'mobile-entwicklung' },
          pt: { name: 'Desenvolvimento Mobile', slug: 'desenvolvimento-mobile' },
          it: { name: 'Sviluppo Mobile', slug: 'sviluppo-mobile' },
          nl: { name: 'Mobiele Ontwikkeling', slug: 'mobiele-ontwikkeling' },
          tr: { name: 'Mobil Geliştirme', slug: 'mobil-gelistirme' },
          ja: { name: 'モバイル開発', slug: 'mobile-development' },
        },
      },
      {
        icon: 'ShoppingCart',
        avgTjmMin: 400, avgTjmMax: 1200,
        translations: {
          fr: { name: 'E-commerce', slug: 'e-commerce' },
          en: { name: 'E-commerce', slug: 'e-commerce' },
          ar: { name: 'التجارة الإلكترونية', slug: 'تجارة-الكترونية' },
          es: { name: 'E-commerce', slug: 'e-commerce' },
          de: { name: 'E-Commerce', slug: 'e-commerce' },
          pt: { name: 'E-commerce', slug: 'e-commerce' },
          it: { name: 'E-commerce', slug: 'e-commerce' },
          nl: { name: 'E-commerce', slug: 'e-commerce' },
          tr: { name: 'E-ticaret', slug: 'e-ticaret' },
          ja: { name: 'Eコマース', slug: 'e-commerce' },
        },
      },
      {
        icon: 'Database',
        avgTjmMin: 600, avgTjmMax: 2500,
        translations: {
          fr: { name: 'DevOps & Cloud', slug: 'devops-cloud' },
          en: { name: 'DevOps & Cloud', slug: 'devops-cloud' },
          ar: { name: 'ديف أوبس والسحابة', slug: 'ديفوبس-سحابة' },
          es: { name: 'DevOps y Cloud', slug: 'devops-cloud' },
          de: { name: 'DevOps & Cloud', slug: 'devops-cloud' },
          pt: { name: 'DevOps e Cloud', slug: 'devops-cloud' },
          it: { name: 'DevOps e Cloud', slug: 'devops-cloud' },
          nl: { name: 'DevOps & Cloud', slug: 'devops-cloud' },
          tr: { name: 'DevOps ve Bulut', slug: 'devops-bulut' },
          ja: { name: 'DevOps・クラウド', slug: 'devops-cloud' },
        },
      },
      {
        icon: 'Bot',
        avgTjmMin: 700, avgTjmMax: 3000,
        translations: {
          fr: { name: 'IA & Machine Learning', slug: 'ia-machine-learning' },
          en: { name: 'AI & Machine Learning', slug: 'ai-machine-learning' },
          ar: { name: 'الذكاء الاصطناعي', slug: 'ذكاء-اصطناعي' },
          es: { name: 'IA y Machine Learning', slug: 'ia-machine-learning' },
          de: { name: 'KI & Machine Learning', slug: 'ki-machine-learning' },
          pt: { name: 'IA e Machine Learning', slug: 'ia-machine-learning' },
          it: { name: 'IA e Machine Learning', slug: 'ia-machine-learning' },
          nl: { name: 'AI & Machine Learning', slug: 'ai-machine-learning' },
          tr: { name: 'Yapay Zeka', slug: 'yapay-zeka' },
          ja: { name: 'AI・機械学習', slug: 'ai-machine-learning' },
        },
      },
    ],
  },
  {
    icon: 'TrendingUp',
    color: '#10B981',
    translations: {
      fr: { name: 'Marketing Digital', slug: 'marketing-digital' },
      en: { name: 'Digital Marketing', slug: 'digital-marketing' },
      ar: { name: 'التسويق الرقمي', slug: 'تسويق-رقمي' },
      es: { name: 'Marketing Digital', slug: 'marketing-digital' },
      de: { name: 'Digitales Marketing', slug: 'digitales-marketing' },
      pt: { name: 'Marketing Digital', slug: 'marketing-digital' },
      it: { name: 'Marketing Digitale', slug: 'marketing-digitale' },
      nl: { name: 'Digitale Marketing', slug: 'digitale-marketing' },
      tr: { name: 'Dijital Pazarlama', slug: 'dijital-pazarlama' },
      ja: { name: 'デジタルマーケティング', slug: 'digital-marketing' },
    },
    subcategories: [
      {
        icon: 'Search',
        avgTjmMin: 400, avgTjmMax: 1200,
        translations: {
          fr: { name: 'SEO', slug: 'seo' },
          en: { name: 'SEO', slug: 'seo' },
          ar: { name: 'تحسين محركات البحث', slug: 'سيو' },
          es: { name: 'SEO', slug: 'seo' },
          de: { name: 'SEO', slug: 'seo' },
          pt: { name: 'SEO', slug: 'seo' },
          it: { name: 'SEO', slug: 'seo' },
          nl: { name: 'SEO', slug: 'seo' },
          tr: { name: 'SEO', slug: 'seo' },
          ja: { name: 'SEO', slug: 'seo' },
        },
      },
      {
        icon: 'Share2',
        avgTjmMin: 300, avgTjmMax: 1000,
        translations: {
          fr: { name: 'Social Media', slug: 'social-media' },
          en: { name: 'Social Media Marketing', slug: 'social-media-marketing' },
          ar: { name: 'التسويق عبر السوشيال', slug: 'سوشيال-ميديا' },
          es: { name: 'Redes Sociales', slug: 'redes-sociales' },
          de: { name: 'Social Media Marketing', slug: 'social-media-marketing' },
          pt: { name: 'Redes Sociais', slug: 'redes-sociais' },
          it: { name: 'Social Media Marketing', slug: 'social-media-marketing' },
          nl: { name: 'Social Media Marketing', slug: 'social-media-marketing' },
          tr: { name: 'Sosyal Medya', slug: 'sosyal-medya' },
          ja: { name: 'SNSマーケティング', slug: 'social-media' },
        },
      },
      {
        icon: 'Mail',
        avgTjmMin: 300, avgTjmMax: 800,
        translations: {
          fr: { name: 'Email Marketing', slug: 'email-marketing' },
          en: { name: 'Email Marketing', slug: 'email-marketing' },
          ar: { name: 'التسويق بالبريد', slug: 'تسويق-بريد' },
          es: { name: 'Email Marketing', slug: 'email-marketing' },
          de: { name: 'E-Mail Marketing', slug: 'email-marketing' },
          pt: { name: 'Email Marketing', slug: 'email-marketing' },
          it: { name: 'Email Marketing', slug: 'email-marketing' },
          nl: { name: 'E-mail Marketing', slug: 'email-marketing' },
          tr: { name: 'E-posta Pazarlama', slug: 'eposta-pazarlama' },
          ja: { name: 'メールマーケティング', slug: 'email-marketing' },
        },
      },
      {
        icon: 'Target',
        avgTjmMin: 400, avgTjmMax: 1500,
        translations: {
          fr: { name: 'Publicité en ligne', slug: 'publicite-en-ligne' },
          en: { name: 'Paid Advertising', slug: 'paid-advertising' },
          ar: { name: 'الإعلانات المدفوعة', slug: 'اعلانات-مدفوعة' },
          es: { name: 'Publicidad Online', slug: 'publicidad-online' },
          de: { name: 'Online Werbung', slug: 'online-werbung' },
          pt: { name: 'Publicidade Online', slug: 'publicidade-online' },
          it: { name: 'Pubblicità Online', slug: 'pubblicita-online' },
          nl: { name: 'Online Adverteren', slug: 'online-adverteren' },
          tr: { name: 'Dijital Reklamcılık', slug: 'dijital-reklamcilik' },
          ja: { name: '有料広告', slug: 'paid-advertising' },
        },
      },
    ],
  },
  {
    icon: 'PenTool',
    color: '#F59E0B',
    translations: {
      fr: { name: 'Rédaction & Traduction', slug: 'redaction-traduction' },
      en: { name: 'Writing & Translation', slug: 'writing-translation' },
      ar: { name: 'الكتابة والترجمة', slug: 'كتابة-ترجمة' },
      es: { name: 'Redacción y Traducción', slug: 'redaccion-traduccion' },
      de: { name: 'Texten & Übersetzen', slug: 'texten-uebersetzen' },
      pt: { name: 'Redação e Tradução', slug: 'redacao-traducao' },
      it: { name: 'Scrittura e Traduzione', slug: 'scrittura-traduzione' },
      nl: { name: 'Schrijven & Vertalen', slug: 'schrijven-vertalen' },
      tr: { name: 'Yazı ve Çeviri', slug: 'yazi-ceviri' },
      ja: { name: 'ライティング・翻訳', slug: 'writing-translation' },
    },
    subcategories: [
      {
        icon: 'FileText',
        avgTjmMin: 200, avgTjmMax: 600,
        translations: {
          fr: { name: 'Rédaction Web', slug: 'redaction-web' },
          en: { name: 'Content Writing', slug: 'content-writing' },
          ar: { name: 'كتابة المحتوى', slug: 'كتابة-محتوى' },
          es: { name: 'Redacción Web', slug: 'redaccion-web' },
          de: { name: 'Content-Erstellung', slug: 'content-erstellung' },
          pt: { name: 'Redação Web', slug: 'redacao-web' },
          it: { name: 'Scrittura Web', slug: 'scrittura-web' },
          nl: { name: 'Contentcreatie', slug: 'contentcreatie' },
          tr: { name: 'Web İçerik Yazarlığı', slug: 'web-icerik-yazarligi' },
          ja: { name: 'Webライティング', slug: 'content-writing' },
        },
      },
      {
        icon: 'BookOpen',
        avgTjmMin: 300, avgTjmMax: 800,
        translations: {
          fr: { name: 'Copywriting', slug: 'copywriting' },
          en: { name: 'Copywriting', slug: 'copywriting' },
          ar: { name: 'كتابة إعلانية', slug: 'كتابة-اعلانية' },
          es: { name: 'Copywriting', slug: 'copywriting' },
          de: { name: 'Copywriting', slug: 'copywriting' },
          pt: { name: 'Copywriting', slug: 'copywriting' },
          it: { name: 'Copywriting', slug: 'copywriting' },
          nl: { name: 'Copywriting', slug: 'copywriting' },
          tr: { name: 'Metin Yazarlığı', slug: 'metin-yazarligi' },
          ja: { name: 'コピーライティング', slug: 'copywriting' },
        },
      },
      {
        icon: 'Languages',
        avgTjmMin: 250, avgTjmMax: 700,
        translations: {
          fr: { name: 'Traduction', slug: 'traduction' },
          en: { name: 'Translation', slug: 'translation' },
          ar: { name: 'الترجمة', slug: 'ترجمة' },
          es: { name: 'Traducción', slug: 'traduccion' },
          de: { name: 'Übersetzung', slug: 'uebersetzung' },
          pt: { name: 'Tradução', slug: 'traducao' },
          it: { name: 'Traduzione', slug: 'traduzione' },
          nl: { name: 'Vertaling', slug: 'vertaling' },
          tr: { name: 'Çeviri', slug: 'ceviri' },
          ja: { name: '翻訳', slug: 'translation' },
        },
      },
    ],
  },
  {
    icon: 'Video',
    color: '#EF4444',
    translations: {
      fr: { name: 'Vidéo & Animation', slug: 'video-animation' },
      en: { name: 'Video & Animation', slug: 'video-animation' },
      ar: { name: 'الفيديو والرسوم المتحركة', slug: 'فيديو-انيميشن' },
      es: { name: 'Vídeo y Animación', slug: 'video-animacion' },
      de: { name: 'Video & Animation', slug: 'video-animation' },
      pt: { name: 'Vídeo e Animação', slug: 'video-animacao' },
      it: { name: 'Video e Animazione', slug: 'video-animazione' },
      nl: { name: 'Video & Animatie', slug: 'video-animatie' },
      tr: { name: 'Video ve Animasyon', slug: 'video-animasyon' },
      ja: { name: '動画・アニメーション', slug: 'video-animation' },
    },
    subcategories: [
      {
        icon: 'Film',
        avgTjmMin: 400, avgTjmMax: 1500,
        translations: {
          fr: { name: 'Montage Vidéo', slug: 'montage-video' },
          en: { name: 'Video Editing', slug: 'video-editing' },
          ar: { name: 'مونتاج الفيديو', slug: 'مونتاج-فيديو' },
          es: { name: 'Edición de Vídeo', slug: 'edicion-video' },
          de: { name: 'Videoschnitt', slug: 'videoschnitt' },
          pt: { name: 'Edição de Vídeo', slug: 'edicao-video' },
          it: { name: 'Montaggio Video', slug: 'montaggio-video' },
          nl: { name: 'Videomontage', slug: 'videomontage' },
          tr: { name: 'Video Montaj', slug: 'video-montaj' },
          ja: { name: '動画編集', slug: 'video-editing' },
        },
      },
      {
        icon: 'Play',
        avgTjmMin: 500, avgTjmMax: 2000,
        translations: {
          fr: { name: 'Motion Design', slug: 'motion-design' },
          en: { name: 'Motion Graphics', slug: 'motion-graphics' },
          ar: { name: 'موشن جرافيك', slug: 'موشن-جرافيك' },
          es: { name: 'Motion Graphics', slug: 'motion-graphics' },
          de: { name: 'Motion Design', slug: 'motion-design' },
          pt: { name: 'Motion Graphics', slug: 'motion-graphics' },
          it: { name: 'Motion Graphics', slug: 'motion-graphics' },
          nl: { name: 'Motion Design', slug: 'motion-design' },
          tr: { name: 'Hareketli Grafik', slug: 'hareketli-grafik' },
          ja: { name: 'モーショングラフィックス', slug: 'motion-graphics' },
        },
      },
      {
        icon: 'Clapperboard',
        avgTjmMin: 600, avgTjmMax: 2500,
        translations: {
          fr: { name: 'Animation 2D/3D', slug: 'animation-2d-3d' },
          en: { name: '2D/3D Animation', slug: '2d-3d-animation' },
          ar: { name: 'الرسوم المتحركة', slug: 'رسوم-متحركة' },
          es: { name: 'Animación 2D/3D', slug: 'animacion-2d-3d' },
          de: { name: '2D/3D Animation', slug: '2d-3d-animation' },
          pt: { name: 'Animação 2D/3D', slug: 'animacao-2d-3d' },
          it: { name: 'Animazione 2D/3D', slug: 'animazione-2d-3d' },
          nl: { name: '2D/3D Animatie', slug: '2d-3d-animatie' },
          tr: { name: '2D/3D Animasyon', slug: '2d-3d-animasyon' },
          ja: { name: '2D/3Dアニメーション', slug: '2d-3d-animation' },
        },
      },
    ],
  },
  {
    icon: 'Briefcase',
    color: '#6366F1',
    translations: {
      fr: { name: 'Business & Conseil', slug: 'business-conseil' },
      en: { name: 'Business & Consulting', slug: 'business-consulting' },
      ar: { name: 'الأعمال والاستشارات', slug: 'اعمال-استشارات' },
      es: { name: 'Negocios y Consultoría', slug: 'negocios-consultoria' },
      de: { name: 'Business & Beratung', slug: 'business-beratung' },
      pt: { name: 'Negócios e Consultoria', slug: 'negocios-consultoria' },
      it: { name: 'Business e Consulenza', slug: 'business-consulenza' },
      nl: { name: 'Business & Advies', slug: 'business-advies' },
      tr: { name: 'İş ve Danışmanlık', slug: 'is-danismanlik' },
      ja: { name: 'ビジネス・コンサル', slug: 'business-consulting' },
    },
    subcategories: [
      {
        icon: 'LineChart',
        avgTjmMin: 500, avgTjmMax: 2000,
        translations: {
          fr: { name: 'Conseil Stratégique', slug: 'conseil-strategique' },
          en: { name: 'Strategy Consulting', slug: 'strategy-consulting' },
          ar: { name: 'الاستشارات الاستراتيجية', slug: 'استشارات-استراتيجية' },
          es: { name: 'Consultoría Estratégica', slug: 'consultoria-estrategica' },
          de: { name: 'Strategieberatung', slug: 'strategieberatung' },
          pt: { name: 'Consultoria Estratégica', slug: 'consultoria-estrategica' },
          it: { name: 'Consulenza Strategica', slug: 'consulenza-strategica' },
          nl: { name: 'Strategisch Advies', slug: 'strategisch-advies' },
          tr: { name: 'Strateji Danışmanlığı', slug: 'strateji-danismanligi' },
          ja: { name: '戦略コンサルティング', slug: 'strategy-consulting' },
        },
      },
      {
        icon: 'Calculator',
        avgTjmMin: 400, avgTjmMax: 1200,
        translations: {
          fr: { name: 'Comptabilité & Finance', slug: 'comptabilite-finance' },
          en: { name: 'Accounting & Finance', slug: 'accounting-finance' },
          ar: { name: 'المحاسبة والمالية', slug: 'محاسبة-مالية' },
          es: { name: 'Contabilidad y Finanzas', slug: 'contabilidad-finanzas' },
          de: { name: 'Buchhaltung & Finanzen', slug: 'buchhaltung-finanzen' },
          pt: { name: 'Contabilidade e Finanças', slug: 'contabilidade-financas' },
          it: { name: 'Contabilità e Finanza', slug: 'contabilita-finanza' },
          nl: { name: 'Boekhouding & Financiën', slug: 'boekhouding-financien' },
          tr: { name: 'Muhasebe ve Finans', slug: 'muhasebe-finans' },
          ja: { name: '会計・財務', slug: 'accounting-finance' },
        },
      },
      {
        icon: 'Scale',
        avgTjmMin: 600, avgTjmMax: 2500,
        translations: {
          fr: { name: 'Juridique', slug: 'juridique' },
          en: { name: 'Legal Services', slug: 'legal-services' },
          ar: { name: 'الخدمات القانونية', slug: 'خدمات-قانونية' },
          es: { name: 'Servicios Legales', slug: 'servicios-legales' },
          de: { name: 'Rechtsdienstleistungen', slug: 'rechtsdienstleistungen' },
          pt: { name: 'Serviços Jurídicos', slug: 'servicos-juridicos' },
          it: { name: 'Servizi Legali', slug: 'servizi-legali' },
          nl: { name: 'Juridische Diensten', slug: 'juridische-diensten' },
          tr: { name: 'Hukuk Hizmetleri', slug: 'hukuk-hizmetleri' },
          ja: { name: '法務サービス', slug: 'legal-services' },
        },
      },
    ],
  },
]

async function main() {
  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.categoryTranslation.deleteMany()
  await prisma.category.deleteMany()
  await prisma.locale.deleteMany()

  console.log('🌍 Seeding locales...')
  for (const locale of locales) {
    await prisma.locale.create({ data: locale })
  }
  console.log(`✅ ${locales.length} locales seeded`)

  console.log('📁 Seeding categories...')
  let categoryCount = 0
  let subcategoryCount = 0

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i]
    
    // Create parent category
    const parent = await prisma.category.create({
      data: {
        icon: cat.icon,
        color: cat.color,
        level: 0,
        sortOrder: i,
        translations: {
          create: Object.entries(cat.translations).map(([locale, t]) => ({
            locale,
            name: t.name,
            slug: t.slug,
          })),
        },
      },
    })
    categoryCount++

    // Create subcategories
    for (let j = 0; j < (cat.subcategories?.length || 0); j++) {
      const sub = cat.subcategories![j]
      await prisma.category.create({
        data: {
          parentId: parent.id,
          icon: sub.icon,
          level: 1,
          sortOrder: j,
          avgTjmMin: sub.avgTjmMin,
          avgTjmMax: sub.avgTjmMax,
          translations: {
            create: Object.entries(sub.translations).map(([locale, t]) => ({
              locale,
              name: t.name,
              slug: t.slug,
            })),
          },
        },
      })
      subcategoryCount++
    }
  }

  console.log(`✅ ${categoryCount} categories + ${subcategoryCount} subcategories seeded`)
  console.log(`📊 Total translations: ${(categoryCount + subcategoryCount) * locales.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
