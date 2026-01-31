"use client"

import { useState, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Image from "next/image"
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
import { Mail, Loader2, ArrowLeft, Briefcase, User, Building2 } from "lucide-react"

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

type Mode = "choice" | "login" | "signup"
type Role = "CLIENT" | "FREELANCER"
type Step = "email" | "code"

function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [mode, setMode] = useState<Mode>("choice")
  const [role, setRole] = useState<Role>("CLIENT")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [code, setCode] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<Step>("email")

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
        body: JSON.stringify({
          email,
          name: mode === "signup" ? name : undefined,
          role: mode === "signup" ? role : undefined,
          source: mode === "signup" ? "onboarding" : "login",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.noAccount && mode === "login") {
          setError("Aucun compte trouvé. Inscrivez-vous d'abord.")
        } else {
          setError(data.message || "Une erreur est survenue")
        }
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

  const handleBackToChoice = () => {
    setMode("choice")
    setStep("email")
    setCode(["", "", "", ""])
    setError("")
    setEmail("")
    setName("")
  }

  // CODE VERIFICATION STEP
  if (step === "code") {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Image src="/icons/itqan-logo.svg" alt="Itqan" width={120} height={40} className="h-8 w-auto" />
        </div>
        <Card className="bg-neutral-900 border-neutral-800">
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
      </div>
    )
  }

  // INITIAL CHOICE: Login or Signup
  if (mode === "choice") {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-4 mb-4">
          <Image src="/icons/itqan-logo.svg" alt="Itqan" width={140} height={48} className="h-9 w-auto" />
          <p className="text-neutral-500 text-sm">La plateforme freelance au Maroc</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("login")}
            className="group rounded-2xl bg-neutral-900 border border-neutral-800 p-6 text-center transition-all hover:border-lime-400/30 hover:bg-lime-400/5"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 group-hover:bg-lime-400/10 transition-colors">
              <Mail className="h-5 w-5 text-neutral-400 group-hover:text-lime-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-sm">Connexion</h3>
            <p className="text-[11px] text-neutral-500 mt-1">J&apos;ai déjà un compte</p>
          </button>

          <button
            onClick={() => setMode("signup")}
            className="group rounded-2xl bg-neutral-900 border border-neutral-800 p-6 text-center transition-all hover:border-lime-400/30 hover:bg-lime-400/5"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 group-hover:bg-lime-400/10 transition-colors">
              <User className="h-5 w-5 text-neutral-400 group-hover:text-lime-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-sm">Inscription</h3>
            <p className="text-[11px] text-neutral-500 mt-1">Créer un compte</p>
          </button>
        </div>
      </div>
    )
  }

  // SIGNUP MODE: role selection + name + email
  if (mode === "signup") {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Image src="/icons/itqan-logo.svg" alt="Itqan" width={120} height={40} className="h-8 w-auto" />
        </div>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-white">Créer un compte</CardTitle>
            <CardDescription className="text-neutral-400">
              Choisissez votre profil pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendCode} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              {/* Role selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-300">Je suis</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("CLIENT")}
                    className={`flex flex-col items-center gap-2 rounded-xl p-4 border transition-all ${
                      role === "CLIENT"
                        ? "border-lime-400/50 bg-lime-400/10 text-lime-400"
                        : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600"
                    }`}
                  >
                    <Building2 className="h-6 w-6" />
                    <span className="text-sm font-medium">Donneur d&apos;ordre</span>
                    <span className="text-[10px] text-neutral-500">Je cherche des freelances</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("FREELANCER")}
                    className={`flex flex-col items-center gap-2 rounded-xl p-4 border transition-all ${
                      role === "FREELANCER"
                        ? "border-lime-400/50 bg-lime-400/10 text-lime-400"
                        : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600"
                    }`}
                  >
                    <Briefcase className="h-6 w-6" />
                    <span className="text-sm font-medium">Freelance</span>
                    <span className="text-[10px] text-neutral-500">Je cherche des missions</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-neutral-300">
                  {role === "CLIENT" ? "Nom de l'entreprise" : "Nom complet"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={role === "CLIENT" ? "Votre entreprise" : "Prénom Nom"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50 focus:ring-lime-400/20"
                />
              </div>

              {/* Email */}
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
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-lime-400/50 focus:ring-lime-400/20"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-lime-400 text-neutral-900 hover:bg-lime-300 h-10 font-semibold"
                disabled={isLoading || !name.trim()}
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

            <div className="mt-4 text-center">
              <button
                onClick={handleBackToChoice}
                className="text-sm text-neutral-500 hover:text-neutral-300 inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Déjà inscrit ? Se connecter
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // LOGIN MODE: email only
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex justify-center">
        <Image src="/icons/itqan-logo.svg" alt="Itqan" width={120} height={40} className="h-8 w-auto" />
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

          <div className="mt-4 text-center">
            <button
              onClick={handleBackToChoice}
              className="text-sm text-neutral-500 hover:text-neutral-300 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Pas encore de compte ? S&apos;inscrire
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
