"use client"

import { type ComponentProps, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface FooterLink {
  title: string
  href: string
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    label: "Pour les entreprises",
    links: [
      { title: "Recruter", href: "/recruter" },
      { title: "Comment ça marche", href: "/recruter/comment-ca-marche" },
      { title: "Nearshore Maroc", href: "/recruter/nearshore-maroc" },
      { title: "Tarifs freelance", href: "/recruter/tarifs-freelance-maroc" },
      { title: "Externalisation", href: "/recruter/externalisation-maroc" },
    ],
  },
  {
    label: "Missions",
    links: [
      { title: "Toutes les missions", href: "/missions" },
      { title: "Missions Dev Web", href: "/missions/developpement-web" },
      { title: "Missions Design", href: "/missions/design-creatif" },
      { title: "Missions Marketing", href: "/missions/marketing-digital" },
      { title: "Missions Data & IT", href: "/missions/data-it" },
    ],
  },
  {
    label: "Guide",
    links: [
      { title: "Devenir freelance", href: "/guide/devenir-freelance-maroc" },
      { title: "Statut auto-entrepreneur", href: "/guide/statut-auto-entrepreneur-maroc" },
      { title: "TJM freelance", href: "/guide/tjm-freelance-maroc" },
      { title: "Télétravail", href: "/guide/teletravail-freelance-maroc" },
      { title: "Contrat freelance", href: "/guide/contrat-freelance-maroc" },
    ],
  },
  {
    label: "Villes",
    links: [
      { title: "Casablanca", href: "/freelances/ville/casablanca" },
      { title: "Rabat", href: "/freelances/ville/rabat" },
      { title: "Marrakech", href: "/freelances/ville/marrakech" },
      { title: "Tanger", href: "/freelances/ville/tanger" },
      { title: "Toutes les villes", href: "/freelances/villes" },
    ],
  },
]

export function MarketplaceFooter() {
  return (
    <section className="text-white">
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
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-lime-300">
                SIMPLIFIEZ VOS RECRUTEMENTS
              </p>
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Trouvez les meilleurs freelances au Maroc en quelques clics
              </h3>
              <p className="mt-2 max-w-prose text-sm text-neutral-400">
                Publiez votre mission, recevez des candidatures qualifiées et
                collaborez avec les meilleurs talents. Matching intelligent et
                paiement sécurisé.
              </p>
            </div>

            {/* Right mockup */}
            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center">
                  <div className="relative p-4 text-center">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="space-y-2">
                      <div className="text-4xl font-extrabold text-lime-300">
                        2 500+
                      </div>
                      <p className="text-sm text-white/80">
                        Freelances vérifiés au Maroc
                      </p>
                      <div className="mt-4 inline-flex items-center rounded-full bg-black/40 px-3 py-1 text-[10px] uppercase tracking-wider text-lime-300">
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
      <footer className="relative w-full border-t border-white/10">
        <div className="container mx-auto px-4 py-12 lg:py-16 pb-28 md:pb-12">
          <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
            <AnimatedContainer className="space-y-4">
              <Image
                src="/icons/itqan-logo.svg"
                alt="Itqan logo"
                width={150}
                height={75}
                className="h-10 w-auto"
              />
              <p className="text-neutral-400 text-sm max-w-xs">
                La plateforme de référence pour trouver les meilleurs freelances
                au Maroc.
              </p>
              <p className="text-neutral-500 text-xs">
                © {new Date().getFullYear()} Itqan. Tous droits réservés.
              </p>
            </AnimatedContainer>

            <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
              {footerLinks.map((section, index) => (
                <AnimatedContainer
                  key={section.label}
                  delay={0.1 + index * 0.1}
                >
                  <div className="mb-10 md:mb-0">
                    <h3 className="text-xs text-white font-medium">
                      {section.label}
                    </h3>
                    <ul className="text-neutral-400 mt-4 space-y-2 text-sm">
                      {section.links.map((link) => (
                        <li key={link.title}>
                          <a
                            href={link.href}
                            className="hover:text-lime-300 inline-flex items-center transition-all duration-300"
                          >
                            {link.title}
                          </a>
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

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
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
