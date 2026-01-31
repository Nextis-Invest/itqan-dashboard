"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "./navbar-base";

const navItems = [
  { name: "Catégories", link: "/categories" },
  { name: "Explorer", link: "/categories" },
  { name: "Comment ça marche", link: "#how-it-works" },
  { name: "Devenir freelance", link: "/login" },
];

interface MarketplaceNavbarProps {
  categories: { slug: string; name: string; icon: string | null }[];
}

export function MarketplaceNavbar({ categories }: MarketplaceNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const handleItemClick = () => {
    setIsOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/categories?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <Navbar className="hidden lg:block top-0 lg:top-[25px] inset-x-0 z-50">
        <NavBody className="border-b border-white/10 flex items-center justify-between px-2 py-2 gap-2 min-h-[64px]">
          {/* Logo */}
          <motion.a
            href="/categories"
            className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/icons/itqan-logo.svg"
              alt="Itqan"
              width={120}
              height={34}
              className="h-8 w-auto"
            />
          </motion.a>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-900/50 border border-white/10 rounded-full text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-lime-400/50 transition-colors"
              />
            </div>
          </form>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center justify-center">
            <NavItems
              items={navItems}
              onItemClick={handleItemClick}
              className="text-white/90 hover:text-white"
            />
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <NavbarButton href="/login" variant="secondary">
              Se connecter
            </NavbarButton>
            <NavbarButton href="/login" variant="gradient">
              S&apos;inscrire
            </NavbarButton>
          </div>
        </NavBody>
      </Navbar>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-black border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4 min-h-[64px]">
          {/* Mobile Logo */}
          <motion.a
            href="/categories"
            className="relative z-20 flex items-center space-x-2 text-sm font-normal flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/icons/itqan-logo.svg"
              alt="Itqan"
              width={120}
              height={34}
              className="h-8 w-auto"
            />
          </motion.a>

          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </div>

        <MobileNavMenu
          isOpen={isOpen}
          className="bg-black/90 backdrop-blur-md border border-white/10"
        >
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-lime-400/50"
              />
            </div>
          </form>

          {navItems.map((item, idx) => (
            <motion.a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={handleItemClick}
              className="block w-full px-2 py-2 text-white/80 hover:text-white transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              {item.name}
            </motion.a>
          ))}

          {/* Mobile categories */}
          <div className="w-full pt-2 border-t border-white/10">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Catégories
            </p>
            {categories.map((cat) => {
              const isActive = pathname?.startsWith(`/categories/${cat.slug}`);
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  onClick={handleItemClick}
                  className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-lime-400/10 text-lime-400 font-medium"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col space-y-3 w-full mt-4 pt-4 border-t border-white/10">
            <Link
              href="/login"
              className="block w-full text-center py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors text-sm"
            >
              Se connecter
            </Link>
            <Link
              href="/login"
              className="block w-full text-center py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition-colors text-sm"
            >
              S&apos;inscrire
            </Link>
          </div>
        </MobileNavMenu>
      </div>

      {/* Categories submenu bar — desktop only */}
      <div className="hidden lg:block fixed top-[89px] inset-x-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50">
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Gradient fade left */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
          {/* Gradient fade right */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {categories.map((cat) => {
              const isActive = pathname?.startsWith(`/categories/${cat.slug}`);
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className={`whitespace-nowrap px-3 py-2 text-[13px] font-medium transition-colors border-b-2 ${
                    isActive
                      ? "text-lime-400 border-lime-400"
                      : "text-neutral-400 border-transparent hover:text-white hover:border-neutral-600"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[64px] lg:h-[130px]" />
    </>
  );
}
