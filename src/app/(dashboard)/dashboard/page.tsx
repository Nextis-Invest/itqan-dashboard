import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, DollarSign, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Missions",
    value: "0",
    description: "Missions créées",
    icon: Briefcase,
    trend: "+0%",
  },
  {
    title: "Freelances actifs",
    value: "0",
    description: "Ce mois-ci",
    icon: Users,
    trend: "+0%",
  },
  {
    title: "Revenus",
    value: "0 €",
    description: "Ce mois-ci",
    icon: DollarSign,
    trend: "+0%",
  },
  {
    title: "Taux de complétion",
    value: "0%",
    description: "Missions terminées",
    icon: TrendingUp,
    trend: "+0%",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h2>
        <p className="text-neutral-400 mt-1">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-neutral-900 border-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-lime-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-lime-400/10 text-lime-400 text-xs border-0">
                    {stat.trend}
                  </Badge>
                  <p className="text-xs text-neutral-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Missions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-neutral-500 text-sm text-center py-8">
              Aucune mission pour le moment.
              <br />
              <span className="text-lime-400 cursor-pointer hover:underline">
                Créer votre première mission
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-neutral-500 text-sm text-center py-8">
              Aucune activité récente.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
