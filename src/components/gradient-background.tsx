"use client"

import { GrainGradient } from "@paper-design/shaders-react"

export function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Mobile: same gradient as login page */}
      <div className="block sm:hidden absolute inset-0 bg-neutral-950">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />
      </div>
      {/* Desktop: animated shader gradient */}
      <div className="hidden sm:block h-full w-full">
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack="hsl(0, 0%, 0%)"
          softness={0.76}
          intensity={0.35}
          noise={0}
          shape="corners"
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={["hsl(193, 70%, 40%)", "hsl(196, 80%, 45%)", "hsl(195, 85%, 30%)"]}
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>
    </div>
  )
}
