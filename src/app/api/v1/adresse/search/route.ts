import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")
  if (!q || q.trim().length < 3) {
    return NextResponse.json({ data: [] })
  }

  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5`,
      { next: { revalidate: 60 } }
    )
    const json = await res.json()

    const data = (json.features || []).map((f: any) => ({
      label: f.properties.label,
      street: f.properties.street || "",
      housenumber: f.properties.housenumber || "",
      postcode: f.properties.postcode || "",
      city: f.properties.city || "",
      context: f.properties.context || "",
    }))

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: [] }, { status: 500 })
  }
}
