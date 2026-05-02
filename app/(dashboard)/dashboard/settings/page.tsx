// app/(dashboard)/dashboard/settings/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { Settings, Shield, Bell, Trash2, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="w-6 h-6 text-violet-400" />
        Settings
      </h1>

      {/* Account */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-violet-400" />
          Account
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-muted-foreground">Email</span>
            <span>{session?.user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-muted-foreground">GitHub</span>
            <span>{(session?.user as { githubUsername?: string })?.githubUsername || "Connected"}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Member since</span>
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          Notifications
        </h2>
        <div className="space-y-3">
          {[
            { label: "New match alerts", desc: "Get notified when we find a compatible developer" },
            { label: "Message notifications", desc: "Receive alerts for new messages" },
            { label: "Weekly digest", desc: "Summary of your top matches and activity" },
          ].map((item) => (
            <label key={item.label} className="flex items-start gap-3 py-2 cursor-pointer group">
              <input type="checkbox" defaultChecked className="mt-1 accent-violet-500 rounded" />
              <div>
                <span className="text-sm font-medium group-hover:text-violet-400 transition-colors">{item.label}</span>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-xl p-6 border border-destructive/20">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-destructive">
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Permanently delete your account and all associated data.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive text-sm font-medium transition-colors">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
