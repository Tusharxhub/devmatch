"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = true,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 whitespace-nowrap active:scale-95"

    const variantClasses = {
      primary: "bg-[#ff2e63] text-white hover:bg-[#ff1447] shadow-lg hover:shadow-[0_0_30px_rgba(255,46,99,0.3)]",
      secondary: "glass-hover text-[#eaeaf0] hover:bg-[rgba(18,18,26,0.9)]",
      ghost: "text-[#b0b0b8] hover:text-[#eaeaf0] hover:bg-[rgba(255,255,255,0.05)]",
      danger: "bg-[#ff2e63]/20 text-[#ff2e63] hover:bg-[#ff2e63]/30",
    }

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm gap-2",
      md: "px-4 py-2.5 text-base gap-2.5",
      lg: "px-6 py-3.5 text-base gap-3",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
