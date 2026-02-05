import type { Metadata } from "next"
import { FolderKanban } from "lucide-react"

export const metadata: Metadata = { title: "Projets" }

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <FolderKanban className="h-6 w-6 text-lime-400" />
          Projets
        </h2>
        <p className="text-muted-foreground mt-1">Gérez vos projets en cours</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border bg-card/30">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <FolderKanban className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-base font-medium">Bientôt disponible</p>
        <p className="text-muted-foreground text-sm mt-1">La gestion de projets arrive prochainement.</p>
      </div>
    </div>
  )
}
