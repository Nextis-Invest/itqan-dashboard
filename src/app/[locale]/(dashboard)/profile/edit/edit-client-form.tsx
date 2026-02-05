"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Loader2, Save, ArrowLeft, Building2, UserCircle, Phone, MapPin, CreditCard, Search, User } from "lucide-react"
import { updateClientProfile } from "@/lib/actions/profile"
import Link from "next/link"
import type { ClientProfile } from "@prisma/client"
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
  { value: "construction", label: "Construction / BTP" },
  { value: "agriculture", label: "Agriculture" },
  { value: "transport", label: "Transport / Logistique" },
  { value: "tourism", label: "Tourisme / Hôtellerie" },
  { value: "textile", label: "Textile" },
  { value: "food", label: "Agroalimentaire" },
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
  { value: "COOPERATIVE", label: "Coopérative" },
  { value: "OTHER", label: "Autre" },
]

const paymentMethods = [
  { value: "BANK_TRANSFER", label: "Virement bancaire" },
  { value: "CARD", label: "Carte bancaire" },
  { value: "CMI", label: "CMI" },
  { value: "PAYPAL", label: "PayPal" },
  { value: "CASH", label: "Espèces" },
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

const moroccanRegions = [
  "Tanger-Tétouan-Al Hoceïma",
  "L'Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
]

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

function mapSizeToSelect(size: string): string {
  if (size.includes("5000")) return "200+"
  if (size.includes("250")) return "200+"
  if (size.includes("10-249") || size.includes("PME")) return "51-200"
  return "1-10"
}

/* Shared input class */
const inputCls = "bg-secondary/60 border-border/50 text-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all"

export function EditClientForm({ profile }: { profile: ClientProfile }) {
  const [isPending, setIsPending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [personType, setPersonType] = useState<"PHYSICAL" | "MORAL">((profile.personType as "PHYSICAL" | "MORAL") || "MORAL")
  const [country, setCountry] = useState(profile.country || "MA")
  const [showCompanySearch, setShowCompanySearch] = useState(false)

  const [companyName, setCompanyName] = useState(profile.companyName || "")
  const [formeJuridique, setFormeJuridique] = useState(profile.formeJuridique || "")
  const [companySize, setCompanySize] = useState(profile.companySize || "")
  const [address, setAddress] = useState(profile.address || "")
  const [city, setCity] = useState(profile.city || "")
  const [postalCode, setPostalCode] = useState(profile.postalCode || "")
  const [rc, setRc] = useState(profile.rc || "")

  const isFrance = country === "FR"

  const handleCompanySelect = (company: CompanyResult) => {
    setCompanyName(company.name)
    setFormeJuridique(mapLegalFormToSelect(company.legalForm))
    setCompanySize(mapSizeToSelect(company.size))
    setAddress(company.address)
    setCity(company.city)
    setPostalCode(company.postalCode)
    setRc(company.siren)
    setShowCompanySearch(false)
  }

  const handleAddressSelect = (result: { address: string; postalCode: string; city: string; region: string }) => {
    setAddress(result.address)
    setPostalCode(result.postalCode)
    setCity(result.city)
  }

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ""
    return new Date(date).toISOString().split("T")[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-muted-foreground text-sm">← Retour au profil</span>
      </div>

      <form
        action={async (formData) => {
          setIsPending(true)
          setSaved(false)
          try {
            await updateClientProfile(formData)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
          } catch {
            setIsPending(false)
          }
        }}
        className="space-y-6"
      >
        <input type="hidden" name="personType" value={personType} />
        <input type="hidden" name="country" value={country} />

        {/* Section 1: Type de personne + Pays */}
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-lime-400/10">
                <UserCircle className="h-4 w-4 text-lime-400" />
              </div>
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Type de personne</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPersonType("PHYSICAL")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    personType === "PHYSICAL"
                      ? "bg-gradient-to-r from-lime-400 to-emerald-400 text-foreground border-lime-400 shadow-lg shadow-lime-400/20"
                      : "bg-secondary/60 text-foreground/80 border-border/50 hover:border-border"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Personne physique
                </button>
                <button
                  type="button"
                  onClick={() => setPersonType("MORAL")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    personType === "MORAL"
                      ? "bg-gradient-to-r from-lime-400 to-emerald-400 text-foreground border-lime-400 shadow-lg shadow-lime-400/20"
                      : "bg-secondary/60 text-foreground/80 border-border/50 hover:border-border"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Personne morale
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Pays</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className={`${inputCls}`}>
                  <SelectValue placeholder="Choisir un pays..." />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {personType === "PHYSICAL" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">CIN (Carte d&apos;identité nationale)</Label>
                  <Input name="cin" defaultValue={profile.cin || ""} placeholder="Ex: AB123456" className={inputCls} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">Date de naissance</Label>
                  <Input name="dateOfBirth" type="date" defaultValue={formatDateForInput(profile.dateOfBirth)} className={inputCls} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Company info */}
        {personType === "MORAL" && (
          <Card className="bg-card/80 border-border backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-400/10">
                    <Building2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  Informations société
                </span>
                {isFrance && (
                  <button
                    type="button"
                    onClick={() => setShowCompanySearch(!showCompanySearch)}
                    className="text-xs text-muted-foreground hover:text-lime-400 transition-colors flex items-center gap-1 font-normal"
                  >
                    <Search className="h-3 w-3" />
                    {showCompanySearch ? "Masquer" : "Rechercher (data.gouv.fr)"}
                  </button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFrance && showCompanySearch && (
                <CompanySearch onSelect={handleCompanySelect} className="pb-4 border-b border-border/30" />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">Nom de l&apos;entreprise</Label>
                  <Input name="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">Forme juridique</Label>
                  <Select name="formeJuridique" value={formeJuridique || undefined} onValueChange={setFormeJuridique}>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">Taille de l&apos;entreprise</Label>
                  <Select name="companySize" value={companySize || undefined} onValueChange={setCompanySize}>
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
                  <Label className="text-foreground/80 text-sm font-medium">Secteur d&apos;activité</Label>
                  <Select name="industry" defaultValue={profile.industry || undefined}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-border">
                      {industries.map((ind) => (
                        <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">Site web</Label>
                  <Input name="website" defaultValue={profile.website || ""} placeholder="https://..." className={inputCls} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">Capital social (MAD)</Label>
                  <Input name="capitalSocial" type="number" step="0.01" defaultValue={profile.capitalSocial || ""} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">{isFrance ? "SIREN" : "RC / SIREN"}</Label>
                  <Input name="rc" value={rc} onChange={(e) => setRc(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">ICE</Label>
                  <Input name="ice" defaultValue={profile.ice || ""} placeholder="15 chiffres" className={inputCls} />
                </div>
              </div>

              {!isFrance && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground/80 text-sm font-medium">Patente</Label>
                    <Input name="patente" defaultValue={profile.patente || ""} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/80 text-sm font-medium">CNSS</Label>
                    <Input name="cnss" defaultValue={profile.cnss || ""} className={inputCls} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section 3: Contact */}
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-400/10">
                <Phone className="h-4 w-4 text-blue-400" />
              </div>
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Téléphone principal</Label>
                <Input name="phone" defaultValue={profile.phone || ""} placeholder={isFrance ? "+33 6 XX XX XX XX" : "+212 6XX XXX XXX"} className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Téléphone secondaire</Label>
                <Input name="phoneSecondary" defaultValue={profile.phoneSecondary || ""} placeholder={isFrance ? "+33 1 XX XX XX XX" : "+212 5XX XXX XXX"} className={inputCls} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Email de contact (si différent du compte)</Label>
              <Input name="contactEmail" type="email" defaultValue={profile.contactEmail || ""} placeholder={isFrance ? "contact@entreprise.fr" : "contact@entreprise.ma"} className={inputCls} />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Address */}
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-400/10">
                <MapPin className="h-4 w-4 text-amber-400" />
              </div>
              Adresse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isFrance && (
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Recherche d&apos;adresse (France)</Label>
                <AddressSearch onSelect={handleAddressSelect} defaultValue={address} />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Adresse</Label>
              <Input name="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rue, numéro, quartier..." className={inputCls} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Ville</Label>
                <Input name="city" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Code postal</Label>
                <Input name="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Région</Label>
                {!isFrance ? (
                  <Select name="region" defaultValue={profile.region || undefined}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-border">
                      {moroccanRegions.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input name="region" defaultValue={profile.region || ""} placeholder="Île-de-France" className={inputCls} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Payment */}
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-400/10">
                <CreditCard className="h-4 w-4 text-purple-400" />
              </div>
              Informations bancaires / Paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">Méthode de paiement préférée</Label>
              <Select name="preferredPaymentMethod" defaultValue={profile.preferredPaymentMethod || undefined}>
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  {paymentMethods.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">Banque</Label>
                <Input name="bankName" defaultValue={profile.bankName || ""} placeholder={isFrance ? "Ex: BNP Paribas" : "Ex: Attijariwafa Bank"} className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">IBAN</Label>
                <Input name="bankIban" defaultValue={profile.bankIban || ""} className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">RIB</Label>
                <Input name="bankRib" defaultValue={profile.bankRib || ""} placeholder="24 chiffres" className={inputCls} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-3 sticky bottom-4 z-10">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-gradient-to-r from-lime-400 to-emerald-400 text-foreground hover:from-lime-300 hover:to-emerald-300 font-semibold h-11 rounded-xl shadow-lg shadow-lime-400/20 px-8 transition-all duration-200"
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Enregistrer</>
            )}
          </Button>
          <Link href="/profile">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent h-11 rounded-xl">
              Annuler
            </Button>
          </Link>
          {saved && (
            <span className="text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20 animate-in fade-in">
              ✓ Enregistré
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
