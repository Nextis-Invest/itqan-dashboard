"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, Search, PenLine } from "lucide-react"
import { createClientProfile } from "@/lib/actions/profile"
import { CompanySearch, type CompanyResult } from "@/components/company-search"

const industries = [
  { value: "tech", label: "Technologie" },
  { value: "finance", label: "Finance" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "education", label: "Éducation" },
  { value: "health", label: "Santé" },
  { value: "media", label: "Médias" },
  { value: "real-estate", label: "Immobilier" },
  { value: "consulting", label: "Conseil" },
  { value: "other", label: "Autre" },
]

const formesJuridiques = [
  { value: "SARL", label: "SARL" },
  { value: "EURL", label: "EURL" },
  { value: "SAS", label: "SAS" },
  { value: "SASU", label: "SASU" },
  { value: "SA", label: "SA" },
  { value: "SNC", label: "SNC" },
  { value: "AUTO_ENTREPRENEUR", label: "Auto-entrepreneur" },
  { value: "ASSOCIATION", label: "Association" },
  { value: "OTHER", label: "Autre" },
]

// Map API size strings to form select values
function mapSizeToSelect(size: string): string {
  if (size.includes("5000")) return "200+"
  if (size.includes("250")) return "200+"
  if (size.includes("10-249") || size.includes("PME")) return "51-200"
  return "1-10"
}

// Map API legal form to form select value
function mapLegalFormToSelect(legalForm: string): string {
  const lower = legalForm.toLowerCase()
  if (lower.includes("sasu") || lower.includes("sas à associé unique")) return "SASU"
  if (lower.includes("sas")) return "SAS"
  if (lower.includes("eurl") || lower.includes("sarl unipersonnelle")) return "EURL"
  if (lower.includes("sarl")) return "SARL"
  if (lower.includes("sa ")) return "SA"
  if (lower.includes("snc")) return "SNC"
  if (lower.includes("entrepreneur")) return "AUTO_ENTREPRENEUR"
  if (lower.includes("association")) return "ASSOCIATION"
  return "OTHER"
}

export function ClientOnboardingForm() {
  const [isPending, setIsPending] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [formeJuridique, setFormeJuridique] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [siren, setSiren] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleCompanySelect = (company: CompanyResult) => {
    setCompanyName(company.name)
    setFormeJuridique(mapLegalFormToSelect(company.legalForm))
    setCompanySize(mapSizeToSelect(company.size))
    setAddress(company.address)
    setCity(company.city)
    setPostalCode(company.postalCode)
    setSiren(company.siren)
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Profil Client</CardTitle>
        <CardDescription className="text-neutral-400">
          Ces informations seront visibles par les freelances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={async (formData) => {
            setIsPending(true)
            try {
              await createClientProfile(formData)
            } catch {
              setIsPending(false)
            }
          }}
          className="space-y-6"
        >
          {/* Company Search Section */}
          {!manualMode ? (
            <div className="space-y-2">
              <Label className="text-neutral-300 flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                Rechercher votre entreprise (France)
              </Label>
              <CompanySearch
                onSelect={handleCompanySelect}
                onManualMode={() => setManualMode(true)}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setManualMode(false)}
              className="text-sm text-neutral-400 hover:text-lime-400 transition-colors flex items-center gap-1.5"
            >
              <Search className="h-3.5 w-3.5" />
              Rechercher une entreprise
            </button>
          )}

          <div className="space-y-2">
            <Label className="text-neutral-300">Nom de l&apos;entreprise *</Label>
            <Input
              name="companyName"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Itqan Technologies"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Forme juridique</Label>
              <Select name="formeJuridique" value={formeJuridique} onValueChange={setFormeJuridique}>
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  {formesJuridiques.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">SIREN</Label>
              <Input
                name="rc"
                value={siren}
                onChange={(e) => setSiren(e.target.value)}
                placeholder="Ex: 123456789"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Taille de l&apos;entreprise</Label>
              <Select name="companySize" value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="1-10">1-10 employés</SelectItem>
                  <SelectItem value="11-50">11-50 employés</SelectItem>
                  <SelectItem value="51-200">51-200 employés</SelectItem>
                  <SelectItem value="200+">200+ employés</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Secteur</Label>
              <Select name="industry">
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  {industries.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Adresse</Label>
            <Input
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rue, numéro, quartier..."
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Ville</Label>
              <Input
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Casablanca"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Code postal</Label>
              <Input
                name="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="75001"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">Site web</Label>
              <Input
                name="website"
                placeholder="https://example.com"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-lime-400 text-neutral-900 hover:bg-lime-300 font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Créer mon profil
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
