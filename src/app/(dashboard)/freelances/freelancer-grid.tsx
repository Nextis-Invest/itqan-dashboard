"use client"

import { useRouter } from "next/navigation"
import { FreelancerProfileCard, type StatConfig } from "@/components/ui/freelancer-profile-card"
import { Badge } from "@/components/ui/badge"
import { Star, Briefcase, DollarSign } from "lucide-react"

type SerializedFreelancer = {
  id: string
  name: string | null
  email: string
  image: string | null
  freelancerProfile: {
    title: string | null
    avgRating: number | null
    dailyRate: number | null
    currency: string | null
    skills: string[]
    city: string | null
    verified: boolean
    available: boolean
  } | null
  _count: {
    freelanceMissions: number
  }
}

interface FreelancerGridProps {
  freelancers: SerializedFreelancer[]
}

export function FreelancerGrid({ freelancers }: FreelancerGridProps) {
  const router = useRouter()

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {freelancers.map((freelancer) => {
        const fp = freelancer.freelancerProfile
        const displayName = freelancer.name || freelancer.email
        const title = fp?.title || "Freelance"
        
        // Generate avatar URL if no image
        const avatarSrc = freelancer.image || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=a3e635&color=1a1a1a`
        
        // Use a simple gradient banner
        const bannerSrc = "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23a3e635;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23a3e635;stop-opacity:0.1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23grad)' /%3E%3C/svg%3E"
        
        // Build stats array for flexibility
        const stats: StatConfig[] = []
        
        // Stat 1: Rating
        if (fp?.avgRating !== null && fp?.avgRating !== undefined) {
          stats.push({
            icon: Star,
            value: fp.avgRating.toFixed(1),
            label: "note"
          })
        }
        
        // Stat 2: Missions count
        stats.push({
          icon: Briefcase,
          value: freelancer._count.freelanceMissions,
          label: "missions"
        })
        
        // Stat 3: Daily rate or "Non renseigné"
        if (fp?.dailyRate && fp?.currency) {
          stats.push({
            icon: DollarSign,
            value: `${fp.dailyRate} ${fp.currency}`,
            label: "TJM"
          })
        } else {
          stats.push({
            value: "Non renseigné",
            label: "TJM"
          })
        }
        
        // Render max 3 skills as badges
        const skills = (
          <>
            {fp?.skills.slice(0, 3).map((skill) => (
              <Badge 
                key={skill}
                className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px] px-1.5 py-0.5"
              >
                {skill}
              </Badge>
            ))}
          </>
        )
        
        // Build badges (Vérifié, Disponible)
        const badges = (
          <>
            {fp?.verified && (
              <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px] px-2 py-0.5">
                Vérifié
              </Badge>
            )}
            {fp?.available && (
              <Badge className="bg-green-400/10 text-green-400 border border-green-400/20 text-[10px] px-2 py-0.5">
                Disponible
              </Badge>
            )}
          </>
        )
        
        return (
          <FreelancerProfileCard
            key={freelancer.id}
            name={displayName}
            title={title}
            avatarSrc={avatarSrc}
            bannerSrc={bannerSrc}
            stats={stats}
            skills={skills}
            badges={badges}
            buttonLabel="Contacter"
            onGetInTouch={() => router.push(`/profile/${freelancer.id}`)}
            onBookmark={() => {
              // Optional: implement bookmark functionality
              console.log("Bookmark:", freelancer.id)
            }}
          />
        )
      })}
    </div>
  )
}
