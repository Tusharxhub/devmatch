"use client"

import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "narrow" | "default" | "wide"
}

export default function Container({ size = "default", className, children, ...props }: ContainerProps) {
  const sizes = {
    narrow: "container-narrow",
    default: "container-base",
    wide: "container-wide",
  }

  return (
    <div className={cn(sizes[size], className)} {...props}>
      {children}
    </div>
  )
}
