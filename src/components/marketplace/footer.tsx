import Link from "next/link"

export function MarketplaceFooter() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-lime-400">إتقان</span>
            <span className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Itqan — Marketplace de freelances
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="#" className="hover:text-white transition-colors">
              À propos
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              CGU
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
