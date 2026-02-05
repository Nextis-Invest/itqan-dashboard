"use client"

import { useState } from "react"
import { AlertCircle, X, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface VerificationBannerProps {
  isVerified: boolean
}

export function VerificationBanner({ isVerified }: VerificationBannerProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [showCodeInput, setShowCodeInput] = useState(false)

  // Don't show banner if email is verified or banner was dismissed
  if (isVerified || !isVisible) {
    return null
  }

  const handleResendEmail = async () => {
    setIsSending(true)
    setMessage(null)

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("✅ Code envoyé ! Vérifiez votre boîte de réception.")
        setShowCodeInput(true)
      } else {
        setMessage(data.error || "Une erreur s'est produite. Veuillez réessayer.")
      }
    } catch (error) {
      setMessage("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsSending(false)
    }
  }

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setMessage("Le code doit contenir 6 chiffres")
      return
    }

    setIsVerifying(true)
    setMessage(null)

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("✅ Email vérifié avec succès ! Rechargement...")
        setTimeout(() => {
          router.refresh()
        }, 1500)
      } else {
        setMessage(data.error || "Code invalide ou expiré")
      }
    } catch (error) {
      setMessage("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="relative bg-yellow-50 dark:bg-yellow-950/30 border-b border-yellow-200 dark:border-yellow-900">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Vérifiez votre adresse email</strong> pour accéder à toutes les fonctionnalités.
              </p>
              {message && (
                <p className="text-xs mt-1 text-yellow-700 dark:text-yellow-300">
                  {message}
                </p>
              )}

              {showCodeInput && (
                <div className="flex items-center gap-2 mt-3">
                  <Input
                    type="text"
                    placeholder="Code à 6 chiffres"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="w-40 font-mono text-center text-lg font-bold"
                    disabled={isVerifying}
                  />
                  <Button
                    size="sm"
                    onClick={handleVerifyCode}
                    disabled={isVerifying || code.length !== 6}
                    className="bg-lime-500 hover:bg-lime-600 text-black"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {isVerifying ? "Vérification..." : "Vérifier"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!showCodeInput && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleResendEmail}
                disabled={isSending}
                className="shrink-0 bg-white dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isSending ? "Envoi..." : "Recevoir le code"}
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="shrink-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:text-yellow-500 dark:hover:bg-yellow-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
