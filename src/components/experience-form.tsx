"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, X, Pencil, Trash2 } from "lucide-react"
import { addExperience, updateExperience, deleteExperience } from "@/lib/actions/experience"
import type { Experience } from "@prisma/client"

export function ExperienceManager({ experiences }: { experiences: Experience[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isCurrent, setIsCurrent] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const editingExp = editingId ? experiences.find((e) => e.id === editingId) : null

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteExperience(id)
    } catch {
      setDeletingId(null)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setIsCurrent(false)
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-base">Expérience professionnelle</CardTitle>
          {!showForm && !editingId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowForm(true)}
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing experiences */}
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="border-b border-neutral-800 pb-4 last:border-0 last:pb-0"
          >
            {editingId === exp.id ? (
              <ExperienceFormFields
                defaultValues={exp}
                isCurrent={isCurrent}
                setIsCurrent={setIsCurrent}
                isPending={isPending}
                onSubmit={async (formData) => {
                  setIsPending(true)
                  formData.set("experienceId", exp.id)
                  formData.set("current", isCurrent ? "true" : "false")
                  try {
                    await updateExperience(formData)
                    resetForm()
                  } catch {
                    setIsPending(false)
                  }
                }}
                onCancel={resetForm}
                submitLabel="Enregistrer"
              />
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white font-medium text-sm">{exp.title}</h4>
                  <p className="text-neutral-400 text-sm">{exp.company}</p>
                  {exp.location && <p className="text-neutral-500 text-xs mt-0.5">{exp.location}</p>}
                  {exp.description && <p className="text-neutral-400 text-sm mt-2">{exp.description}</p>}
                  <div className="flex items-center gap-2 mt-1 text-neutral-500 text-xs">
                    {exp.startDate && new Date(exp.startDate).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                    {exp.startDate && " — "}
                    {exp.current ? "Présent" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }) : ""}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-neutral-400 hover:text-white"
                    onClick={() => { setEditingId(exp.id); setIsCurrent(exp.current); setShowForm(false) }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" disabled={deletingId === exp.id}
                    className="h-7 w-7 p-0 text-neutral-400 hover:text-red-400"
                    onClick={() => handleDelete(exp.id)}>
                    {deletingId === exp.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New experience form */}
        {showForm && (
          <ExperienceFormFields
            isCurrent={isCurrent}
            setIsCurrent={setIsCurrent}
            isPending={isPending}
            onSubmit={async (formData) => {
              setIsPending(true)
              formData.set("current", isCurrent ? "true" : "false")
              try {
                await addExperience(formData)
                resetForm()
              } catch {
                setIsPending(false)
              }
            }}
            onCancel={resetForm}
            submitLabel="Ajouter"
          />
        )}

        {experiences.length === 0 && !showForm && (
          <p className="text-neutral-500 text-sm text-center py-4">
            Aucune expérience ajoutée.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function ExperienceFormFields({
  defaultValues,
  isCurrent,
  setIsCurrent,
  isPending,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  defaultValues?: Experience | null
  isCurrent: boolean
  setIsCurrent: (v: boolean) => void
  isPending: boolean
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
  submitLabel: string
}) {
  const formatDateForInput = (d: Date | null | undefined) => {
    if (!d) return ""
    return new Date(d).toISOString().split("T")[0]
  }

  return (
    <form action={onSubmit} className="space-y-3 p-3 rounded-lg border border-neutral-800 bg-neutral-800/30">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-neutral-400 text-xs">Poste *</Label>
          <Input name="title" required defaultValue={defaultValues?.title || ""}
            placeholder="Développeur Senior"
            className="bg-neutral-800 border-neutral-700 text-white text-sm placeholder:text-neutral-500 focus:border-lime-400/50" />
        </div>
        <div className="space-y-1">
          <Label className="text-neutral-400 text-xs">Entreprise *</Label>
          <Input name="company" required defaultValue={defaultValues?.company || ""}
            placeholder="Nom de l'entreprise"
            className="bg-neutral-800 border-neutral-700 text-white text-sm placeholder:text-neutral-500 focus:border-lime-400/50" />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-neutral-400 text-xs">Lieu</Label>
        <Input name="location" defaultValue={defaultValues?.location || ""}
          placeholder="Casablanca, Maroc"
          className="bg-neutral-800 border-neutral-700 text-white text-sm placeholder:text-neutral-500 focus:border-lime-400/50" />
      </div>

      <div className="space-y-1">
        <Label className="text-neutral-400 text-xs">Description</Label>
        <Textarea name="description" rows={2} defaultValue={defaultValues?.description || ""}
          placeholder="Décrivez vos responsabilités..." className="text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-neutral-400 text-xs">Date de début</Label>
          <Input name="startDate" type="date" defaultValue={formatDateForInput(defaultValues?.startDate)}
            className="bg-neutral-800 border-neutral-700 text-white text-sm focus:border-lime-400/50" />
        </div>
        <div className="space-y-1">
          <Label className="text-neutral-400 text-xs">Date de fin</Label>
          <Input name="endDate" type="date" disabled={isCurrent}
            defaultValue={formatDateForInput(defaultValues?.endDate)}
            className="bg-neutral-800 border-neutral-700 text-white text-sm focus:border-lime-400/50 disabled:opacity-50" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setIsCurrent(!isCurrent)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isCurrent ? "bg-lime-400" : "bg-neutral-700"}`}>
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isCurrent ? "translate-x-4.5" : "translate-x-0.5"}`} />
        </button>
        <Label className="text-neutral-400 text-xs">Poste actuel</Label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isPending}
          className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold text-xs">
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
          {submitLabel}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}
          className="text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs">
          <X className="h-3.5 w-3.5 mr-1" />Annuler
        </Button>
      </div>
    </form>
  )
}
