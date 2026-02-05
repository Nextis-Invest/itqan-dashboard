"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export function Logo({
  width = 120,
  height = 40,
  className = "h-10 w-auto",
  alt = "Itqan"
}: LogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a placeholder during SSR to avoid hydration issues
  if (!mounted) {
    return (
      <div
        style={{ width, height }}
        className={className}
      />
    );
  }

  // Use resolvedTheme to get the actual theme (system preference resolved)
  const currentTheme = resolvedTheme || theme;
  const logoSrc = currentTheme === "dark"
    ? "/icons/itqan-logo-white.svg"
    : "/icons/itqan-logo.svg";

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
