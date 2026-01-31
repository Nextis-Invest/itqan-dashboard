import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      freelancerProfile: {
        include: { experiences: { orderBy: { startDate: "desc" } } },
      },
      badges: { select: { type: true, name: true, icon: true, earnedAt: true } },
      certifications: true,
      educations: true,
      reviewsReceived: {
        select: { rating: true, comment: true, createdAt: true, author: { select: { name: true } }, mission: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      gigs: {
        where: { status: "ACTIVE" },
        select: {
          id: true, title: true, category: true, basicPrice: true,
          standardPrice: true, premiumPrice: true, currency: true, skills: true, deliveryDays: true,
        },
      },
    },
  })

  if (!user || !user.freelancerProfile) {
    return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })
  }

  const fp = user.freelancerProfile
  return NextResponse.json({
    data: {
      id: user.id,
      name: user.name,
      image: user.image,
      title: fp.title,
      bio: fp.bio,
      city: fp.city,
      country: fp.country,
      skills: fp.skills,
      category: fp.category,
      dailyRate: fp.dailyRate,
      currency: fp.currency,
      avgRating: fp.avgRating,
      completedMissions: fp.completedMissions,
      available: fp.available,
      remote: fp.remote,
      verified: fp.verified,
      badges: user.badges,
      experiences: fp.experiences,
      certifications: user.certifications,
      educations: user.educations,
      reviews: user.reviewsReceived,
      gigs: user.gigs,
      links: {
        portfolio: fp.portfolioUrl,
        linkedin: fp.linkedinUrl,
        github: fp.githubUrl,
        website: fp.websiteUrl,
      },
    },
  }, { headers: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "99" } })
}
