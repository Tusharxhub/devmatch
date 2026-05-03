"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "featured"
  clickable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      clickable = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,26,0.7)] backdrop-blur-md p-5 transition-all duration-200",
      interactive: "rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,26,0.7)] backdrop-blur-md p-5 transition-all duration-200 hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(18,18,26,0.9)] hover:shadow-lg hover:shadow-[0_0_20px_rgba(255,46,99,0.15)] hover:scale-[1.02] cursor-pointer",
      featured: "rounded-xl border border-[#ff2e63]/30 bg-[rgba(18,18,26,0.9)] backdrop-blur-md p-6 transition-all duration-200 shadow-lg shadow-[0_0_20px_rgba(255,46,99,0.1)]",
    }

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          clickable && "cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export default Card
