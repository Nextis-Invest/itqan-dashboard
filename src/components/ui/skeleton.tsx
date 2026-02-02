import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md bg-muted animate-shimmer",
        "bg-[length:400%_100%]",
        "bg-gradient-to-r from-muted via-muted-foreground/10 to-muted",
        className
      )}
      style={{ backgroundSize: "400% 100%" }}
      {...props}
    />
  )
}

function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton-card"
      className={cn(
        "rounded-xl border bg-card p-6 space-y-4",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard }
