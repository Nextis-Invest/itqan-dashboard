/**
 * FreelancerProfileCard Usage Examples
 * 
 * This file demonstrates different usage patterns for the FreelancerProfileCard
 * component across various contexts in the application.
 */

import { FreelancerProfileCard, type StatConfig } from "./freelancer-profile-card"
import { Badge } from "./badge"
import { Star, Briefcase, DollarSign, Clock, TrendingUp, Award } from "lucide-react"

// ============================================================================
// Example 1: Freelances Browse/Listing Page
// ============================================================================
export function FreelanceBrowseExample() {
  const stats: StatConfig[] = [
    { icon: Star, value: "4.5", label: "note" },
    { icon: Briefcase, value: "3", label: "missions" },
    { icon: DollarSign, value: "500 MAD", label: "TJM" }
  ]

  const skills = (
    <>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        React
      </Badge>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        Node.js
      </Badge>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        TypeScript
      </Badge>
    </>
  )

  const badges = (
    <>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        Vérifié
      </Badge>
      <Badge className="bg-green-400/10 text-green-400 border border-green-400/20 text-[10px]">
        Disponible
      </Badge>
    </>
  )

  return (
    <FreelancerProfileCard
      name="Ahmed Benali"
      title="Full Stack Developer"
      avatarSrc="https://ui-avatars.com/api/?name=Ahmed+Benali&background=a3e635&color=1a1a1a"
      bannerSrc="data:image/svg+xml,..."
      stats={stats}
      skills={skills}
      badges={badges}
      buttonLabel="Contacter"
      onGetInTouch={() => console.log("Contact freelancer")}
    />
  )
}

// ============================================================================
// Example 2: Proposal View (Client sees freelancer who proposed)
// ============================================================================
export function ProposalViewExample() {
  const stats: StatConfig[] = [
    { icon: Star, value: "4.7", label: "note" },
    { value: "15000 MAD", label: "offre" },
    { icon: Clock, value: "10j", label: "délai" }
  ]

  const skills = (
    <>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        Vue.js
      </Badge>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        Laravel
      </Badge>
    </>
  )

  const badges = (
    <Badge className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-[10px]">
      Top Rated
    </Badge>
  )

  return (
    <FreelancerProfileCard
      name="Fatima Zahra"
      title="Frontend Specialist"
      avatarSrc="https://ui-avatars.com/api/?name=Fatima+Zahra&background=a3e635&color=1a1a1a"
      bannerSrc="data:image/svg+xml,..."
      stats={stats}
      skills={skills}
      badges={badges}
      buttonLabel="Voir la proposition"
      onGetInTouch={() => console.log("View proposal")}
    />
  )
}

// ============================================================================
// Example 3: Admin View (Total revenue, missions completed)
// ============================================================================
export function AdminViewExample() {
  const stats: StatConfig[] = [
    { icon: Star, value: "4.8", label: "note" },
    { icon: TrendingUp, value: "45000 MAD", label: "revenu total" },
    { icon: Award, value: "12", label: "missions" }
  ]

  const skills = (
    <>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        Python
      </Badge>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        Django
      </Badge>
    </>
  )

  const badges = (
    <>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        Vérifié
      </Badge>
      <Badge className="bg-blue-400/10 text-blue-400 border border-blue-400/20 text-[10px]">
        Premium
      </Badge>
    </>
  )

  return (
    <FreelancerProfileCard
      name="Youssef Idrissi"
      title="Backend Engineer"
      avatarSrc="https://ui-avatars.com/api/?name=Youssef+Idrissi&background=a3e635&color=1a1a1a"
      bannerSrc="data:image/svg+xml,..."
      stats={stats}
      skills={skills}
      badges={badges}
      buttonLabel="Gérer le compte"
      onGetInTouch={() => console.log("Manage account")}
    />
  )
}

// ============================================================================
// Example 4: Mission Detail (Assigned freelancer)
// ============================================================================
export function MissionAssignedFreelancerExample() {
  const stats: StatConfig[] = [
    { icon: Star, value: "4.9", label: "note" },
    { icon: Briefcase, value: "8", label: "missions" },
    { value: "En cours", label: "statut" }
  ]

  const skills = (
    <>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        UI/UX
      </Badge>
      <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
        Figma
      </Badge>
    </>
  )

  return (
    <FreelancerProfileCard
      name="Sara Amrani"
      title="UI/UX Designer"
      avatarSrc="https://ui-avatars.com/api/?name=Sara+Amrani&background=a3e635&color=1a1a1a"
      bannerSrc="data:image/svg+xml,..."
      stats={stats}
      skills={skills}
      buttonLabel="Envoyer un message"
      hideBookmark={true}
      onGetInTouch={() => console.log("Send message")}
    />
  )
}

// ============================================================================
// Example 5: Backward Compatibility (Legacy props)
// ============================================================================
export function BackwardCompatibilityExample() {
  // Old API still works!
  return (
    <FreelancerProfileCard
      name="Karim Mansouri"
      title="Mobile Developer"
      avatarSrc="https://ui-avatars.com/api/?name=Karim+Mansouri&background=a3e635&color=1a1a1a"
      bannerSrc="data:image/svg+xml,..."
      rating={4.6}
      duration="5 missions"
      rate="600 MAD/j"
      tools={
        <>
          <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
            Flutter
          </Badge>
          <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
            Dart
          </Badge>
        </>
      }
      buttonLabel="Contacter"
      onGetInTouch={() => console.log("Contact")}
    />
  )
}

// ============================================================================
// Example 6: Minimal Card (No stats, no button)
// ============================================================================
export function MinimalCardExample() {
  return (
    <FreelancerProfileCard
      name="Nadia El Fassi"
      title="Content Writer"
      avatarSrc="https://ui-avatars.com/api/?name=Nadia+El+Fassi&background=a3e635&color=1a1a1a"
      bannerSrc="data:image/svg+xml,..."
      stats={[]} // No stats
      hideButton={true}
      hideBookmark={true}
    />
  )
}
