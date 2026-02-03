import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@discoverly.cc"

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string
  subject: string
  html: string
  attachments?: { filename: string; content: Buffer }[]
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Itqan <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    })
    if (error) {
      console.error("Email send error:", error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error("Email send exception:", error)
    return { success: false, error }
  }
}

// Shared email wrapper with dark theme
function emailLayout(title: string, body: string, ctaUrl?: string, ctaText?: string): string {
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
          <h2 style="margin:0 0 16px;font-size:18px;color:#ffffff;font-weight:600;">${title}</h2>
          <div style="color:#a3a3a3;font-size:14px;line-height:1.6;">${body}</div>
          ${ctaUrl ? `
          <div style="margin:24px 0;">
            <a href="${ctaUrl}" style="display:inline-block;background-color:#a3e635;color:#171717;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
              ${ctaText || "Voir sur Itqan"}
            </a>
          </div>` : ""}
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

export function welcomeEmail(name: string) {
  return emailLayout(
    `Bienvenue sur Itqan, ${name} !`,
    `<p>Nous sommes ravis de vous accueillir sur Itqan, la plateforme de mise en relation freelance au Maroc.</p>
     <p>Commencez par compléter votre profil pour être visible par la communauté.</p>`,
    `${process.env.NEXTAUTH_URL}/onboarding`,
    "Compléter mon profil"
  )
}

export function missionPostedEmail(missionTitle: string, missionId: string) {
  return emailLayout(
    "Votre mission a été publiée !",
    `<p>Votre mission <strong style="color:#fff;">"${missionTitle}"</strong> est maintenant visible par les freelances.</p>
     <p>Vous recevrez une notification dès qu'un freelance soumettra une proposition.</p>`,
    `${process.env.NEXTAUTH_URL}/missions/${missionId}`,
    "Voir ma mission"
  )
}

export function newProposalEmail(freelancerName: string, missionTitle: string, missionId: string) {
  return emailLayout(
    "Nouvelle proposition reçue",
    `<p><strong style="color:#fff;">${freelancerName}</strong> a soumis une proposition pour votre mission <strong style="color:#fff;">"${missionTitle}"</strong>.</p>
     <p>Consultez les détails et décidez si ce freelance correspond à vos besoins.</p>`,
    `${process.env.NEXTAUTH_URL}/missions/${missionId}`,
    "Voir la proposition"
  )
}

export function proposalAcceptedEmail(missionTitle: string, missionId: string) {
  return emailLayout(
    "Votre proposition a été acceptée ! 🎉",
    `<p>Félicitations ! Votre proposition pour la mission <strong style="color:#fff;">"${missionTitle}"</strong> a été acceptée.</p>
     <p>Vous pouvez maintenant commencer à travailler sur cette mission.</p>`,
    `${process.env.NEXTAUTH_URL}/missions/${missionId}`,
    "Voir la mission"
  )
}

export function proposalRejectedEmail(missionTitle: string) {
  return emailLayout(
    "Proposition non retenue",
    `<p>Votre proposition pour la mission <strong style="color:#fff;">"${missionTitle}"</strong> n'a pas été retenue.</p>
     <p>Ne vous découragez pas ! De nouvelles missions sont publiées chaque jour.</p>`,
    `${process.env.NEXTAUTH_URL}/missions`,
    "Parcourir les missions"
  )
}

export function newMessageEmail(senderName: string, conversationId: string) {
  return emailLayout(
    "Nouveau message",
    `<p><strong style="color:#fff;">${senderName}</strong> vous a envoyé un message.</p>
     <p>Connectez-vous pour lire et répondre.</p>`,
    `${process.env.NEXTAUTH_URL}/messages?c=${conversationId}`,
    "Lire le message"
  )
}

export function missionCompletedEmail(missionTitle: string, missionId: string) {
  return emailLayout(
    "Mission terminée — Laissez un avis !",
    `<p>La mission <strong style="color:#fff;">"${missionTitle}"</strong> est maintenant terminée.</p>
     <p>Partagez votre expérience en laissant un avis. Cela aide la communauté !</p>`,
    `${process.env.NEXTAUTH_URL}/missions/${missionId}`,
    "Laisser un avis"
  )
}

export function reviewReceivedEmail(reviewerName: string, rating: number) {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating)
  return emailLayout(
    "Vous avez reçu un avis",
    `<p><strong style="color:#fff;">${reviewerName}</strong> vous a laissé un avis.</p>
     <p style="font-size:20px;color:#facc15;">${stars}</p>`,
    `${process.env.NEXTAUTH_URL}/profile`,
    "Voir mon profil"
  )
}

