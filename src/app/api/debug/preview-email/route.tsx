import { NextRequest } from "next/server"
import { VerificationEmail } from "@/lib/email/templates/verification-email"
import { render } from "@react-email/render"

export async function GET(request: NextRequest) {
  const userName = request.nextUrl.searchParams.get("name") || "Utilisateur Test"
  const verificationCode = "123456" // Preview code

  const html = await render(
    VerificationEmail({
      verificationCode,
      userName,
    })
  )

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
