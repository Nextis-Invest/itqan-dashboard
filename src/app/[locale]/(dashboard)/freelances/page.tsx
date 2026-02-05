import type { Metadata } from "next"

export const metadata: Metadata = { title: "Freelances" }
import { Users, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { FreelancerGrid } from "./freelancer-grid"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function FreelancesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const searchQuery = q?.trim()

  // Build where clause with optional search
  const whereClause: Prisma.UserWhereInput = {
    role: "FREELANCER",
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { freelancerProfile: { title: { contains: searchQuery, mode: "insensitive" } } },
        { freelancerProfile: { skills: { hasSome: [searchQuery] } } },
        { freelancerProfile: { bio: { contains: searchQuery, mode: "insensitive" } } },
      ],
    }),
  }

  const freelancers = await prisma.user.findMany({
    where: whereClause,
    include: {
      freelancerProfile: true,
      _count: {
        select: {
          freelanceMissions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Serialize the data for the client component (convert Decimal to number)
  const serializedFreelancers = freelancers.map((freelancer) => ({
    id: freelancer.id,
    name: freelancer.name,
    email: freelancer.email,
    image: freelancer.image,
    freelancerProfile: freelancer.freelancerProfile
      ? {
          title: freelancer.freelancerProfile.title,
          avgRating: freelancer.freelancerProfile.avgRating
            ? Number(freelancer.freelancerProfile.avgRating)
            : null,
          dailyRate: freelancer.freelancerProfile.dailyRate
            ? Number(freelancer.freelancerProfile.dailyRate)
            : null,
          currency: freelancer.freelancerProfile.currency,
          skills: freelancer.freelancerProfile.skills,
          city: freelancer.freelancerProfile.city,
          verified: freelancer.freelancerProfile.verified,
          available: freelancer.freelancerProfile.available,
        }
      : null,
    _count: {
      freelanceMissions: freelancer._count.freelanceMissions,
    },
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          {searchQuery ? (
            <>
              <Search className="h-6 w-6 text-lime-400" />
              Résultats pour &quot;{searchQuery}&quot;
            </>
          ) : (
            <>
              <Users className="h-6 w-6 text-lime-400" />
              Freelances
            </>
          )}
        </h2>
        <p className="text-muted-foreground mt-1">
          {searchQuery 
            ? `${serializedFreelancers.length} freelance${serializedFreelancers.length > 1 ? 's' : ''} trouvé${serializedFreelancers.length > 1 ? 's' : ''}`
            : "Parcourez les freelances disponibles"
          }
        </p>
      </div>

      {serializedFreelancers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            {searchQuery ? (
              <Search className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Users className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <p className="text-muted-foreground text-base font-medium">
            {searchQuery ? `Aucun résultat pour "${searchQuery}"` : "Aucun freelance inscrit"}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            {searchQuery 
              ? "Essayez avec d'autres termes de recherche."
              : "Revenez plus tard pour découvrir les talents."
            }
          </p>
        </div>
      ) : (
        <FreelancerGrid freelancers={serializedFreelancers} />
      )}
    </div>
  )
}
