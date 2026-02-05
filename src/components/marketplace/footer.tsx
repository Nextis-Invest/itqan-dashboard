"use client"

import React from "react"
import type { ComponentProps, ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

interface FooterLink {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface FooterSectionType {
  label: string
  links: FooterLink[]
}

export function MarketplaceFooter() {
  const footerLinks: FooterSectionType[] = [
    {
      label: "Pour les entreprises",
      links: [
        { title: "Recruter", href: "/login" },
        { title: "Comment ça marche", href: "#" },
        { title: "Nearshore Maroc", href: "#" },
        { title: "Tarifs freelance", href: "#" },
        { title: "Externalisation", href: "#" },
      ],
    },
    {
      label: "Missions",
      links: [
        { title: "Toutes les missions", href: "/marketplace/categories" },
        { title: "Développement Web", href: "/marketplace/categories/programming-tech" },
        { title: "Design & Créatif", href: "/marketplace/categories/graphics-design" },
        { title: "Marketing Digital", href: "/marketplace/categories/online-marketing" },
        { title: "Data & IT", href: "/marketplace/categories/data" },
      ],
    },
    {
      label: "Guide",
      links: [
        { title: "Devenir freelance", href: "#" },
        { title: "Statut auto-entrepreneur", href: "#" },
        { title: "TJM freelance Maroc", href: "#" },
        { title: "Télétravail freelance", href: "#" },
        { title: "Contrat freelance", href: "#" },
      ],
    },
    {
      label: "Villes",
      links: [{ title: "Maroc", href: "/marketplace/categories" }],
    },
  ]

  return (
    <section className="bg-background text-foreground">
      {/* Contact CTA Button */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-full bg-lime-400 px-6 py-2 text-sm font-medium text-black shadow-[0_0_20px_rgba(163,230,53,0.35)] hover:bg-lime-300 hover:scale-[1.02] transition-all"
          >
            <Link href="/login">Publier une mission</Link>
          </Button>
        </div>
      </div>

      {/* CTA Card with Phone Mockup */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl bg-neutral-900 p-6 sm:p-10">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-lime-400">
                SIMPLIFIEZ VOTRE RECRUTEMENT
              </p>
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Trouvez les meilleurs freelances au Maroc
              </h3>
              <p className="mt-2 max-w-prose text-sm text-neutral-400">
                Accédez à un réseau de talents qualifiés pour vos projets digitaux.
              </p>
            </div>

            {/* Right mockup */}
            <div className="mx-auto w-full max-w-[260px]">
              <div className="relative rounded-[28px] bg-neutral-800 p-2 shadow-2xl">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black">
                  <Image
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_37DhuNyRmxE2Dt9Cj4761sckNmX/hf_20260205_020108_f230042f-a6f4-4401-a86a-109563090f8d.png"
                    alt="Freelance marocain"
                    fill
                    className="object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <div className="space-y-2">
                      <div className="text-3xl font-extrabold text-lime-400">2 500+</div>
                      <p className="text-sm text-white/90">Freelances disponibles</p>
                      <div className="mt-2 inline-flex items-center rounded-full bg-lime-400 px-3 py-1 text-[10px] uppercase tracking-wider text-black font-medium">
                        Matching en 24h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="relative w-full border-t border-border">
        <div className="container mx-auto px-4 py-12 lg:py-16 pb-28 md:pb-12">
          <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
            <AnimatedContainer className="space-y-4">
              <Logo
                width={150}
                height={75}
                className="h-10 w-auto"
              />
              <p className="text-muted-foreground text-sm max-w-xs">
                La marketplace de freelances au Maroc et en France. Trouvez les meilleurs talents pour vos projets digitaux.
              </p>
              <p className="text-muted-foreground/60 text-xs">
                © {new Date().getFullYear()} Itqan. Tous droits réservés.
              </p>
            </AnimatedContainer>

            <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
              {footerLinks.map((section, index) => (
                <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                  <div className="mb-10 md:mb-0">
                    <h3 className="text-xs text-foreground font-medium">{section.label}</h3>
                    <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                      {section.links.map((link) => (
                        <li key={link.title}>
                          <Link
                            href={link.href}
                            className="hover:text-lime-500 inline-flex items-center transition-all duration-300"
                          >
                            {link.icon && <link.icon className="me-1 size-4" />}
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>["className"]
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