export function disputeOpenedEmail(missionTitle: string, missionId: string) {
  return emailLayout(
    "Un litige a été ouvert",
    `<p>Un litige a été ouvert concernant la mission <strong style="color:#fff;">"${missionTitle}"</strong>.</p>
     <p>Notre équipe examinera la situation et vous tiendra informé.</p>`,
    `${process.env.NEXTAUTH_URL}/missions/${missionId}`,
    "Voir les détails"
  )
}

export function newMissionForReviewEmail(clientName: string, missionTitle: string, missionId: string) {
  return emailLayout(
    "Nouvelle mission à valider",
    `<p><strong style="color:#fff;">${clientName}</strong> a soumis une nouvelle mission : <strong style="color:#fff;">"${missionTitle}"</strong>.</p>
     <p>Vérifiez les détails et validez ou rejetez cette mission.</p>`,
    `${process.env.NEXTAUTH_URL}/admin/missions?status=PENDING_REVIEW`,
    "Voir les missions en attente"
  )
}

export function creditPurchaseEmail(amount: number, newBalance: number) {
  return emailLayout(
    "Achat de crédits confirmé",
    `<p>Votre achat de <strong style="color:#a3e635;">${amount} crédits</strong> a été confirmé.</p>
     <p>Solde actuel : <strong style="color:#fff;">${newBalance} crédits</strong></p>`,
    `${process.env.NEXTAUTH_URL}/credits`,
    "Voir mes crédits"
  )
}

export function invoiceEmail(
  invoiceNumber: string,
  clientName: string,
  totalAmount: number,
  currency: string,
  dueDate: string
) {
  return emailLayout(
    `Facture ${invoiceNumber}`,
    `<p>Bonjour <strong style="color:#fff;">${clientName}</strong>,</p>
     <p>Veuillez trouver ci-joint votre facture <strong style="color:#a3e635;">${invoiceNumber}</strong>.</p>
     <p>Montant total TTC : <strong style="color:#fff;">${totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} ${currency}</strong></p>
     <p>Date d'échéance : <strong style="color:#fff;">${new Date(dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong></p>
     <p style="margin-top:16px;">Merci pour votre confiance.</p>`,
    `${process.env.NEXTAUTH_URL}/invoices`,
    "Voir mes factures"
  )
}

export function invoiceReminderEmail(
  invoiceNumber: string,
  clientName: string,
  totalAmount: number,
  daysOverdue: number
) {
  return emailLayout(
    `Relance — Facture ${invoiceNumber}`,
    `<p>Bonjour <strong style="color:#fff;">${clientName}</strong>,</p>
     <p>Nous vous rappelons que la facture <strong style="color:#a3e635;">${invoiceNumber}</strong> d'un montant de <strong style="color:#fff;">${totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} MAD</strong> est en retard de <strong style="color:#ef4444;">${daysOverdue} jour(s)</strong>.</p>
     <p>Nous vous prions de bien vouloir procéder au règlement dans les meilleurs délais.</p>
     <p>Si le paiement a déjà été effectué, merci de ne pas tenir compte de ce message.</p>`,
    `${process.env.NEXTAUTH_URL}/invoices`,
    "Voir mes factures"
  )
}
