import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function FreelancesPage() {
  const freelancers = await prisma.user.findMany({
    where: { role: "FREELANCER" },
    include: {
      _count: {
        select: {
          freelanceMissions: true,
          proposals: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Freelances</h2>
        <p className="text-neutral-400 mt-1">Parcourez les freelances disponibles</p>
      </div>

      {freelancers.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-12">
            <div className="text-neutral-500 text-sm text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <p>Aucun freelance inscrit pour le moment.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {freelancers.map((freelancer) => (
            <Card key={freelancer.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12 border border-neutral-700">
                  <AvatarFallback className="bg-lime-400/10 text-lime-400 font-medium">
                    {(freelancer.name || freelancer.email)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-white text-base">
                    {freelancer.name || freelancer.email}
                  </CardTitle>
                  <p className="text-neutral-500 text-sm">{freelancer.email}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge className="bg-lime-400/10 text-lime-400 border-0 text-xs">
                    {freelancer._count.freelanceMissions} missions
                  </Badge>
                  <Badge className="bg-blue-400/10 text-blue-400 border-0 text-xs">
                    {freelancer._count.proposals} propositions
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
