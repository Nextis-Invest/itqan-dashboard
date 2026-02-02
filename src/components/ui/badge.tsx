import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        success:
          "bg-success/15 text-success border-success/20",
        warning:
          "bg-warning/15 text-warning border-warning/20",
        info:
          "bg-info/15 text-info border-info/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  dot = false,
  pulse = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    dot?: boolean
    pulse?: boolean
  }) {
  const Comp = asChild ? Slot : "span"

  const dotColorMap: Record<string, string> = {
    default: "bg-primary-foreground",
    secondary: "bg-secondary-foreground",
    destructive: "bg-white",
    outline: "bg-foreground",
    ghost: "bg-foreground",
    link: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    info: "bg-info",
  }

  const dotColor = dotColorMap[variant ?? "default"] ?? "bg-current"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(
        badgeVariants({ variant }),
        pulse && "animate-pulse-glow",
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("size-1.5 rounded-full shrink-0", dotColor, pulse && "animate-pulse")}
          aria-hidden="true"
        />
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
