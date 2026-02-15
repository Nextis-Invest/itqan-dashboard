"use client"

import { useState, Suspense, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, Loader2, ArrowLeft, User } from "lucide-react"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  )
}

function LoginSkeleton() {
  return (
    <Card className="w-full max-w-md backdrop-blur-xl bg-card/70 border-border/50 shadow-2xl shadow-black/20">
      <CardHeader className="space-y-1">
        <div className="h-8 w-32 bg-muted/80 animate-pulse rounded" />
        <div className="h-4 w-48 bg-muted/80 animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-10 bg-muted/80 animate-pulse rounded" />
        <div className="h-10 bg-muted/80 animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}

type Mode = "choice" | "login" | "signup"
type Role = "CLIENT"
type Step = "email" | "code"

function OAuthButtons({ callbackUrl }: { callbackUrl: string }) {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [linkedinLoading, setLinkedinLoading] = useState(false)

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-muted/50 border-border/50 text-foreground hover:bg-accent hover:border-border h-11 font-medium transition-all duration-200"
        disabled={googleLoading || linkedinLoading}
        onClick={() => {
          setGoogleLoading(true)
          signIn("google", { callbackUrl })
        }}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-5 w-5" />
        )}
        Continuer avec Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full bg-muted/50 border-border/50 text-foreground hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/40 hover:text-[#0A66C2] h-11 font-medium transition-all duration-200"
        disabled={googleLoading || linkedinLoading}
        onClick={() => {
          setLinkedinLoading(true)
          signIn("linkedin", { callbackUrl })
        }}
      >
        {linkedinLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LinkedInIcon className="mr-2 h-5 w-5" />
        )}
        Continuer avec LinkedIn
      </Button>
    </div>
  )
}

function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/50" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="backdrop-blur-xl bg-card/70 px-3 text-muted-foreground">ou</span>
      </div>
    </div>
  )
}

/* Spinner with gradient */
function GradientSpinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <div className="absolute inset-0 rounded-full border-2 border-border/30" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-lime-400 animate-spin" />
    </div>
  )
}

// Map NextAuth error codes to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: "Cet email est déjà associé à un autre compte. Connectez-vous avec votre méthode habituelle.",
  OAuthSignin: "Erreur de connexion OAuth. Veuillez réessayer.",
  OAuthCallback: "Erreur lors de la connexion. Veuillez réessayer.",
  OAuthCreateAccount: "Impossible de créer le compte. Veuillez réessayer.",
  EmailCreateAccount: "Impossible de créer le compte avec cet email.",
  Callback: "Erreur lors de la connexion.",
  Default: "Une erreur est survenue. Veuillez réessayer.",
}

