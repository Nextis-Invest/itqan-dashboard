"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Logo } from "@/components/ui/logo"
import { Loader2 } from "lucide-react"
import Cookies from "js-cookie"

function MissionAuthContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const provider = searchParams.get("provider")
    const missionData = searchParams.get("mission")

    if (!provider || !missionData) {
      setError("Paramètres manquants")
      return
    }

    if (provider !== "google" && provider !== "linkedin") {
      setError("Provider non supporté")
      return
    }

    try {
      // Validate mission JSON
      const mission = JSON.parse(decodeURIComponent(missionData))
      
      // Store mission data in cookie for post-auth processing
      Cookies.set("pending_mission_data", JSON.stringify(mission), {
        expires: 1, // 1 day
        path: "/",
        sameSite: "lax",
      })

      // Trigger OAuth - callback page will process mission creation
      signIn(provider, {
        callbackUrl: "/mission-callback",
      })
    } catch (e) {
      console.error("Mission parse error:", e)
      setError("Données de mission invalides")
    }
  }, [searchParams, router])

  if (error) {
    return (
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center">
          <Logo width={200} height={64} className="h-16 w-auto" />
        </div>
        <div className="backdrop-blur-xl bg-card/70 border border-red-500/30 rounded-2xl p-8 shadow-2xl shadow-black/20 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="mt-4 text-sm text-muted-foreground hover:text-lime-400"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <Logo width={200} height={64} className="h-16 w-auto" />
      </div>
      <div className="backdrop-blur-xl bg-card/70 border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400 mx-auto mb-4" />
        <p className="text-foreground font-medium">Connexion en cours...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Vous allez être redirigé vers votre compte
        </p>
      </div>
    </div>
  )
}

export default function MissionAuthPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo width={200} height={64} className="h-16 w-auto" />
        </div>
        <div className="backdrop-blur-xl bg-card/70 border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400 mx-auto mb-4" />
          <p className="text-foreground font-medium">Chargement...</p>
        </div>
      </div>
    }>
      <MissionAuthContent />
    </Suspense>
  )
}
