"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Code,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Volume2,
  VolumeX,
  Terminal,
  GitBranch,
  Database,
  Server,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdminAccessDialog } from "@/components/admin-access-dialog"
import { soundManager } from "@/lib/sounds"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Matches",
    href: "/dashboard/matches",
    icon: Users,
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Collabs",
    href: "/dashboard/collabs",
    icon: Code,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled())

  const handleNavClick = (href: string) => {
    soundManager.playNavigationClick()
    setIsMobileMenuOpen(false)
  }

  const handleAdminClick = () => {
    soundManager.playHologramActivate()
    setShowAdminDialog(true)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    soundManager.playSystemBoot()
    router.push("/")
  }

  const toggleSound = () => {
    soundManager.toggleSound()
    setSoundEnabled(soundManager.isEnabled())
    if (soundManager.isEnabled()) {
      soundManager.playSuccessSound()
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            soundManager.playButtonClick()
            setIsMobileMenuOpen(!isMobileMenuOpen)
          }}
          className="squid-button border border-squid-pink/30 hover:border-squid-pink squid-interactive"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 squid-terminal transition-transform duration-300 ease-out animate-terminal-fade squid-terminal-bg",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="squid-terminal-header">
              <div className="terminal-dot terminal-dot-red"></div>
              <div className="terminal-dot terminal-dot-yellow"></div>
              <div className="terminal-dot terminal-dot-green"></div>
              <div className="ml-2 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-squid-teal" />
                <span className="text-xs font-medium">devmatch_terminal.sh</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4 squid-terminal-bg">
              <div className="px-4 mb-4">
                <div className="terminal-prompt text-sm mb-2 animate-typing-effect overflow-hidden whitespace-nowrap">
                  <span className="squid-keyword">const</span> <span className="squid-function">devMatch</span> ={" "}
                  <span className="squid-keyword">new</span> <span className="squid-function">DevMatch</span>()
                  <span className="squid-operator">;</span>
                </div>
                <div className="terminal-prompt text-sm animate-typing-effect overflow-hidden whitespace-nowrap">
                  devMatch<span className="squid-operator">.</span>
                  <span className="squid-function">init</span>()<span className="squid-operator">;</span>
                </div>
              </div>
              <nav className="space-y-1 px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "squid-nav-item flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 squid-game-hover",
                      pathname === item.href
                        ? "active text-squid-pink bg-squid-pink/10 border-l-3 border-squid-pink animate-green-light-safe"
                        : "hover:bg-squid-pink/5 hover:text-squid-pink",
                    )}
                    onClick={() => handleNavClick(item.href)}
                    onMouseEnter={() => soundManager.playHoverSound()}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}

                {/* Admin Button */}
                <Button
                  variant="ghost"
                  className="squid-nav-item w-full justify-start gap-3 px-4 py-3 text-sm font-medium hover:bg-squid-teal/10 hover:text-squid-teal"
                  onClick={handleAdminClick}
                  onMouseEnter={() => soundManager.playHoverSound()}
                >
                  <Shield className="h-5 w-5" />
                  Admin Dashboard
                </Button>
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-squid-pink/20 bg-code-bg/50">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-squid-pink squid-interactive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSound}
                    className="h-8 w-8 text-muted-foreground hover:text-squid-teal squid-interactive"
                    title={soundEnabled ? "Disable Sound" : "Enable Sound"}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 lg:w-72 lg:border-r lg:border-squid-pink/20 squid-terminal">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="squid-terminal-header">
            <div className="terminal-dot terminal-dot-red"></div>
            <div className="terminal-dot terminal-dot-yellow"></div>
            <div className="terminal-dot terminal-dot-green"></div>
            <div className="ml-2 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-squid-teal" />
              <span className="text-xs font-medium">devmatch_terminal.sh</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-4 squid-terminal-bg">
            <div className="px-4 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-squid-pink to-squid-teal flex items-center justify-center animate-marble-bounce">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold squid-title">DevMatch</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-xs squid-subtitle">Squid Game Edition</span>
                    <span className="inline-block h-2 w-2 rounded-full status-online animate-synchronized-blink"></span>
                  </div>
                </div>
              </div>
              <div className="terminal-prompt text-sm mb-2 animate-typing-effect overflow-hidden whitespace-nowrap">
                <span className="squid-keyword">const</span> <span className="squid-function">devMatch</span> ={" "}
                <span className="squid-keyword">new</span> <span className="squid-function">DevMatch</span>()
                <span className="squid-operator">;</span>
              </div>
              <div className="terminal-prompt text-sm animate-typing-effect overflow-hidden whitespace-nowrap">
                devMatch<span className="squid-operator">.</span>
                <span className="squid-function">init</span>()<span className="squid-operator">;</span>
              </div>
            </div>
            <nav className="space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "squid-nav-item flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 squid-game-hover",
                    pathname === item.href
                      ? "active text-squid-pink bg-squid-pink/10 border-l-3 border-squid-pink animate-green-light-safe"
                      : "hover:bg-squid-pink/5 hover:text-squid-pink",
                  )}
                  onClick={() => handleNavClick(item.href)}
                  onMouseEnter={() => soundManager.playHoverSound()}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}

              {/* Admin Button */}
              <Button
                variant="ghost"
                className="squid-nav-item w-full justify-start gap-3 px-4 py-3 text-sm font-medium hover:bg-squid-teal/10 hover:text-squid-teal"
                onClick={handleAdminClick}
                onMouseEnter={() => soundManager.playHoverSound()}
              >
                <Shield className="h-5 w-5" />
                Admin Dashboard
              </Button>
            </nav>

            {/* System Info */}
            <div className="px-4 mt-8">
              <div className="text-xs squid-comment mb-2">// System Status</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Server className="h-3 w-3 text-squid-teal animate-guard-march" />
                    <span>API Status</span>
                  </div>
                  <span className="squid-badge-teal animate-honeycomb-reveal">Online</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3 text-squid-pink" />
                    <span>Database</span>
                  </div>
                  <span className="squid-badge-pink">Connected</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-3 w-3 text-code-number" />
                    <span>Version</span>
                  </div>
                  <span className="squid-badge-gray">v1.0.0</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-squid-pink animate-heartbeat" />
                    <span>Squid Mode</span>
                  </div>
                  <span className="squid-badge-pink animate-tension-build">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-squid-pink/20 bg-code-bg/50">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-squid-pink squid-interactive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSound}
                  className="h-8 w-8 text-muted-foreground hover:text-squid-teal squid-interactive"
                  title={soundEnabled ? "Disable Sound" : "Enable Sound"}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminAccessDialog open={showAdminDialog} onOpenChange={setShowAdminDialog} />
    </>
  )
}
