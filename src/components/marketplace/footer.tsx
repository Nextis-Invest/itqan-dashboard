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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
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
            <Link href="/categories" className="inline-block mb-4">
              <Image
                src="/icons/itqan-logo.svg"
                alt="Itqan"
                width={120}
                height={34}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La marketplace de freelances au Maroc et en France. Trouvez les meilleurs talents pour vos projets digitaux.
            </p>
            <div className="flex gap-4">
              {[
                { name: "Twitter", icon: "🐦", href: "#" },
                { name: "LinkedIn", icon: "💼", href: "#" },
                { name: "Instagram", icon: "📷", href: "#" },
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

          {/* Catégories populaires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4 text-white">Catégories</h3>
            <ul className="space-y-3 text-gray-300">
              {[
                { name: "Programmation & Tech", slug: "programming-tech" },
                { name: "Graphisme & Design", slug: "graphics-design" },
                { name: "Marketing Digital", slug: "online-marketing" },
                { name: "Rédaction & Traduction", slug: "writing-translation" },
                { name: "Vidéo & Animation", slug: "video-animation" },
                { name: "Services IA", slug: "ai-services" },
              ].map((cat, index) => (
                <motion.li
                  key={cat.slug}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-lime-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-lime-400 rounded-full"></span>
                    {cat.name}
                  </Link>
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
                { name: "Explorer les catégories", href: "/categories" },
                { name: "Devenir freelance", href: "/login" },
                { name: "Publier une mission", href: "/login" },
                { name: "Comment ça marche", href: "#" },
                { name: "FAQ", href: "#" },
                { name: "Contact", href: "#" },
                { name: "Politique de confidentialité", href: "#" },
                { name: "Conditions d'utilisation", href: "#" },
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="hover:text-lime-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-lime-400 rounded-full"></span>
                    {link.name}
                  </Link>
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
            <h3 className="font-semibold text-lg mb-4 text-white">Restez informé</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Recevez les dernières opportunités et tendances du marché freelance.
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Entrez votre email"
                className="bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder:text-gray-400 focus:border-lime-400 hover:bg-white/10 transition-all duration-300"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full px-5 py-2 text-base font-semibold rounded-md bg-lime-400 hover:bg-lime-300 text-black transition-all duration-300 hover:shadow-lg hover:shadow-lime-500/25"
                >
                  S&apos;abonner
                </Button>
              </motion.div>
            </form>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>contact@itqan.ma</span>
              </div>
              <a
                href="https://wa.me/33764448036"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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
            © {new Date().getFullYear()} Itqan. Tous droits réservés.
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-lime-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>+1000 freelances disponibles</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
