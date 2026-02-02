"use client"

import { FreelancerProfileCard, StatConfig, BadgeConfig } from "@/components/ui/freelancer-profile-card"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  id: string
  name: string
  title: string
  avatarSrc: string
  bannerSrc?: string
  stats: StatConfig[]
  badges?: BadgeConfig[]
  buttonLabel?: string
  hideButton?: boolean
  hideBookmark?: boolean
  onGetInTouch?: () => void
}

export function FreelancerCardClient({
  id,
  name,
  title,
  avatarSrc,
  bannerSrc = "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23a3e635;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%23a3e635;stop-opacity:0.05'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23g)'/%3E%3C/svg%3E",
  stats,
  badges,
  buttonLabel = "Voir profil",
  hideButton = false,
  hideBookmark = true,
  onGetInTouch,
}: Props) {
  const router = useRouter()

  const handleGetInTouch = onGetInTouch || (() => {
    router.push(`/profile/${id}`)
  })

  return (
    <FreelancerProfileCard
      name={name}
      title={title}
      avatarSrc={avatarSrc}
      bannerSrc={bannerSrc}
      stats={stats}
      badges={badges}
      buttonLabel={buttonLabel}
      hideButton={hideButton}
      hideBookmark={hideBookmark}
      onGetInTouch={handleGetInTouch}
      className="max-w-none"
    />
  )
}
