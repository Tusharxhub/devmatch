"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline"
  size?: "xs" | "sm" | "md" | "lg"
  isLoading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all whitespace-nowrap select-none active:scale-[0.97]"

    const variants: Record<string, string> = {
      primary:
        "bg-[var(--dm-accent)] text-white hover:bg-[var(--dm-accent-hover)] shadow-md hover:shadow-[0_0_24px_rgba(230,57,86,0.25)] rounded-[var(--radius-md)]",
      secondary:
        "glass-hover text-[var(--dm-text-primary)] rounded-[var(--radius-md)]",
      ghost:
        "text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:bg-[var(--dm-bg-hover)] rounded-[var(--radius-md)]",
      danger:
        "bg-[var(--dm-accent-muted)] text-[var(--dm-accent)] hover:bg-[rgba(230,57,86,0.2)] rounded-[var(--radius-md)]",
      success:
        "bg-[var(--dm-green-muted)] text-[var(--dm-green)] hover:bg-[rgba(45,212,160,0.2)] rounded-[var(--radius-md)]",
      outline:
        "border border-[var(--dm-border)] text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:border-[var(--dm-border-hover)] hover:bg-[var(--dm-bg-hover)] rounded-[var(--radius-md)]",
    }

    const sizes: Record<string, string> = {
      xs: "h-7 px-2.5 text-xs gap-1.5",
      sm: "h-8 px-3 text-sm gap-2",
      md: "h-10 px-4 text-sm gap-2.5",
      lg: "h-12 px-6 text-base gap-3",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
