import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type BadgeItem = {
  id: string
  type: string
  name: string
  description?: string | null
  icon?: string | null
}

export function BadgeDisplay({ badges }: { badges: BadgeItem[] }) {
  if (!badges || badges.length === 0) return null

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {badges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-neutral-800 border border-neutral-700 text-xs cursor-help" title={badge.name}>
                {badge.icon || "🏅"}
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-800 border-neutral-700 text-white">
              <p className="font-medium">{badge.name}</p>
              {badge.description && <p className="text-neutral-400 text-xs">{badge.description}</p>}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
