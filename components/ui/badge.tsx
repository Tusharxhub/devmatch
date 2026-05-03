"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "accent"
  size?: "sm" | "md"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "sm",
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-[rgba(18,18,26,0.8)] text-[#b0b0b8] border border-[rgba(255,255,255,0.08)]",
      success: "bg-[rgba(0,255,163,0.1)] text-[#00ffa3] border border-[rgba(0,255,163,0.2)]",
      warning: "bg-[rgba(255,46,99,0.1)] text-[#ff2e63] border border-[rgba(255,46,99,0.2)]",
      accent: "bg-[rgba(255,46,99,0.15)] text-[#ff2e63] border border-[rgba(255,46,99,0.3)]",
    }

    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = "Badge"

export default Badge
