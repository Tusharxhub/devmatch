"use client";

import { useEffect, useState } from "react";
import {
  Users,
  MessageSquare,
  FolderKanban,
  Globe,
  Flag,
  TrendingUp,
  Activity,
  Loader2,
  Shield,
  FileText,
} from "lucide-react";
import Card from "@/components/ui/card";

interface PlatformStats {
  totalUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  totalMessages: number;
  totalMatches: number;
  totalProjects: number;
  totalCommunities: number;
  totalPosts: number;
  activeUsers: number;
  bannedUsers: number;
  pendingReports: number;
}

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  createdAt: string;
  user?: { id: string; name?: string | null; image?: string | null } | null;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data.stats);
        setAuditLogs(data.recentAuditLogs || []);
      } catch {
        console.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-accent)]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <Shield className="w-10 h-10 text-[var(--dm-text-faint)] mx-auto mb-3" />
        <p className="text-heading-sm">Failed to load admin data</p>
      </div>
    );
  }

  const metricCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, color: "var(--dm-accent)" },
    { icon: TrendingUp, label: "New (30d)", value: stats.newUsersThisMonth, color: "var(--dm-green)" },
    { icon: Activity, label: "Active Now", value: stats.activeUsers, color: "var(--dm-cyan)" },
    { icon: MessageSquare, label: "Messages", value: stats.totalMessages, color: "var(--dm-amber)" },
    { icon: Users, label: "Total Matches", value: stats.totalMatches, color: "var(--dm-pink)" },
    { icon: FolderKanban, label: "Projects", value: stats.totalProjects, color: "var(--dm-green)" },
    { icon: Globe, label: "Communities", value: stats.totalCommunities, color: "var(--dm-cyan)" },
    { icon: FileText, label: "Posts", value: stats.totalPosts, color: "var(--dm-amber)" },
    { icon: Flag, label: "Pending Reports", value: stats.pendingReports, color: "var(--dm-accent)" },
    { icon: Shield, label: "Banned Users", value: stats.bannedUsers, color: "var(--dm-accent)" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-heading-xl flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-[var(--dm-accent)]" />
          Admin Overview
        </h1>
        <p className="text-body-md mt-1">Platform metrics and recent activity</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {metricCards.map((m) => (
          <Card key={m.label} variant="default" padding="md">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="w-4 h-4" style={{ color: m.color }} />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--dm-text-muted)]">
                {m.label}
              </span>
            </div>
            <div className="text-xl font-bold font-display text-[var(--dm-text-primary)]">
              {m.value.toLocaleString()}
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Audit Logs */}
      <div>
        <h2 className="text-heading-sm mb-4">Recent Audit Logs</h2>
        {auditLogs.length > 0 ? (
          <Card variant="default" padding="none">
            <div className="divide-y divide-[var(--dm-border)]">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--dm-bg-surface)] flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-[var(--dm-text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[var(--dm-text-primary)]">
                      <span className="font-semibold">{log.user?.name || "System"}</span>
                      {" "}
                      <span className="text-[var(--dm-text-muted)]">{log.action}</span>
                      {" on "}
                      <span className="text-[var(--dm-text-secondary)]">{log.entity}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--dm-text-faint)] shrink-0">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card variant="default" padding="lg">
            <p className="text-body-sm text-center">No audit logs yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
