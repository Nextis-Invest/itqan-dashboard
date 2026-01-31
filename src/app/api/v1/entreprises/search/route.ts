import { NextRequest, NextResponse } from "next/server"

const NATURE_JURIDIQUE_MAP: Record<string, string> = {
  "1000": "Entrepreneur individuel",
  "1200": "Commerçant",
  "1300": "Artisan",
  "1400": "Officier public ou ministériel",
  "5199": "Société en commandite simple",
  "5306": "SNC",
  "5498": "SARL unipersonnelle (EURL)",
  "5499": "SARL",
  "5505": "SA à conseil d'administration",
  "5510": "SA à directoire",
  "5599": "SAS",
  "5710": "SAS à associé unique (SASU)",
  "5720": "SASU",
  "9210": "Association loi 1901",
  "9220": "Association déclarée d'utilité publique",
  "9221": "Association intermédiaire",
  "9222": "Association d'insertion par l'activité économique",
  "9300": "Fondation",
  "9900": "Autre personne morale de droit privé",
}

const CATEGORIE_MAP: Record<string, string> = {
  PME: "PME (10-249)",
  ETI: "ETI (250-4999)",
  GE: "Grande entreprise (5000+)",
  TPE: "TPE/Micro (1-9)",
}

function mapNatureJuridique(code: string | null): string {
  if (!code) return ""
  return NATURE_JURIDIQUE_MAP[code] || `Code ${code}`
}

function mapCategorie(cat: string | null): string {
  if (!cat) return "TPE/Micro (1-9)"
  return CATEGORIE_MAP[cat] || cat
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")
  const page = searchParams.get("page") || "1"

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ data: [], total: 0 })
  }

  try {
    const apiUrl = new URL("https://recherche-entreprises.api.gouv.fr/search")
    apiUrl.searchParams.set("q", q.trim())
    apiUrl.searchParams.set("page", page)
    apiUrl.searchParams.set("per_page", "10")

    const response = await fetch(apiUrl.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // cache 5 min
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur API data.gouv.fr", status: response.status },
        { status: 502 }
      )
    }

    const raw = await response.json()

    const data = (raw.results || []).map((r: any) => {
      const siege = r.siege || {}
      return {
        siren: r.siren || "",
        siret: siege.siret || "",
        name: r.nom_complet || r.nom_raison_sociale || "",
        address: siege.geo_adresse || siege.adresse || "",
        postalCode: siege.code_postal || "",
        city: siege.libelle_commune || siege.commune || "",
        legalForm: mapNatureJuridique(r.nature_juridique),
        legalFormCode: r.nature_juridique || "",
        activity: siege.activite_principale || "",
        activityLabel: siege.activite_principale_label || siege.libelle_activite_principale || "",
        size: mapCategorie(r.categorie_entreprise),
        createdAt: r.date_creation || "",
        dirigeants: (r.dirigeants || []).map((d: any) => ({
          nom: d.nom || "",
          prenom: d.prenoms || "",
          qualite: d.qualite || "",
        })),
      }
    })

    return NextResponse.json({
      data,
      total: raw.total_results || 0,
      page: raw.page || 1,
      perPage: raw.per_page || 10,
    })
  } catch (error) {
    console.error("Entreprise search error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la recherche" },
      { status: 500 }
    )
  }
}
