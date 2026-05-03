"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      icon,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#eaeaf0] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg",
              "glass border-line",
              "text-[#eaeaf0] placeholder-[#9ca3af]",
              "transition-all duration-200",
              "focus:outline-none focus:border-[#ff2e63] focus:ring-1 focus:ring-[#ff2e63]/30",
              icon && "pl-10",
              error && "border-[#ff2e63] focus:border-[#ff2e63]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[#ff2e63] mt-1.5">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
