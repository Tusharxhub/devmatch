// components/dashboard/nav.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react"
import { useState } from "react"

interface NavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

const navItems = [
  { href: "/dashboard", label: "Discover", icon: LayoutDashboard },
  { href: "/dashboard/matches", label: "Matches", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export function DashboardNav({ user }: NavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg glass border-line flex items-center justify-center text-[#eaeaf0] hover:bg-[rgba(18,18,26,0.9)] transition-all"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 glass border-r border-line flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-line">
          <div className="w-8 h-8 rounded-lg bg-[#ff2e63] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-[#eaeaf0]">
            Dev<span className="text-[#ff2e63]">Match</span>
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/messages" && pathname.startsWith("/messages"))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[rgba(255,46,99,0.1)] text-[#ff2e63] border border-[rgba(255,46,99,0.2)]"
                    : "text-[#b0b0b8] hover:text-[#eaeaf0] hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User profile section */}
        <div className="p-4 border-t border-line">
          <div className="flex items-center gap-3 mb-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={36}
                height={36}
                className="rounded-full border border-[rgba(255,46,99,0.2)]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[rgba(255,46,99,0.1)] flex items-center justify-center border border-[rgba(255,46,99,0.2)]">
                <User className="w-4 h-4 text-[#ff2e63]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#eaeaf0] truncate">
                {user.name || "Developer"}
              </p>
              <p className="text-xs text-[#9ca3af] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#b0b0b8] hover:text-[#ff2e63] hover:bg-[rgba(255,46,99,0.05)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
