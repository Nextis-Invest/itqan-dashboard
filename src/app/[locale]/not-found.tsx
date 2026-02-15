import Link from "next/link"
import { ArrowLeft, Home, Plus } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-950">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-lime-400 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Page introuvable
        </h1>
        <p className="text-neutral-400 mb-8">
          Cette page n'existe pas ou a été supprimée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-6 py-3 font-semibold text-black hover:bg-lime-300 transition-colors"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/missions/new"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Link>
        </div>
        <div className="mt-12 text-sm text-neutral-500">
          <Link
            href="https://itqan.ma"
            className="text-lime-400 hover:text-lime-300 transition-colors"
          >
            ← Retour sur itqan.ma
          </Link>
        </div>
      </div>
    </main>
  )
}
