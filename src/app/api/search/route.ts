import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { prismaCatalog } from "@/lib/prisma-catalog"

export const dynamic = "force-dynamic"

// Public API - no auth required
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim()
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50)

  if (!query || query.length < 2) {
    return NextResponse.json({
      freelancers: [],
      gigs: [],
      categories: [],
      skills: [],
    })
  }

  const searchTerms = query.toLowerCase().split(" ").filter(Boolean)

  try {
    // Search freelancers
    const freelancers = await prisma.user.findMany({
      where: {
        role: "FREELANCER",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { freelancerProfile: { title: { contains: query, mode: "insensitive" } } },
          { freelancerProfile: { bio: { contains: query, mode: "insensitive" } } },
          { freelancerProfile: { skills: { hasSome: searchTerms } } },
        ],
      },
      include: {
        freelancerProfile: {
          select: {
            title: true,
            skills: true,
            city: true,
            dailyRate: true,
            currency: true,
            avgRating: true,
            verified: true,
            available: true,
          },
        },
      },
      take: limit,
      orderBy: [
        { freelancerProfile: { verified: "desc" } },
        { freelancerProfile: { avgRating: "desc" } },
      ],
    })

    // Search gigs
    const gigs = await prisma.gig.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { skills: { hasSome: searchTerms } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
            freelancerProfile: {
              select: {
                avgRating: true,
                verified: true,
              },
            },
          },
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    // Search categories from main database (same as marketplace pages use)
    const categoryResults = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        parent: {
          select: { slug: true },
        },
      },
      take: 10,
      orderBy: { level: "asc" },
    })

    const categories = categoryResults.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      parentSlug: cat.parent?.slug || null,
    }))

    // Search skills from catalog (these link to skill pages, not category pages)
    let skills: Array<{ id: string; name: string; slug: string; categorySlug: string | null }> = []
    
    try {
      const skillResults = await prismaCatalog.skill.findMany({
        where: {
          isActive: true,
          translations: {
            some: {
              locale: "fr",
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { slug: { contains: query, mode: "insensitive" } },
              ],
            },
          },
        },
        include: {
          translations: {
            where: { locale: "fr" },
            select: { name: true, slug: true },
          },
        },
        take: 15,
      })

      skills = skillResults.map((skill) => ({
        id: skill.id,
        name: skill.translations[0]?.name || "",
        slug: skill.translations[0]?.slug || "",
        categorySlug: null, // Skills link to /marketplace/skills/[slug], not category pages
      }))
    } catch {
      // Catalog DB might not be available
      console.warn("Catalog skill search failed, skipping skills")
    }

    // Serialize results
    const serializedFreelancers = freelancers.map((f) => ({
      id: f.id,
      name: f.name,
      image: f.image,
      title: f.freelancerProfile?.title,
      skills: f.freelancerProfile?.skills?.slice(0, 5) || [],
      city: f.freelancerProfile?.city,
      dailyRate: f.freelancerProfile?.dailyRate ? Number(f.freelancerProfile.dailyRate) : null,
      currency: f.freelancerProfile?.currency,
      avgRating: f.freelancerProfile?.avgRating ? Number(f.freelancerProfile.avgRating) : null,
      verified: f.freelancerProfile?.verified || false,
      available: f.freelancerProfile?.available || false,
    }))

    const serializedGigs = gigs.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      skills: g.skills.slice(0, 5),
      basicPrice: g.basicPrice,
      currency: g.currency,
      deliveryDays: g.deliveryDays,
      freelancer: {
        id: g.freelancer.id,
        name: g.freelancer.name,
        image: g.freelancer.image,
        avgRating: g.freelancer.freelancerProfile?.avgRating
          ? Number(g.freelancer.freelancerProfile.avgRating)
          : null,
        verified: g.freelancer.freelancerProfile?.verified || false,
      },
    }))

    return NextResponse.json({
      query,
      freelancers: serializedFreelancers,
      gigs: serializedGigs,
      categories,
      skills,
      total: serializedFreelancers.length + serializedGigs.length + categories.length + skills.length,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}
