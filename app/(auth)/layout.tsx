import type React from "react"
import Link from "next/link"
import { SoundToggle } from "@/components/ui/sound-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

      {/* Header with logo and sound toggle */}
      <header className="relative z-10 p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center">
            <span className="text-white font-bold">&lt;/&gt;</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-pink to-primary-teal">
            DevMatch
          </span>
        </Link>
        <SoundToggle />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DevMatch. All rights reserved.</p>
      </footer>
    </div>
  )
}
