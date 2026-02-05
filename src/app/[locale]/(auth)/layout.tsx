export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        {/* Lime orb - top left, slowly drifting */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #a3e635 0%, transparent 70%)",
            top: "10%",
            left: "5%",
            animation: "auth-float-1 20s ease-in-out infinite",
          }}
        />
        {/* Emerald orb - center right */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
            top: "40%",
            right: "-5%",
            animation: "auth-float-2 25s ease-in-out infinite",
          }}
        />
        {/* Blue orb - bottom left */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
            bottom: "5%",
            left: "20%",
            animation: "auth-float-3 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-background/40" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* CSS keyframes for floating animation */}
      <style>{`
        @keyframes auth-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, 40px) scale(1.1); }
          66% { transform: translate(-30px, 60px) scale(0.95); }
        }
        @keyframes auth-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, -30px) scale(1.05); }
          66% { transform: translate(40px, -60px) scale(0.9); }
        }
        @keyframes auth-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -50px) scale(1.15); }
          66% { transform: translate(-60px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  )
}
