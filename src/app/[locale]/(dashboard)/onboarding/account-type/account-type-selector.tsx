"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, Briefcase, Loader2, ArrowRight } from "lucide-react"

type AccountType = "CLIENT" | "FREELANCER"

interface AccountTypeSelectorProps {
  userId: string
}

export function AccountTypeSelector({ userId }: AccountTypeSelectorProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<AccountType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleContinue = async () => {
    if (!selected) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/set-account-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, accountType: selected }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Une erreur est survenue")
      }

      // Redirect to profile onboarding
      router.push("/onboarding")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20 text-center">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {/* Client option */}
        <button
          type="button"
          onClick={() => setSelected("CLIENT")}
          disabled={isLoading}
          className={`relative flex items-start gap-4 rounded-2xl p-6 border-2 transition-all duration-300 text-left ${
            selected === "CLIENT"
              ? "border-lime-400 bg-lime-400/10 shadow-[0_0_30px_rgba(163,230,53,0.15)]"
              : "border-border bg-card hover:border-border/80 hover:bg-accent/50"
          }`}
        >
          <div
            className={`shrink-0 p-3 rounded-xl transition-all duration-300 ${
              selected === "CLIENT"
                ? "bg-lime-400/20 text-lime-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Je suis un client</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Je cherche des freelances pour réaliser mes projets. Je veux publier des missions et recruter des talents.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Publier des missions
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Recruter des talents
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Gérer des projets
              </span>
            </div>
          </div>
          {selected === "CLIENT" && (
            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-lime-400 flex items-center justify-center">
              <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>

        {/* Freelancer option */}
        <button
          type="button"
          onClick={() => setSelected("FREELANCER")}
          disabled={isLoading}
          className={`relative flex items-start gap-4 rounded-2xl p-6 border-2 transition-all duration-300 text-left ${
            selected === "FREELANCER"
              ? "border-lime-400 bg-lime-400/10 shadow-[0_0_30px_rgba(163,230,53,0.15)]"
              : "border-border bg-card hover:border-border/80 hover:bg-accent/50"
          }`}
        >
          <div
            className={`shrink-0 p-3 rounded-xl transition-all duration-300 ${
              selected === "FREELANCER"
                ? "bg-lime-400/20 text-lime-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Je suis freelance</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Je propose mes services et je cherche des missions. Je veux créer mon profil et trouver des clients.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Trouver des missions
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Créer mon profil
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Proposer mes services
              </span>
            </div>
          </div>
          {selected === "FREELANCER" && (
            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-lime-400 flex items-center justify-center">
              <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selected || isLoading}
        className="w-full h-12 bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-semibold rounded-xl hover:from-lime-300 hover:to-emerald-300 shadow-lg shadow-lime-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
