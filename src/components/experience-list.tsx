import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar } from "lucide-react"
import type { Experience } from "@prisma/client"

function formatDate(date: Date | null) {
  if (!date) return ""
  return new Date(date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
}

export function ExperienceList({
  experiences,
  editable = false,
}: {
  experiences: Experience[]
  editable?: boolean
}) {
  if (experiences.length === 0) return null

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-lime-400" />
          Expérience professionnelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="border-b border-neutral-800 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium text-sm">{exp.title}</h4>
                <p className="text-neutral-400 text-sm">{exp.company}</p>
                {exp.location && (
                  <p className="text-neutral-500 text-xs mt-0.5">{exp.location}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {exp.source === "linkedin" && (
                  <Badge className="bg-[#0A66C2]/10 text-[#0A66C2] border-0 text-xs">
                    LinkedIn
                  </Badge>
                )}
                {exp.current && (
                  <Badge className="bg-green-400/10 text-green-400 border-0 text-xs">
                    Actuel
                  </Badge>
                )}
              </div>
            </div>
            {(exp.startDate || exp.endDate) && (
              <div className="flex items-center gap-1 mt-1 text-neutral-500 text-xs">
                <Calendar className="h-3 w-3" />
                {formatDate(exp.startDate)}
                {exp.startDate && (exp.endDate || exp.current) && " — "}
                {exp.current ? "Présent" : formatDate(exp.endDate)}
              </div>
            )}
            {exp.description && (
              <p className="text-neutral-400 text-sm mt-2">{exp.description}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
