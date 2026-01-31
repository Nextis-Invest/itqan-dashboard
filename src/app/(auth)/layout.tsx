export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
