"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return (
    <div
      className={cn(
        "w-full",
        isMobile && "mobile-layout",
        isTablet && "tablet-layout",
        !isMobile && !isTablet && "desktop-layout",
        className,
      )}
    >
      {children}
    </div>
  )
}
