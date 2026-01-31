"use client"

import { useState, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, Loader2, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  )
}

function LoginSkeleton() {
  return (
    <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
      <CardHeader className="space-y-1">
        <div className="h-8 w-32 bg-neutral-800 animate-pulse rounded" />
        <div className="h-4 w-48 bg-neutral-800 animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-10 bg-neutral-800 animate-pulse rounded" />
        <div className="h-10 bg-neutral-800 animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("")
  const [code, setCode] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"email" | "code">("email")

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/magic-link/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Une erreur est survenue")
      } else {
        setStep("code")
      }
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }

    if (newCode.every(d => d) && newCode.join("").length === 4) {
      handleVerifyCode(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4)
    if (!/^\d+$/.test(pastedData)) return

    const newCode = [...code]
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }
    setCode(newCode)

    if (newCode.every(d => d) && newCode.join("").length === 4) {
      handleVerifyCode(newCode.join(""))
    }
  }

  const handleVerifyCode = async (codeStr: string) => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/magic-link/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: codeStr }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Code invalide")
        setCode(["", "", "", ""])
        inputRefs[0].current?.focus()
      } else {
        const result = await signIn("credentials", {
          email: data.email,
          magicLinkVerified: "true",
          redirect: false,
        })

        if (result?.ok) {
          window.location.href = callbackUrl
        } else {
          setError("Erreur de connexion")
        }
      }
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStep("email")
    setCode(["", "", "", ""])
    setError("")
  }

  if (step === "code") {
    return (
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime-400/10 border border-lime-400/20">
            <Mail className="h-6 w-6 text-lime-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold text-white">Entrez le code</CardTitle>
            <CardDescription className="text-neutral-400">
              Un code à 4 chiffres a été envoyé à
            </CardDescription>
            <p className="font-medium text-lime-400 text-sm">{email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg text-center border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-2xl font-semibold bg-neutral-800 border-neutral-700 text-white focus:border-lime-400/50 focus:ring-lime-400/20"
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-lime-400" />
            </div>
          )}

          <div className="space-y-2 pt-2">
            <Button
              variant="ghost"
              className="w-full text-neutral-400 hover:text-white hover:bg-neutral-800"
              onClick={handleReset}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Utiliser une autre adresse
            </Button>
            <Button
              variant="link"
              className="w-full text-neutral-500 text-sm"
              onClick={handleSendCode}
              disabled={isLoading}
            >
              Renvoyer le code
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400/10 border border-lime-400/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#a3e635" />
            <path d="M2 17L12 22L22 17" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Itqan</h1>
        <p className="text-neutral-500 text-sm">Plateforme de gestion de missions</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-semibold text-white">Connexion</CardTitle>
          <CardDescription className="text-neutral-400">
            Entrez votre email pour recevoir un code de connexion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendCode} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
                autoFocus
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50 focus:ring-lime-400/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-lime-400 text-neutral-900 hover:bg-lime-300 h-10 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Recevoir le code
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-[11px] text-neutral-600">
        En continuant, vous acceptez nos conditions d&apos;utilisation
      </p>
    </div>
  )
}
