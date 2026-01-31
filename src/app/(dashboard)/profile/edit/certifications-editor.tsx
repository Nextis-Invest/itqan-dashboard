"use client"

import { useTransition } from "react"
import { createCertification, deleteCertification } from "@/lib/actions/certification"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Trash2 } from "lucide-react"

type Certification = {
  id: string
  name: string
  issuer: string | null
  issueDate: Date | null
  expiryDate: Date | null
  url: string | null
}

export function CertificationsEditor({ certifications }: { certifications: Certification[] }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteCertification(id)
    })
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Award className="h-4 w-4 text-lime-400" />
          Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing certifications */}
        {certifications.length > 0 && (
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-start justify-between bg-neutral-800/50 rounded-lg p-3">
                <div>
                  <p className="text-white text-sm font-medium">{cert.name}</p>
                  {cert.issuer && <p className="text-neutral-400 text-xs">{cert.issuer}</p>}
                  <div className="flex gap-3 mt-1 text-xs text-neutral-500">
                    {cert.issueDate && (
                      <span>{new Date(cert.issueDate).toLocaleDateString("fr-FR")}</span>
                    )}
                    {cert.expiryDate && (
                      <span>→ {new Date(cert.expiryDate).toLocaleDateString("fr-FR")}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cert.id)}
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
          <p className="text-neutral-300 text-sm font-medium mb-3">Ajouter une certification</p>
          <form action={createCertification} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="name"
                placeholder="Nom de la certification *"
                required
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
              <input
                name="issuer"
                placeholder="Organisme émetteur"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-neutral-500 text-xs mb-1 block">Date d&apos;obtention</label>
                <input
                  name="issueDate"
                  type="date"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="text-neutral-500 text-xs mb-1 block">Date d&apos;expiration</label>
                <input
                  name="expiryDate"
                  type="date"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>
            </div>
            <input
              name="url"
              type="url"
              placeholder="URL de vérification (optionnel)"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
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
