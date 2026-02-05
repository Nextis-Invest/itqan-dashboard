import type { Metadata } from "next"
import { Layers } from "lucide-react"

export const metadata: Metadata = { title: "Services" }

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Layers className="h-6 w-6 text-lime-400" />
          Services
        </h2>
        <p className="text-muted-foreground mt-1">Découvrez les services proposés</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border bg-card/30">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <Layers className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-base font-medium">Bientôt disponible</p>
        <p className="text-muted-foreground text-sm mt-1">Le catalogue de services arrive prochainement.</p>
      </div>
    </div>
  )
}
