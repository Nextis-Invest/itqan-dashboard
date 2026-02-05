import * as React from "react"

interface VerificationEmailProps {
  verificationUrl: string
  userName?: string
}

export const VerificationEmail = ({
  verificationUrl,
  userName,
}: VerificationEmailProps) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body
      style={{
        backgroundColor: "#f4f4f5",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Header with logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "16px 32px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <img
              src="https://app.itqan.ma/icons/itqan-logo.svg"
              alt="Itqan"
              width="140"
              height="48"
              style={{
                display: "block",
                margin: 0,
              }}
            />
          </div>
        </div>

        {/* Main content card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: "24px",
              fontWeight: "600",
              color: "#18181b",
              lineHeight: "1.3",
            }}
          >
            Vérifiez votre adresse email
          </h2>

          {userName && (
            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "16px",
                color: "#52525b",
                lineHeight: "1.5",
              }}
            >
              Bonjour {userName},
            </p>
          )}

          <p
            style={{
              margin: "0 0 24px 0",
              fontSize: "16px",
              color: "#52525b",
              lineHeight: "1.6",
            }}
          >
            Bienvenue sur <strong style={{ color: "#a3e635" }}>Itqan</strong> !
            Pour commencer à utiliser votre compte et accéder à toutes les
            fonctionnalités de la plateforme de freelance au Maroc et en France,
            veuillez vérifier votre adresse email.
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: "center", margin: "32px 0" }}>
            <a
              href={verificationUrl}
              style={{
                display: "inline-block",
                padding: "16px 40px",
                backgroundColor: "#a3e635",
                color: "#18181b",
                textDecoration: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(163, 230, 53, 0.4)",
                border: "2px solid #a3e635",
              }}
            >
              ✓ Vérifier mon email
            </a>
          </div>

          {/* Alternative link */}
          <p
            style={{
              margin: "24px 0 0 0",
              fontSize: "14px",
              color: "#71717a",
              lineHeight: "1.5",
            }}
          >
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre
            navigateur :
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "13px",
              color: "#a3e635",
              wordBreak: "break-all",
              fontFamily: "monospace",
              backgroundColor: "#fafafa",
              padding: "12px",
              borderRadius: "6px",
            }}
          >
            {verificationUrl}
          </p>

          {/* Security notice */}
          <div
            style={{
              marginTop: "32px",
              padding: "16px",
              backgroundColor: "#fef3c7",
              borderLeft: "4px solid #f59e0b",
              borderRadius: "6px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#92400e",
                lineHeight: "1.5",
              }}
            >
              <strong>⚠️ Note de sécurité :</strong> Ce lien expire dans 24
              heures. Si vous n'avez pas demandé cette vérification, vous
              pouvez ignorer cet email en toute sécurité.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            fontSize: "13px",
            color: "#a1a1aa",
          }}
        >
          <p style={{ margin: "0 0 8px 0" }}>
            © {new Date().getFullYear()} Itqan. Tous droits réservés.
          </p>
          <p style={{ margin: 0 }}>
            La marketplace de freelances au Maroc et en France
          </p>
        </div>
      </div>
    </body>
  </html>
)

// Plain text version for email clients that don't support HTML
export const verificationEmailText = ({
  verificationUrl,
  userName,
}: VerificationEmailProps) => `
Vérifiez votre adresse email

${userName ? `Bonjour ${userName},` : "Bonjour,"}

Bienvenue sur Itqan ! Pour commencer à utiliser votre compte et accéder à toutes les fonctionnalités de notre plateforme, veuillez vérifier votre adresse email.

Cliquez sur le lien ci-dessous pour vérifier votre email :
${verificationUrl}

⚠️ Note de sécurité : Ce lien expire dans 24 heures. Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email en toute sécurité.

---
© ${new Date().getFullYear()} Itqan. Tous droits réservés.
La marketplace de freelances au Maroc et en France
`
