"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Github, ArrowRight } from "lucide-react"
import Button from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import NetworkVisualization, { FloatingDevCard } from "@/components/landing/hero-animations"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export function LandingHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Canvas background */}
      <div className="absolute inset-0 opacity-40">
        <NetworkVisualization />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--dm-text-faint) 1px, transparent 1px), linear-gradient(90deg, var(--dm-text-faint) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient overlay to fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--dm-bg-deep)] via-transparent to-[var(--dm-bg-deep)]" />

      <div className="container-base relative z-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="success" size="md" dot>
                GitHub signals, not generic profiles
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-display-xl mt-7 text-[var(--dm-text-primary)]"
            >
              Match with developers
              <br />
              who actually{" "}
              <span className="gradient-text-accent">ship</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-body-lg mt-6 max-w-lg text-[var(--dm-text-secondary)]"
            >
              DevMatch analyzes your GitHub activity and connects you with
              collaborators who match your code style, pace, and project needs.
              Not a social network — engineering infrastructure for collaboration.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <Link href="/auth/signin">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Github className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  Get started free
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  How it works
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right — Floating cards */}
          <div className="hidden lg:block relative w-80 h-96">
            <FloatingDevCard
              name="Sarah Chen"
              role="Senior Full-Stack"
              score={94}
              languages={["TypeScript", "React", "Go"]}
              delay={0.6}
              className="absolute top-0 right-0"
            />
            <FloatingDevCard
              name="Marcus Johnson"
              role="Backend Engineer"
              score={87}
              languages={["Rust", "Python", "PostgreSQL"]}
              delay={0.9}
              className="absolute top-36 -left-4"
            />
            <FloatingDevCard
              name="Yuki Tanaka"
              role="DevOps Lead"
              score={82}
              languages={["Kubernetes", "Terraform", "Go"]}
              delay={1.2}
              className="absolute bottom-0 right-4"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
