"use client"

import { useSession, signOut } from "next-auth/react"
import { Settings, Shield, Bell, Trash2, LogOut } from "lucide-react"
import Container from "@/components/ui/container"
import Card from "@/components/ui/card"
import Badge from "@/components/ui/badge"
import Button from "@/components/ui/button"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Container size="md">
        <div className="py-8 border-b border-line">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-[#ff2e63]" />
            <h1 className="text-heading-xl">Settings</h1>
          </div>
          <p className="text-body-sm mt-2 text-[#b0b0b8]">Account details and notification preferences</p>
        </div>

        <div className="space-y-6 py-8">
          <Card variant="default">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-[#ff2e63]" />
              <h2 className="text-heading-md">Account</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] py-3">
                <span className="text-[#9ca3af]">Email</span>
                <span className="text-[#eaeaf0]">{session?.user?.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] py-3">
                <span className="text-[#9ca3af]">GitHub</span>
                <Badge variant="success" size="sm">
                  {(session?.user as { githubUsername?: string })?.githubUsername || "Connected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-[#9ca3af]">Status</span>
                <span className="text-[#00ffa3]">Active</span>
              </div>
            </div>
          </Card>

          <Card variant="default">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-[#00ffa3]" />
              <h2 className="text-heading-md">Notifications</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "New match alerts", desc: "Get notified when we find a compatible developer" },
                { label: "Message notifications", desc: "Receive alerts for new messages" },
                { label: "Weekly digest", desc: "Summary of your top matches and activity" },
              ].map((item) => (
                <label key={item.label} className="flex cursor-pointer items-start gap-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3 transition-colors hover:border-[rgba(255,255,255,0.12)]">
                  <input type="checkbox" defaultChecked className="mt-1 accent-[#ff2e63]" />
                  <div>
                    <span className="text-sm font-medium text-[#eaeaf0]">{item.label}</span>
                    <p className="text-xs text-[#9ca3af]">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card variant="featured">
            <div className="flex items-center gap-2 mb-4 text-[#ff2e63]">
              <Trash2 className="h-4 w-4" />
              <h2 className="text-heading-md">Danger Zone</h2>
            </div>
            <p className="text-sm text-[#9ca3af] mb-4">
              Permanently delete your account and all associated data.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => signOut({ callbackUrl: "/" })} variant="secondary" size="md" className="flex items-center gap-2 sm:w-auto">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
              <Button variant="danger" size="md" className="flex items-center gap-2 sm:w-auto">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  )
}
