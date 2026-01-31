"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Award, Loader2, X } from "lucide-react"
import { adminAssignBadge, adminRemoveBadge } from "@/lib/actions/badge"

const BADGE_TYPES = [
  { type: "VERIFIED", label: "Vérifié", icon: "✅" },
  { type: "TOP_RATED", label: "Top Rated", icon: "⭐" },
  { type: "RISING_TALENT", label: "Talent montant", icon: "🚀" },
  { type: "EXPERT", label: "Expert", icon: "🏆" },
  { type: "FAST_RESPONDER", label: "Réponse rapide", icon: "⚡" },
]

type BadgeItem = { id: string; type: string; name: string; icon?: string | null }

export function AdminBadgeManager({
  userId,
  currentBadges,
}: {
  userId: string
  currentBadges: BadgeItem[]
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const [badges, setBadges] = useState(currentBadges)
  const [open, setOpen] = useState(false)

  const hasBadge = (type: string) => badges.some((b) => b.type === type)

  return (
    <div className="relative inline-block">
      <Button
        size="sm"
        variant="ghost"
        className="text-neutral-400 hover:text-yellow-400 h-8 w-8 p-0"
        title="Gérer les badges"
        onClick={() => setOpen(!open)}
      >
        <Award className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-neutral-900 border border-neutral-700 rounded-lg p-3 shadow-lg min-w-[200px]">
          <p className="text-xs text-neutral-400 mb-2 font-medium">Badges</p>
          <div className="space-y-1">
            {BADGE_TYPES.map((bt) => {
              const has = hasBadge(bt.type)
              return (
                <button
                  key={bt.type}
                  disabled={loading === bt.type}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors ${
                    has
                      ? "bg-lime-400/10 text-lime-400"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                  onClick={async () => {
                    setLoading(bt.type)
                    if (has) {
                      await adminRemoveBadge(userId, bt.type)
                      setBadges(badges.filter((b) => b.type !== bt.type))
                    } else {
                      await adminAssignBadge(userId, bt.type)
                      setBadges([...badges, { id: "", type: bt.type, name: bt.label, icon: bt.icon }])
                    }
                    setLoading(null)
                  }}
                >
                  {loading === bt.type ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>{bt.icon}</span>
                  )}
                  <span>{bt.label}</span>
                  {has && <X className="h-3 w-3 ml-auto" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
