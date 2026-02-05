import { prisma } from "@/lib/prisma"
import { MarketplaceNavbar } from "@/components/marketplace/navbar"
import { MarketplaceFooter } from "@/components/marketplace/footer"

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await prisma.category.findMany({
    where: { level: 0 },
    orderBy: { order: "asc" },
    select: { slug: true, name: true, icon: true },
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketplaceNavbar categories={categories} />
      <main className="flex-1 px-4 md:px-6 py-6">{children}</main>
      <MarketplaceFooter />
    </div>
  )
}
