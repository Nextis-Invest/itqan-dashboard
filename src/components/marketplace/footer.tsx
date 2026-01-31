"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function MarketplaceFooter() {
  return (
    <footer className="relative bg-black text-white py-16 overflow-hidden" id="footer">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="#"
              className="inline-block mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/icons/itqan-logo.svg"
                alt="Itqan Logo"
                width={140}
                height={35}
                className="h-auto"
              />
            </motion.a>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Solutions web modernes pour marques ambitieuses. Nous aidons les entreprises à lancer, croître et évoluer avec un design et développement de classe mondiale.
            </p>
            <div className="flex gap-4">
              {[
                { name: "Twitter", icon: "🐦", href: "#" },
                { name: "LinkedIn", icon: "💼", href: "#" },
                { name: "GitHub", icon: "🐙", href: "#" },
                { name: "Instagram", icon: "📷", href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4 text-white">Services</h3>
            <ul className="space-y-3 text-gray-300">
              {[
                { name: "Développement Web", slug: "developpement-web" },
                { name: "Solutions E-commerce", slug: "solutions-ecommerce" },
                { name: "Design UI/UX", slug: "design-ui-ux" },
                { name: "SEO & Performance", slug: "seo-performance" },
                { name: "Applications Mobiles", slug: "applications-mobiles" },
                { name: "Intégrations IA", slug: "integrations-ia" }
              ].map((service, index) => (
                <motion.li
                  key={service.slug}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={`/services/${service.slug}`}
                    className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    {service.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4 text-white">Navigation</h3>
            <ul className="space-y-3 text-gray-300">
              {[
                { name: "Comment ça marche", href: "/comment-ca-marche" },
                { name: "Blog", href: "/blog" },
                { name: "Témoignages", href: "/temoignages" },
                { name: "FAQ", href: "/faq" },
                { name: "Contact", href: "/contact" },
                { name: "Politique de Confidentialité", href: "/politique-de-confidentialite" },
                { name: "Conditions d&apos;Utilisation", href: "/conditions-utilisation" }
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4 text-white">Restez Informé</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Recevez les dernières mises à jour sur les tendances du développement web et nos nouveaux projets.
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Entrez votre email"
                className="bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 hover:bg-white/10 transition-all duration-300"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full px-5 py-2 text-base font-semibold rounded-md min-w-[160px] min-h-[40px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  S&apos;abonner
                </Button>
              </motion.div>
            </form>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span>🏢</span>
                <span><b>Nextis Invest</b> — Residence Riad El Otor B N°4, Bloc C Avenue Annakhil, Hay Riad -agdal Riyad - Agdal Riyad</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>contact@nextis-ai.com</span>
              </div>
              <a
                href="https://wa.me/33764448036"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 13.487c-.263-.131-1.558-.77-1.799-.858-.241-.088-.417-.131-.593.132-.175.263-.676.858-.83 1.033-.153.175-.307.197-.57.066-.263-.132-1.11-.409-2.115-1.304-.782-.698-1.31-1.561-1.464-1.824-.153-.263-.016-.405.115-.537.118-.117.263-.307.395-.461.132-.153.175-.263.263-.438.088-.175.044-.329-.022-.461-.066-.132-.593-1.433-.813-1.963-.214-.514-.432-.444-.593-.452-.153-.007-.329-.009-.505-.009-.175 0-.46.066-.701.329-.241.263-.92.899-.92 2.19 0 1.29.942 2.537 1.073 2.712.131.175 1.853 2.83 4.49 3.855.628.216 1.117.345 1.499.441.63.16 1.204.138 1.658.084.506-.06 1.558-.637 1.779-1.253.219-.616.219-1.144.153-1.253-.066-.109-.241-.175-.505-.307z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 1.591.417 3.085 1.144 4.375L3 21l4.755-1.244A8.963 8.963 0 0012 21c4.97 0 9-4.03 9-9z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400"
        >
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Nextis Invest. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Disponible pour nouveaux projets</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
