import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <DashboardSidebar />
      <div className="lg:pl-72">
        <div className="min-h-screen p-4 md:p-8">{children}</div>
      </div>
    </div>
  )
}
