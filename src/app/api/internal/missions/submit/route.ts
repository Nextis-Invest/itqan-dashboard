import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

// Internal API key validation
const INTERNAL_API_KEY = process.env.INTERNAL_API_SECRET

interface SubmitMissionRequest {
  email: string
  phone: string
  description: string
  budgetMin: number
  budgetMax: number | null
  duration: string
  skills: string[]
  category?: string
  subcategory?: string
}

export async function POST(request: NextRequest) {
  try {
    // Validate internal API key
    const apiKey = request.headers.get("x-api-key")
    if (!INTERNAL_API_KEY || apiKey !== INTERNAL_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: SubmitMissionRequest = await request.json()
    
    const {
      email,
      phone,
      description,
      budgetMin,
      budgetMax,
      duration,
      skills,
      category,
      subcategory,
    } = body

    // Validate required fields
    if (!email || !phone || !description) {
      return NextResponse.json(
        { error: "Email, téléphone et description requis" },
        { status: 400 }
      )
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
      },
    })

    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    if (user) {
      // User exists - update phone and verification token
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          phone,
          verificationToken,
          verificationTokenExpiry,
        },
      })
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          phone,
          role: "CLIENT",
          verificationToken,
          verificationTokenExpiry,
        },
      })
    }

    // Generate mission title from description
    const title = description.slice(0, 100).trim()

    // Create mission with OPEN status (published immediately)
    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        budgetMin,
        budgetMax,
        budgetType: "FIXED",
        currency: "MAD",
        duration,
        skills,
        category,
        subcategory,
        status: "OPEN",
        clientId: user.id,
      },
    })

    // Build verification URL
    const dashboardUrl = process.env.NEXTAUTH_URL || "https://app.itqan.ma"
    const verificationUrl = `${dashboardUrl}/verify?token=${verificationToken}&mission=${mission.id}`

    // Format budget for email
    const budgetText = budgetMax
      ? `${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()} MAD`
      : `${budgetMin.toLocaleString()}+ MAD`

    // Send client verification email
    await sendEmail({
      to: email,
      subject: "✅ Mission publiée - Vérifiez votre email | Itqan",
      html: clientVerificationEmailHtml(title, verificationUrl),
    })

    // Get admin users from database
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true },
    })

    // Send notification to all admins
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `🆕 Nouvelle mission: ${title}`,
        html: adminNotificationEmailHtml({
          missionTitle: title,
          missionId: mission.id,
          clientEmail: email,
          clientPhone: phone,
          description,
          budget: budgetText,
          dashboardUrl,
        }),
      })
    }

    return NextResponse.json({
      success: true,
      missionId: mission.id,
      email,
    })
  } catch (error) {
    console.error("Mission submit error:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

function clientVerificationEmailHtml(missionTitle: string, verificationUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#171717;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#171717;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#262626;border-radius:12px;border:1px solid #404040;">
        <tr><td style="padding:32px 32px 24px;border-bottom:1px solid #404040;">
          <h1 style="margin:0;font-size:20px;color:#a3e635;font-weight:700;">⚡ Itqan</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="margin:0 0 16px;font-size:18px;color:#22c55e;font-weight:600;">✅ Votre mission est publiée !</h2>
          
          <div style="background-color:#1f1f1f;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;color:#a3a3a3;font-size:12px;text-transform:uppercase;">Votre mission</p>
            <p style="margin:8px 0 0;color:#ffffff;font-size:14px;font-style:italic;">"${missionTitle}"</p>
          </div>
          
          <p style="color:#a3a3a3;font-size:14px;line-height:1.6;">
            Nos freelances qualifiés vont bientôt postuler.
          </p>
          
          <p style="color:#ffffff;font-size:14px;line-height:1.6;font-weight:500;">
            Pour suivre les candidatures et gérer votre mission, vérifiez votre adresse email :
          </p>
          
          <div style="margin:24px 0;text-align:center;">
            <a href="${verificationUrl}" style="display:inline-block;background-color:#a3e635;color:#171717;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:14px;">
              Vérifier mon email
            </a>
          </div>
          
          <div style="background-color:#422006;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:0 8px 8px 0;margin:16px 0;">
            <p style="margin:0;color:#fcd34d;font-size:13px;">
              💡 <strong>Pensez à vérifier vos spams</strong> si vous ne trouvez pas cet email.
            </p>
          </div>
          
          <p style="color:#737373;font-size:12px;margin-top:16px;">Ce lien expire dans 24 heures.</p>
        </td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid #404040;">
          <p style="margin:0;color:#737373;font-size:12px;">© ${new Date().getFullYear()} Itqan — Plateforme freelance Maroc</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function adminNotificationEmailHtml(params: {
  missionTitle: string
  missionId: string
  clientEmail: string
  clientPhone: string
  description: string
  budget: string
  dashboardUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#171717;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#171717;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#262626;border-radius:12px;border:1px solid #404040;">
        <tr><td style="padding:24px 32px;background-color:#a3e635;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;font-size:16px;color:#171717;font-weight:700;">🆕 Nouvelle mission reçue</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;">
                <p style="margin:0;color:#737373;font-size:11px;text-transform:uppercase;">Titre</p>
                <p style="margin:4px 0 0;color:#ffffff;font-size:14px;">${params.missionTitle}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <p style="margin:0;color:#737373;font-size:11px;text-transform:uppercase;">Client</p>
                <p style="margin:4px 0 0;color:#ffffff;font-size:14px;">${params.clientEmail}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <p style="margin:0;color:#737373;font-size:11px;text-transform:uppercase;">Téléphone</p>
                <p style="margin:4px 0 0;color:#ffffff;font-size:14px;">${params.clientPhone}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <p style="margin:0;color:#737373;font-size:11px;text-transform:uppercase;">Budget</p>
                <p style="margin:4px 0 0;color:#a3e635;font-size:14px;font-weight:600;">${params.budget}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <p style="margin:0;color:#737373;font-size:11px;text-transform:uppercase;">Description</p>
                <p style="margin:4px 0 0;color:#a3a3a3;font-size:13px;line-height:1.5;">${params.description.slice(0, 300)}${params.description.length > 300 ? "..." : ""}</p>
              </td>
            </tr>
          </table>
          
          <div style="margin:24px 0 0;text-align:center;">
            <a href="${params.dashboardUrl}/admin/missions/${params.missionId}" style="display:inline-block;background-color:#a3e635;color:#171717;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
              Voir la mission
            </a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
