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

const badgeGlowColors: Record<string, string> = {
  VERIFIED: "shadow-lime-400/30 border-lime-400/30",
  TOP_RATED: "shadow-yellow-400/30 border-yellow-400/30",
  RISING_TALENT: "shadow-blue-400/30 border-blue-400/30",
  EXPERT: "shadow-purple-400/30 border-purple-400/30",
}

export function BadgeDisplay({ badges }: { badges: BadgeItem[] }) {
  if (!badges || badges.length === 0) return null

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5">
        {badges.map((badge) => {
          const glowCls = badgeGlowColors[badge.type] || "shadow-muted/20 border-border/50"
          return (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <span
                  className={`inline-flex items-center justify-center h-7 w-7 rounded-full bg-secondary/80 border text-sm cursor-help shadow-md transition-all hover:scale-110 hover:shadow-lg ${glowCls}`}
                  title={badge.name}
                >
                  {badge.icon || "🏅"}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary border-border text-foreground">
                <p className="font-medium text-sm">{badge.name}</p>
                {badge.description && <p className="text-muted-foreground text-xs mt-0.5">{badge.description}</p>}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
