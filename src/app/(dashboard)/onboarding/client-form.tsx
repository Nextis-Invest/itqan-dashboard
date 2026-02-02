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
import { Loader2, Save, Search, PenLine, User, Building2, Rocket, MapPin, Phone } from "lucide-react"
import { createClientProfile } from "@/lib/actions/profile"
import { CompanySearch, type CompanyResult } from "@/components/company-search"
import { AddressSearch } from "@/components/address-search"

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

const countries = [
  { value: "FR", label: "France 🇫🇷" },
  { value: "MA", label: "Maroc 🇲🇦" },
  { value: "TN", label: "Tunisie 🇹🇳" },
  { value: "DZ", label: "Algérie 🇩🇿" },
  { value: "BE", label: "Belgique 🇧🇪" },
  { value: "CH", label: "Suisse 🇨🇭" },
  { value: "CA", label: "Canada 🇨🇦" },
  { value: "OTHER", label: "Autre" },
]

function mapSizeToSelect(size: string): string {
  if (size.includes("5000")) return "200+"
  if (size.includes("250")) return "200+"
  if (size.includes("10-249") || size.includes("PME")) return "51-200"
  return "1-10"
}

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

/* Shared input class */
const inputCls = "bg-secondary/60 border-border text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all"

export function ClientOnboardingForm() {
  const [isPending, setIsPending] = useState(false)
  const [personType, setPersonType] = useState<"PHYSICAL" | "MORAL">("MORAL")
  const [country, setCountry] = useState("FR")
  const [manualMode, setManualMode] = useState(false)

  const [companyName, setCompanyName] = useState("")
  const [formeJuridique, setFormeJuridique] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [siren, setSiren] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const isFrance = country === "FR"

  const handleCompanySelect = (company: CompanyResult) => {
    setCompanyName(company.name)
    setFormeJuridique(mapLegalFormToSelect(company.legalForm))
    setCompanySize(mapSizeToSelect(company.size))
    setAddress(company.address)
    setCity(company.city)
    setPostalCode(company.postalCode)
    setSiren(company.siren)
  }

  const handleAddressSelect = (result: { address: string; postalCode: string; city: string; region: string }) => {
    setAddress(result.address)
    setPostalCode(result.postalCode)
    setCity(result.city)
  }

  return (
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
      <input type="hidden" name="personType" value={personType} />
      <input type="hidden" name="country" value={country} />

      {/* Section: Profile Type */}
      <Card className="bg-card/80 border-border backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-lime-400/10">
              <User className="h-4 w-4 text-lime-400" />
            </div>
            Type de profil
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Ces informations seront visibles par les freelances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Person Type Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPersonType("PHYSICAL")}
              className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                personType === "PHYSICAL"
                  ? "bg-lime-400/10 text-lime-400 border-lime-400/40 shadow-[0_0_20px_rgba(163,230,53,0.1)]"
                  : "bg-secondary/60 text-foreground/80 border-border hover:border-border"
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-all duration-200 ${personType === "PHYSICAL" ? "bg-lime-400/15 shadow-[0_0_12px_rgba(163,230,53,0.15)]" : "bg-secondary/30"}`}>
                <User className="h-5 w-5" />
              </div>
              Personne physique
            </button>
            <button
              type="button"
              onClick={() => setPersonType("MORAL")}
              className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                personType === "MORAL"
                  ? "bg-lime-400/10 text-lime-400 border-lime-400/40 shadow-[0_0_20px_rgba(163,230,53,0.1)]"
                  : "bg-secondary/60 text-foreground/80 border-border hover:border-border"
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-all duration-200 ${personType === "MORAL" ? "bg-lime-400/15 shadow-[0_0_12px_rgba(163,230,53,0.15)]" : "bg-secondary/30"}`}>
                <Building2 className="h-5 w-5" />
              </div>
              Personne morale
            </button>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Pays</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className={inputCls}>
                <SelectValue placeholder="Choisir un pays..." />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-border">
                {countries.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ========== PERSONNE MORALE ========== */}
      {personType === "MORAL" && (
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-400/10">
                <Building2 className="h-4 w-4 text-emerald-400" />
              </div>
              Informations société
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Company Search — only for France */}
            {isFrance && !manualMode ? (
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium flex items-center gap-2">
                  <Search className="h-3.5 w-3.5" />
                  Rechercher votre entreprise (France)
                </Label>
                <CompanySearch
                  onSelect={handleCompanySelect}
                  onManualMode={() => setManualMode(true)}
                />
              </div>
            ) : isFrance ? (
              <button
                type="button"
                onClick={() => setManualMode(false)}
                className="text-sm text-muted-foreground hover:text-lime-400 transition-colors flex items-center gap-1.5"
              >
                <Search className="h-3.5 w-3.5" />
                Rechercher une entreprise
              </button>
            ) : null}

            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Nom de l&apos;entreprise *</Label>
              <Input
                name="companyName"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Itqan Technologies"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Forme juridique</Label>
                <Select name="formeJuridique" value={formeJuridique} onValueChange={setFormeJuridique}>
                  <SelectTrigger className={inputCls}>
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    {formesJuridiques.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">{isFrance ? "SIREN" : "RC"}</Label>
                <Input
                  name="rc"
                  value={siren}
                  onChange={(e) => setSiren(e.target.value)}
                  placeholder={isFrance ? "Ex: 123456789" : "Numéro RC"}
                  className={inputCls}
                />
              </div>
            </div>

            {!isFrance && (
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">ICE</Label>
                <Input name="ice" placeholder="15 chiffres" className={inputCls} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Taille de l&apos;entreprise</Label>
                <Select name="companySize" value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger className={inputCls}>
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="1-10">1-10 employés</SelectItem>
                    <SelectItem value="11-50">11-50 employés</SelectItem>
                    <SelectItem value="51-200">51-200 employés</SelectItem>
                    <SelectItem value="200+">200+ employés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Secteur</Label>
                <Select name="industry">
                  <SelectTrigger className={inputCls}>
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    {industries.map((ind) => (
                      <SelectItem key={ind.value} value={ind.value}>
                        {ind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========== PERSONNE PHYSIQUE ========== */}
      {personType === "PHYSICAL" && (
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-400/10">
                <User className="h-4 w-4 text-emerald-400" />
              </div>
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">CIN (Carte d&apos;identité nationale)</Label>
              <Input name="cin" placeholder="Ex: AB123456" className={inputCls} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section: Address */}
      <Card className="bg-card/80 border-border backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/10">
              <MapPin className="h-4 w-4 text-amber-400" />
            </div>
            Adresse & Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address autocomplete for France */}
          {isFrance && (
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Recherche d&apos;adresse</Label>
              <AddressSearch onSelect={handleAddressSelect} />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Adresse</Label>
            <Input
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rue, numéro, quartier..."
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Ville</Label>
              <Input
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={isFrance ? "Paris" : "Casablanca"}
                className={inputCls}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Code postal</Label>
              <Input
                name="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="75001"
                className={inputCls}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Site web</Label>
              <Input name="website" placeholder="https://..." className={inputCls} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm font-medium">Téléphone</Label>
            <Input
              name="phone"
              placeholder={isFrance ? "+33 6 XX XX XX XX" : "+212 6XX XXX XXX"}
              className={inputCls}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-lime-400 to-emerald-400 text-neutral-900 hover:from-lime-300 hover:to-emerald-300 font-semibold h-12 rounded-xl shadow-lg shadow-lime-400/20 text-base transition-all duration-200"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Création...
          </>
        ) : (
          <>
            <Rocket className="mr-2 h-5 w-5" />
            Créer mon profil
          </>
        )}
      </Button>
    </form>
  )
}
