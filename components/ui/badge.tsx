"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "warning" | "info" | "outline"
  size?: "xs" | "sm" | "md"
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", dot = false, children, ...props }, ref) => {
    const variants: Record<string, string> = {
      default:
        "bg-[var(--dm-bg-surface)] text-[var(--dm-text-secondary)] border border-[var(--dm-border)]",
      accent:
        "bg-[var(--dm-accent-muted)] text-[var(--dm-accent)] border border-[rgba(230,57,86,0.2)]",
      success:
        "bg-[var(--dm-green-muted)] text-[var(--dm-green)] border border-[rgba(45,212,160,0.2)]",
      warning:
        "bg-[var(--dm-amber-muted)] text-[var(--dm-amber)] border border-[rgba(229,163,65,0.2)]",
      info:
        "bg-[var(--dm-cyan-muted)] text-[var(--dm-cyan)] border border-[rgba(79,184,201,0.2)]",
      outline:
        "text-[var(--dm-text-secondary)] border border-[var(--dm-border)]",
    }

    const sizes: Record<string, string> = {
      xs: "px-1.5 py-0.5 text-[10px]",
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-xs",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              variant === "success" && "bg-[var(--dm-green)]",
              variant === "accent" && "bg-[var(--dm-accent)]",
              variant === "warning" && "bg-[var(--dm-amber)]",
              variant === "info" && "bg-[var(--dm-cyan)]",
              variant === "default" && "bg-[var(--dm-text-muted)]",
              variant === "outline" && "bg-[var(--dm-text-muted)]"
            )}
          />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"

export default Badge