function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const urlError = searchParams.get("error")

  const [mode, setMode] = useState<Mode>("choice")
  const [role, setRole] = useState<Role>("CLIENT")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [code, setCode] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<Step>("email")

  // Handle URL error params from NextAuth
  useEffect(() => {
    if (urlError) {
      setError(ERROR_MESSAGES[urlError] || ERROR_MESSAGES.Default)
    }
  }, [urlError])

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
        // Clear any existing session before signing in with new account
        // This prevents the "logged in as wrong account" bug
        await signOut({ redirect: false })
        
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
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center">
          <Logo width={200} height={64} className="h-16 w-auto" />
        </div>
        <Card className="backdrop-blur-xl bg-card/70 border-border shadow-2xl shadow-black/20">
          <CardHeader className="space-y-4 text-center pb-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400/20 to-emerald-400/20 border border-lime-400/20 shadow-lg shadow-lime-400/5">
              <Mail className="h-7 w-7 text-lime-400" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">Entrez le code</CardTitle>
              <CardDescription className="text-muted-foreground">
                Un code à 4 chiffres a été envoyé à
              </CardDescription>
              <p className="font-medium text-lime-400 text-sm">{email}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl text-center border border-red-500/20 backdrop-blur-sm">
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
                  className="w-16 h-16 text-center text-2xl font-bold bg-muted/60 border-border/50 text-foreground rounded-xl focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 focus:shadow-[0_0_20px_rgba(163,230,53,0.15)] transition-all duration-200"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {isLoading && (
              <div className="flex justify-center">
                <GradientSpinner className="h-6 w-6" />
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
                onClick={handleReset}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Utiliser une autre adresse
              </Button>
              <Button
                variant="link"
                className="w-full text-muted-foreground text-sm hover:text-lime-400"
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
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Logo width={200} height={64} className="h-16 w-auto" />
          <p className="text-muted-foreground text-sm">Itqan — Votre agence digitale</p>
        </div>

        {/* Glass card wrapper */}
        <div className="backdrop-blur-xl bg-card/70 border border-border/50 rounded-2xl p-6 shadow-2xl shadow-black/20">
          {/* OAuth buttons first */}
          <OAuthButtons callbackUrl={callbackUrl} />

          <Divider />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("login")}
              className="group rounded-2xl bg-muted/50 border border-border/50 p-6 text-center transition-all duration-300 hover:border-lime-400/40 hover:bg-lime-400/5 hover:shadow-lg hover:shadow-lime-400/5"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted/80 group-hover:bg-lime-400/15 group-hover:shadow-[0_0_20px_rgba(163,230,53,0.1)] transition-all duration-300">
                <Mail className="h-5 w-5 text-muted-foreground group-hover:text-lime-400 transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Connexion</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Magic link par email</p>
            </button>

            <button
              onClick={() => setMode("signup")}
              className="group rounded-2xl bg-muted/50 border border-border/50 p-6 text-center transition-all duration-300 hover:border-lime-400/40 hover:bg-lime-400/5 hover:shadow-lg hover:shadow-lime-400/5"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted/80 group-hover:bg-lime-400/15 group-hover:shadow-[0_0_20px_rgba(163,230,53,0.1)] transition-all duration-300">
                <User className="h-5 w-5 text-muted-foreground group-hover:text-lime-400 transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Inscription</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Créer un compte</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // SIGNUP MODE: role selection + name + email
  if (mode === "signup") {
    return (
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center">
          <Logo width={200} height={64} className="h-16 w-auto" />
        </div>

        <Card className="backdrop-blur-xl bg-card/70 border-border/50 shadow-2xl shadow-black/20">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Créer un compte</CardTitle>
            <CardDescription className="text-muted-foreground">
              Choisissez votre profil pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* OAuth option */}
            <OAuthButtons callbackUrl={callbackUrl} />
            <Divider />

            <form onSubmit={handleSendCode} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20 backdrop-blur-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nom de l&apos;entreprise
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre entreprise"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-muted/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  className="bg-muted/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-lime-400 to-emerald-400 text-neutral-900 hover:from-lime-300 hover:to-emerald-300 h-11 font-semibold rounded-xl shadow-lg shadow-lime-400/20 transition-all duration-200"
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
                className="text-sm text-muted-foreground hover:text-lime-400 inline-flex items-center gap-1 transition-colors duration-200"
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
    <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <Logo width={200} height={64} className="h-16 w-auto" />
      </div>

      <Card className="backdrop-blur-xl bg-card/70 border-border/50 shadow-2xl shadow-black/20">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Connexion</CardTitle>
          <CardDescription className="text-muted-foreground">
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* OAuth option */}
          <OAuthButtons callbackUrl={callbackUrl} />
          <Divider />

          <form onSubmit={handleSendCode} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
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
                className="bg-muted/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 h-11 rounded-xl transition-all duration-200"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-400 to-emerald-400 text-neutral-900 hover:from-lime-300 hover:to-emerald-300 h-11 font-semibold rounded-xl shadow-lg shadow-lime-400/20 transition-all duration-200"
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
                  Recevoir le code magic link
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleBackToChoice}
              className="text-sm text-muted-foreground hover:text-lime-400 inline-flex items-center gap-1 transition-colors duration-200"
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
