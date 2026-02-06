"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle } from "lucide-react"

interface VerifyClientProps {
  email: string
  redirectPath: string
}

export function VerifyClient({ email, redirectPath }: VerifyClientProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function performSignIn() {
      try {
        // Sign in using credentials provider (magic link verified)
        const result = await signIn("credentials", {
          email,
          magicLinkVerified: "true",
          redirect: false,
        })

        if (result?.error) {
          console.error("Sign in error:", result.error)
          setError("Erreur lors de la connexion. Veuillez réessayer.")
          setStatus("error")
          return
        }

        setStatus("success")
        
        // Small delay to show success state
        setTimeout(() => {
          router.push(redirectPath)
          router.refresh()
        }, 1000)
      } catch (err) {
        console.error("Sign in exception:", err)
        setError("Une erreur est survenue. Veuillez réessayer.")
        setStatus("error")
      }
    }

    performSignIn()
  }, [email, redirectPath, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-lime-400 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-white">
              Vérification en cours...
            </h1>
            <p className="text-neutral-400">
              Connexion à votre compte {email}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-12 w-12 text-lime-400 mx-auto" />
            <h1 className="text-2xl font-bold text-white">
              Email vérifié !
            </h1>
            <p className="text-neutral-400">
              Redirection en cours...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Erreur de connexion
            </h1>
            <p className="text-red-400">
              {error}
            </p>
            <a
              href="/login"
              className="inline-block mt-4 px-6 py-2 bg-lime-400 text-neutral-900 font-medium rounded-lg hover:bg-lime-300 transition-colors"
            >
              Retour à la connexion
            </a>
          </>
        )}
      </div>
    </div>
  )
}
