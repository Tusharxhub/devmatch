"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SoundToggle } from "@/components/ui/sound-toggle"
import { useSound } from "@/components/sound-provider"
import { Home, User, Users, MessageSquare, Briefcase, Settings, ShieldAlert, Menu, X, LogOut } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { playSound } = useSound()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    playSound("medium")
  }

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Matches", href: "/matches", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Collaborations", href: "/collaborations", icon: Briefcase },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Admin", href: "/admin", icon: ShieldAlert },
  ]

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

      {/* Mobile header */}
      <header className="md:hidden relative z-20 p-4 flex justify-between items-center border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center">
            <span className="text-white font-bold">&lt;/&gt;</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-pink to-primary-teal">
            DevMatch
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={closeSidebarOnMobile} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-black/70 backdrop-blur-md border-r border-gray-800`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center">
              <span className="text-white font-bold">&lt;/&gt;</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-pink to-primary-teal">
              DevMatch
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    playSound("high")
                    closeSidebarOnMobile()
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all group relative overflow-hidden ${
                    isActive ? "bg-primary-pink/20 text-primary-pink" : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-10"></span>
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary-pink" : ""}`} />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && <span className="absolute right-0 top-0 bottom-0 w-1 bg-primary-pink" />}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="mt-auto space-y-4">
            <div className="hidden md:block">
              <SoundToggle />
            </div>
            <Link
              href="/"
              onClick={() => playSound("medium")}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 transition-all group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-10"></span>
              <LogOut className="h-5 w-5" />
              <span className="relative z-10">Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"} min-h-screen`}>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
