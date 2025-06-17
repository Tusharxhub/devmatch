"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface MobileOptimizedButtonProps extends React.ComponentProps<typeof Button> {
  mobileSize?: "sm" | "md" | "lg"
  touchOptimized?: boolean
}

export const MobileOptimizedButton = forwardRef<HTMLButtonElement, MobileOptimizedButtonProps>(
  ({ className, mobileSize = "md", touchOptimized = true, children, ...props }, ref) => {
    const mobileClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    }

    return (
      <Button
        ref={ref}
        className={cn(
          // Base responsive classes
          "transition-all duration-200",
          // Mobile optimizations
          "sm:h-auto sm:px-auto sm:text-auto",
          // Touch optimizations
          touchOptimized && [
            "touch-manipulation",
            "active:scale-95",
            "min-h-[44px] sm:min-h-auto", // iOS recommended touch target
            "min-w-[44px] sm:min-w-auto",
          ],
          // Mobile-specific sizing
          `${mobileClasses[mobileSize]} sm:h-auto sm:px-auto sm:text-auto`,
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

MobileOptimizedButton.displayName = "MobileOptimizedButton"
