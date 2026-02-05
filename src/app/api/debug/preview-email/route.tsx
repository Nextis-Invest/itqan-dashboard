import { NextRequest } from "next/server"
import { VerificationEmail } from "@/lib/email/templates/verification-email"
import { render } from "@react-email/render"

export async function GET(request: NextRequest) {
  const userName = request.nextUrl.searchParams.get("name") || "Utilisateur Test"
  const token = "preview-token-123456"
  const verificationUrl = `https://app.itqan.ma/api/auth/verify-email?token=${token}`

  const html = await render(
    VerificationEmail({
      verificationUrl,
      userName,
    })
  )

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
