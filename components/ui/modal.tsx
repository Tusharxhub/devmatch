"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
}

export default function Modal({ open, onClose, children, className, size = "md" }: ModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div
        className={cn(
          "relative w-full glass-strong rounded-[var(--radius-xl)] p-6 sm:p-8 max-h-[85vh] overflow-y-auto animate-scale-in",
          sizeMap[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
