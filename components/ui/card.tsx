"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "featured" | "ghost"
  padding?: "none" | "sm" | "md" | "lg"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    const variants: Record<string, string> = {
      default:
        "rounded-[var(--radius-lg)] border border-[var(--dm-border)] bg-[var(--dm-bg-raised)] transition-all duration-200",
      interactive:
        "rounded-[var(--radius-lg)] border border-[var(--dm-border)] bg-[var(--dm-bg-raised)] transition-all duration-200 hover:border-[var(--dm-border-hover)] hover:bg-[var(--dm-bg-surface)] hover:shadow-md cursor-pointer",
      featured:
        "rounded-[var(--radius-lg)] border border-[var(--dm-border-accent)] bg-[var(--dm-bg-surface)] transition-all duration-200 shadow-[0_0_20px_rgba(230,57,86,0.08)]",
      ghost:
        "rounded-[var(--radius-lg)] transition-all duration-200",
    }

    const paddings: Record<string, string> = {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-6 sm:p-8",
    }

    return (
      <div
        ref={ref}
        className={cn(variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export default Card
