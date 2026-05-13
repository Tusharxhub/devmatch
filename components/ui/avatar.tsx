"use client"

import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  online?: boolean
  className?: string
}

const sizeMap = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
}

const iconSizeMap = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
}

const dotSizeMap = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border-[1.5px]",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-3.5 h-3.5 border-2",
}

const pxSizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
}

export default function Avatar({ src, alt = "", size = "md", online, className }: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={pxSizeMap[size]}
          height={pxSizeMap[size]}
          className={cn(
            sizeMap[size],
            "rounded-full object-cover border border-[var(--dm-border)]"
          )}
        />
      ) : (
        <div
          className={cn(
            sizeMap[size],
            "rounded-full bg-[var(--dm-accent-muted)] border border-[var(--dm-border-accent)] flex items-center justify-center"
          )}
        >
          <User className={cn(iconSizeMap[size], "text-[var(--dm-accent)]")} />
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-[var(--dm-bg-deep)]",
            dotSizeMap[size],
            online ? "bg-[var(--dm-green)]" : "bg-[var(--dm-text-faint)]"
          )}
        />
      )}
    </div>
  )
}
