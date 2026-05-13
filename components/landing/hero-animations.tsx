"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

/**
 * Animated network visualization for the hero section.
 * Draws floating nodes connected by dim lines with a gentle drift animation.
 * Uses Canvas for performance.
 */
export default function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        setDimensions({ w: rect.width, h: rect.height })
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }
    resize()
    window.addEventListener("resize", resize)

    // Create nodes
    const nodeCount = 35
    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      r: number
      color: string
      pulse: number
    }> = []

    const colors = [
      "rgba(230, 57, 86, 0.6)",
      "rgba(45, 212, 160, 0.5)",
      "rgba(79, 184, 201, 0.4)",
      "rgba(196, 122, 154, 0.4)",
      "rgba(229, 163, 65, 0.35)",
    ]

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * dimensions.w,
        y: Math.random() * dimensions.h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
      })
    }

    const connectionDistance = 150
    let animFrame: number

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      // Update positions
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.015

        // Wrap around edges
        if (node.x < -20) node.x = w + 20
        if (node.x > w + 20) node.x = -20
        if (node.y < -20) node.y = h + 20
        if (node.y > h + 20) node.y = -20
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulseScale = 1 + Math.sin(node.pulse) * 0.2
        const r = node.r * pulseScale

        // Glow
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4)
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = gradient
        ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.fillStyle = node.color
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animFrame)
    }
  }, [dimensions.w, dimensions.h])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  )
}

/**
 * Floating developer card for the hero section.
 * Appears as a glass card with developer info, floating gently.
 */
interface FloatingCardProps {
  name: string
  role: string
  score: number
  languages: string[]
  delay?: number
  className?: string
}

export function FloatingDevCard({
  name,
  role,
  score,
  languages,
  delay = 0,
  className,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 5 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.5,
        }}
        className="glass rounded-[var(--radius-lg)] p-4 w-56 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-[var(--dm-text-primary)]">{name}</div>
            <div className="text-xs text-[var(--dm-text-muted)]">{role}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-[var(--dm-accent)]">{score}</div>
            <div className="text-[10px] text-[var(--dm-text-muted)] uppercase tracking-wider">
              match
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {languages.map((lang) => (
            <span
              key={lang}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--dm-bg-surface)] text-[var(--dm-text-secondary)] border border-[var(--dm-border)]"
            >
              {lang}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Staggered fade-in wrapper for sections.
 */
export function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
