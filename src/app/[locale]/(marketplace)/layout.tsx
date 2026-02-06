import { MarketplaceNavbar } from "@/components/marketplace/navbar"
import { MarketplaceFooter } from "@/components/marketplace/footer"
import { MobileBottomNav } from "@/components/marketplace/mobile-bottom-nav"
import { getCategoriesFromCatalog } from "@/lib/categories"

export default async function MarketplaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  const catalogCategories = await getCategoriesFromCatalog(locale)
  
  // Transform to navbar format
  const categories = catalogCategories.map(cat => ({
    slug: cat.slug,
    name: cat.name,
    icon: cat.icon,
    children: cat.subcategories.map(sub => ({
      slug: sub.slug,
      name: sub.name,
    })),
  }))

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketplaceNavbar categories={categories} />
      <main className="flex-1 px-4 md:px-6 py-6 pb-20 md:pb-6">{children}</main>
      <MarketplaceFooter />
      <MobileBottomNav />
    </div>
  )
}
