"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";

interface UserData {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  isBanned: boolean;
  bannedReason?: string | null;
  onlineStatus: boolean;
  createdAt: string;
  lastSeenAt?: string | null;
  githubProfile?: { username?: string | null; experienceLevel?: string | null } | null;
  _count: { sentMessages: number; matchesAsUser: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        search,
        role: roleFilter,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function performAction(userId: string, action: "ban" | "unban" | "changeRole", extra?: Record<string, string>) {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, ...extra }),
      });
      if (res.ok) fetchUsers();
    } catch {
      console.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  const roleColors: Record<string, "accent" | "success" | "info"> = {
    ADMIN: "accent",
    RECRUITER: "info",
    DEVELOPER: "success",
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-heading-xl flex items-center gap-2.5">
          <Users className="w-6 h-6 text-[var(--dm-accent)]" />
          User Management
        </h1>
        <p className="text-body-md mt-1">Manage users, roles, and bans</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dm-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] focus:outline-none"
        >
          <option value="">All roles</option>
          <option value="DEVELOPER">Developer</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-accent)]" />
        </div>
      ) : (
        <Card variant="default" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--dm-border)]">
                  <th className="text-left px-4 py-3 text-label">User</th>
                  <th className="text-left px-4 py-3 text-label hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 text-label hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-label hidden lg:table-cell">Activity</th>
                  <th className="text-right px-4 py-3 text-label">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--dm-border)]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--dm-bg-hover)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.image} alt={user.name || ""} size="sm" online={user.onlineStatus} />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[var(--dm-text-primary)] truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-[var(--dm-text-muted)] truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={roleColors[user.role] || "default"} size="xs">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {user.isBanned ? (
                        <Badge variant="accent" size="xs" dot>Banned</Badge>
                      ) : user.onlineStatus ? (
                        <Badge variant="success" size="xs" dot>Online</Badge>
                      ) : (
                        <Badge variant="default" size="xs" dot>Offline</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-xs text-[var(--dm-text-muted)]">
                        {user._count.matchesAsUser} matches · {user._count.sentMessages} msgs
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {user.isBanned ? (
                          <Button
                            variant="success"
                            size="xs"
                            icon={<CheckCircle className="w-3 h-3" />}
                            onClick={() => performAction(user.id, "unban")}
                            isLoading={actionLoading === user.id}
                          >
                            Unban
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="xs"
                            icon={<Ban className="w-3 h-3" />}
                            onClick={() => performAction(user.id, "ban")}
                            isLoading={actionLoading === user.id}
                          >
                            Ban
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--dm-border)]">
              <span className="text-xs text-[var(--dm-text-muted)]">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="xs"
                  icon={<ChevronLeft className="w-3.5 h-3.5" />}
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
