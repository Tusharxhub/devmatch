"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTerminalProps {
  text: string
  delay?: number
  className?: string
}

export function AnimatedTerminal({ text, delay = 100, className }: AnimatedTerminalProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [index, text, delay])

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden whitespace-nowrap border-r-2 border-primary-pink font-mono text-lg md:text-xl lg:text-2xl",
        "animate-typing animate-blink",
        className,
      )}
      style={{ width: `${displayedText.length}ch` }} // Adjust width based on displayed text
    >
      <span className="text-code-green">$&gt; </span>
      <span className="text-code-blue">{displayedText}</span>
    </div>
  )
}
