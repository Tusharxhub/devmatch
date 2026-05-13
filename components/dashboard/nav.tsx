// components/dashboard/nav.tsx
"use client"

import Link from "next/link"
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
  FolderKanban,
  Globe,
  Bell,
  Search,
  Shield,
} from "lucide-react"
import { useState } from "react"
import Avatar from "@/components/ui/avatar"

interface NavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

const mainNav = [
  { href: "/dashboard", label: "Discover", icon: LayoutDashboard },
  { href: "/dashboard/matches", label: "Matches", icon: Users },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/communities", label: "Communities", icon: Globe },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/feed", label: "Feed", icon: Bell },
]

const bottomNav = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardNav({ user }: NavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(href))

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-[var(--radius-md)] glass flex items-center justify-center text-[var(--dm-text-primary)] hover:bg-[var(--dm-bg-active)] transition-all"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-[var(--dm-bg-base)] border-r border-[var(--dm-border)] flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[var(--dm-border)]">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--dm-accent)] flex items-center justify-center transition-shadow group-hover:shadow-[0_0_12px_rgba(230,57,86,0.3)]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-base font-bold tracking-tight">
              Dev<span className="text-[var(--dm-accent)]">Match</span>
            </span>
          </Link>
        </div>

        {/* Search trigger */}
        <div className="px-3 py-3 border-b border-[var(--dm-border)]">
          <Link
            href="/dashboard/search"
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[var(--radius-md)] text-sm text-[var(--dm-text-muted)] hover:text-[var(--dm-text-secondary)] bg-[var(--dm-bg-raised)] hover:bg-[var(--dm-bg-surface)] border border-[var(--dm-border)] transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[var(--dm-bg-surface)] border border-[var(--dm-border)] text-[var(--dm-text-faint)]">
              ⌘K
            </kbd>
          </Link>
        </div>

        {/* Main nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <div className="text-label px-3 mb-2">Platform</div>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
                isActive(item.href)
                  ? "bg-[var(--dm-accent-muted)] text-[var(--dm-accent)] border border-[rgba(230,57,86,0.15)]"
                  : "text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:bg-[var(--dm-bg-hover)] border border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}

          {/* Admin link for admin users */}
          {user.role === "ADMIN" && (
            <>
              <div className="text-label px-3 mt-5 mb-2">Admin</div>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
                  pathname.startsWith("/admin")
                    ? "bg-[var(--dm-accent-muted)] text-[var(--dm-accent)] border border-[rgba(230,57,86,0.15)]"
                    : "text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:bg-[var(--dm-bg-hover)] border border-transparent"
                }`}
              >
                <Shield className="w-4 h-4 shrink-0" />
                Admin Panel
              </Link>
            </>
          )}

          <div className="text-label px-3 mt-5 mb-2">Account</div>
          {bottomNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
                isActive(item.href)
                  ? "bg-[var(--dm-accent-muted)] text-[var(--dm-accent)] border border-[rgba(230,57,86,0.15)]"
                  : "text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:bg-[var(--dm-bg-hover)] border border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-[var(--dm-border)]">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <Avatar src={user.image} alt={user.name || "User"} size="sm" online />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--dm-text-primary)] truncate">
                {user.name || "Developer"}
              </p>
              <p className="text-xs text-[var(--dm-text-muted)] truncate">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--dm-text-muted)] hover:text-[var(--dm-accent)] hover:bg-[var(--dm-accent-muted)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
