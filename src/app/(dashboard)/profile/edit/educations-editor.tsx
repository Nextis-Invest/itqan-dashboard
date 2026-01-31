"use client"

import { useTransition } from "react"
import { createEducation, deleteEducation } from "@/lib/actions/education"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Trash2 } from "lucide-react"

type Education = {
  id: string
  school: string
  degree: string | null
  field: string | null
  startYear: number | null
  endYear: number | null
}

export function EducationsEditor({ educations }: { educations: Education[] }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteEducation(id)
    })
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white text-base flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-lime-400" />
          Formation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing educations */}
        {educations.length > 0 && (
          <div className="space-y-3">
            {educations.map((edu) => (
              <div key={edu.id} className="flex items-start justify-between bg-neutral-800/50 rounded-lg p-3">
                <div>
                  <p className="text-white text-sm font-medium">{edu.school}</p>
                  {(edu.degree || edu.field) && (
                    <p className="text-neutral-400 text-xs">
                      {[edu.degree, edu.field].filter(Boolean).join(" — ")}
                    </p>
                  )}
                  {(edu.startYear || edu.endYear) && (
                    <p className="text-neutral-500 text-xs mt-1">
                      {edu.startYear || "?"} — {edu.endYear || "En cours"}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(edu.id)}
                  disabled={isPending}
                  className="text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        <div className="border-t border-neutral-800 pt-4">
          <p className="text-neutral-300 text-sm font-medium mb-3">Ajouter une formation</p>
          <form action={createEducation} className="space-y-3">
            <input
              name="school"
              placeholder="École / Université *"
              required
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="degree"
                placeholder="Diplôme"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
              <input
                name="field"
                placeholder="Domaine d'études"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-neutral-500 text-xs mb-1 block">Année de début</label>
                <input
                  name="startYear"
                  type="number"
                  min="1950"
                  max="2030"
                  placeholder="2020"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="text-neutral-500 text-xs mb-1 block">Année de fin</label>
                <input
                  name="endYear"
                  type="number"
                  min="1950"
                  max="2030"
                  placeholder="2024"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-lime-400 text-neutral-900 rounded-md text-sm font-medium hover:bg-lime-300 transition-colors"
            >
              Ajouter
            </button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
