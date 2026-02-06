"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Logo } from "@/components/ui/logo"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Cookies from "js-cookie"

interface MissionData {
  description: string
  budgetMin: number
  budgetMax?: number | null
  duration: string
  skills: string[]
  category?: string
  subcategory?: string
}

function MissionCallbackContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [state, setState] = useState<"loading" | "creating" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // User is authenticated - check for pending mission
    const missionDataStr = Cookies.get("pending_mission_data")
    
    if (!missionDataStr) {
      // No pending mission - redirect to dashboard
      router.push("/dashboard")
      return
    }

    const createMission = async () => {
      setState("creating")
      
      try {
        const missionData: MissionData = JSON.parse(missionDataStr)
        
        // Create mission via API
        const response = await fetch("/api/missions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: missionData.description.slice(0, 100).trim(),
            description: missionData.description,
            budgetMin: missionData.budgetMin,
            budgetMax: missionData.budgetMax,
            budgetType: "FIXED",
            currency: "MAD",
            duration: missionData.duration,
            skills: missionData.skills,
            category: missionData.category,
            subcategory: missionData.subcategory,
            status: "OPEN",
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Erreur lors de la création")
        }

        const { mission } = await response.json()
        
        // Clear the cookie
        Cookies.remove("pending_mission_data", { path: "/" })
        
        setState("success")
        
        // Redirect to mission page after a brief delay
        setTimeout(() => {
          router.push(`/missions/${mission.id}`)
        }, 1500)
        
      } catch (error) {
        console.error("Mission creation error:", error)
        setState("error")
        setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue")
        
        // Clear cookie on error too
        Cookies.remove("pending_mission_data", { path: "/" })
      }
    }

    createMission()
  }, [session, status, router])

  return (
    <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <Logo width={200} height={64} className="h-16 w-auto" />
      </div>
      
      <div className="backdrop-blur-xl bg-card/70 border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/20 text-center">
        {(state === "loading" || state === "creating") && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-lime-400 mx-auto mb-4" />
            <p className="text-foreground font-medium">
              {state === "loading" ? "Vérification..." : "Publication de votre mission..."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Un instant, nous préparons tout
            </p>
          </>
        )}
        
        {state === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-foreground font-semibold text-lg">Mission publiée !</p>
            <p className="text-sm text-muted-foreground mt-2">
              Redirection vers votre tableau de bord...
            </p>
          </>
        )}
        
        {state === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-foreground font-semibold">Erreur</p>
            <p className="text-sm text-red-400 mt-2">{errorMessage}</p>
            <button 
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-4 py-2 bg-lime-400 text-neutral-900 rounded-lg font-medium text-sm hover:bg-lime-300 transition-colors"
            >
              Aller au tableau de bord
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function MissionCallbackPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo width={200} height={64} className="h-16 w-auto" />
        </div>
        <div className="backdrop-blur-xl bg-card/70 border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-lime-400 mx-auto mb-4" />
          <p className="text-foreground font-medium">Chargement...</p>
        </div>
      </div>
    }>
      <MissionCallbackContent />
    </Suspense>
  )
}
