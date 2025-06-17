"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedTerminal } from "@/components/ui/animated-terminal"
import { useSound } from "@/components/sound-provider"

export default function LandingPage() {
  const { playSound } = useSound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-mono relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center md:px-6 lg:py-24">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary-pink to-primary-teal animate-scan">
            Find Your DevMatch
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">Collaborate, Build, Ship Together.</p>
          <AnimatedTerminal
            text="Connect with developers, build amazing projects, and level up your skills."
            className="mx-auto text-code-blue"
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                className="group relative overflow-hidden bg-primary-pink text-white hover:bg-primary-pink/90 transition-all duration-300 ease-in-out transform hover:scale-105"
                size="lg"
                onClick={() => playSound("medium")}
              >
                <span className="relative z-10">Get Started with GitHub</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary-pink to-primary-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="group relative overflow-hidden border-primary-teal text-primary-teal hover:bg-primary-teal/10 transition-all duration-300 ease-in-out transform hover:scale-105"
                size="lg"
                onClick={() => playSound("medium")}
              >
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary-teal to-primary-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Placeholder for other sections like Feature Showcase, Testimonials, Footer */}
      <footer className="relative z-10 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DevMatch. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="#" className="hover:text-primary-teal transition-colors" onClick={() => playSound("high")}>
            Privacy
          </Link>
          <Link href="#" className="hover:text-primary-teal transition-colors" onClick={() => playSound("high")}>
            Contact
          </Link>
          <Link href="#" className="hover:text-primary-teal transition-colors" onClick={() => playSound("high")}>
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  )
}
