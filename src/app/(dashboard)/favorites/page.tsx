"use client"

import { useEffect, useState, useTransition } from "react"
import { getFavorites, toggleFavoriteFreelancer, toggleFavoriteMission } from "@/lib/actions/favorite"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, User, Briefcase, X, MapPin, Star, Coins, Search } from "lucide-react"
import Link from "next/link"

type Freelancer = {
  id: string
  name: string | null
  email: string
  freelancerProfile: {
    title: string | null
    skills: string[]
    city: string | null
    dailyRate: number | null
    currency: string
  } | null
}

type Mission = {
  id: string
  title: string
  budget: number | null
  currency: string
  status: string
  client: { name: string | null }
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<"freelancers" | "missions">("freelancers")
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getFavorites().then((data) => {
      setFreelancers(data.freelancers as Freelancer[])
      setMissions(data.missions as Mission[])
      setLoading(false)
    })
  }, [])

  const handleRemoveFreelancer = (freelancerId: string) => {
    startTransition(async () => {
      await toggleFavoriteFreelancer(freelancerId)
      setFreelancers((prev) => prev.filter((f) => f.id !== freelancerId))
    })
  }

  const handleRemoveMission = (missionId: string) => {
    startTransition(async () => {
      await toggleFavoriteMission(missionId)
      setMissions((prev) => prev.filter((m) => m.id !== missionId))
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Favoris</h2>
          <p className="text-muted-foreground mt-1">Chargement...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Favoris</h2>
        <p className="text-muted-foreground mt-1">Vos freelances et missions sauvegardés</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card/80 border border-border rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("freelancers")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "freelancers"
              ? "bg-lime-400/10 text-lime-400 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          Freelances ({freelancers.length})
        </button>
        <button
          onClick={() => setActiveTab("missions")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "missions"
              ? "bg-lime-400/10 text-lime-400 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Missions ({missions.length})
        </button>
      </div>

      {/* Freelancers Tab */}
      {activeTab === "freelancers" && (
        <>
          {freelancers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-5 rounded-2xl bg-red-400/5 p-6 ring-1 ring-red-400/10">
                <Heart className="h-10 w-10 text-red-400/40" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground">Aucun favori</h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Ajoutez des freelances en favoris pour les retrouver facilement</p>
              <Link href="/search" className="mt-4 text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors flex items-center gap-1">
                <Search className="h-3.5 w-3.5" />
                Explorer les freelances
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {freelancers.map((freelancer) => (
                <Card key={freelancer.id} className="group bg-card/80 border-border hover:border-border hover:bg-accent transition-all duration-300">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between">
                      <Link href={`/profile/${freelancer.id}`} className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-lime-400/20 to-lime-400/5 flex items-center justify-center text-lime-400 font-bold text-sm shrink-0">
                            {(freelancer.name || freelancer.email)[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-foreground font-semibold group-hover:text-lime-400 transition-colors truncate">
                              {freelancer.name || freelancer.email}
                            </p>
                            {freelancer.freelancerProfile?.title && (
                              <p className="text-lime-400/70 text-xs truncate">{freelancer.freelancerProfile.title}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleRemoveFreelancer(freelancer.id)}
                        disabled={isPending}
                        className="text-muted-foreground hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-400/10 disabled:opacity-50"
                        title="Retirer des favoris"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {freelancer.freelancerProfile?.city && (
                      <div className="flex items-center gap-1 mt-3 text-muted-foreground text-xs">
                        <MapPin className="h-3 w-3" />
                        {freelancer.freelancerProfile.city}
                      </div>
                    )}
                    {freelancer.freelancerProfile?.skills && freelancer.freelancerProfile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {freelancer.freelancerProfile.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} className="bg-secondary/80 text-foreground/80 border-0 text-[10px] font-medium">
                            {skill}
                          </Badge>
                        ))}
                        {freelancer.freelancerProfile.skills.length > 3 && (
                          <Badge className="bg-secondary/50 text-muted-foreground border-0 text-[10px]">
                            +{freelancer.freelancerProfile.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    {freelancer.freelancerProfile?.dailyRate && (
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
                        <Coins className="h-3 w-3 text-lime-400/70" />
                        <span className="text-foreground font-semibold text-sm">
                          {freelancer.freelancerProfile.dailyRate} {freelancer.freelancerProfile.currency}
                        </span>
                        <span className="text-muted-foreground text-xs">/jour</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Missions Tab */}
      {activeTab === "missions" && (
        <>
          {missions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-5 rounded-2xl bg-red-400/5 p-6 ring-1 ring-red-400/10">
                <Heart className="h-10 w-10 text-red-400/40" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground">Aucune mission en favori</h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Sauvegardez des missions pour y postuler plus tard</p>
              <Link href="/missions" className="mt-4 text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors flex items-center gap-1">
                <Search className="h-3.5 w-3.5" />
                Explorer les missions
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {missions.map((mission) => (
                <Card key={mission.id} className="group bg-card/80 border-border hover:border-border hover:bg-accent transition-all duration-300">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between">
                      <Link href={`/missions/${mission.id}`} className="min-w-0 flex-1">
                        <p className="text-foreground font-semibold text-sm group-hover:text-lime-400 transition-colors">
                          {mission.title}
                        </p>
                        {mission.client?.name && (
                          <p className="text-muted-foreground text-xs mt-1">Par {mission.client.name}</p>
                        )}
                      </Link>
                      <button
                        onClick={() => handleRemoveMission(mission.id)}
                        disabled={isPending}
                        className="text-muted-foreground hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-400/10 disabled:opacity-50"
                        title="Retirer des favoris"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                      {mission.budget && (
                        <span className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-lime-400/70" />
                          <span className="text-lime-400 text-sm font-bold">{mission.budget} {mission.currency}</span>
                        </span>
                      )}
                      <Badge className="bg-secondary/80 text-muted-foreground border-0 text-[10px]">
                        {mission.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
