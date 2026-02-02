"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Download, CheckCircle, AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export function LinkedInImportButton({ hasLinkedInToken }: { hasLinkedInToken: boolean }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)

  const handleImport = async () => {
    if (!hasLinkedInToken) {
      signIn("linkedin", { callbackUrl: window.location.pathname + "?linkedin_import=1" })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/linkedin/import", { method: "POST" })
      const data = await res.json()

      if (res.ok) {
        setResult({ success: true, message: data.message || "Import réussi !" })
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setResult({ success: false, message: data.message })
      }
    } catch {
      setResult({ success: false, message: "Erreur lors de l'import" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleImport}
        disabled={loading}
        variant="outline"
        className="border-[#0A66C2]/30 bg-[#0A66C2]/5 text-[#0A66C2] hover:bg-[#0A66C2]/15 hover:border-[#0A66C2]/50 hover:text-[#0A66C2] h-10 rounded-xl font-medium transition-all duration-200"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LinkedInIcon className="mr-2 h-4 w-4" />
        )}
        {hasLinkedInToken ? "Importer depuis LinkedIn" : "Se connecter à LinkedIn pour importer"}
      </Button>

      {result && (
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
          result.success
            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
            : "text-red-400 bg-red-400/10 border-red-400/20"
        }`}>
          {result.success ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
          {result.message}
        </div>
      )}
    </div>
  )
}
