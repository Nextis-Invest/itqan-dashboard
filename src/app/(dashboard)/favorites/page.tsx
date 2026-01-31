"use client"

import { useEffect, useState, useTransition } from "react"
import { getFavorites, toggleFavoriteFreelancer, toggleFavoriteMission } from "@/lib/actions/favorite"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, User, Briefcase, X } from "lucide-react"

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
          <h2 className="text-2xl font-bold text-white tracking-tight">Favoris</h2>
          <p className="text-neutral-400 mt-1">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Favoris</h2>
        <p className="text-neutral-400 mt-1">Vos freelances et missions sauvegardés</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("freelancers")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "freelancers"
              ? "bg-lime-400/10 text-lime-400"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <User className="h-4 w-4" />
          Freelances favoris ({freelancers.length})
        </button>
        <button
          onClick={() => setActiveTab("missions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "missions"
              ? "bg-lime-400/10 text-lime-400"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Missions favorites ({missions.length})
        </button>
      </div>

      {/* Freelancers Tab */}
      {activeTab === "freelancers" && (
        <>
          {freelancers.length === 0 ? (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="py-12">
                <div className="text-neutral-500 text-sm text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
                  <p>Aucun freelance en favori.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {freelancers.map((freelancer) => (
                <Card key={freelancer.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-white font-medium">
                          {freelancer.name || freelancer.email}
                        </p>
                        {freelancer.freelancerProfile?.title && (
                          <p className="text-lime-400 text-sm">{freelancer.freelancerProfile.title}</p>
                        )}
                        {freelancer.freelancerProfile?.city && (
                          <p className="text-neutral-500 text-xs">{freelancer.freelancerProfile.city}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFreelancer(freelancer.id)}
                        disabled={isPending}
                        className="text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Retirer des favoris"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {freelancer.freelancerProfile?.skills && freelancer.freelancerProfile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {freelancer.freelancerProfile.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} className="bg-neutral-800 text-neutral-300 border-0 text-[10px]">
                            {skill}
                          </Badge>
                        ))}
                        {freelancer.freelancerProfile.skills.length > 3 && (
                          <Badge className="bg-neutral-800 text-neutral-500 border-0 text-[10px]">
                            +{freelancer.freelancerProfile.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    {freelancer.freelancerProfile?.dailyRate && (
                      <p className="text-neutral-400 text-xs mt-2">
                        {freelancer.freelancerProfile.dailyRate} {freelancer.freelancerProfile.currency}/jour
                      </p>
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
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="py-12">
                <div className="text-neutral-500 text-sm text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
                  <p>Aucune mission en favori.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {missions.map((mission) => (
                <Card key={mission.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-white font-medium text-sm">{mission.title}</p>
                        {mission.client?.name && (
                          <p className="text-neutral-500 text-xs">Par {mission.client.name}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveMission(mission.id)}
                        disabled={isPending}
                        className="text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Retirer des favoris"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      {mission.budget && (
                        <span className="text-lime-400 text-sm font-medium">
                          {mission.budget} {mission.currency}
                        </span>
                      )}
                      <Badge className="bg-neutral-800 text-neutral-400 border-0 text-[10px]">
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
